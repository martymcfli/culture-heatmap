CREATE TABLE `glassdoorMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`overallRating` decimal(3,1),
	`ceoApproval` decimal(5,2),
	`recommendToFriend` decimal(5,2),
	`salaryMin` int,
	`salaryMax` int,
	`salaryCurrency` varchar(10) DEFAULT 'USD',
	`reviewCount` int DEFAULT 0,
	`interviewCount` int DEFAULT 0,
	`lastSyncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `glassdoorMetrics_id` PRIMARY KEY(`id`),
	CONSTRAINT `glassdoorMetrics_companyId_unique` UNIQUE(`companyId`)
);
--> statement-breakpoint
CREATE TABLE `interviewData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`glassdoorInterviewId` varchar(255),
	`jobTitle` varchar(255) NOT NULL,
	`interviewType` varchar(100),
	`difficulty` varchar(50),
	`duration` varchar(100),
	`questions` text,
	`experience` text,
	`outcome` varchar(50),
	`interviewDate` date,
	`dataSource` varchar(100) DEFAULT 'Glassdoor',
	`cachedAt` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `interviewData_id` PRIMARY KEY(`id`),
	CONSTRAINT `interviewData_glassdoorInterviewId_unique` UNIQUE(`glassdoorInterviewId`)
);
