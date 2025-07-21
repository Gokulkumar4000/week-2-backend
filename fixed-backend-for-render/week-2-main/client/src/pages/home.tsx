import { Navigation } from "@/components/navigation";
import { ReviewForm } from "@/components/review-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <ReviewForm />
    </div>
  );
}
