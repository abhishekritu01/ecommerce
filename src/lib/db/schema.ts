
import { sql } from "drizzle-orm";
import { pgTable, serial, varchar,timestamp,text, integer } from "drizzle-orm/pg-core";

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