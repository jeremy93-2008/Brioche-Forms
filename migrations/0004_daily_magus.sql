ALTER TABLE `answers` ADD `choice_free_text` text;--> statement-breakpoint
ALTER TABLE `choices` ADD `is_free_text` integer DEFAULT 0 NOT NULL;