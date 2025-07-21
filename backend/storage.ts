import { reviews, type Review, type InsertReview } from "@shared/schema";

export interface IStorage {
  createReview(review: InsertReview): Promise<Review>;
  getReviews(): Promise<Review[]>;
  getReviewStats(): Promise<{
    totalReviews: number;
    averageRating: number;
    sentimentBreakdown: { positive: number; neutral: number; negative: number };
    ratingDistribution: { [key: number]: number };
  }>;
}

export class MemStorage implements IStorage {
  private reviews: Map<number, Review>;
  private currentId: number;

  constructor() {
    this.reviews = new Map();
    this.currentId = 1;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentId++;
    const review: Review = {
      ...insertReview,
      id,
      email: insertReview.email || null,
      comment: insertReview.comment || null,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    return review;
  }

  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getReviewStats() {
    const reviewsList = Array.from(this.reviews.values());
    const totalReviews = reviewsList.length;
    
    if (totalReviews === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const averageRating = reviewsList.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    
    const sentimentBreakdown = reviewsList.reduce(
      (acc, review) => {
        acc[review.sentiment as keyof typeof acc]++;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    const ratingDistribution = reviewsList.reduce(
      (acc, review) => {
        acc[review.rating as keyof typeof acc]++;
        return acc;
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>
    );

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      sentimentBreakdown,
      ratingDistribution,
    };
  }
}

export const storage = new MemStorage();
