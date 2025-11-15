import { useAuth } from "../contexts/AuthContext";

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
      {/* User Avatar */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.username}
            className="w-8 h-8 rounded-full border-2 border-white/20 flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-white text-sm font-medium truncate">
          {user.username}
        </span>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap flex-shrink-0"
      >
        Logout
      </button>
    </div>
  );
}

