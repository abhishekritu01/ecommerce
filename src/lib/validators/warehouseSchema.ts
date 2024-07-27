
import {z} from 'zod';

export const warehouseSchema = z.object({
    name: z.string({message:"warehouse name should be string"}),
    pincode: z.string({message:"pincode should be string of 6 digits"}).length(6),
}); 