import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, TrendingUp, Smile, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Review } from "@shared/schema";

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/reviews/stats"],
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const recentReviews = reviews?.slice(0, 5) || [];

  const ratingChartData = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        label: "Number of Reviews",
        data: stats
          ? [
              stats.ratingDistribution[1],
              stats.ratingDistribution[2],
              stats.ratingDistribution[3],
              stats.ratingDistribution[4],
              stats.ratingDistribution[5],
            ]
          : [0, 0, 0, 0, 0],
        backgroundColor: [
          "hsl(0, 84.2%, 60.2%)",
          "hsl(25, 95%, 53%)",
          "hsl(45, 93%, 47%)",
          "hsl(142, 76%, 36%)",
          "hsl(142, 71%, 45%)",
        ],
        borderColor: [
          "hsl(0, 93%, 94%)",
          "hsl(25, 95%, 48%)",
          "hsl(45, 93%, 42%)",
          "hsl(142, 76%, 31%)",
          "hsl(142, 71%, 40%)",
        ],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const sentimentChartData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: stats
          ? [
              stats.sentimentBreakdown.positive,
              stats.sentimentBreakdown.neutral,
              stats.sentimentBreakdown.negative,
            ]
          : [0, 0, 0],
        backgroundColor: [
          "hsl(142, 71%, 45%)",
          "hsl(215, 25%, 27%)",
          "hsl(0, 84.2%, 60.2%)",
        ],
        borderColor: [
          "hsl(142, 71%, 40%)",
          "hsl(215, 25%, 22%)",
          "hsl(0, 93%, 94%)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "hsl(215, 25%, 27%)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  const getInitials = (email: string) => {
    if (!email) return "??";
    const parts = email.split("@")[0].split(".");
    return parts
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const getSentimentBadge = (sentiment: string) => {
    const variants = {
      positive: "bg-success/10 text-success",
      neutral: "bg-slate-100 text-secondary",
      negative: "bg-destructive/10 text-destructive",
    };
    
    const labels = {
      positive: "Positive",
      neutral: "Neutral", 
      negative: "Negative",
    };

    return {
      className: variants[sentiment as keyof typeof variants] || variants.neutral,
      label: labels[sentiment as keyof typeof labels] || "Unknown",
    };
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-warning">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-current" : "fill-none"
            }`}
          />
        ))}
      </div>
    );
  };

  if (statsLoading || reviewsLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h2>
        <p className="text-secondary">Real-time analytics and feedback insights • Auto-sync to Google Sheets</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-2xl shadow-lg border border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Star className="text-primary w-5 h-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-secondary">Total Reviews</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats?.totalReviews || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-success/10 rounded-xl">
                <TrendingUp className="text-success w-5 h-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-secondary">Average Rating</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats?.averageRating || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-warning/10 rounded-xl">
                <Smile className="text-warning w-5 h-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-secondary">Positive Reviews</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats?.totalReviews
                    ? Math.round(
                        (stats.sentimentBreakdown.positive / stats.totalReviews) * 100
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Calendar className="text-blue-500 w-5 h-5" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-secondary">This Month</p>
                <p className="text-2xl font-bold text-slate-900">
                  {reviews?.filter(
                    (review) =>
                      new Date(review.createdAt).getMonth() === new Date().getMonth()
                  ).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="rounded-2xl shadow-lg border border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              Star Rating Distribution
            </h3>
            <div className="h-80">
              <Bar data={ratingChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg border border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              Sentiment Analysis
            </h3>
            <div className="h-80">
              <Doughnut data={sentimentChartData} options={doughnutOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card className="rounded-2xl shadow-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900">Recent Reviews</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {recentReviews.length === 0 ? (
            <div className="p-6 text-center text-secondary">
              No reviews yet. Be the first to submit feedback!
            </div>
          ) : (
            recentReviews.map((review) => {
              const sentimentBadge = getSentimentBadge(review.sentiment);
              return (
                <div
                  key={review.id}
                  className="p-6 hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {getInitials(review.email || "")}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {renderStars(review.rating)}
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sentimentBadge.className}`}
                          >
                            {sentimentBadge.label}
                          </span>
                        </div>
                        <span className="text-sm text-secondary">
                          {formatDistanceToNow(new Date(review.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-slate-900 mb-2">"{review.comment}"</p>
                      )}
                      {review.email && (
                        <p className="text-sm text-secondary">{review.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
