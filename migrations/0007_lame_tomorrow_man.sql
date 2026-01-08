ALTER TABLE `forms` ALTER COLUMN "must_login_to_respond" TO "must_login_to_respond" integer NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `forms` ADD `message_after_submit` text;--> statement-breakpoint
ALTER TABLE `forms` ADD `message_if_limit_reached` text;--> statement-breakpoint
ALTER TABLE `forms` ADD `shuffle_questions` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `forms` ADD `save_partial_responses` integer DEFAULT 0 NOT NULL;