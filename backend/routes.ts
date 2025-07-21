import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReviewSchema } from "@shared/schema";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Google Sheets API
  const auth = new GoogleAuth({
    credentials: process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY) : undefined,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

  // Submit review
  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      
      // Store in memory
      const review = await storage.createReview(validatedData);

      // Also store in Google Sheets if configured
      if (SPREADSHEET_ID && sheets) {
        try {
          await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Sheet1!A:E",
            valueInputOption: "RAW",
            requestBody: {
              values: [
                [
                  review.createdAt.toISOString(),
                  review.rating,
                  review.sentiment,
                  review.comment || "",
                  review.email || "",
                ],
              ],
            },
          });
        } catch (sheetsError) {
          console.error("Failed to write to Google Sheets:", sheetsError);
          // Continue without failing the request
        }
      }

      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  // Get all reviews
  app.get("/api/reviews", async (req, res) => {
    try {
      // Note: Real-time sync to Google Sheets happens during form submission
      // No need to sync from Google Sheets here since our memory storage is the source of truth

      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Get review statistics
  app.get("/api/reviews/stats", async (req, res) => {
    try {
      const stats = await storage.getReviewStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}
