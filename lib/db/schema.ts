import type { InferSelectModel } from 'drizzle-orm';
import { pgTable, serial, text, varchar, timestamp, boolean, uuid } from "drizzle-orm/pg-core"

export const attendees = pgTable("attendees", {
  id: serial("id").primaryKey(),
  publicId: varchar("public_id", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  company: varchar("company", { length: 255 }),
  jobTitle: varchar("job_title", { length: 255 }),
  marketingConsent: boolean("marketing_consent").default(false),
  registeredAt: timestamp("registered_at").defaultNow(),
  checkedIn: boolean("checked_in").default(false),
  checkedInAt: timestamp("checked_in_at"),
})


export const user = pgTable('User', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 }),
});

export type User = InferSelectModel<typeof user>;
