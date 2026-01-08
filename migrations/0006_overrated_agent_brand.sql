ALTER TABLE `forms` ALTER COLUMN "form_style" TO "form_style" text NOT NULL DEFAULT 'brioche';--> statement-breakpoint
ALTER TABLE `forms` ALTER COLUMN "theme" TO "theme" text NOT NULL DEFAULT 'dark';--> statement-breakpoint
ALTER TABLE `forms` ADD `must_login_to_respond` integer NOT NULL DEFAULT 0;