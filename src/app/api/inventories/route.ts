
import { db } from "@/lib/db/db";
import { inventorySchema } from "@/lib/validators/inventorySchema";
import { inveventories, products, warehouses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";



export async function POST(request: Request) {

    const requestData = await request.json()

    let validateData;

    try {
        validateData = inventorySchema.parse(requestData)

    } catch (error) {
        return Response.json({ message: error }, { status: 400 })
    }


    try {
        await db.insert(inveventories).values(validateData)
        return Response.json({ message: "Inventory response stored successfully" }, { status: 200 })

    } catch (error) {

        //todo check database status code , and if it duplicate value code then send the message to the client
        
        return Response.json({ message: "Failed to store inventory response " }, { status: 500 })
    }
}


export async function GET(request: Request) {
    try {
        const data = await db.select(
            {
                id: inveventories.id,
                sku: inveventories.sku,
                werehouse: warehouses.name,
                product: products.name,

            }
        ).from(inveventories)
            .leftJoin(warehouses, eq(inveventories.warehousesId, warehouses.id))
            .leftJoin(products, eq(inveventories.productId, products.id))
        return Response.json(data, { status: 200 })
    } catch (error) {
        return Response.json({ message: "Failed to fetch inventory response " }, { status: 500 })
    }
}
