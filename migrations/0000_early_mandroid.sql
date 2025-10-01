CREATE TABLE "ai_conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"calculation_id" integer,
	"session_id" text NOT NULL,
	"messages" jsonb NOT NULL,
	"context" jsonb,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "attendee_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"attendee_id" integer,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"icon" text,
	"footprint_reduction" numeric(10, 6),
	"unlocked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "attendee_choices" (
	"id" serial PRIMARY KEY NOT NULL,
	"attendee_id" integer,
	"category" text NOT NULL,
	"choice" text NOT NULL,
	"emissions" numeric(10, 6),
	"compared_to_average" numeric(5, 2),
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "attendee_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"calculation_id" integer,
	"name" text,
	"email" text,
	"ticket_id" text,
	"total_footprint" numeric(10, 6),
	"rank" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "attendee_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"attendee_id" integer,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"value" numeric(10, 2),
	"code" text,
	"expires_at" timestamp,
	"redeemed" boolean DEFAULT false,
	"redeemed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"log_id" text NOT NULL,
	"calculation_id" integer,
	"action" text NOT NULL,
	"actor" text NOT NULL,
	"changes" jsonb,
	"hash" text NOT NULL,
	"previous_hash" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "audit_logs_log_id_unique" UNIQUE("log_id")
);
--> statement-breakpoint
CREATE TABLE "blockchain_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"record_id" text NOT NULL,
	"calculation_id" integer,
	"record_type" text NOT NULL,
	"data_hash" text NOT NULL,
	"transaction_id" text,
	"consensus_timestamp" text,
	"topic_sequence_number" integer,
	"explorer_url" text,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "blockchain_records_record_id_unique" UNIQUE("record_id")
);
--> statement-breakpoint
CREATE TABLE "carbon_calculations" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" integer,
	"user_id" integer,
	"reporting_year" integer NOT NULL,
	"calculation_method" text NOT NULL,
	"status" text DEFAULT 'in_progress',
	"scope1_data" jsonb,
	"scope2_data" jsonb,
	"scope3_data" jsonb,
	"scope1_emissions" numeric(10, 3),
	"scope2_emissions" numeric(10, 3),
	"scope3_emissions" numeric(10, 3),
	"total_emissions" numeric(10, 3),
	"ghg_protocol_version" text DEFAULT '2025',
	"calculated_at" timestamp,
	"verified_at" timestamp,
	"blockchain_hash" text,
	"blockchain_transaction_id" text,
	"blockchain_timestamp" timestamp,
	"blockchain_network" text,
	"blockchain_explorer_url" text,
	"verification_status" text DEFAULT 'unverified',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "carbon_certificates" (
	"id" serial PRIMARY KEY NOT NULL,
	"certificate_id" text NOT NULL,
	"calculation_id" integer,
	"event_name" text NOT NULL,
	"organization_name" text NOT NULL,
	"total_emissions" numeric(10, 3),
	"emission_breakdown" jsonb,
	"verification_status" text DEFAULT 'unverified',
	"blockchain_hash" text NOT NULL,
	"blockchain_timestamp" timestamp NOT NULL,
	"certificate_url" text,
	"qr_code" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "carbon_certificates_certificate_id_unique" UNIQUE("certificate_id")
);
--> statement-breakpoint
CREATE TABLE "carbon_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"calculation_id" integer,
	"user_id" integer,
	"type" text NOT NULL,
	"format" text NOT NULL,
	"title" text NOT NULL,
	"content" jsonb,
	"file_path" text,
	"is_blockchain_verified" boolean DEFAULT false,
	"blockchain_hash" text,
	"generated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "emission_factors" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"subcategory" text,
	"activity" text NOT NULL,
	"unit" text NOT NULL,
	"factor" numeric(10, 6) NOT NULL,
	"source" text NOT NULL,
	"region" text,
	"year" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"size" text NOT NULL,
	"industry" text NOT NULL,
	"country" text,
	"website" text,
	"description" text,
	"owner_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "supplier_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer,
	"calculation_id" integer,
	"request_type" jsonb NOT NULL,
	"draft_message" text NOT NULL,
	"status" text DEFAULT 'draft',
	"sent_at" timestamp,
	"response_received" timestamp,
	"response_data" jsonb,
	"tracking_link" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"calculation_id" integer,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"contact_info" text,
	"identified_from" text DEFAULT 'user_mentioned',
	"confidence" numeric(3, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"achievement_type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"icon" text,
	"unlocked_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"profile_image_url" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_calculation_id_carbon_calculations_id_fk" FOREIGN KEY ("calculation_id") REFERENCES "public"."carbon_calculations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendee_achievements" ADD CONSTRAINT "attendee_achievements_attendee_id_attendee_profiles_id_fk" FOREIGN KEY ("attendee_id") REFERENCES "public"."attendee_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendee_choices" ADD CONSTRAINT "attendee_choices_attendee_id_attendee_profiles_id_fk" FOREIGN KEY ("attendee_id") REFERENCES "public"."attendee_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendee_profiles" ADD CONSTRAINT "attendee_profiles_calculation_id_carbon_calculations_id_fk" FOREIGN KEY ("calculation_id") REFERENCES "public"."carbon_calculations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendee_rewards" ADD CONSTRAINT "attendee_rewards_attendee_id_attendee_profiles_id_fk" FOREIGN KEY ("attendee_id") REFERENCES "public"."attendee_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_calculation_id_carbon_calculations_id_fk" FOREIGN KEY ("calculation_id") REFERENCES "public"."carbon_calculations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blockchain_records" ADD CONSTRAINT "blockchain_records_calculation_id_carbon_calculations_id_fk" FOREIGN KEY ("calculation_id") REFERENCES "public"."carbon_calculations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_calculations" ADD CONSTRAINT "carbon_calculations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_calculations" ADD CONSTRAINT "carbon_calculations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_certificates" ADD CONSTRAINT "carbon_certificates_calculation_id_carbon_calculations_id_fk" FOREIGN KEY ("calculation_id") REFERENCES "public"."carbon_calculations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_reports" ADD CONSTRAINT "carbon_reports_calculation_id_carbon_calculations_id_fk" FOREIGN KEY ("calculation_id") REFERENCES "public"."carbon_calculations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carbon_reports" ADD CONSTRAINT "carbon_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_requests" ADD CONSTRAINT "supplier_requests_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_requests" ADD CONSTRAINT "supplier_requests_calculation_id_carbon_calculations_id_fk" FOREIGN KEY ("calculation_id") REFERENCES "public"."carbon_calculations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suppliers" ADD CONSTRAINT "suppliers_calculation_id_carbon_calculations_id_fk" FOREIGN KEY ("calculation_id") REFERENCES "public"."carbon_calculations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;