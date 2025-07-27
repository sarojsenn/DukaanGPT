"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
    GraduationCap, 
    Lightbulb, 
    TrendingUp, 
    HeartHandshake,
    Loader2,
    Video,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { generateLearningVideo, GenerateLearningVideoOutput } from "@/ai/flows/generate-learning-video";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const learningModules = [
  {
    title: "How to Increase Profit",
    category: "Business Growth",
    icon: TrendingUp,
    youtubeId: "dJQn4DqzMVQ",
  },
  {
    title: "Hygienic Food, More Customers",
    category: "Food Safety",
    icon: HeartHandshake,
    youtubeId: "RUeVNCEDbCo",
  },
  {
    title: "Smart Sourcing Strategies",
    category: "Sourcing",
    icon: Lightbulb,
    youtubeId: "bz1IgHQ7J9M",
  },
  {
    title: "PM SVANidhi Loan Scheme",
    category: "Finance",
    icon: GraduationCap,
    youtubeId: "AJnuCFCNvJ8",
  },
];

interface VideoState {
    [key: string]: {
        loading: boolean;
        error: string | null;
        data: GenerateLearningVideoOutput | null;
    }
}

export default function LearningPage() {
  const [videoState, setVideoState] = useState<VideoState>({});
  
  const handleGenerateVideo = async (topic: string) => {
    setVideoState(prevState => ({
        ...prevState,
        [topic]: { loading: true, error: null, data: null }
    }));

    try {
        const result = await generateLearningVideo({ topic });
         if (result.error) {
            // If the flow returned an error, set it in the state
            setVideoState(prevState => ({
                ...prevState,
                [topic]: { loading: false, error: result.error ?? null, data: null }
            }));
         } else {
            // Otherwise, set the data
            setVideoState(prevState => ({
                ...prevState,
                [topic]: { loading: false, error: null, data: result }
            }));
         }
    } catch (e: any) {
         // This will catch network errors or if the flow itself throws an unexpected error
         console.error(`Failed to generate video for ${topic}:`, e);
         setVideoState(prevState => ({
            ...prevState,
            [topic]: { loading: false, error: e.message || "An unknown error occurred.", data: null }
        }));
    }
  }

  return (
    <div className="container py-12 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          AI Learning Capsules
        </h1>
        <p className="mt-2 text-lg text-foreground/80 max-w-2xl mx-auto">
          Bite-sized, AI-generated video tips in your language to help you grow your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {learningModules.map((mod, index) => {
            const state = videoState[mod.title];
            return (
                <Card 
                    key={index} 
                    className="overflow-hidden flex flex-col"
                >
                    <div className="aspect-video bg-secondary flex items-center justify-center">
                        {mod.youtubeId ? (
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${mod.youtubeId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : state?.loading ? (
                            <div className="flex flex-col items-center gap-4 text-primary">
                                <Loader2 className="w-12 h-12 animate-spin"/>
                                <p className="font-medium">AI is creating your video... this can take a minute.</p>
                            </div>
                        ) : state?.error ? (
                            <Alert variant="destructive" className="m-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Generation Failed</AlertTitle>
                                <AlertDescription>
                                    {state.error}
                                </AlertDescription>
                            </Alert>
                        ) : state?.data?.videoUrl ? (
                            <video
                                key={state.data.videoUrl}
                                className="w-full h-full object-cover"
                                controls
                                autoPlay
                                muted
                                loop
                                playsInline
                            >
                                <source src={state.data.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-primary">
                                <Video className="w-16 h-16 opacity-50"/>
                                <Button onClick={() => handleGenerateVideo(mod.title)}>
                                    Generate Learning Video
                                </Button>
                            </div>
                        )}
                    </div>
                    <CardHeader className="text-center flex-grow">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 -mt-12 mb-4 border-4 border-background bg-background">
                            <mod.icon className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{mod.title}</CardTitle>
                        <CardDescription>{mod.category}</CardDescription>
                    </CardHeader>
                </Card>
            );
        })}
      </div>

       <Card className="mt-16 w-full overflow-hidden">
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-primary">
              Connect with Experts & NGOs
            </h2>
            <p className="mt-4 text-foreground/80">
              We partner with local food experts and non-profits to bring you the best advice. Want to partner with us?
            </p>
            <Button asChild className="mt-6" size="lg">
              <Link href="#">Contact Us</Link>
            </Button>
          </div>
          <div className="hidden md:block h-full">
             <Image
                src="/images/learning.jpg"
                alt="Community volunteers helping"
                width={500}
                height={200}
                className="object-cover h-full w-full"
            />
          </div>
        </div>
      </Card>

    </div>
  );
}
