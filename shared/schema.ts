import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  doctorName: text("doctor_name").notNull(),
  clinicName: text("clinic_name").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
});

export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  diagnosis: text("diagnosis").notNull(),
  doctor: text("doctor").notNull(),
  date: text("date").notNull(),
});

export const aiAnalysis = pgTable("ai_analysis", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  symptoms: text("symptoms").notNull(),
  analysis: text("analysis").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertAppointmentSchema = createInsertSchema(appointments);
export const insertHealthRecordSchema = createInsertSchema(healthRecords);
export const insertAiAnalysisSchema = createInsertSchema(aiAnalysis);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type InsertHealthRecord = z.infer<typeof insertHealthRecordSchema>;
export type InsertAiAnalysis = z.infer<typeof insertAiAnalysisSchema>;

export type User = typeof users.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;
export type HealthRecord = typeof healthRecords.$inferSelect;
export type AiAnalysis = typeof aiAnalysis.$inferSelect;
