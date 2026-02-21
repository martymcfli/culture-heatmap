CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`domain` varchar(255),
	`industry` varchar(100),
	`sizeRange` varchar(50),
	`headquartersCity` varchar(100),
	`headquartersState` varchar(100),
	`headquartersCountry` varchar(100),
	`logoUrl` text,
	`website` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`),
	CONSTRAINT `companies_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `companyReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`source` varchar(50),
	`rating` decimal(3,2),
	`title` varchar(255),
	`reviewText` text,
	`pros` text,
	`cons` text,
	`sentimentScore` decimal(3,2),
	`reviewDate` date,
	`jobTitle` varchar(255),
	`employmentStatus` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `companyReviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cultureScores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`source` varchar(50) NOT NULL,
	`overallRating` decimal(3,2),
	`workLifeBalance` decimal(3,2),
	`compensationBenefits` decimal(3,2),
	`careerOpportunities` decimal(3,2),
	`cultureValues` decimal(3,2),
	`seniorManagement` decimal(3,2),
	`ceoApproval` decimal(5,2),
	`recommendToFriend` decimal(5,2),
	`reviewCount` int,
	`dateCollected` date,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cultureScores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cultureTrends` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`metricName` varchar(100) NOT NULL,
	`metricValue` decimal(5,2),
	`monthYear` date,
	`source` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cultureTrends_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `layoffEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`date` date,
	`employeesAffected` int,
	`percentageOfWorkforce` decimal(5,2),
	`sourceUrl` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `layoffEvents_id` PRIMARY KEY(`id`)
);
