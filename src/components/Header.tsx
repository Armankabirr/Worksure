import { MouseEvent, useEffect } from "react";
import { ShoppingCart, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LoginDialog from "./LoginDialog";
import RegisterDialog from "./RegisterDialog";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const {
    isAuthenticated,
    user,
    loginOpen,
    registerOpen,
    openLogin,
    openRegister,
    closeLogin,
    closeRegister,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scrolling to hash targets when location changes
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.slice(1); // Remove '#'
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location.hash]);

  const handleScroll = (event: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    event.preventDefault();

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // If element doesn't exist on current page, navigate to home with hash
      navigate(`/#${targetId}`);
    }
  };

  const handleSwitchToRegister = () => {
    openRegister();
  };

  const handleSwitchToLogin = () => {
    openLogin();
  };

  return (
    <header className="bg-card py-4 px-6 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            WorkSure
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#home"
            onClick={(event) => handleScroll(event, "home")}
            className="text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            Home
          </a>

          <div className="relative group">
            <a
              href="#service"
              onClick={(event) => handleScroll(event, "service")}
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Service
            </a>
            <div className="absolute left-0 mt-3 w-48 rounded-lg bg-card shadow-xl border border-border/50 backdrop-blur-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-20 overflow-hidden">
              <Link
                to="/electrician"
                className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200 first:rounded-t-lg last:rounded-b-lg cursor-pointer"
              >
                Electrician
              </Link>
              <a
                href="#service-cleaner"
                onClick={(event) => handleScroll(event, "service-cleaner")}
                className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200 cursor-pointer"
              >
                Cleaner
              </a>
              <a
                href="#service-catering"
                onClick={(event) => handleScroll(event, "service-catering")}
                className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200 cursor-pointer"
              >
                Catering
              </a>
              <a
                href="#service-babysitter"
                onClick={(event) => handleScroll(event, "service-babysitter")}
                className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200 cursor-pointer"
              >
                Babysitter
              </a>
              <a
                href="#service-pet-care"
                onClick={(event) => handleScroll(event, "service-pet-care")}
                className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200 cursor-pointer"
              >
                Pet Care
              </a>
            </div>
          </div>

          <a
            href="#about"
            onClick={(event) => handleScroll(event, "about")}
            className="text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            About
          </a>
          <a
            href="#contact"
            onClick={(event) => handleScroll(event, "contact")}
            className="text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <ShoppingCart className="h-5 w-5" />
          </Button>

          {isAuthenticated ? (
            <>
              {/* Profile avatar/button - shows uploaded avatar when available */}
              <Button
                variant="default"
                size="icon"
                className="p-0 rounded-full overflow-hidden"
                type="button"
                aria-label="Profile"
                onClick={() => navigate("/profile")}
              >
                {user?.avatar ? (
                  <Avatar className="h-10 w-10">
                    <AvatarImage className="object-cover" src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-10 w-10 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="outline"
                  className="border-primary/40 text-primary hover:bg-primary/5 hover:text-primary"
                  type="button"
                  onClick={openLogin}
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg"
                  type="button"
                  onClick={openRegister}
                >
                  Sign up
                </Button>
              </div>

              {/* Compact auth icon for small screens */}
              <Button
                variant="default"
                size="icon"
                className="bg-primary hover:bg-primary/90 text-primary-foreground md:hidden"
                type="button"
                aria-label="Account"
                onClick={openLogin}
              >
                <User className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>

      <LoginDialog
        open={loginOpen}
        onOpenChange={(open) => (open ? openLogin() : closeLogin())}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterDialog
        open={registerOpen}
        onOpenChange={(open) => (open ? openRegister() : closeRegister())}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </header>
  );
};

export default Header;