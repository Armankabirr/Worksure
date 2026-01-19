import { MouseEvent, useEffect, useState } from "react";
import { ShoppingCart, User, Menu, X as CloseIcon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LoginDialog from "./LoginDialog";
import RegisterDialog from "./RegisterDialog";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle scrolling to hash targets when location changes
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.slice(1);
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
      navigate(`/#${targetId}`);
    }
  };

  const handleSwitchToRegister = () => {
    openRegister();
    setMobileOpen(false);
  };

  const handleSwitchToLogin = () => {
    openLogin();
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  const isActive = (hash: string) => {
    return location.hash === `#${hash}` || (hash === "home" && !location.hash && location.pathname === "/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border/40 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Branding */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="group flex items-center gap-2 transition-all duration-200"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-md group-hover:bg-primary/20 transition-all duration-200"></div>
                <div className="relative w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary transition-all duration-200">
                WorkSure
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <a 
              href="#home" 
              onClick={(event) => handleScroll(event, "home")} 
              className={`group relative px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${
                isActive("home")
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Home
              {isActive("home") && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
              )}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"></span>
            </a>

            <div className="relative group">
              <a 
                href="#service" 
                onClick={(event) => handleScroll(event, "service")} 
                className={`relative px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${
                  isActive("service")
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                Service
                {isActive("service") && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                )}
              </a>
              <div className="absolute left-0 top-full mt-2 w-56 rounded-xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-border/50 backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-20 overflow-hidden">
                <div className="p-1.5">
                  <Link to="/electrician" className="block px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 cursor-pointer">Electrician</Link>
                  <Link to="/cleaner" className="block px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 cursor-pointer">Cleaner</Link>
                  <Link to="/ac-doctor" className="block px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 cursor-pointer">AC Doctor</Link>
                  <Link to="/catering" className="block px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 cursor-pointer">Catering</Link>
                  <Link to="/babysitter" className="block px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 cursor-pointer">Babysitter</Link>
                  <Link to="/pet-caring" className="block px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200 cursor-pointer">Pet Caring</Link>
                </div>
              </div>
            </div>

            <a 
              href="#about" 
              onClick={(event) => handleScroll(event, "about")} 
              className={`group relative px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${
                isActive("about")
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              About
              {isActive("about") && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
              )}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"></span>
            </a>

            <a 
              href="#contact" 
              onClick={(event) => handleScroll(event, "contact")} 
              className={`group relative px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${
                isActive("contact")
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Contact
              {isActive("contact") && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
              )}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"></span>
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-10 w-10 hover:bg-primary/5 hover:text-primary transition-all duration-200"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5 transition-transform duration-200 hover:scale-110" />
              {totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold shadow-sm"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all duration-200" 
                type="button" 
                aria-label="Profile" 
                onClick={() => navigate("/profile")}
              >
                {user?.avatar ? (
                  <Avatar className="h-10 w-10">
                    <AvatarImage className="object-cover" src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-10 w-10 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="h-10 px-5 border-border/60 text-foreground/80 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all duration-200 font-semibold" 
                  type="button" 
                  onClick={openLogin}
                >
                  Login
                </Button>
                <Button 
                  variant="default" 
                  className="h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 font-semibold" 
                  type="button" 
                  onClick={openRegister}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-10 w-10 hover:bg-primary/5 hover:text-primary transition-all duration-200"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
            <button 
              onClick={() => setMobileOpen((v) => !v)} 
              aria-label="Toggle menu" 
              className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-primary/5 transition-all duration-200"
            >
              {mobileOpen ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`md:hidden bg-white border-t border-border/40 overflow-hidden transition-all duration-200 ease-out ${
        mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pt-6 pb-8 space-y-1">
          <a 
            href="#home" 
            onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleScroll(e, 'home'); closeMobile(); }} 
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${
              isActive("home") 
                ? "text-primary bg-primary/5" 
                : "text-foreground/70 hover:text-primary hover:bg-primary/5"
            }`}
          >
            Home
          </a>

          <div>
            <a 
              href="#service" 
              onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleScroll(e, 'service'); closeMobile(); }} 
              className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${
                isActive("service") 
                  ? "text-primary bg-primary/5" 
                  : "text-foreground/70 hover:text-primary hover:bg-primary/5"
              }`}
            >
              Service
            </a>
            <div className="mt-1 ml-4 space-y-1">
              <Link 
                to="/electrician" 
                onClick={() => closeMobile()} 
                className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
              >
                Electrician
              </Link>
              <Link 
                to="/cleaner" 
                onClick={() => closeMobile()} 
                className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
              >
                Cleaner
              </Link>
              <Link 
                to="/ac-doctor" 
                onClick={() => closeMobile()} 
                className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
              >
                AC Doctor
              </Link>
              <Link 
                to="/catering" 
                onClick={() => closeMobile()} 
                className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
              >
                Catering
              </Link>
              <Link 
                to="/babysitter" 
                onClick={() => closeMobile()} 
                className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
              >
                Babysitter
              </Link>
              <Link 
                to="/pet-caring" 
                onClick={() => closeMobile()} 
                className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
              >
                Pet Caring
              </Link>
            </div>
          </div>

          <a 
            href="#about" 
            onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleScroll(e, 'about'); closeMobile(); }} 
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${
              isActive("about") 
                ? "text-primary bg-primary/5" 
                : "text-foreground/70 hover:text-primary hover:bg-primary/5"
            }`}
          >
            About
          </a>

          <a 
            href="#contact" 
            onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleScroll(e, 'contact'); closeMobile(); }} 
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${
              isActive("contact") 
                ? "text-primary bg-primary/5" 
                : "text-foreground/70 hover:text-primary hover:bg-primary/5"
            }`}
          >
            Contact
          </a>

          <div className="pt-4 mt-4 border-t border-border/40">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 px-4 py-3">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-10 w-10 object-cover rounded-full ring-2 ring-primary/20" 
                  />
                ) : (
                  <div className="h-10 w-10 flex items-center justify-center bg-primary rounded-full text-white">
                    <User className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1">
                  <button 
                    onClick={() => { navigate('/profile'); closeMobile(); }} 
                    className="text-left text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
                  >
                    View profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-4">
                <Button 
                  variant="outline" 
                  className="w-full h-11 border-border/60 text-foreground/80 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all duration-200 font-semibold" 
                  onClick={() => { openLogin(); closeMobile(); }}
                >
                  Login
                </Button>
                <Button 
                  variant="default" 
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 font-semibold" 
                  onClick={() => { openRegister(); closeMobile(); }}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <LoginDialog open={loginOpen} onOpenChange={(open) => (open ? openLogin() : closeLogin())} onSwitchToRegister={handleSwitchToRegister} />
      <RegisterDialog open={registerOpen} onOpenChange={(open) => (open ? openRegister() : closeRegister())} onSwitchToLogin={handleSwitchToLogin} />
    </header>
  );
};

export default Header;
