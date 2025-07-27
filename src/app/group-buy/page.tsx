
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Users, Hourglass, Loader2, LocateFixed, Wand2, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getMarketPrice } from "@/ai/flows/get-market-price";
import { notifySuppliersOfGroupBuy } from "@/ai/flows/notify-suppliers-group-buy";

interface GroupBuyListing {
    id: string;
    creator: string;
    product: string;
    imageUrl: string;
    targetAmount: number;
    currentAmount: number;
    pricePerKg: number;
    originalPrice: number;
    endsIn: string;
    participants: number;
}

const initialGroupBuyListings: GroupBuyListing[] = [
  {
    id: "gb1",
    creator: "Anil Farms",
    product: "A-Grade Onions",
    imageUrl: "https://placehold.co/600x400.png",
    targetAmount: 500, // kg
    currentAmount: 210, // kg
    pricePerKg: 18,
    originalPrice: 25,
    endsIn: "3 days",
    participants: 4,
  },
  {
    id: "gb2",
    creator: "Mumbai Flour Mill",
    product: "Bulk AP Flour (Maida)",
    imageUrl: "https://placehold.co/600x400.png",
    targetAmount: 1000,
    currentAmount: 850,
    pricePerKg: 32,
    originalPrice: 40,
    endsIn: "2 days",
    participants: 12,
  },
  {
    id: "gb3",
    creator: "Delhi Oil Traders",
    product: "Refined Sunflower Oil",
    imageUrl: "https://placehold.co/600x400.png",
    targetAmount: 200, // Liters
    currentAmount: 50,
    pricePerKg: 150, // per liter
    originalPrice: 175,
    endsIn: "5 days",
    participants: 2,
  },
];

