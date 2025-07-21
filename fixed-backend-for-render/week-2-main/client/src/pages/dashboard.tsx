import { Navigation } from "@/components/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <AdminDashboard />
    </div>
  );
}
