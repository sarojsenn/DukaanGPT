"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "./ui/textarea";

export function RatingDialog({ supplierName }: { supplierName: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    // In a real app, this would submit the rating to a backend.
    toast({
      title: "Rating Submitted!",
      description: `You gave ${supplierName} a ${rating} star rating. Thank you for your feedback!`,
    });
    setOpen(false);
    setRating(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto flex-grow">
          <Star className="mr-2 h-4 w-4" /> Rate Supplier
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate {supplierName}</DialogTitle>
          <DialogDescription>
            Share your experience to help other vendors in the community.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div
            className="flex justify-center gap-2"
            onMouseLeave={() => setHoverRating(0)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-8 w-8 cursor-pointer transition-colors",
                  (hoverRating || rating) >= star
                    ? "text-amber-400 fill-amber-400"
                    : "text-muted-foreground/50"
                )}
                onMouseEnter={() => setHoverRating(star)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <Textarea placeholder="Tell us more about your experience (optional)..." />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0}>
            Submit Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
