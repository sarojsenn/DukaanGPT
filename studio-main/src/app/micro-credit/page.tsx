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
import { Banknote, Landmark, FileText, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const schemes = [
  {
    title: "PM SVANidhi Scheme",
    description: "A special micro-credit facility for street vendors. Get a collateral-free working capital loan of up to ₹10,000.",
    logoUrl: "https://placehold.co/100x100.png",
    link: "https://pmsvanidhi.mohua.gov.in/",
  },
  {
    title: "Mudra Loans (Shishu)",
    description: "Under the Pradhan Mantri Mudra Yojana (PMMY), get loans up to ₹50,000 for your micro-enterprise.",
    logoUrl: "https://placehold.co/100x100.png",
    link: "https://www.mudra.org.in/offerings",
  },
  {
    title: "Stand-Up India Scheme",
    description: "Promotes entrepreneurship among women and SC/ST communities. Get bank loans between ₹10 lakh and ₹1 crore.",
    logoUrl: "https://placehold.co/100x100.png",
    link: "https://www.standupmitra.in/",
  },
];

const privateLenders = [
  {
    name: "Local Microfinance Org",
    description: "Partnering with local MFIs to provide quick and accessible small-ticket loans for daily operations.",
  },
  {
    name: "Digital Lending Platforms",
    description: "Integrating with fintech platforms that offer instant digital loans based on your transaction history.",
  },
];

export default function MicroCreditPage() {
  return (
    <div className="container py-12 space-y-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Financial Services & Micro-Credit
        </h1>
        <p className="mt-2 text-lg text-foreground/80 max-w-3xl mx-auto">
          Access financial tools and government schemes to grow your business. Connect your ledger for easier loan applications.
        </p>
         <Button asChild size="lg" className="mt-6">
            <Link href="/ledger">
                <FileText className="mr-2 h-5 w-5" /> Go to Your Digital Ledger
            </Link>
         </Button>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Landmark className="h-6 w-6 text-primary" />
            Government Loan Schemes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schemes.map((scheme, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="flex-row items-center gap-4">
                <Image
                  src={scheme.logoUrl}
                  alt={`${scheme.title} logo`}
                  width={64}
                  height={64}
                  className="rounded-lg border p-1"
                />
                <div>
                    <CardTitle>{scheme.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{scheme.description}</CardDescription>
              </CardContent>
              <CardFooter>
                 <Button asChild className="w-full">
                    <Link href={scheme.link} target="_blank" rel="noopener noreferrer">
                        Learn More & Apply
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
       <Card className="mt-16 w-full overflow-hidden bg-secondary/30">
        <div className="grid md:grid-cols-2 items-center">
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-primary">
              Coming Soon: Private Lender Integrations
            </h2>
            <p className="mt-4 text-foreground/80">
              We are working to partner with private microfinance institutions and digital lenders to provide you with even more options, right from the DukaanGPT app. A strong ledger history will help you get pre-approved.
            </p>
            <div className="mt-6 space-y-4">
                {privateLenders.map((lender, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0 mt-1">
                            <Banknote className="h-5 w-5 text-primary"/>
                        </div>
                        <div>
                            <h3 className="font-semibold">{lender.name}</h3>
                            <p className="text-sm text-muted-foreground">{lender.description}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
          <div className="hidden md:block h-full min-h-80">
             <Image
                src="https://placehold.co/600x400.png"
                alt="Digital finance illustration"
                width={600}
                height={400}
                className="object-cover h-full w-full"
            />
          </div>
        </div>
      </Card>

    </div>
  );
}
