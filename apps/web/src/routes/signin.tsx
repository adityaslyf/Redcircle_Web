import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "../components/ui/sign-in";

export const Route = createFileRoute("/signin")({
  component: SignIn,
});

function SignIn() {
  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const rememberMe = formData.get("rememberMe");

    console.log("Sign in:", { email, password, rememberMe });
    // Add your authentication logic here
  };

  const handleRedditSignIn = () => {
    console.log("Reddit sign in clicked");
    // Add your Reddit OAuth logic here
    // Reddit OAuth endpoint: https://www.reddit.com/api/v1/authorize
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign in clicked");
    // Add your Google OAuth logic here
  };

  const handleResetPassword = () => {
    console.log("Reset password clicked");
    // Add your password reset logic here
  };

  const handleCreateAccount = () => {
    console.log("Create account clicked");
    // Add your account creation logic here
  };

  return (
    <SignInPage
      title={
        <span className="font-light tracking-wider">
          Welcome to <span className="font-bold font-satoshi">Redcircle</span>
        </span>
      }
      description="Access your account and start trading tokenized engagement"
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
