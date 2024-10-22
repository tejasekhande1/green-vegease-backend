ALTER TABLE "offer" ALTER COLUMN "discount_type" SET DEFAULT 'percentage';--> statement-breakpoint
ALTER TABLE "offer" ALTER COLUMN "discount_value" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "offer" ALTER COLUMN "started_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "offer" ALTER COLUMN "ended_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_offer" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "product_offer" ALTER COLUMN "offer_id" SET NOT NULL;