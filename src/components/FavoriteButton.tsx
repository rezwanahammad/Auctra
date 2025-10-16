"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  auctionId: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function FavoriteButton({
  auctionId,
  size = "md",
  showLabel = false,
  className = "",
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const buttonSizeClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5",
  };

  // Check if the auction is favorited
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const response = await fetch("/api/favorites/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ auctionIds: [auctionId] }),
          });

          if (response.ok) {
            const data = await response.json();
            setIsFavorited(!!data.favorites[auctionId]);
          }
        } catch (error) {
          console.error("Check favorite status error:", error);
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
      }
    };

    checkFavoriteStatus();
  }, [auctionId, session, status]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?auctionId=${auctionId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFavorited(false);
        } else {
          throw new Error("Failed to remove favorite");
        }
      } else {
        // Add to favorites
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ auctionId }),
        });

        if (response.ok) {
          setIsFavorited(true);
        } else {
          throw new Error("Failed to add favorite");
        }
      }
    } catch (error) {
      console.error("Toggle favorite error:", error);
      alert("Failed to update favorites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <button
        className={`rounded-full bg-white/90 ${buttonSizeClasses[size]} text-slate-400 shadow-md transition dark:bg-slate-800/90 ${className}`}
        disabled
        aria-label="Loading favorite status"
      >
        <div
          className={`${sizeClasses[size]} animate-pulse rounded-full bg-slate-300 dark:bg-slate-600`}
        ></div>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`group rounded-full bg-white/90 ${
        buttonSizeClasses[size]
      } shadow-md transition hover:scale-110 disabled:opacity-50 dark:bg-slate-800/90 ${
        isFavorited
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
          : "text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-700"
      } ${className}`}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${sizeClasses[size]} transition ${
          isFavorited ? "fill-current" : ""
        }`}
      />
      {showLabel && (
        <span className="ml-1 text-xs font-medium">
          {isFavorited ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
