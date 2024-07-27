

import { warehouseSchema } from "@/lib/validators/warehouseSchema";
import { db } from "@/lib/db/db";
import { warehouses } from "@/lib/db/schema";


export async function POST(request:Request){

    // todo:check authenticaion and authorization
    const requestData = await request.json();

    let validatedData;

    try {
        validatedData = warehouseSchema.parse(requestData);

    } catch (error) {
        return Response.json({message:error},{status:400});
        
    }


    try {
        const result = await db.insert(warehouses).values(validatedData);
        
        return Response.json({message:"warehouse created successfully"},{status:201});

        
    } catch (error) {
        return new Response(JSON.stringify({error:"could not create warehouse"}),{
            status:500,
            headers:{
                'content-type':'application/json'
            }
        })  
    }
}