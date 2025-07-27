"use client";

import { useState, useEffect } from "react";
import {
  smartSupplierMatching,
  type SmartSupplierMatchingOutput,
} from "@/ai/flows/smart-supplier-matching";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Loader2,
  Search,
  Star,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  MessageCircle,
  LocateFixed,
} from "lucide-react";
import { RatingDialog } from "@/components/rating-dialog";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// Zod form validation schema
const formSchema = z.object({
  vendorLocation: z.string().min(3, "Location is required."),
  rawMaterial: z.string().min(2, "Raw material is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  language: z.string().min(2, "Language is required."),
});

type Supplier = SmartSupplierMatchingOutput["suppliers"][0];

function SupplierCard({ supplier }: { supplier: Supplier }) {
  const cleanPhoneNumber = supplier.contactNumber.replace(/[^0-9]/g, "");
  const message = `Hi ${supplier.supplierName}, I found you on DukaanGPT and I'm interested in sourcing raw materials.`;
  const whatsappLink = `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(message)}`;
  const smsLink = `sms:${cleanPhoneNumber}?body=${encodeURIComponent(message)}`;

  return (
    <Card
      className="flex flex-col h-full"
    >
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle>{supplier.supplierName}</CardTitle>
            <CardDescription>{supplier.location}</CardDescription>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full shrink-0">
            <Star className="w-4 h-4 fill-current" />
            <span>{supplier.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="text-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-foreground/80 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Trust Score
            </span>
            <span className="font-bold text-primary">{supplier.trustScore}/100</span>
          </div>
          <Progress value={supplier.trustScore} className="h-2" />
        </div>
        <p className="text-sm">
          <span className="font-semibold text-foreground/80">Languages:</span>{" "}
          {supplier.languageSupport.join(", ")}
        </p>
        <div>
          <h4 className="font-semibold text-sm mb-2 text-foreground/80">Inventory Highlight</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            {supplier.inventory.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.itemName}</span>
                <span>
                  ₹{item.price} ({item.quantity} units)
                </span>
              </div>
            ))}
            {supplier.inventory.length > 2 && (
              <p>+ {supplier.inventory.length - 2} more items</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <RatingDialog supplierName={supplier.supplierName} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full sm:w-auto flex-grow">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={smsLink} target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-2 h-4 w-4" /> SMS
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

export default function SupplierMatchingPage() {
  const [data, setData] = useState<SmartSupplierMatchingOutput | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [running, setRunning] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendorLocation: "",
      rawMaterial: "tomatoes",
      quantity: 10,
      language: "English",
    },
  });

  const getLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
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
          const locationData = await response.json();
          const location = locationData.display_name || `${locationData.address.city}, ${locationData.address.state}`;
          form.setValue("vendorLocation", location);
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
      () => {
        setIsLocating(false);
        toast({
          variant: "destructive",
          title: "Location access denied",
          description: "Enable location in browser or enter manually.",
        });
      }
    );
  };

  useEffect(() => {
    form.setValue("vendorLocation", "Koramangala, Bangalore");
    getLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setRunning(true);
    setData(null);
    setError(null);
    try {
      const result = await smartSupplierMatching(values);
      setData(result);
    } catch (e: any) {
      setError(e);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="container py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Smart Supplier Matching
        </h1>
        <p className="mt-2 text-lg text-foreground/80 max-w-2xl mx-auto">
          Find the best local suppliers for your needs, powered by AI.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search for Suppliers</CardTitle>
          <CardDescription>
            Enter your requirements to find matching suppliers near you. Use the locate button for automatic detection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
            >
              <FormField
                control={form.control}
                name="vendorLocation"
                render={({ field }) => (
                  <FormItem className="lg:col-span-1">
                    <FormLabel>Your Location</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input placeholder="e.g., Jayanagar, Bangalore" {...field} />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={getLocation}
                          disabled={isLocating}
                        >
                          {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rawMaterial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raw Material</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Onions, Flour" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Hindi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={running} className="w-full lg:w-auto">
                {running ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Suppliers
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="min-h-[20rem]">
        {running && !data && (
          <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">AI is finding the best suppliers for you...</p>
          </div>
        )}
        {error && (
          <div className="text-destructive p-4 bg-destructive/10 rounded-md">
            <p className="font-bold">An error occurred:</p>
            <p className="text-sm">{error.message}</p>
          </div>
        )}
        {data && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  AI Summary ({data.suppliers.length} suppliers found)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{data.summary}</p>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.suppliers.map((supplier, index) => (
                <SupplierCard key={index} supplier={supplier} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