function JoinGroupBuyDialog({
  listing,
  onJoin,
}: {
  listing: GroupBuyListing;
  onJoin: (id: string, amount: number) => void;
}) {
  const [amount, setAmount] = useState(10);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a pledge amount greater than zero.",
      });
      return;
    }
    if (amount > listing.targetAmount - listing.currentAmount) {
      toast({
        variant: "destructive",
        title: "Amount Too High",
        description: `You can pledge a maximum of ${listing.targetAmount - listing.currentAmount} kg.`,
      });
      return;
    }
    onJoin(listing.id, amount);
    toast({
      title: "Successfully Joined!",
      description: `You have pledged ${amount}kg for ${listing.product}.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg" disabled={listing.currentAmount >= listing.targetAmount}>
          {listing.currentAmount >= listing.targetAmount ? "Target Reached" : "Join Group Buy"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join {listing.product} Group Buy</DialogTitle>
          <DialogDescription>
            Pledge the quantity you want to purchase. The deal is confirmed when the target is met.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <p>Current Progress: {listing.currentAmount} / {listing.targetAmount} kg</p>
                <p className="text-2xl font-bold text-primary">Rs {listing.pricePerKg}/kg</p>
            </div>
            <div className="space-y-2">
                <Label htmlFor="pledge-amount">Your Quantity (kg)</Label>
                <Input 
                    id="pledge-amount" 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="1"
                    max={listing.targetAmount - listing.currentAmount}
                />
            </div>
            <p className="font-bold text-lg">Your Cost: Rs {(amount * listing.pricePerKg).toFixed(2)}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Confirm Pledge</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function GroupBuyPage() {
    const [listings, setListings] = useState<GroupBuyListing[]>(initialGroupBuyListings);
    const { toast } = useToast();

    // State for the new group buy form
    const [newProduct, setNewProduct] = useState({ name: "", target: 1000, price: 50, originalPrice: 60, location: ""});
    const [isCreating, setIsCreating] = useState(false);
    const [isFetchingPrice, setIsFetchingPrice] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    const getLocation = () => {
        if (!navigator.geolocation) {
           toast({ variant: "destructive", title: "Geolocation not supported" });
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
              setNewProduct(p => ({ ...p, location }));
              toast({ title: "✅ Location Found!", description: `Location set to ${location}` });
            } catch (error) {
                toast({ variant: "destructive", title: "Could not fetch address" });
            } finally {
                setIsLocating(false);
            }
          },
          () => {
            setIsLocating(false);
            toast({ variant: "destructive", title: "Location access denied" });
          }
        );
      };

    useEffect(() => {
        getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFetchPrice = async () => {
        if (!newProduct.name) {
            toast({ variant: 'destructive', title: 'Product Name Required' });
            return;
        }
        setIsFetchingPrice(true);
        try {
            const result = await getMarketPrice({ itemName: newProduct.name });
            const discountedPrice = parseFloat((result.price * 0.9).toFixed(2)); // 10% discount
            setNewProduct(p => ({...p, price: discountedPrice, originalPrice: result.price }));
            toast({ title: `Price for ${newProduct.name} updated!`, description: `AI suggested market price is Rs ${result.price}/kg.` });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch the market price.' });
        } finally {
            setIsFetchingPrice(false);
        }
    };


    const handleCreateListing = async () => {
        if (!newProduct.name || !newProduct.location || newProduct.target <= 0 || newProduct.price <= 0 || newProduct.originalPrice <= 0) {
            toast({ variant: "destructive", title: "Invalid Input" });
            return;
        }
        setIsCreating(true);

        try {
            const newListing: GroupBuyListing = {
                id: `gb-${Date.now()}`,
                creator: "Your Shop",
                product: newProduct.name,
                imageUrl: "https://placehold.co/600x400.png",
                targetAmount: newProduct.target,
                currentAmount: 0,
                pricePerKg: newProduct.price,
                originalPrice: newProduct.originalPrice,
                endsIn: "7 days",
                participants: 0,
            };

            setListings([newListing, ...listings]);
            toast({
                title: "Group Buy Created!",
                description: `Your group buy for ${newProduct.name} is now live.`,
            });
            
            // Notify suppliers
            const notificationResult = await notifySuppliersOfGroupBuy({
                productName: newProduct.name,
                targetQuantity: newProduct.target,
                pricePerUnit: newProduct.price,
                vendorLocation: newProduct.location,
            });

            toast({
                title: "Suppliers Notified",
                description: notificationResult.summary
            });

            // Reset form
            setNewProduct({ name: "", target: 1000, price: 50, originalPrice: 60, location: newProduct.location });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Creation Failed", description: error.message });
        } finally {
            setIsCreating(false);
        }

    };

    const handleJoinBuy = (id: string, amount: number) => {
        setListings(listings.map(l => {
            if (l.id === id) {
                return {
                    ...l,
                    currentAmount: l.currentAmount + amount,
                    participants: l.participants + 1,
                }
            }
            return l;
        }));
    };
    
    const handleRemoveListing = (id: string) => {
        setListings(listings.filter(l => l.id !== id));
        toast({
            title: "Group Buy Removed",
            description: "The group buy listing has been removed.",
        });
    };


  return (
    <div className="container py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Group Buy Marketplace
        </h1>
        <p className="mt-2 text-lg text-foreground/80 max-w-2xl mx-auto">
          Collaborate with other vendors on bulk orders to unlock better pricing from suppliers.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a New Group Buy</CardTitle>
          <CardDescription>
            Have a good deal? Invite others to join your bulk purchase. AI will notify nearby suppliers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                    placeholder="Product Name (e.g., A-Grade Potatoes)" 
                    value={newProduct.name} 
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
                 <div className="flex items-center gap-2">
                    <Input 
                        placeholder="Your Location" 
                        value={newProduct.location}
                        onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                    />
                     <Button type="button" variant="outline" size="icon" onClick={getLocation} disabled={isLocating}>
                        {isLocating ? <Loader2 className="h-4 w-4 animate-spin"/> : <LocateFixed className="h-4 w-4" />}
                    </Button>
                 </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input 
                    type="number" 
                    placeholder="Target Quantity (kg)" 
                    value={newProduct.target} 
                    onChange={(e) => setNewProduct({...newProduct, target: Number(e.target.value)})}
                />
                <Input 
                    type="number" 
                    placeholder="Original Price (per kg)"
                    value={newProduct.originalPrice} 
                    onChange={(e) => setNewProduct({...newProduct, originalPrice: Number(e.target.value)})}
                />
                <div className="flex items-center gap-2">
                    <Input 
                        type="number" 
                        placeholder="Discounted Price (per kg)"
                        value={newProduct.price} 
                        onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={handleFetchPrice} disabled={isFetchingPrice}>
                        {isFetchingPrice ? <Loader2 className="h-4 w-4 animate-spin"/> : <Wand2 className="h-4 w-4 text-primary"/>}
                    </Button>
                </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-end">
            <Button onClick={handleCreateListing} disabled={isCreating}>
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                Create & Notify Suppliers
            </Button>
        </CardFooter>
      </Card>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center">Active Group Buys</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => {
            const progress = (listing.currentAmount / listing.targetAmount) * 100;
            return (
              <Card key={listing.id} className="flex flex-col">
                <CardHeader className="p-0">
                    <div className="relative aspect-video rounded-t-lg overflow-hidden">
                        <Image
                        src={listing.imageUrl}
                        alt={listing.product}
                        fill
                        className="object-cover"
                        data-ai-hint={listing.product}
                        />
                         {listing.creator === "Your Shop" && (
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full z-10"
                                onClick={() => handleRemoveListing(listing.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove Listing</span>
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4 pt-6">
                    <CardTitle className="text-xl">{listing.product}</CardTitle>
                    <CardDescription>Initiated by {listing.creator}</CardDescription>

                    <div>
                      <div className="flex justify-between items-end mb-1">
                        <div className="flex items-baseline gap-2">
                           <span className="text-2xl font-bold text-primary">Rs {listing.pricePerKg}/kg</span>
                           <span className="line-through text-muted-foreground">Rs {listing.originalPrice}/kg</span>
                        </div>
                        <Badge variant="destructive">{(((listing.originalPrice - listing.pricePerKg) / listing.originalPrice) * 100).toFixed(0)}% OFF</Badge>
                      </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>{listing.currentAmount} kg pledged</span>
                            <span>Target: {listing.targetAmount} kg</span>
                        </div>
                        <Progress value={progress} />
                        <p className="text-sm font-medium text-center mt-2">{progress.toFixed(0)}% of target reached</p>
                    </div>

                    <div className="flex justify-between text-sm border-t pt-4">
                        <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{listing.participants} participants</span>
                        </div>
                         <div className="flex items-center gap-1.5">
                            <Hourglass className="h-4 w-4 text-muted-foreground" />
                            <span>Ends in {listing.endsIn}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <JoinGroupBuyDialog listing={listing} onJoin={handleJoinBuy} />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
