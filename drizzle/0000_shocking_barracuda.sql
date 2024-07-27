CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"fname" varchar(100) NOT NULL,
	"lname" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"provider" varchar(20),
	"external_id" varchar(100) NOT NULL,
	"image" varchar,
	"role" varchar(20) DEFAULT 'customer' NOT NULL,
	"created_at" timestamp DEFAULT current_timestamp NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
