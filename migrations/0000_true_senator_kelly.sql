CREATE TABLE `answers` (
	`id` text PRIMARY KEY NOT NULL,
	`response_id` text NOT NULL,
	`question_id` text NOT NULL,
	`choice_id` text,
	`short_answer` text,
	`long_answer` text,
	`date_answer` integer,
	FOREIGN KEY (`response_id`) REFERENCES `responses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`choice_id`) REFERENCES `choices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `choices` (
	`id` text PRIMARY KEY NOT NULL,
	`question_id` text NOT NULL,
	`content` text NOT NULL,
	`order` text NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `folders` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`author_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `forms` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`author_id` text NOT NULL,
	`background_color` text NOT NULL,
	`folder_id` text,
	`description` text,
	`background_image` text,
	`header_image` text,
	`is_published` integer NOT NULL,
	`is_draft` integer NOT NULL,
	`can_modify_responses` integer NOT NULL,
	`response_limit` integer,
	`response_limit_date` integer,
	FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` text PRIMARY KEY NOT NULL,
	`section_id` text NOT NULL,
	`url` text NOT NULL,
	`caption` text,
	`order` text NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `multiple_choices` (
	`id` text PRIMARY KEY NOT NULL,
	`answer_id` text NOT NULL,
	`choice_id` text NOT NULL,
	FOREIGN KEY (`answer_id`) REFERENCES `answers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`choice_id`) REFERENCES `choices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`content` text NOT NULL,
	`action_type` text NOT NULL,
	`is_read` integer NOT NULL,
	`created_at` integer NOT NULL,
	`form_id` text,
	`folder_id` text,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` text PRIMARY KEY NOT NULL,
	`form_id` text NOT NULL,
	`title` text NOT NULL,
	`order` text NOT NULL,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`section_id` text NOT NULL,
	`name` text NOT NULL,
	`content` text NOT NULL,
	`type` text NOT NULL,
	`is_required` integer NOT NULL,
	`order` text NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `responses` (
	`id` text PRIMARY KEY NOT NULL,
	`form_id` text NOT NULL,
	`respondent_id` text NOT NULL,
	`submitted_at` integer NOT NULL,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sections` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`order` text NOT NULL,
	`page_id` text,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE `shared_forms` (
	`id` text PRIMARY KEY NOT NULL,
	`form_id` text NOT NULL,
	`shared_with_user_id` text NOT NULL,
	`is_read_allowed` integer NOT NULL,
	`is_write_allowed` integer NOT NULL,
	`is_delete_allowed` integer NOT NULL,
	`is_share_allowed` integer NOT NULL,
	`is_admin_allowed` integer NOT NULL,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `shared_notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`notification_id` text NOT NULL,
	`shared_with_user_id` text NOT NULL,
	FOREIGN KEY (`notification_id`) REFERENCES `notifications`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags_forms` (
	`id` text PRIMARY KEY NOT NULL,
	`tag_id` text NOT NULL,
	`form_id` text NOT NULL,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`color` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `texts` (
	`id` text PRIMARY KEY NOT NULL,
	`section_id` text NOT NULL,
	`content` text NOT NULL,
	`order` text NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` text PRIMARY KEY NOT NULL,
	`section_id` text NOT NULL,
	`url` text NOT NULL,
	`caption` text,
	`order` text NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE no action
);
