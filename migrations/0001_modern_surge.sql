CREATE TABLE `shared_folders` (
	`id` text PRIMARY KEY NOT NULL,
	`folder_id` text NOT NULL,
	`shared_with_user_id` text NOT NULL,
	`is_read_allowed` integer NOT NULL,
	`is_write_allowed` integer NOT NULL,
	`is_delete_allowed` integer NOT NULL,
	`is_share_allowed` integer NOT NULL,
	`is_admin_allowed` integer NOT NULL,
	FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE no action
);
