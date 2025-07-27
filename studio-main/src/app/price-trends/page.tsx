"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, Minus, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarketItem {
  name: string;
  price: number;
  change: number;
}

const initialMarketData: MarketItem[] = [
  { name: "Tomatoes", price: 32.5, change: 1.2 },
  { name: "Onions", price: 24.0, change: -0.5 },
  { name: "Potatoes", price: 21.75, change: 0.25 },
  { name: "AP Flour (Maida)", price: 41.0, change: 0.0 },
  { name: "Green Chillies", price: 58.5, change: -2.0 },
  { name: "Paneer", price: 355.0, change: 5.0 },
  { name: "Mustard Oil", price: 178.0, change: -1.5 },
];

export default function PriceTrendsPage() {
  const [marketData, setMarketData] = useState<MarketItem[]>(initialMarketData);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const updatePrices = () => {
    setLoading(true);
    // Simulate a network request
    setTimeout(() => {
      setMarketData(
        (currentData) => currentData.map((item) => {
          const change = (Math.random() - 0.45) * (item.price * 0.05); // +/- 5% change
          return {
            ...item,
            price: Math.max(5, item.price + change), // Ensure price doesn't go below 5
            change: change,
          };
        })
      );
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // Initial update
    updatePrices();

    // Set up auto-refresh every 15 seconds
    const intervalId = setInterval(updatePrices, 15000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="container py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Live Market Prices
        </h1>
        <p className="mt-2 text-lg text-foreground/80 max-w-2xl mx-auto">
          Track real-time prices for key raw materials to optimize your costs. Data auto-refreshes periodically.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Mandi Price Dashboard</CardTitle>
            <CardDescription>
              {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString('en-IN')}` : 'Fetching latest prices...'}
            </CardDescription>
          </div>
          <Button onClick={updatePrices} disabled={loading} variant="outline">
            <RefreshCw
              className={cn("mr-2 h-4 w-4", loading && "animate-spin")}
            />
            Refresh Now
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Raw Material</TableHead>
                  <TableHead className="text-right">Current Price (Rs/kg)</TableHead>
                  <TableHead className="text-right">Change (Rs)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketData.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right font-semibold text-lg text-primary">
                      Rs {item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={item.change === 0 ? "secondary" : "default"}
                        className={cn(
                          "tabular-nums",
                          item.change > 0
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
                            : item.change < 0
                            ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {item.change > 0 ? (
                          <ArrowUp className="mr-1 h-3 w-3" />
                        ) : item.change < 0 ? (
                          <ArrowDown className="mr-1 h-3 w-3" />
                        ) : (
                          <Minus className="mr-1 h-3 w-3" />
                        )}
                        Rs {Math.abs(item.change).toFixed(2)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
