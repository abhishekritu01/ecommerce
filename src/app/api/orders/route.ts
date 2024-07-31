import { authOptions } from "@/lib/auth/authOptions";
import { orderSchema } from "@/lib/validators/orderSchema";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db/db"
import { inveventories, warehouses } from "@/lib/db/schema";
import { and, eq, inArray, is, isNull } from "drizzle-orm";
import { products } from "@/lib/db/schema";
import { orders } from "@/lib/db/schema";
import { diliveryPersons } from "@/lib/db/schema";
import crypto from "node:crypto";
import axios from "axios";
import {user} from "@/lib/db/schema";
import { desc } from "drizzle-orm";


export async function POST(request: Request) {

    const session = await getServerSession(authOptions);
    console.log("session", session);

    if (!session) {
        return Response.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }


    const requestData = await request.json();

    let validateData;

    try {
        validateData = await orderSchema.parse(requestData);

    } catch (error) {
        return Response.json({ error: "Invalid data" }, { status: 400 });
    }

    //Order creation logic
    const warehouse = await db.select({ id: warehouses.id }).from(warehouses)
        .where(eq(warehouses.pincode, validateData.pincode))

    if (!warehouse.length) {
        return Response.json(
            { error: "No warehouse found" },
            { status: 400 }
        );
    }

    //find product 
    const foundProducts = await db.select().from(products)
        .where(eq(products.id, validateData.productId)).limit(1);

    if (!foundProducts.length) {
        return Response.json(
            { error: "Product not found" },
            { status: 400 }
        );
    }

    let transactionError: string = "";
    let finalOrder: any = null;

    //start transaction
    try {
        finalOrder = await db.transaction(async (tx) => {

            //create order
            const order = await tx.insert(orders).values({
                ...validateData,

                //@ts-ignore
                userId:Number(session.token.id),
                price: foundProducts[0].price * validateData.qty,
                // todo move all status to enum
                status: "received",
            }).returning({ id: orders.id, price: orders.price });


            //check stock
            const availableStock = await tx.select().from(inveventories)
                .where(and(
                    eq(inveventories.warehousesId, warehouse[0].id),
                    eq(inveventories.productId, validateData.productId),
                    isNull(inveventories.orderId)
                )).limit(validateData.qty).for('update', { skipLocked: true });

            //check stock if not available then rollback
            if (availableStock.length < validateData.qty) {
                transactionError = `Not enough stock available, available stock is ${availableStock.length}`;
                tx.rollback();
                return;
            }

            //check delivery person availablelity
            const availablePerson = await tx.select().from(diliveryPersons).where(
                and(
                    isNull(diliveryPersons.orderID),
                    eq(diliveryPersons.werehouseID, warehouse[0].id),
                )
            ).for('update').limit(1);

            if (!availablePerson.length) {
                transactionError = "No delivery person available at the moment";
                tx.rollback();
                return;
            }

            // stock is available and delivery person is available
            //update inventory table  add order id 
            await tx.update(inveventories).set({
                orderId: order[0].id
            }).where(
                inArray(inveventories.id, availableStock.map((stock) => stock.id))

            )

            //update delivery person table
            await tx.update(diliveryPersons)
                .set({ orderID: order[0].id })
                .where(eq(diliveryPersons.id, availablePerson[0].id));

            //update ordee table
            await tx.update(orders).set({
                status: "reserved"
            }).where(eq(orders.id, order[0].id));

            return order[0];
        });

    } catch (error) {
        //transaction error
        // in production don't return internal error
        return Response.json(
            { message: transactionError ? transactionError : "Error while db transation" },
            { status: 500 });
    }


    //payment gateway logic
    //1 create invoice
    const paymentUrl = "https://api.cryptomus.com/v1/payment";

    const paymentData = {
        amount: String(finalOrder.price),
        currency: "USD",
        orderId: String(finalOrder.id),
        url_return: "https://localhost:3000/payment/return",
        url_success: "https://localhost:3000/payment/success",
        url_callback: "https://34f2-2405-201-a413-d93c-98d8-76f6-916c-e67b.ngrok-free.app/api/payment/callback",
    }


    const stringData = btoa(JSON.stringify(paymentData)) + process.env.CRYPTOMUS_API_KEY;
    const sign = crypto.createHash('md5').update(stringData).digest('hex');


    const headers = {
        merchant: process.env.CRYPTOMUS_MERCHANT_ID,
        sign,
    };

    try {
        const response = await axios.post(paymentUrl, paymentData, {
            headers,
        });
        console.log('response', response.data);

        return Response.json({ paymentUrl: response.data.result.url });
    } catch (err) {
        console.log('error while creating an invoice', err);
        // todo: 1. retry if not then we have undo the order.
    
        return Response.json({
            message: 'Failed to create an invoice',
        });
    }
}





export async function GET() {
    // todo: add authentication and authorization
    // todo: add logging
    // todo: add error handling
    const allOrders = await db
        .select({
            id: orders.id,
            product: products.name,
            productId: products.id,
            userId: user.id,
            user: user.fname,
            type: orders.type,
            price: orders.price,
            image: products.image,
            status: orders.status,
            address: orders.address,
            qty: orders.qty,
            createAt: orders.createdAt,
        })
        .from(orders)
        .leftJoin(products, eq(orders.productId, products.id))
        .leftJoin(user, eq(orders.userId, user.id))
        // join inventories (orderId)
        // join delivery person (orderId)
        // join warehouse (deliveryId)
        // todo: 1. use pagination, 2. Put index
        .orderBy(desc(orders.id));
    return Response.json(allOrders);
}



