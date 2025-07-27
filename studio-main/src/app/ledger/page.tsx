"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Trash2, PlusCircle, IndianRupee, MinusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface LedgerEntry {
  id: number;
  date: string;
  description: string;
  type: "income" | "expense";
  amount: number;
}

const initialEntries: LedgerEntry[] = [
  { id: 1, date: new Date().toISOString().split("T")[0], description: "Purchase of Onions", type: "expense", amount: 500 },
  { id: 2, date: new Date().toISOString().split("T")[0], description: "Day's sales", type: "income", amount: 2500 },
  { id: 3, date: new Date(Date.now() - 86400000).toISOString().split("T")[0], description: "Gas cylinder", type: "expense", amount: 1100 },
  { id: 4, date: new Date(Date.now() - 86400000).toISOString().split("T")[0], description: "Day's sales", type: "income", amount: 2200 },
];

export default function LedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>(initialEntries);
  const { toast } = useToast();

  const [newEntry, setNewEntry] = useState({ description: "", type: "expense", amount: "" });

  const totalIncome = entries.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpense;


  const handleAddEntry = () => {
    if (!newEntry.description || !newEntry.amount) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in the description and amount.",
      });
      return;
    }
    const newLedgerEntry: LedgerEntry = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      description: newEntry.description,
      type: newEntry.type as "income" | "expense",
      amount: parseFloat(newEntry.amount),
    };
    setEntries([newLedgerEntry, ...entries]);
    setNewEntry({ description: "", type: "expense", amount: "" });
     toast({
      title: `✅ ${newEntry.type === 'income' ? 'Income' : 'Expense'} Added`,
      description: `${newEntry.description} for Rs ${newEntry.amount} has been logged.`,
    });
  };

  const handleRemoveItem = (id: number) => {
    setEntries(entries.filter((item) => item.id !== id));
  };


  return (
    <div className="container py-12 space-y-12">
       <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Digital Ledger (Hisab-Kitab)
        </h1>
        <p className="mt-2 text-lg text-foreground/80 max-w-2xl mx-auto">
          Keep a simple track of your daily income and expenses.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                        <PlusCircle className="h-4 w-4 text-green-500"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">Rs {totalIncome.toLocaleString('en-IN')}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <MinusCircle className="h-4 w-4 text-red-500"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">Rs {totalExpense.toLocaleString('en-IN')}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>Rs {netBalance.toLocaleString('en-IN')}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                    Your last 10 income/expense entries.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="border rounded-md overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount (Rs)</TableHead>
                         <TableHead className="w-[80px] text-right">
                            Actions
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {entries.slice(0, 10).map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.description}</TableCell>
                            <TableCell>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</TableCell>
                            <TableCell>
                                <Badge variant={item.type === 'income' ? 'default' : 'destructive'} className={`${item.type === 'income' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'}`}>
                                    {item.type}
                                </Badge>
                            </TableCell>
                            <TableCell className={`text-right font-semibold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{item.amount.toFixed(2)}</TableCell>
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
                </CardContent>
            </Card>
        </div>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add New Entry</CardTitle>
            <CardDescription>
              Quickly add an income or expense.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Input 
                placeholder="Description (e.g. Day's sales)"
                value={newEntry.description}
                onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
             />
             <Input 
                placeholder="Amount (Rs)"
                type="number"
                value={newEntry.amount}
                onChange={(e) => setNewEntry({...newEntry, amount: e.target.value})}
             />
            <Select 
                value={newEntry.type}
                onValueChange={(value) => setNewEntry({...newEntry, type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter>
             <Button onClick={handleAddEntry} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
