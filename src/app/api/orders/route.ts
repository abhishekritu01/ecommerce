import { authOptions } from "@/lib/auth/authOptions";
import { orderSchema } from "@/lib/validators/orderSchema";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db/db"
import { inveventories, warehouses } from "@/lib/db/schema";
import { and, eq, inArray, is, isNull } from "drizzle-orm";
import { products } from "@/lib/db/schema";
import { orders } from "@/lib/db/schema";
import { diliveryPersons } from "@/lib/db/schema";


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
    let finalOrder:any = null;

    //start transaction
    try {
        finalOrder = await db.transaction(async (tx) => {

            //create order
            const order = await tx.insert(orders).values({
                ...validateData,

                //@ts-ignore
                userId: session.token.id,
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
    











}