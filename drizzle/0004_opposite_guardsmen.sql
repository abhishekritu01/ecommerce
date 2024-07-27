CREATE TABLE IF NOT EXISTS "dilivery_persons" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"phone" varchar(13) NOT NULL,
	"werehouse_id" integer,
	"order_id" integer,
	"created_at" timestamp DEFAULT current_timestamp NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dilivery_persons" ADD CONSTRAINT "dilivery_persons_werehouse_id_warehouse_id_fk" FOREIGN KEY ("werehouse_id") REFERENCES "public"."warehouse"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dilivery_persons" ADD CONSTRAINT "dilivery_persons_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
