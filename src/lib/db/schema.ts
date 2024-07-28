
import { or, sql } from "drizzle-orm";
import { pgTable, serial, varchar,timestamp,text, integer } from "drizzle-orm/pg-core";
import { index } from "drizzle-orm/pg-core";



export const user = pgTable("users",{
    id:serial('id').primaryKey(),
    fname:varchar('fname',{length:100}).notNull(),
    lname:varchar('lname',{length:100}).notNull(),
    email:varchar('email',{length:100}).unique().notNull(),
    provider:varchar('provider',{length:20}),
    extrnalID:varchar('external_id',{length:100}).notNull(),
    image:text('image'),
    role:varchar('role',{length:20}).notNull().default('customer'),
    created_at:timestamp('created_at').notNull().default(sql`current_timestamp`),
    updated_at:timestamp('updated_at').notNull().default(sql`current_timestamp`)
})


export const products = pgTable("products",{
    id:serial('id').primaryKey(),
    name:varchar('name',{length:100}).notNull(),
    image:text('image'),
    description:text('description'),
    price:integer('price').notNull(),
    created_at:timestamp('created_at').notNull().default(sql`current_timestamp`),
    updated_at:timestamp('updated_at').notNull().default(sql`current_timestamp`)
})


export const warehouses = pgTable("warehouse",{
    id:serial('id').primaryKey(),
    name:varchar('name',{length:100}).notNull(),
    pincode:varchar('pincode',{length:6}).notNull(),
    created_at:timestamp('created_at').notNull().default(sql`current_timestamp`),
    updated_at:timestamp('updated_at').notNull().default(sql`current_timestamp`)
},
    (table)=>{
        return {
            pincodeIdx:index('pincode_idx').on(table.pincode)
        }
    }
)

export const orders = pgTable("orders",{
    id:serial('id').primaryKey(),

})


export const diliveryPersons = pgTable("dilivery_persons",{  
    id:serial('id').primaryKey(),
    name:varchar('name',{length:100}).notNull(),
    phone:varchar('phone',{length:13}).notNull(),
    werehouseID:integer('werehouse_id').references(()=>warehouses.id,{onDelete:'cascade'}),  
    orderID:integer('order_id').references(()=>orders.id,{onDelete:'set null'}),
    created_at:timestamp('created_at').notNull().default(sql`current_timestamp`),
    updated_at:timestamp('updated_at').notNull().default(sql`current_timestamp`)
})



export const inveventories = pgTable("inventories",{
    id:serial('id').primaryKey(),
    sku:varchar('sku',{length:8}).unique().notNull(),
    orderId:integer('order_id').references(()=>orders.id,{onDelete:'set null'}),
    warehousesId:integer('warehouses_id').references(()=>warehouses.id,{onDelete:'cascade'}),
    productId:integer('product_id').references(()=>products.id,{onDelete:'cascade'}),
    created_at:timestamp('created_at').notNull().default(sql`current_timestamp`),
    updated_at:timestamp('updated_at').notNull().default(sql`current_timestamp`)
})

