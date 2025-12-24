CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`type` text NOT NULL,
	`used_in_form_id` text,
	`uploaded_at` integer NOT NULL,
	`uploaded_by_user_id` text NOT NULL,
	FOREIGN KEY (`used_in_form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE no action
);
