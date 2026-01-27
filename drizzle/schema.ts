import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Companies table
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  domain: varchar("domain", { length: 255 }),
  industry: varchar("industry", { length: 100 }),
  sizeRange: varchar("sizeRange", { length: 50 }), // "1-50", "51-200", etc.
  headquartersCity: varchar("headquartersCity", { length: 100 }),
  headquartersState: varchar("headquartersState", { length: 100 }),
  headquartersCountry: varchar("headquartersCountry", { length: 100 }),
  logoUrl: text("logoUrl"),
  website: varchar("website", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

// Culture scores table
export const cultureScores = mysqlTable("cultureScores", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  source: varchar("source", { length: 50 }).notNull(), // "glassdoor", "indeed", "comparably"
  overallRating: decimal("overallRating", { precision: 3, scale: 2 }),
  workLifeBalance: decimal("workLifeBalance", { precision: 3, scale: 2 }),
  compensationBenefits: decimal("compensationBenefits", { precision: 3, scale: 2 }),
  careerOpportunities: decimal("careerOpportunities", { precision: 3, scale: 2 }),
  cultureValues: decimal("cultureValues", { precision: 3, scale: 2 }),
  seniorManagement: decimal("seniorManagement", { precision: 3, scale: 2 }),
  ceoApproval: decimal("ceoApproval", { precision: 5, scale: 2 }),
  recommendToFriend: decimal("recommendToFriend", { precision: 5, scale: 2 }),
  reviewCount: int("reviewCount"),
  dateCollected: date("dateCollected"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CultureScore = typeof cultureScores.$inferSelect;
export type InsertCultureScore = typeof cultureScores.$inferInsert;

// Culture trends table
export const cultureTrends = mysqlTable("cultureTrends", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  metricName: varchar("metricName", { length: 100 }).notNull(),
  metricValue: decimal("metricValue", { precision: 5, scale: 2 }),
  monthYear: date("monthYear"),
  source: varchar("source", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CultureTrend = typeof cultureTrends.$inferSelect;
export type InsertCultureTrend = typeof cultureTrends.$inferInsert;

// Layoff events table
export const layoffEvents = mysqlTable("layoffEvents", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  date: date("date"),
  employeesAffected: int("employeesAffected"),
  percentageOfWorkforce: decimal("percentageOfWorkforce", { precision: 5, scale: 2 }),
  sourceUrl: text("sourceUrl"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LayoffEvent = typeof layoffEvents.$inferSelect;
export type InsertLayoffEvent = typeof layoffEvents.$inferInsert;

// Company reviews table
export const companyReviews = mysqlTable("companyReviews", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  source: varchar("source", { length: 50 }),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  title: varchar("title", { length: 255 }),
  reviewText: text("reviewText"),
  pros: text("pros"),
  cons: text("cons"),
  sentimentScore: decimal("sentimentScore", { precision: 3, scale: 2 }),
  reviewDate: date("reviewDate"),
  jobTitle: varchar("jobTitle", { length: 255 }),
  employmentStatus: varchar("employmentStatus", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CompanyReview = typeof companyReviews.$inferSelect;
export type InsertCompanyReview = typeof companyReviews.$inferInsert;

// Anonymous user reviews table
export const anonymousReviews = mysqlTable("anonymousReviews", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).notNull(),
  title: varchar("title", { length: 255 }),
  reviewText: text("reviewText"),
  pros: text("pros"),
  cons: text("cons"),
  jobTitle: varchar("jobTitle", { length: 255 }),
  employmentStatus: varchar("employmentStatus", { length: 50 }), // "current", "former", "interviewing"
  workLifeBalance: decimal("workLifeBalance", { precision: 3, scale: 2 }),
  compensationBenefits: decimal("compensationBenefits", { precision: 3, scale: 2 }),
  careerOpportunities: decimal("careerOpportunities", { precision: 3, scale: 2 }),
  cultureValues: decimal("cultureValues", { precision: 3, scale: 2 }),
  seniorManagement: decimal("seniorManagement", { precision: 3, scale: 2 }),
  isHelpful: int("isHelpful").default(0), // Count of helpful votes
  isFlagged: int("isFlagged").default(0), // Flag for inappropriate content
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnonymousReview = typeof anonymousReviews.$inferSelect;
export type InsertAnonymousReview = typeof anonymousReviews.$inferInsert;