"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, User, X } from "lucide-react";
import { recipeChat } from "@/ai/flows/recipe-chat";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        setMessages([
            { role: "assistant", content: "Hello! I'm your AI culinary assistant. Ask me for any street food recipe!" }
        ])
    }
  }, [isOpen]);
  
  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo(0, scrollAreaRef.current.scrollHeight);
    }
  }, [messages]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await recipeChat({ message: input });
      const assistantMessage: Message = { role: "assistant", content: result.reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      toast({
        variant: "destructive",
        title: "Chatbot Error",
        description: "Sorry, I couldn't process that. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        size="icon"
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        <Sparkles className="h-4 w-4 absolute top-3 right-3 text-primary-foreground/80" />
        <Bot className="h-8 w-8" />
        <span className="sr-only">Open Chatbot</span>
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-md h-[75vh] flex flex-col shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot />
                        </AvatarFallback>
                    </Avatar>
                     <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-primary" />
                </div>
                <div className="grid gap-0.5">
                    <CardTitle>AI Recipe Assistant</CardTitle>
                    <CardDescription>Your culinary co-pilot</CardDescription>
                </div>
            </div>
             <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
             </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
             <div className="p-6 space-y-6">
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                         {message.role === 'assistant' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    <Bot className="h-5 w-5"/>
                                </AvatarFallback>
                            </Avatar>
                        )}
                         <div className={`rounded-2xl p-3 max-w-[80%] whitespace-pre-wrap ${message.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                           <p className="text-sm">{message.content}</p>
                        </div>
                        {message.role === 'user' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                    <User className="h-5 w-5"/>
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                <Bot className="h-5 w-5"/>
                            </AvatarFallback>
                        </Avatar>
                        <div className="rounded-2xl p-3 bg-muted rounded-bl-none">
                            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>
                )}
             </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
            <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask for a recipe..."
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4"/>
                </Button>
            </form>
        </CardFooter>
    </Card>
  )
}
