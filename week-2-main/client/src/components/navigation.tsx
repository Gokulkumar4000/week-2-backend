import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">FeedbackPro</h1>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/">
                  <span
                    className={cn(
                      "px-1 pt-1 pb-4 text-sm font-medium transition-colors cursor-pointer",
                      location === "/"
                        ? "text-primary border-b-2 border-primary"
                        : "text-secondary hover:text-slate-700"
                    )}
                  >
                    Submit Review
                  </span>
                </Link>
                <Link href="/dashboard">
                  <span
                    className={cn(
                      "px-1 pt-1 pb-4 text-sm font-medium transition-colors cursor-pointer",
                      location === "/dashboard"
                        ? "text-primary border-b-2 border-primary"
                        : "text-secondary hover:text-slate-700"
                    )}
                  >
                    Admin Dashboard
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <span className="text-sm text-secondary">Real-time Analytics</span>
                  <div className="ml-2 w-2 h-2 bg-success rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-slate-200">
        <div className="px-4 py-3 space-y-1">
          <Link href="/">
            <span
              className={cn(
                "block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                location === "/"
                  ? "text-primary bg-primary/10"
                  : "text-secondary hover:bg-slate-50"
              )}
            >
              Submit Review
            </span>
          </Link>
          <Link href="/dashboard">
            <span
              className={cn(
                "block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                location === "/dashboard"
                  ? "text-primary bg-primary/10"
                  : "text-secondary hover:bg-slate-50"
              )}
            >
              Admin Dashboard
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
