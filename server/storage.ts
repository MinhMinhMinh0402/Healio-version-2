import { users, appointments, healthRecords, aiAnalysis } from "@shared/schema";
import type { User, InsertUser, Appointment, InsertAppointment, HealthRecord, InsertHealthRecord, AiAnalysis, InsertAiAnalysis } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAppointmentsByUserId(userId: number): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  
  getHealthRecordsByUserId(userId: number): Promise<HealthRecord[]>;
  createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord>;
  
  getAiAnalysesByUserId(userId: number): Promise<AiAnalysis[]>;
  createAiAnalysis(analysis: InsertAiAnalysis): Promise<AiAnalysis>;

  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private appointments: Map<number, Appointment>;
  private healthRecords: Map<number, HealthRecord>;
  private aiAnalyses: Map<number, AiAnalysis>;
  sessionStore: session.SessionStore;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.appointments = new Map();
    this.healthRecords = new Map();
    this.aiAnalyses = new Map();
    this.currentId = {
      users: 1,
      appointments: 1,
      healthRecords: 1,
      aiAnalyses: 1,
    };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAppointmentsByUserId(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.userId === userId,
    );
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentId.appointments++;
    const newAppointment = { ...appointment, id };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  async getHealthRecordsByUserId(userId: number): Promise<HealthRecord[]> {
    return Array.from(this.healthRecords.values()).filter(
      (record) => record.userId === userId,
    );
  }

  async createHealthRecord(record: InsertHealthRecord): Promise<HealthRecord> {
    const id = this.currentId.healthRecords++;
    const newRecord = { ...record, id };
    this.healthRecords.set(id, newRecord);
    return newRecord;
  }

  async getAiAnalysesByUserId(userId: number): Promise<AiAnalysis[]> {
    return Array.from(this.aiAnalyses.values()).filter(
      (analysis) => analysis.userId === userId,
    );
  }

  async createAiAnalysis(analysis: InsertAiAnalysis): Promise<AiAnalysis> {
    const id = this.currentId.aiAnalyses++;
    const newAnalysis = { ...analysis, id };
    this.aiAnalyses.set(id, newAnalysis);
    return newAnalysis;
  }
}

export const storage = new MemStorage();
