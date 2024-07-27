
import { db } from "@/lib/db/db";
import { inventorySchema } from "@/lib/validators/inventorySchema";
import { inveventories } from "@/lib/db/schema";


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
        return Response.json({ message: "Failed to store inventory response " }, { status: 500 })
    }
}


export async function GET(request: Request) {
    try {
        const data = await db.select().from(inveventories)
        return Response.json(data, { status: 200 })
    } catch (error) {
        return Response.json({ message: "Failed to fetch inventory response " }, { status: 500 })
    }
}
