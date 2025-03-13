import { pgTable, serial, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core"

export const attendees = pgTable("attendees", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  company: varchar("company", { length: 255 }),
  jobTitle: varchar("job_title", { length: 255 }),
  dietaryRestrictions: text("dietary_restrictions"),
  tShirtSize: varchar("t_shirt_size", { length: 10 }),
  specialRequirements: text("special_requirements"),
  marketingConsent: boolean("marketing_consent").default(false),
  registeredAt: timestamp("registered_at").defaultNow(),
  checkedIn: boolean("checked_in").default(false),
  checkedInAt: timestamp("checked_in_at"),
})

