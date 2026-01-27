CREATE TABLE `companyNews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int,
	`industryCategory` varchar(100),
	`headline` varchar(500) NOT NULL,
	`summary` text,
	`fullContent` text,
	`sourceUrl` text,
	`sourceName` varchar(255),
	`publishedDate` date,
	`sentiment` varchar(20),
	`relevanceScore` decimal(3,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `companyNews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobOpenings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`jobTitle` varchar(255) NOT NULL,
	`jobDescription` text,
	`location` varchar(255),
	`jobType` varchar(50),
	`salaryMin` int,
	`salaryMax` int,
	`currency` varchar(10) DEFAULT 'USD',
	`postedDate` date,
	`externalUrl` text,
	`source` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `jobOpenings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `savedComparisons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`comparisonName` varchar(255) NOT NULL,
	`companyIds` text,
	`notes` text,
	`savedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `savedComparisons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userFavorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyId` int NOT NULL,
	`savedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userFavorites_id` PRIMARY KEY(`id`)
);
