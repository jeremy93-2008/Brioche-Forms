ALTER TABLE `answers` ADD `type` text NOT NULL;--> statement-breakpoint
ALTER TABLE `responses` ADD `is_partial_response` integer DEFAULT 0 NOT NULL;