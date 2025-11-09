import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LaunchPanel from "@/components/LaunchPanel";

export const Route = createFileRoute("/launch")({
  component: LaunchPage,
});

function LaunchPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Debug logging
    console.log("🔍 Launch Route Auth Check:", { user, isLoading, isAuthenticated });
    
    // Redirect to signin if not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to sign in...");
      navigate({ to: "/signin" });
    }
  }, [user, isLoading, isAuthenticated, navigate]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-black pt-32 pb-20 px-6">
      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <LaunchPanel />
    </div>
  );
}

