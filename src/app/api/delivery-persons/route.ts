import { db } from "@/lib/db/db";
import { deliverySchema } from "@/lib/validators/deliverySchema";
import { diliveryPersons} from "@/lib/db/schema";
import { warehouses } from "@/lib/db/schema";
import {eq} from "drizzle-orm";


export async function POST(request: Request, response: Response) {
    let requestDate = await request.json();
    let validateData;
    try {
        validateData = await deliverySchema.parse(requestDate);

        if(!validateData){
            return Response.json({message:'Invalid Data'},{status:400});
        }
        
    } catch (error) {
        return Response.json({message:error},{status:400});
        
    }


    try {
        await db.insert(diliveryPersons).values(validateData);
        return Response.json({message:'Delivery Person Created'},{status:201});
    } catch (error) {
        return Response.json({message:'failed to store delivery person in database '},{status:500});
    }
}




export async function GET(request: Request, response: Response) {
try {
    let deliveryPersons = await db.select({
        name:diliveryPersons.name,
        phone:diliveryPersons.phone,
        werehouseID:diliveryPersons.werehouseID,
        werehouseName:warehouses.name,
        werehousePincode:warehouses.pincode
    }).from(diliveryPersons)
    .leftJoin(warehouses ,eq(diliveryPersons.werehouseID,warehouses.id))
    return Response.json(deliveryPersons);
    
} catch (error) {
    return Response.json({message:'failed to fetch delivery persons'},{status:500});
}
}