import { db } from "@/lib/db/db";
import { deliverySchema } from "@/lib/validators/deliverySchema";
import { diliveryPersons} from "@/lib/db/schema";


export async function POST(request: Request, response: Response) {
    let requestDate = await request.json();
    console.log(requestDate);

    let validateData;

    try {
        validateData = await deliverySchema.parse(requestDate);

        
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