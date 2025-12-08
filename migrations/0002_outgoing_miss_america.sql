ALTER TABLE `forms` ADD `accept_responses` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `forms` ADD `message_if_not_accept_responses` text;