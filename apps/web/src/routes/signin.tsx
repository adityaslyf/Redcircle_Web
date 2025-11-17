import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SignInPage } from "../components/ui/sign-in";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getApiUrl } from "../lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/signin")({
  component: SignIn,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || undefined,
    };
  },
});

function SignIn() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { redirect } = Route.useSearch();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: redirect || "/" });
    }
  }, [isAuthenticated, navigate, redirect]);

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userStr = params.get("user");
    const error = params.get("error");

    if (error) {
      console.error("❌ Authentication error:", error);
      
      // Show user-friendly error messages
      const errorMessages: { [key: string]: string } = {
        auth_failed: "Reddit authentication failed. This usually means:\n\n• The users table doesn't exist (run: pnpm db:push)\n• Database connection failed (check DATABASE_URL)\n\nCheck the backend terminal for detailed error logs.",
        no_user: "Reddit authentication succeeded but no user was returned. Check backend logs.",
        session_failed: "Failed to create session. Please try again.",
        server_error: "Server error occurred. Please try again.",
      };
      
      const message = errorMessages[error] || `Unknown error: ${error}`;
      toast.error("Authentication error", {
        description: `${message}\n\nCheck your backend terminal for detailed error logs.`,
      });
      
      // Clean up URL
      window.history.replaceState({}, document.title, "/signin");
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Use auth context to log in
        login(token, user);
        
        console.log("✅ Successfully signed in:", user);
        
        // Clean up URL
        window.history.replaceState({}, document.title, "/signin");
        
        // Redirect to intended page or home
        navigate({ to: redirect || "/" });
      } catch (err) {
        console.error("❌ Error parsing user data:", err);
        toast.error("Failed to complete sign in", {
          description: "We couldn't parse the user data from Reddit. Please try again.",
        });
      }
    }
  }, [login, navigate]);

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const rememberMe = formData.get("rememberMe");

    console.log("Email/Password sign in attempt:", { email, rememberMe, hasPassword: !!password });
    
    // TODO: Implement email/password authentication
    toast.info("Email/password sign-in not available yet", {
      description: "Please use Reddit sign-in to access RedCircle.",
    });
  };

  const handleRedditSignIn = () => {
    console.log("🔴 Reddit sign-in button clicked!");
    
    // Redirect to backend OAuth endpoint
    const backendUrl = getApiUrl();
    console.log("🔴 Backend URL:", backendUrl);
    console.log("🔴 Redirecting to:", `${backendUrl}/auth/reddit`);
    
    window.location.href = `${backendUrl}/auth/reddit`;
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    toast.info("Google sign-in coming soon", {
      description: "For now, please continue with Reddit sign-in.",
    });
  };

  const handleResetPassword = () => {
    // TODO: Implement password reset
    toast.info("Password reset not available yet", {
      description: "Feature coming soon.",
    });
  };

  const handleCreateAccount = () => {
    // TODO: Implement account creation
    toast.info("Account creation handled via Reddit", {
      description:
        "A RedCircle account is created automatically when you sign in with Reddit.",
    });
  };

  return (
    <SignInPage
      title={
        <span className="font-light tracking-wider">
          Welcome to <span className="font-bold font-satoshi">Redcircle</span>
        </span>
      }
      description={
        redirect 
          ? "Please sign in to access this feature"
          : "Access your account and start trading tokenized engagement"
      }
      heroImageSrc="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
      testimonials={[
        {
          avatarSrc: "https://i.pravatar.cc/150?img=1",
          name: "Sarah Chen",
          handle: "@sarahc",
          text: "RedCircle transformed how I monetize my content. The tokenization process is seamless!",
        },
        {
          avatarSrc: "https://i.pravatar.cc/150?img=2",
          name: "Marcus Rodriguez",
          handle: "@marcusr",
          text: "Best trading platform for content creators. The UI is incredibly intuitive.",
        },
        {
          avatarSrc: "https://i.pravatar.cc/150?img=3",
          name: "Emily Watson",
          handle: "@emilyw",
          text: "I've been using RedCircle for 6 months. The rewards system is phenomenal!",
        },
      ]}
      onSignIn={handleSignIn}
      onRedditSignIn={handleRedditSignIn}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={handleResetPassword}
      onCreateAccount={handleCreateAccount}
    />
  );
}
