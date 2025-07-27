
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
import { Trash2, PlusCircle, Calculator, Sparkles, Wand2, Loader2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateRecipeCost, CalculateRecipeCostOutput } from "@/ai/flows/calculate-recipe-cost";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface Ingredient {
  id: number;
  name: string;
  quantity: number; // in grams or units
  pricePerKg: number; // price per 1000g or per unit
}

export default function RecipeCalculatorPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipeName, setRecipeName] = useState("");
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const { toast } = useToast();

  // AI Mode state
  const [aiRecipeName, setAiRecipeName] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<CalculateRecipeCostOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);


  const handleAddIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now(),
      name: "",
      quantity: 0,
      pricePerKg: 0,
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const handleRemoveIngredient = (id: number) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const handleInputChange = (
    id: number,
    field: keyof Omit<Ingredient, "id">,
    value: string | number
  ) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
    setTotalCost(null); // Recalculate when inputs change
  };
  

  const calculateCost = () => {
    if (ingredients.some(ing => !ing.name || ing.quantity <= 0 || ing.pricePerKg <= 0)) {
        toast({
            variant: "destructive",
            title: "Invalid Input",
            description: "Please make sure all ingredients have a name, quantity, and price.",
        });
        return;
    }
    const cost = ingredients.reduce((total, ing) => {
      // Assuming quantity is in grams and price is per kg
      const costOfIngredient = (ing.quantity / 1000) * ing.pricePerKg;
      return total + costOfIngredient;
    }, 0);
    setTotalCost(cost);
  };

  const handleAiCalculate = async () => {
    if (!aiRecipeName.trim()) {
        toast({
            variant: "destructive",
            title: "Recipe Name Required",
            description: "Please enter a recipe name for the AI to analyze.",
        });
        return;
    }
    setAiLoading(true);
    setAiResult(null);
    setAiError(null);
    try {
        const result = await calculateRecipeCost({ recipeName: aiRecipeName });
        setAiResult(result);
    } catch (e: any) {
        setAiError("AI failed to calculate the cost. Please try again.");
        toast({
            variant: "destructive",
            title: "AI Analysis Failed",
            description: e.message || "An unknown error occurred.",
        });
    } finally {
        setAiLoading(false);
    }
  }


  return (
    <div className="container py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Recipe Cost Calculator
        </h1>
        <p className="mt-2 text-lg text-foreground/80 max-w-2xl mx-auto">
          Calculate the exact cost of your dishes to optimize your pricing, manually or with AI.
        </p>
      </div>

      <Tabs defaultValue="ai" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai" className="gap-2"><Wand2 className="h-4 w-4"/> AI Calculator</TabsTrigger>
            <TabsTrigger value="manual" className="gap-2"><Calculator className="h-4 w-4"/> Manual Calculator</TabsTrigger>
        </TabsList>
        <TabsContent value="ai">
             <Card>
                <CardHeader>
                    <CardTitle>AI-Powered Recipe Costing</CardTitle>
                    <CardDescription>
                        Enter a recipe name, and our AI will estimate the ingredients and cost for you.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex w-full items-center space-x-2">
                        <Input 
                            placeholder="e.g., 'Pav Bhaji' or 'Paneer Butter Masala'" 
                            value={aiRecipeName}
                            onChange={(e) => setAiRecipeName(e.target.value)}
                            disabled={aiLoading}
                            className="text-base"
                        />
                        <Button onClick={handleAiCalculate} disabled={aiLoading}>
                            {aiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                            Calculate
                        </Button>
                    </div>

                    <div className="min-h-[20rem] flex items-center justify-center">
                         {aiLoading && (
                            <div className="flex flex-col items-center text-primary gap-4">
                                <Sparkles className="h-12 w-12" />
                                <p className="font-medium text-muted-foreground">AI is calculating your recipe cost...</p>
                            </div>
                        )}
                        {aiError && (
                            <Alert variant="destructive">
                                <Info className="h-4 w-4" />
                                <AlertTitle>Analysis Error</AlertTitle>
                                <AlertDescription>{aiError}</AlertDescription>
                            </Alert>
                        )}
                        {aiResult && (
                            <div className="w-full space-y-4">
                                 <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>AI Analysis</AlertTitle>
                                    <AlertDescription>{aiResult.reasoning}</AlertDescription>
                                </Alert>
                                <div className="border rounded-lg">
                                    {aiResult.ingredients.map((ing, index) => (
                                        <div key={index} className={`grid grid-cols-4 gap-4 p-3 ${index < aiResult.ingredients.length - 1 ? 'border-b' : ''}`}>
                                            <span className="font-medium col-span-2">{ing.name}</span>
                                            <span className="text-muted-foreground">{ing.quantityInGrams}g @ Rs {ing.pricePerKg}/kg</span>
                                            <span className="text-right font-semibold">Rs {ing.cost.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-4 bg-primary/10 rounded-lg text-center">
                                    <h3 className="text-lg font-medium text-muted-foreground">
                                        Total Estimated Cost for <span className="font-bold text-primary">{aiRecipeName}</span>:
                                    </h3>
                                    <p className="text-4xl font-bold text-primary tracking-tight">
                                        Rs {aiResult.totalCost.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        )}
                         {!aiResult && !aiLoading && !aiError && (
                            <div className="text-center text-muted-foreground p-8">
                                <Wand2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                <p>Enter a recipe name and let AI do the work.</p>
                            </div>
                        )}
                    </div>

                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="manual">
            <Card>
                <CardHeader>
                <CardTitle>Manual Recipe Calculator</CardTitle>
                <CardDescription>
                    Add ingredients and their quantities to calculate the cost.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <Input 
                    placeholder="Enter recipe name, e.g., 'Samosa Filling'" 
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    className="text-lg font-semibold"
                />

                <div className="space-y-4">
                    {ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-3 bg-secondary/30 rounded-lg">
                        <Input
                        placeholder="Ingredient Name"
                        value={ingredient.name}
                        onChange={(e) => handleInputChange(ingredient.id, "name", e.target.value)}
                        className="md:col-span-2"
                        />
                        <Input
                        type="number"
                        placeholder="Quantity (grams)"
                        value={ingredient.quantity === 0 ? "" : ingredient.quantity}
                        onChange={(e) => handleInputChange(ingredient.id, "quantity", Number(e.target.value))}
                        />
                        <div className="flex items-center gap-2">
                            <Input
                            type="number"
                            placeholder="Price (Rs/kg)"
                            value={ingredient.pricePerKg === 0 ? "" : ingredient.pricePerKg}
                            onChange={(e) => handleInputChange(ingredient.id, "pricePerKg", Number(e.target.value))}
                            />
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveIngredient(ingredient.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    </div>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <Button onClick={handleAddIngredient} variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Ingredient
                    </Button>
                    <Button onClick={calculateCost}>
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Total Cost
                    </Button>
                </div>

                {totalCost !== null && (
                    <div className="mt-6 p-6 bg-primary/10 rounded-lg text-center">
                        <h3 className="text-lg font-medium text-muted-foreground">
                            Total cost for <span className="font-bold text-primary">{recipeName || 'your recipe'}</span>:
                        </h3>
                        <p className="text-4xl font-bold text-primary tracking-tight">
                            Rs {totalCost.toFixed(2)}
                        </p>
                    </div>
                )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

