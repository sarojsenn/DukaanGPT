
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BellRing, Wand2, LocateFixed } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { broadcastSurplusAlert } from "@/ai/flows/broadcast-surplus-alert";
import { getMarketPrice } from "@/ai/flows/get-market-price";


const formSchema = z.object({
  produceName: z.string().min(3, "Produce name is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  price: z.coerce.number().min(1, "Price is required."),
  location: z.string().min(3, "Location is required."),
  contact: z.string().min(10, "A valid contact number is required."),
  notes: z.string().optional(),
});

export default function SurplusAlertPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produceName: "",
      quantity: 100,
      price: 5,
      location: "",
      contact: "",
      notes: "Fresh from the farm, available for immediate pickup.",
    },
  });
  
  const getLocation = () => {
    if (!navigator.geolocation) {
       toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const location = data.display_name || `${data.address.city}, ${data.address.state}`;
          form.setValue("location", location);
          toast({
            title: "✅ Location Found!",
            description: `Location set to ${location}`,
          });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Could not fetch address",
                description: "Please enter your location manually.",
            });
        } finally {
            setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        toast({
            variant: "destructive",
            title: "Location access denied",
            description: "Please enable location access in your browser settings or enter it manually.",
        });
      }
    );
  };
  
  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchPrice = async () => {
    const produceName = form.getValues("produceName");
    if (!produceName) {
        toast({
            variant: "destructive",
            title: "Produce Name Required",
            description: "Please enter a produce name before fetching its price.",
        });
        return;
    }
    setIsFetchingPrice(true);
    try {
        const result = await getMarketPrice({ itemName: produceName });
        form.setValue("price", result.price);
        toast({
            title: `Price for ${produceName} updated!`,
            description: `AI suggested market price is Rs ${result.price}/kg.`,
        });
    } catch (error) {
         console.error("Failed to fetch market price", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch the market price.",
        });
    } finally {
        setIsFetchingPrice(false);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const result = await broadcastSurplusAlert(values);

      if (result.success) {
        toast({
          title: "✅ Alert Posted!",
          description: `Your surplus alert for ${values.quantity}kg of ${values.produceName} has been posted to the community feed.`,
        });
        
        // Create a community post
        const newCommunityPost = {
            id: Date.now(),
            username: "You (via Surplus Alert)",
            avatarUrl: "https://placehold.co/100x100.png",
            caption: `Surplus produce available! I have ${values.quantity}kg of ${values.produceName} for sale at Rs ${values.price}/kg in ${values.location}. ${values.notes || ''} #surplus #deal`,
            likes: 0,
            comments: 0,
            isLiked: false,
        };

        const existingPosts = JSON.parse(localStorage.getItem('newCommunityPosts') || '[]');
        localStorage.setItem('newCommunityPosts', JSON.stringify([newCommunityPost, ...existingPosts]));


        form.reset({
          produceName: "",
          quantity: 100,
          price: 5,
          location: form.getValues('location'), // Keep location
          contact: "",
          notes: "Fresh from the farm, available for immediate pickup.",
        });

      } else {
        toast({
            variant: "destructive",
            title: "❌ Post Failed",
            description: result.message || "An unknown error occurred.",
        });
      }

    } catch (error) {
       console.error("Error broadcasting alert:", error);
       toast({
        variant: "destructive",
        title: "❌ Error",
        description: "Could not post the alert. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Broadcast Surplus Produce
        </h1>
        <p className="mt-2 text-lg text-foreground/80 max-w-2xl mx-auto">
          Have extra produce? Alert local vendors by posting to the community feed and sell it quickly to reduce waste.
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Surplus Alert</CardTitle>
          <CardDescription>
            Fill in the details below. This will post your alert to the community feed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="produceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Produce Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Tomatoes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Location</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                            <Input placeholder="e.g., Nashik" {...field} />
                        </FormControl>
                         <Button type="button" variant="outline" size="icon" onClick={getLocation} disabled={isLocating}>
                            {isLocating ? <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> : <LocateFixed className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity (in kg)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (Rs per kg)</FormLabel>
                       <div className="flex items-center gap-2">
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleFetchPrice}
                                disabled={isFetchingPrice}
                            >
                                {isFetchingPrice ? (
                                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Wand2 className="h-4 w-4 text-primary" />
                                )}
                                <span className="sr-only">Fetch Market Price</span>
                            </Button>
                        </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your contact number for vendors" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Organic, available for the next 2 days only."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={loading}>
                   {loading ? (
                      <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   ) : (
                      <BellRing className="mr-2 h-4 w-4" />
                   )}
                  Post Alert to Feed
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
