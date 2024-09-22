DROP INDEX IF EXISTS "cart_id_idx";--> statement-breakpoint
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_cart_id_product_id_pk";--> statement-breakpoint
ALTER TABLE "cart_item" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "cart_product_unique" ON "cart_item" USING btree ("cart_id","product_id");