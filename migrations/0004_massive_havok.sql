CREATE TABLE `shared_notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`notification_id` text NOT NULL,
	`shared_with_user_id` text NOT NULL,
	FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`id`) ON UPDATE no action ON DELETE no action
);
