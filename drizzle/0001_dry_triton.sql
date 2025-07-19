CREATE TABLE "small_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"details" text,
	"is_completed" boolean DEFAULT false NOT NULL,
	"parent_task_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tasks" RENAME TO "big_tasks";--> statement-breakpoint
ALTER TABLE "big_tasks" RENAME COLUMN "completed" TO "is_completed";--> statement-breakpoint
ALTER TABLE "big_tasks" ADD COLUMN "details" text;--> statement-breakpoint
ALTER TABLE "small_tasks" ADD CONSTRAINT "small_tasks_parent_task_id_big_tasks_id_fk" FOREIGN KEY ("parent_task_id") REFERENCES "public"."big_tasks"("id") ON DELETE cascade ON UPDATE no action;