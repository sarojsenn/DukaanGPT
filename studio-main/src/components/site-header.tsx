
"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Sprout, ChevronDown, User, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LanguageSelector } from "./language-selector";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/context/auth-context";

const suppliersNavLinks = [
  { href: "/supplier-matching", label: "Find Suppliers" },
  { href: "/group-buy", label: "Group Buy" },
  { href: "/voice-order", label: "Voice Order" },
  { href: "/surplus-alert", label: "Surplus Alerts" },
  { href: "/price-trends", label: "Price Trends" },
];

const toolsNavLinks = [
  { href: "/recipe-calculator", label: "Cost Calculator" },
  { href: "/food-safety", label: "Food Safety" },
];

const financeNavLinks = [
    { href: "/ledger", label: "Ledger" },
    { href: "/micro-credit", label: "Micro-Credit" },
]

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "font-medium text-sm transition-colors block px-3 py-2 rounded-md",
        isActive
          ? "text-primary bg-primary/10"
          : "text-muted-foreground hover:text-primary hover:bg-primary/5"
      )}
    >
      {children}
    </Link>
  );
}

function NavDropdown({
  label,
  links,
  onLinkClick,
}: {
  label: string;
  links: { href: string; label: string }[];
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = links.some((link) => pathname === link.href);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "font-medium text-sm transition-colors w-full justify-start px-2",
            isActive
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          {label}
          <ChevronDown className="ml-auto h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8} className="w-[--radix-dropdown-menu-trigger-width]">
        {links.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href} onClick={onLinkClick}>{link.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DesktopNav() {
    return (
      <nav className="hidden lg:flex items-center gap-2">
        <NavLink href="/">Home</NavLink>
        <NavDropdown label="Suppliers" links={suppliersNavLinks} />
        <NavLink href="/inventory">Inventory</NavLink>
        <NavDropdown label="Finance" links={financeNavLinks} />
        <NavLink href="/community">Community</NavLink>
        <NavDropdown label="Tools" links={toolsNavLinks} />
        <NavLink href="/learning">Learning</NavLink>
        <NavLink href="/barter">Barter</NavLink>
      </nav>
    );
}

function MobileNav() {
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);
    const { user, logout } = useAuth();
    const closeSheet = () => setIsSheetOpen(false);

    const handleLogout = async () => {
      await logout();
      closeSheet();
    };

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle asChild>
                <Link
                  href="/"
                  className="flex items-center gap-2 font-bold text-lg text-primary mb-4"
                   onClick={closeSheet}
                >
                  <Sprout className="h-6 w-6" />
                  DukaanGPT
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 py-4">
                <NavLink href="/" onClick={closeSheet}>Home</NavLink>
                <NavDropdown label="Suppliers" links={suppliersNavLinks} onLinkClick={closeSheet} />
                <NavLink href="/inventory" onClick={closeSheet}>Inventory</NavLink>
                <NavDropdown label="Finance" links={financeNavLinks} onLinkClick={closeSheet}/>
                <NavLink href="/community" onClick={closeSheet}>Community</NavLink>
                <NavDropdown label="Tools" links={toolsNavLinks} onLinkClick={closeSheet} />
                <NavLink href="/learning" onClick={closeSheet}>Learning</NavLink>
                <NavLink href="/barter" onClick={closeSheet}>Barter Exchange</NavLink>
              
              {user ? (
                <div className="mt-6 space-y-2">
                  <div className="p-3 bg-primary/10 rounded-md">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="mt-6 space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/login" onClick={closeSheet}>Login</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/signup" onClick={closeSheet}>Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
    );
}

function Navigation() {
  const [mounted, setMounted] = React.useState(false);
  const { user, logout } = useAuth();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <DesktopNav />
      <div className="hidden lg:flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.name}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        )}
      </div>
      <div className="lg:hidden flex items-center gap-2">
        <LanguageSelector />
        <ThemeToggle />
        <MobileNav />
      </div>
    </>
  );
}

export function SiteHeader() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-primary"
        >
          <Sprout className="h-7 w-7" />
          DukaanGPT
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
