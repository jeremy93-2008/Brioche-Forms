ALTER TABLE `forms` ADD `is_published` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `forms` ADD `is_draft` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `forms` ADD `can_modify_responses` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `forms` ADD `response_limit` integer;--> statement-breakpoint
ALTER TABLE `forms` ADD `response_limit_date` integer;