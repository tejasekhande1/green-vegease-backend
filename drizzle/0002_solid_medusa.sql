CREATE TABLE IF NOT EXISTS "product" (
	"id" uuid,
	"product_name" varchar(255) NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"images" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_id_category_id_fk" FOREIGN KEY ("id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
