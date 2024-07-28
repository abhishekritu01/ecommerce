
import {z} from 'zod';


const isServer = typeof window === 'undefined';

export const productSchema = z.object({
    name: z.string({message:"product name should be string"}).min(3,{message:"product name should be atleast 3 characters"}),
    image: z.instanceof(isServer ? File : FileList,{message:"image is should be a file"}),
    description: z.string({message:"description should be a string"}).min(8,{message:"description should be atleast 10 characters"}),
    price: z.number({message:'product price should be a number'}).int().positive(),
});