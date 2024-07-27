import { NextRequest,NextResponse } from "next/server";
import { productSchema } from "@/lib/validators/productSchema";
import { writeFile } from "fs/promises";
import path from 'node:path';
import { db } from "@/lib/db/db";
import { products } from "@/lib/db/schema";
import { unlink } from "fs/promises";
import { desc } from "drizzle-orm";

export async function POST(request:Request , response:Response){

    // todo : check if the user is authenticated

    const data = await request.formData();

    let validatedData;

    try {
        validatedData = productSchema.parse({
            name:data.get('name'),
            description:data.get('description'),
            price:Number(data.get('price')),
            image:data.get('image'),
        });
        
    } catch (error) {
        return Response.json({message:error},{status:400});
    }

    const filename = `${Date.now()}.${validatedData.image.name.split('.').slice(-1)}`;


    try{
       const buffer  = Buffer.from(await validatedData.image.arrayBuffer());
       await writeFile(path.join(process.cwd(),"public/assets",filename),buffer);
    }
    catch(error){
        return Response.json({message:'failed to save the file to fs'},{status:500});
    }

    try {

        await db.insert(products).values({...validatedData,image:filename});

    } catch (error) {
        // delete the file if the db insert fails 
        // await unlink(path.join(process.cwd(),"public/asset",filename));
        return Response.json({message:'failed to save the file to fs'},{status:500});
    }



    return Response.json({message:'product created'},{status:201});


}



export async function GET(){
try {
    const allproduct = await db.select().from(products).orderBy(desc(products.id));
    return Response.json(allproduct);   
} catch (error) { 
    return Response.json({message:'failed to fetch products'},{status:500});
}

}