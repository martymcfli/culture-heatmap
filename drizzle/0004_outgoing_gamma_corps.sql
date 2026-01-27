CREATE TABLE `salaryData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`jobTitle` varchar(255) NOT NULL,
	`level` varchar(50) NOT NULL,
	`baseSalary` decimal(12,2) NOT NULL,
	`bonus` decimal(12,2),
	`equity` decimal(12,2),
	`totalCompensation` decimal(12,2) NOT NULL,
	`currency` varchar(10) DEFAULT 'USD',
	`location` varchar(255),
	`yearsExperience` int,
	`dataSource` varchar(100),
	`lastUpdated` date,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `salaryData_id` PRIMARY KEY(`id`)
);
