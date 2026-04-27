ALTER TABLE `tasks` ADD `gaccsGoals` text;--> statement-breakpoint
ALTER TABLE `tasks` ADD `gaccsAudience` text;--> statement-breakpoint
ALTER TABLE `tasks` ADD `gaccsCreative` text;--> statement-breakpoint
ALTER TABLE `tasks` ADD `gaccsChannels` text;--> statement-breakpoint
ALTER TABLE `tasks` ADD `gaccsStakeholders` text;--> statement-breakpoint
ALTER TABLE `tasks` ADD `routedByAgentId` int;--> statement-breakpoint
ALTER TABLE `tasks` ADD `reviewingAgentId` int;--> statement-breakpoint
ALTER TABLE `tasks` ADD `subFunction` varchar(128);--> statement-breakpoint
ALTER TABLE `tasks` ADD `orchestrationStage` enum('cma_review','lead_assignment','specialist_work','lead_review','cma_approval','human_review','completed') DEFAULT 'cma_review';--> statement-breakpoint
ALTER TABLE `tasks` ADD `cmaFeedback` text;--> statement-breakpoint
ALTER TABLE `tasks` ADD `leadFeedback` text;