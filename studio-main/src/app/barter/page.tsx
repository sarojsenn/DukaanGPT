
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Repeat, Send, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface BarterListing {
    id: string;
    owner: string;
    offering: string;
    seeking: string;
    location: string;
    imageUrl: string;
}

const initialBarterListings: BarterListing[] = [
  {
    id: "b1",
    owner: "Ramesh Kumar",
    offering: "50kg Extra Onions",
    seeking: "Fresh Paneer or Cooking Oil",
    location: "Koramangala",
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: "b2",
    owner: "Sunita Devi",
    offering: "20kg Surplus Tomatoes",
    seeking: "Packaging materials (paper bags)",
    location: "Jayanagar",
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: "b3",
    owner: "Anil Singh",
    offering: "Unused Gas Cylinder",
    seeking: "Bulk potatoes or flour",
    location: "Indiranagar",
    imageUrl: "https://placehold.co/600x400.png",
  },
  {
    id: "b4",
    owner: "Priya Foods",
    offering: "Bulk Spices (Turmeric/Coriander)",
    seeking: "Fresh vegetables",
    location: "Dadar, Mumbai",
    imageUrl: "https://placehold.co/600x400.png",
  },
];

export default function BarterPage() {
    const [listings, setListings] = useState<BarterListing[]>(initialBarterListings);
    const [tradeCart, setTradeCart] = useState<BarterListing[]>([]);
    const [newOffering, setNewOffering] = useState("");
    const [newSeeking, setNewSeeking] = useState("");
    const { toast } = useToast();

    const handlePostListing = () => {
        if (!newOffering.trim() || !newSeeking.trim()) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please describe what you are offering and seeking.'
            });
            return;
        }

        const newListing = {
            id: `b-${Date.now()}`,
            owner: 'You',
            offering: newOffering,
            seeking: newSeeking,
            location: 'Your Location',
            imageUrl: 'https://placehold.co/600x400.png'
        };

        setListings([newListing, ...listings]);

        const newCommunityPost = {
            id: Date.now(),
            username: "You (via Barter)",
            avatarUrl: "https://placehold.co/100x100.png",
            caption: `Trade offer! Offering "${newOffering}" and seeking "${newSeeking}". Let's connect and trade! #barter`,
            likes: 0,
            comments: 0,
            isLiked: false,
        };

        const existingPosts = JSON.parse(localStorage.getItem('newCommunityPosts') || '[]');
        localStorage.setItem('newCommunityPosts', JSON.stringify([newCommunityPost, ...existingPosts]));
        
        toast({
            title: '✅ Listing Posted!',
            description: 'Your barter listing is live and a post has been added to the community feed.'
        });

        setNewOffering("");
        setNewSeeking("");
    };

    const handleProposeTrade = (listing: BarterListing) => {
        if (tradeCart.some(item => item.id === listing.id)) {
            toast({
                variant: 'default',
                title: 'Already in Cart',
                description: 'You have already proposed a trade for this item.'
            });
            return;
        }
        setTradeCart([...tradeCart, listing]);
        toast({
            title: '✅ Trade Proposed!',
            description: `Added "${listing.offering}" to your trade cart.`
        });
    };
    
    const handleRemoveFromCart = (listingId: string) => {
        setTradeCart(tradeCart.filter(item => item.id !== listingId));
    };

    const handleConfirmBarter = (listingId: string) => {
        // Find the listing to get its details before removing
        const listingToRemove = tradeCart.find(item => item.id === listingId);

        // Remove from available listings
        setListings(listings.filter(item => item.id !== listingId));
        // Remove from cart
        handleRemoveFromCart(listingId);
        
        toast({
            title: '🎉 Barter Successful!',
            description: `Your trade for "${listingToRemove?.offering}" has been confirmed.`
        });
    };

  return (
    <div className="container py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Vendor Barter Exchange
        </h1>
        <p className="mt-2 text-lg text-foreground/80 max-w-2xl mx-auto">
          Trade your surplus goods with other vendors in the community. One vendor's waste is another's treasure.
        </p>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                    <CardTitle>Create a New Barter Listing</CardTitle>
                    <CardDescription>
                        Let others know what you have and what you need.
                    </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Textarea 
                        placeholder="What are you offering? (e.g., 30kg surplus potatoes)" 
                        rows={3}
                        value={newOffering}
                        onChange={(e) => setNewOffering(e.target.value)}
                    />
                    <Textarea 
                        placeholder="What are you looking for in return? (e.g., Cooking oil or packaging material)" 
                        rows={3}
                        value={newSeeking}
                        onChange={(e) => setNewSeeking(e.target.value)}
                    />
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">This also posts to the community feed.</p>
                        <Button onClick={handlePostListing}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Post Listing
                        </Button>
                    </CardFooter>
                </Card>

                 <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-center">Available for Barter</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map((listing) => (
                        <Card key={listing.id} className="flex flex-col">
                        <CardHeader>
                            <div className="relative aspect-video rounded-md overflow-hidden">
                                <Image
                                src={listing.imageUrl}
                                alt={listing.offering}
                                fill
                                className="object-cover"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3">
                            <div>
                                <CardTitle className="text-lg">{listing.offering}</CardTitle>
                                <CardDescription>{listing.owner} - {listing.location}</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Repeat className="h-4 w-4 text-primary shrink-0"/>
                                <p className="text-muted-foreground">
                                    <span className="font-semibold text-foreground">Seeking:</span> {listing.seeking}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => handleProposeTrade(listing)} className="w-full">
                                <Send className="mr-2 h-4 w-4" />
                                Propose a Trade
                            </Button>
                        </CardFooter>
                        </Card>
                    ))}
                    </div>
                </div>
            </div>

            <Card className="lg:col-span-1 lg:sticky lg:top-24">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-6 w-6 text-primary"/>
                            <CardTitle>Your Trade Cart</CardTitle>
                        </div>
                        <Badge variant="secondary">{tradeCart.length}</Badge>
                    </div>
                    <CardDescription>Items you have proposed a trade for.</CardDescription>
                </CardHeader>
                <CardContent>
                    {tradeCart.length > 0 ? (
                        <div className="space-y-4">
                            {tradeCart.map(item => (
                                <div key={item.id} className="space-y-3">
                                    <div className="flex justify-between items-start gap-3">
                                        <div>
                                            <p className="font-semibold">{item.offering}</p>
                                            <p className="text-sm text-muted-foreground">by {item.owner}</p>
                                        </div>
                                         <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRemoveFromCart(item.id)}>
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                    <Button size="sm" className="w-full" onClick={() => handleConfirmBarter(item.id)}>
                                        Confirm Barter
                                    </Button>
                                    <Separator />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            <p>Your trade cart is empty.</p>
                            <p className="text-sm">Click "Propose a Trade" on an item to add it here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
