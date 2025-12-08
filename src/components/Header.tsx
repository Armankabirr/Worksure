import { MouseEvent, useEffect, useState } from "react";
import { ShoppingCart, User, Menu, X as CloseIcon } from "lucide-react";
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

  return (
    <header className="bg-card py-4 px-6 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">WorkSure</Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#home" onClick={(event) => handleScroll(event, "home")} className="text-foreground hover:text-primary transition-colors cursor-pointer">Home</a>

          <div className="relative group">
            <a href="#service" onClick={(event) => handleScroll(event, "service")} className="text-foreground hover:text-primary transition-colors cursor-pointer">Service</a>
            <div className="absolute left-0 mt-3 w-48 rounded-lg bg-card shadow-xl border border-border/50 backdrop-blur-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out z-20 overflow-hidden">
              <Link to="/electrician" className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200 first:rounded-t-lg last:rounded-b-lg cursor-pointer">Electrician</Link>
              <a href="#service-cleaner" onClick={(event) => handleScroll(event, "service-cleaner")} className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200 cursor-pointer">Cleaner</a>
              <a href="#service-catering" onClick={(event) => handleScroll(event, "service-catering")} className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200 cursor-pointer">Catering</a>
              <a href="#service-babysitter" onClick={(event) => handleScroll(event, "service-babysitter")} className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200 cursor-pointer">Babysitter</a>
              <a href="#service-pet-care" onClick={(event) => handleScroll(event, "service-pet-care")} className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80 hover:text-primary transition-all duration-200 cursor-pointer">Pet Care</a>
            </div>
          </div>

          <a href="#about" onClick={(event) => handleScroll(event, "about")} className="text-foreground hover:text-primary transition-colors cursor-pointer">About</a>
          <a href="#contact" onClick={(event) => handleScroll(event, "contact")} className="text-foreground hover:text-primary transition-colors cursor-pointer">Contact</a>
        </nav>

        {/* Desktop: full icons (visible md+) */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hover:bg-accent"><ShoppingCart className="h-5 w-5" /></Button>

          {isAuthenticated ? (
            <Button variant="default" size="icon" className="p-0 rounded-full overflow-hidden" type="button" aria-label="Profile" onClick={() => navigate("/profile")}>{user?.avatar ? (<Avatar className="h-10 w-10"><AvatarImage className="object-cover" src={user.avatar} alt={user.name} /><AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">{user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}</AvatarFallback></Avatar>) : (<div className="h-10 w-10 flex items-center justify-center"><User className="h-5 w-5" /></div>)}</Button>
          ) : (
            <>
              <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/5 hover:text-primary" type="button" onClick={openLogin}>Login</Button>
              <Button variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg" type="button" onClick={openRegister}>Sign up</Button>
            </>
          )}
        </div>

        {/* Mobile: only cart + hamburger (no profile icon in header) */}
        <div className="flex md:hidden items-center space-x-2">
          <Button variant="ghost" size="icon" className="hover:bg-accent"><ShoppingCart className="h-5 w-5" /></Button>
          <button onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu" className="p-2 rounded-md hover:bg-accent">{mobileOpen ? <CloseIcon className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div className={`md:hidden bg-card border-t border-border overflow-hidden transition-max-h duration-200 ${mobileOpen ? 'max-h-[80vh]' : 'max-h-0'}`}>
        <div className="px-4 pt-4 pb-6 space-y-3">
          <a href="#home" onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleScroll(e, 'home'); closeMobile(); }} className="block text-foreground hover:text-primary">Home</a>

          <div>
            <a href="#service" onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleScroll(e, 'service'); closeMobile(); }} className="block text-foreground hover:text-primary">Service</a>
            <div className="mt-2 ml-3 space-y-1">
              <Link to="/electrician" onClick={() => closeMobile()} className="block text-foreground hover:text-primary">Electrician</Link>
              <a href="#service-cleaner" onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleScroll(e, 'service-cleaner'); closeMobile(); }} className="block text-foreground hover:text-primary">Cleaner</a>
              <a href="#service-catering" onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleScroll(e, 'service-catering'); closeMobile(); }} className="block text-foreground hover:text-primary">Catering</a>
              <a href="#service-babysitter" onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleScroll(e, 'service-babysitter'); closeMobile(); }} className="block text-foreground hover:text-primary">Babysitter</a>
              <a href="#service-pet-care" onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleScroll(e, 'service-pet-care'); closeMobile(); }} className="block text-foreground hover:text-primary">Pet Care</a>
            </div>
          </div>

          <a href="#about" onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleScroll(e, 'about'); closeMobile(); }} className="block text-foreground hover:text-primary">About</a>
          <a href="#contact" onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleScroll(e, 'contact'); closeMobile(); }} className="block text-foreground hover:text-primary">Contact</a>

          <div className="pt-3 border-t border-border">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* compact avatar in mobile panel */}
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-8 w-8 object-cover rounded-full" />
                ) : (
                  <div className="h-8 w-8 flex items-center justify-center bg-primary rounded-full text-white">
                    <User className="h-4 w-4" />
                  </div>
                )}

                <div className="flex-1">
                  <button onClick={() => { navigate('/profile'); closeMobile(); }} className="w-full text-left text-sm font-medium text-foreground hover:text-primary">View profile</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button onClick={() => { openLogin(); closeMobile(); }} className="w-full text-left">Login</button>
                <button onClick={() => { openRegister(); closeMobile(); }} className="w-full text-left">Sign up</button>
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
