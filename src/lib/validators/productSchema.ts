
import {z} from 'zod';


export const productSchema = z.object({
    name: z.string({message:"product name should be string"}),
    image: z.instanceof(File,{message:"image is should be a file"}),
    description: z.string({message:"description should be a string"}),
    price: z.number({message:'product price should be a number'}).int().positive(),
});