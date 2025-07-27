"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, PlusCircle, Save, Wand2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMarketPrice } from "@/ai/flows/get-market-price";


interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const initialInventory: InventoryItem[] = [
  { id: 1, name: "Tomatoes", quantity: 50, price: 30 },
  { id: 2, name: "Onions", quantity: 100, price: 25 },
  { id: 3, name: "Potatoes", quantity: 80, price: 20 },
  { id: 4, name: "AP Flour (Maida)", quantity: 25, price: 40 },
];

export default function InventoryPage() {
  const [inventory, setInventory] =
    useState<InventoryItem[]>(initialInventory);
  const [fetchingPriceId, setFetchingPriceId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: Date.now(),
      name: "",
      quantity: 0,
      price: 0,
    };
    setInventory([...inventory, newItem]);
  };

  const handleRemoveItem = (id: number) => {
    setInventory(inventory.filter((item) => item.id !== id));
  };

  const handleInputChange = (
    id: number,
    field: keyof Omit<InventoryItem, "id">,
    value: string | number
  ) => {
    setInventory(
      inventory.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleFetchPrice = async (id: number, name: string) => {
    if (!name) {
        toast({
            variant: 'destructive',
            title: 'Item Name Required',
            description: 'Please enter an item name before fetching its price.',
        });
        return;
    }
    setFetchingPriceId(id);
    try {
        const result = await getMarketPrice({ itemName: name });
        handleInputChange(id, 'price', result.price);
        toast({
            title: `Price for ${name} updated!`,
            description: `AI suggested market price is Rs ${result.price}/kg.`,
        });
    } catch (error) {
        console.error("Failed to fetch market price", error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch the market price.',
        });
    } finally {
        setFetchingPriceId(null);
    }
  };


  const handleSaveChanges = () => {
    // In a real app, this would be a server action to save to Firestore.
    console.log("Saving inventory:", inventory);
    toast({
      title: "Inventory Updated",
      description: "Your inventory and pricing have been successfully saved.",
    });
  };

  return (
    <div className="container py-12 space-y-12">
       <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Manage Inventory
        </h1>
        <p className="mt-2 text-lg text-foreground/80 max-w-2xl mx-auto">
          Update your item stock and prices quickly. Use the AI assistant to fetch current market prices.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Inventory</CardTitle>
            <CardDescription>
              Add, remove, or edit your items below.
            </CardDescription>
          </div>
          <Button onClick={handleAddItem}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="w-[150px]">
                    Quantity (kg/unit)
                  </TableHead>
                  <TableHead className="w-[250px]">Price (Rs per unit)</TableHead>
                  <TableHead className="w-[80px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.name}
                        onChange={(e) =>
                          handleInputChange(item.id, "name", e.target.value)
                        }
                        placeholder="e.g. Green Chillies"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleInputChange(
                            item.id,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                            handleInputChange(
                                item.id,
                                "price",
                                Number(e.target.value)
                            )
                            }
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleFetchPrice(item.id, item.name)}
                            disabled={fetchingPriceId === item.id}
                        >
                            {fetchingPriceId === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Wand2 className="h-4 w-4 text-primary" />
                            )}
                            <span className="sr-only">Fetch Market Price</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              size="lg"
              onClick={handleSaveChanges}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
