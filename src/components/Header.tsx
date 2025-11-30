import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-card py-4 px-6 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">WorkSure</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#home"
            className="text-foreground hover:text-primary transition-colors scroll-smooth"
          >
            Home
          </a>

          <div className="relative group">
            <a
              href="#service"
              className="text-foreground hover:text-primary transition-colors scroll-smooth"
            >
              Service
            </a>
            <div className="absolute left-0 mt-3 w-48 rounded-lg bg-card shadow-xl border border-border/50 backdrop-blur-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-20 overflow-hidden">
              <a
                href="#service-electrician"
                className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200 first:rounded-t-lg last:rounded-b-lg"
              >
                Electrician
              </a>
              <a
                href="#service-cleaner"
                className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200"
              >
                Cleaner
              </a>
              <a
                href="#service-catering"
                className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200"
              >
                Catering
              </a>
              <a
                href="#service-babysitter"
                className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200"
              >
                Babysitter
              </a>
              <a
                href="#service-pet-care"
                className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200"
              >
                Pet Care
              </a>
            </div>
          </div>

          <a
            href="#about"
            className="text-foreground hover:text-primary transition-colors scroll-smooth"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-foreground hover:text-primary transition-colors scroll-smooth"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="default" size="icon" className="bg-primary hover:bg-primary/90">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;