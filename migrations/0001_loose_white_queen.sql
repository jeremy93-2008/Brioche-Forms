ALTER TABLE `folders` ADD `author_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `forms` ADD `author_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `pages` ADD `conditions` text;--> statement-breakpoint
ALTER TABLE `sections` ADD `conditions` text;