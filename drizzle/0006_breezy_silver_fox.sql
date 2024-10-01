DO $$ BEGIN
 CREATE TYPE "public"."request_status" AS ENUM('accepted', 'pending', 'canceled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
