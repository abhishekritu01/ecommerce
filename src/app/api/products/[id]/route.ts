import { db } from "@/lib/db/db";
import { eq } from "drizzle-orm";
import { products } from "@/lib/db/schema";
import { number } from "zod";

export async function GET(request:Request , {params} : {params:{id:string}}){

    const id = params.id;

    try {
    const product  = await db.select().from(products).where(eq(products.id,Number(id))).limit(1);
    if(!product.length){
        return Response.json({message:'product not found'},{status:404});
    }
    return Response.json(product[0]);
    } catch (error) {
        return Response.json({message:'failed to fetch the product'},{status:500});
    }

}