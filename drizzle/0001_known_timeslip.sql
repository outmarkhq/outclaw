CREATE TABLE `agents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`agentId` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` varchar(255),
	`tier` enum('leader','coordinator','specialist') NOT NULL DEFAULT 'specialist',
	`subFunction` varchar(128),
	`status` enum('active','idle','error','offline') NOT NULL DEFAULT 'idle',
	`model` varchar(128),
	`lastHeartbeat` timestamp,
	`totalTasksCompleted` int NOT NULL DEFAULT 0,
	`totalTokensUsed` bigint NOT NULL DEFAULT 0,
	`config` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int,
	`userId` int,
	`action` varchar(128) NOT NULL,
	`resource` varchar(128),
	`resourceId` varchar(128),
	`details` json,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`status` enum('inbox','assigned','active','review','waiting','blocked','done','archived') NOT NULL DEFAULT 'inbox',
	`priority` enum('urgent','high','normal','low') NOT NULL DEFAULT 'normal',
	`assignedAgentId` int,
	`createdByUserId` int,
	`source` enum('form','telegram','slack','whatsapp','api') NOT NULL DEFAULT 'form',
	`tags` json,
	`result` text,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspace_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('admin','member') NOT NULL DEFAULT 'member',
	`invitedBy` int,
	`inviteEmail` varchar(320),
	`inviteToken` varchar(128),
	`inviteAccepted` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workspace_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`ownerId` int NOT NULL,
	`status` enum('provisioning','active','suspended','archived') NOT NULL DEFAULT 'provisioning',
	`plan` enum('free','starter','pro','enterprise') NOT NULL DEFAULT 'free',
	`llmProvider` varchar(64),
	`llmModel` varchar(128),
	`llmApiKeyEncrypted` text,
	`portkeyVirtualKey` varchar(255),
	`telegramBotToken` text,
	`telegramEnabled` boolean NOT NULL DEFAULT false,
	`slackBotToken` text,
	`slackEnabled` boolean NOT NULL DEFAULT false,
	`whatsappToken` text,
	`whatsappEnabled` boolean NOT NULL DEFAULT false,
	`monthlyTokensUsed` bigint NOT NULL DEFAULT 0,
	`monthlyTokenLimit` bigint NOT NULL DEFAULT 1000000,
	`totalCostCents` int NOT NULL DEFAULT 0,
	`onboardingStep` int NOT NULL DEFAULT 0,
	`onboardingCompleted` boolean NOT NULL DEFAULT false,
	`settings` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workspaces_id` PRIMARY KEY(`id`),
	CONSTRAINT `workspaces_slug_unique` UNIQUE(`slug`)
);
