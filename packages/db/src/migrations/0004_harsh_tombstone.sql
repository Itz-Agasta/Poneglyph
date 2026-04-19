CREATE TABLE "organisation" (
	"user_id" text PRIMARY KEY NOT NULL,
	"org_name" varchar(255) NOT NULL,
	"tagline" varchar(160),
	"description" text,
	"logo" text,
	"country" varchar(100),
	"website" text,
	"contact_email" text,
	"social_links" jsonb,
	"uploads" uuid[] DEFAULT '{}' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organisation" ADD CONSTRAINT "organisation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "organisation_is_verified_idx" ON "organisation" USING btree ("is_verified");