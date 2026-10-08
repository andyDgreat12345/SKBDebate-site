CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`data` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_documents_owner_kind` ON `documents` (`owner_id`,`kind`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'learner' NOT NULL,
	`bio` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`owner_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`completed_at` text NOT NULL,
	PRIMARY KEY(`owner_id`, `lesson_id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`resource_id` text NOT NULL,
	`owner_id` text NOT NULL,
	`reason` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`author` text NOT NULL,
	`title` text NOT NULL,
	`format` text NOT NULL,
	`kind` text NOT NULL,
	`description` text NOT NULL,
	`url` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_submissions_status_created` ON `submissions` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_submissions_owner` ON `submissions` (`owner_id`);