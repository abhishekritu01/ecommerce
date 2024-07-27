
import {z} from 'zod';


export const inventorySchema = z.object({
    sku: z.string({message:"sku should be string"}).length(8,{message:"sku should be 8 characters long"}),
    warehousesId: z.number({message:"werehouseID should be number"}),
    productId: z.number({message:"productId should be number"}),
})