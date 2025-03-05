import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertAppointmentSchema, insertHealthRecordSchema, insertAiAnalysisSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Appointments
  app.get("/api/appointments/:userId", async (req, res) => {
    const appointments = await storage.getAppointmentsByUserId(parseInt(req.params.userId));
    res.json(appointments);
  });

  app.post("/api/appointments", async (req, res) => {
    const appointment = insertAppointmentSchema.parse(req.body);
    const created = await storage.createAppointment(appointment);
    res.status(201).json(created);
  });

  // Health Records
  app.get("/api/health-records/:userId", async (req, res) => {
    const records = await storage.getHealthRecordsByUserId(parseInt(req.params.userId));
    res.json(records);
  });

  app.post("/api/health-records", async (req, res) => {
    const record = insertHealthRecordSchema.parse(req.body);
    const created = await storage.createHealthRecord(record);
    res.status(201).json(created);
  });

  // AI Analysis
  app.post("/api/ai-analysis", async (req, res) => {
    const analysis = insertAiAnalysisSchema.parse(req.body);
    const created = await storage.createAiAnalysis(analysis);
    res.status(201).json(created);
  });

  app.get("/api/ai-analysis/:userId", async (req, res) => {
    const analyses = await storage.getAiAnalysesByUserId(parseInt(req.params.userId));
    res.json(analyses);
  });

  const httpServer = createServer(app);
  return httpServer;
}
