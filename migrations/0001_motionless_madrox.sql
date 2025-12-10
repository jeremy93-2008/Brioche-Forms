PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_answers` (
	`id` text PRIMARY KEY NOT NULL,
	`response_id` text NOT NULL,
	`question_id` text NOT NULL,
	`choice_id` text,
	`short_answer` text,
	`long_answer` text,
	`date_answer` integer,
	`form_id` text NOT NULL,
	FOREIGN KEY (`response_id`) REFERENCES `responses`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`choice_id`) REFERENCES `choices`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_answers`("id", "response_id", "question_id", "choice_id", "short_answer", "long_answer", "date_answer", "form_id") SELECT "id", "response_id", "question_id", "choice_id", "short_answer", "long_answer", "date_answer", "form_id" FROM `answers`;--> statement-breakpoint
DROP TABLE `answers`;--> statement-breakpoint
ALTER TABLE `__new_answers` RENAME TO `answers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_choices` (
	`id` text PRIMARY KEY NOT NULL,
	`question_id` text NOT NULL,
	`form_id` text NOT NULL,
	`content` text NOT NULL,
	`order` text NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_choices`("id", "question_id", "form_id", "content", "order") SELECT "id", "question_id", "form_id", "content", "order" FROM `choices`;--> statement-breakpoint
DROP TABLE `choices`;--> statement-breakpoint
ALTER TABLE `__new_choices` RENAME TO `choices`;--> statement-breakpoint
CREATE TABLE `__new_forms` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`author_id` text NOT NULL,
	`author_name` text DEFAULT '' NOT NULL,
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
	`accept_responses` integer DEFAULT 1 NOT NULL,
	`message_if_not_accept_responses` text,
	FOREIGN KEY (`folder_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_forms`("id", "title", "created_at", "updated_at", "author_id", "author_name", "background_color", "folder_id", "description", "background_image", "header_image", "is_published", "is_draft", "can_modify_responses", "response_limit", "response_limit_date", "accept_responses", "message_if_not_accept_responses") SELECT "id", "title", "created_at", "updated_at", "author_id", "author_name", "background_color", "folder_id", "description", "background_image", "header_image", "is_published", "is_draft", "can_modify_responses", "response_limit", "response_limit_date", "accept_responses", "message_if_not_accept_responses" FROM `forms`;--> statement-breakpoint
DROP TABLE `forms`;--> statement-breakpoint
ALTER TABLE `__new_forms` RENAME TO `forms`;--> statement-breakpoint
CREATE TABLE `__new_images` (
	`id` text PRIMARY KEY NOT NULL,
	`section_id` text NOT NULL,
	`form_id` text NOT NULL,
	`url` text NOT NULL,
	`caption` text,
	`order` text NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_images`("id", "section_id", "form_id", "url", "caption", "order") SELECT "id", "section_id", "form_id", "url", "caption", "order" FROM `images`;--> statement-breakpoint
DROP TABLE `images`;--> statement-breakpoint
ALTER TABLE `__new_images` RENAME TO `images`;--> statement-breakpoint
CREATE TABLE `__new_multiple_choices` (
	`id` text PRIMARY KEY NOT NULL,
	`answer_id` text NOT NULL,
	`choice_id` text NOT NULL,
	`form_id` text NOT NULL,
	FOREIGN KEY (`answer_id`) REFERENCES `answers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`choice_id`) REFERENCES `choices`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_multiple_choices`("id", "answer_id", "choice_id", "form_id") SELECT "id", "answer_id", "choice_id", "form_id" FROM `multiple_choices`;--> statement-breakpoint
DROP TABLE `multiple_choices`;--> statement-breakpoint
ALTER TABLE `__new_multiple_choices` RENAME TO `multiple_choices`;--> statement-breakpoint
CREATE TABLE `__new_pages` (
	`id` text PRIMARY KEY NOT NULL,
	`form_id` text NOT NULL,
	`title` text NOT NULL,
	`order` text NOT NULL,
	`conditions` text,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_pages`("id", "form_id", "title", "order", "conditions") SELECT "id", "form_id", "title", "order", "conditions" FROM `pages`;--> statement-breakpoint
DROP TABLE `pages`;--> statement-breakpoint
ALTER TABLE `__new_pages` RENAME TO `pages`;--> statement-breakpoint
CREATE TABLE `__new_questions` (
	`id` text PRIMARY KEY NOT NULL,
	`section_id` text NOT NULL,
	`form_id` text NOT NULL,
	`name` text NOT NULL,
	`content` text NOT NULL,
	`type` text NOT NULL,
	`is_required` integer NOT NULL,
	`order` text NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_questions`("id", "section_id", "form_id", "name", "content", "type", "is_required", "order") SELECT "id", "section_id", "form_id", "name", "content", "type", "is_required", "order" FROM `questions`;--> statement-breakpoint
DROP TABLE `questions`;--> statement-breakpoint
ALTER TABLE `__new_questions` RENAME TO `questions`;--> statement-breakpoint
CREATE TABLE `__new_responses` (
	`id` text PRIMARY KEY NOT NULL,
	`form_id` text NOT NULL,
	`respondent_id` text NOT NULL,
	`submitted_at` integer NOT NULL,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_responses`("id", "form_id", "respondent_id", "submitted_at") SELECT "id", "form_id", "respondent_id", "submitted_at" FROM `responses`;--> statement-breakpoint
DROP TABLE `responses`;--> statement-breakpoint
ALTER TABLE `__new_responses` RENAME TO `responses`;--> statement-breakpoint
CREATE TABLE `__new_sections` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`order` text NOT NULL,
	`conditions` text,
	`page_id` text,
	`form_id` text NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sections`("id", "title", "description", "order", "conditions", "page_id", "form_id") SELECT "id", "title", "description", "order", "conditions", "page_id", "form_id" FROM `sections`;--> statement-breakpoint
DROP TABLE `sections`;--> statement-breakpoint
ALTER TABLE `__new_sections` RENAME TO `sections`;--> statement-breakpoint
CREATE TABLE `__new_texts` (
	`id` text PRIMARY KEY NOT NULL,
	`section_id` text NOT NULL,
	`form_id` text NOT NULL,
	`content` text NOT NULL,
	`order` text NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_texts`("id", "section_id", "form_id", "content", "order") SELECT "id", "section_id", "form_id", "content", "order" FROM `texts`;--> statement-breakpoint
DROP TABLE `texts`;--> statement-breakpoint
ALTER TABLE `__new_texts` RENAME TO `texts`;--> statement-breakpoint
CREATE TABLE `__new_videos` (
	`id` text PRIMARY KEY NOT NULL,
	`section_id` text NOT NULL,
	`form_id` text NOT NULL,
	`url` text NOT NULL,
	`caption` text,
	`order` text NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`form_id`) REFERENCES `forms`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_videos`("id", "section_id", "form_id", "url", "caption", "order") SELECT "id", "section_id", "form_id", "url", "caption", "order" FROM `videos`;--> statement-breakpoint
DROP TABLE `videos`;--> statement-breakpoint
ALTER TABLE `__new_videos` RENAME TO `videos`;