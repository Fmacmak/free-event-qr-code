CREATE TABLE "attendees" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(255) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255),
	"job_title" varchar(255),
	"marketing_consent" boolean DEFAULT false,
	"registered_at" timestamp DEFAULT now(),
	"checked_in" boolean DEFAULT false,
	"checked_in_at" timestamp,
	CONSTRAINT "attendees_public_id_unique" UNIQUE("public_id"),
	CONSTRAINT "attendees_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(64) NOT NULL,
	"password" varchar(64)
);
