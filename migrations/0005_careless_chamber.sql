CREATE TABLE `videos` (
	`id` text PRIMARY KEY NOT NULL,
	`section_id` text NOT NULL,
	`url` text NOT NULL,
	`caption` text,
	`order` text NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE no action
);
