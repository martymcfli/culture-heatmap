import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  companyId: number;
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  variant?: "default" | "outline" | "ghost";
}

export default function FavoriteButton({ 
  companyId, 
  size = "default",
  variant = "outline"
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);

  const { data: isFav } = trpc.favorites.check.useQuery(companyId, {
    enabled: !!user,
  });

  useEffect(() => {
    if (isFav !== undefined) {
      setIsFavorited(isFav);
    }
  }, [isFav]);

  const addFavoriteMutation = trpc.favorites.add.useMutation({
    onSuccess: () => {
      setIsFavorited(true);
      toast.success("Added to favorites!");
    },
    onError: () => {
      toast.error("Failed to add favorite");
    },
  });

  const removeFavoriteMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      setIsFavorited(false);
      toast.success("Removed from favorites");
    },
    onError: () => {
      toast.error("Failed to remove favorite");
    },
  });

  const handleToggleFavorite = () => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }

    if (isFavorited) {
      removeFavoriteMutation.mutate(companyId);
    } else {
      addFavoriteMutation.mutate(companyId);
    }
  };

  const isLoading = addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={isFavorited ? "text-red-600" : ""}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
      )}
      <span className="ml-2">{isFavorited ? "Favorited" : "Add to Favorites"}</span>
    </Button>
  );
}
