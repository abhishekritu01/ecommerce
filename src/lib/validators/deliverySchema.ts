
import {z} from 'zod'; 

export const deliverySchema = z.object({
    name: z.string({message:'Delivery Person Name should be a string '}),
    phone: z.string({message:'Delivery Person Phone should be a string '}).length(13,'phone number should be 13 digit'),
    werehouseID: z.number({message:'Warehouse ID should be a number '}),
});