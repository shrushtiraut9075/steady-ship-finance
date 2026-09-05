import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

import { BallastLogo } from "@/components/BallastMarks";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#product", label: "Product" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#preview", label: "Dashboard Preview" },
  { href: "#docs", label: "Docs" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`glass fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5">
        <BallastLogo />
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/signin">Sign In</Link>
          </Button>
          <Button asChild size="sm" className="glow-hover">
            <Link to="/signup">Sign Up Free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

const footerCols = [
  { title: "Product", items: ["Features", "Dashboard", "Pricing"] },
  { title: "Company", items: ["About", "Contact"] },
  { title: "Resources", items: ["Docs", "GitHub repo"] },
  { title: "Legal", items: ["Privacy", "Terms"] },
];

export function SiteFooter() {
  return (
    <footer id="docs" className="border-t border-primary/40 bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <BallastLogo />
          <p className="mt-3 text-sm text-muted-foreground">Stability, automated.</p>
        </div>
        {footerCols.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold">{col.title}</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {col.items.map((i) => (
                <li key={i}>
                  <span className="nav-link cursor-pointer">{i}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-muted-foreground sm:flex-row">
          <span>© 2026 Ballast. Built for the Hackathon.</span>
          <div className="flex items-center gap-4">
            <Twitter className="h-4 w-4 hover:text-primary" />
            <Github className="h-4 w-4 hover:text-primary" />
            <Linkedin className="h-4 w-4 hover:text-primary" />
          </div>
        </div>
      </div>
    </footer>
  );
}
