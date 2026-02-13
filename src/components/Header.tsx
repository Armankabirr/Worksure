import { MouseEvent, useEffect, useState, useRef } from "react";
import { ShoppingCart, User, Menu, X as CloseIcon, Zap, Sparkles, Wind, Heart, UtensilsCrossed, Baby, LogOut, Bell, Loader2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/hooks/useCart";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import worksureLogo from "@/assets/Logo.png";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const Header = () => {
  const {
    isAuthenticated,
    logout,
  } = useAuth();
  const { totalItems } = useCart();
  const { toast } = useToast();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const [localUser, setLocalUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const serviceTriggerRef = useRef<HTMLAnchorElement>(null);
  const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setLocalUser(JSON.parse(storedUser));
      } else {
        setLocalUser(null);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      setLocalUser(null);
    }
  }, []);

  // Fetch Notifications
  useEffect(() => {
    async function fetchNotifications() {
      if (!localUser?.email || !isAuthenticated || localUser?.role !== "client") return;
      
      setNotificationsLoading(true);
      try {
        const res = await axiosPublic.get(`/userRoutes/notifications/${localUser.id}`);
        const data = res.data;
        
        if (data.success && Array.isArray(data.data)) {
          setNotifications(data.data);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
      } finally {
        setNotificationsLoading(false);
      }
    }
    fetchNotifications();
  }, [axiosPublic, localUser?.id, isAuthenticated, localUser?.role, localUser?.email]);

  // Smooth scroll helper that accounts for the fixed header height
  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (!element) return false;

    const headerEl = document.querySelector("header");
    const headerHeight = headerEl instanceof HTMLElement ? headerEl.getBoundingClientRect().height : 96;
    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementTop - headerHeight;

    window.scrollTo({
      top: offsetPosition >= 0 ? offsetPosition : 0,
      behavior: "smooth",
    });
    return true;
  };

  // Handle scrolling to hash targets when location changes
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.slice(1);
      // Delay to allow DOM render on route change before measuring
      setTimeout(() => {
        scrollToSection(targetId);
      }, 120);
    }
  }, [location.hash]);

  const handleScroll = (event: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    event.preventDefault();
    const scrolled = scrollToSection(targetId);
    if (!scrolled) {
      navigate(`/#${targetId}`);
    }
  };

  const closeMobile = () => setMobileOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileOpen(false);
  };

  // Mark single notification as read
  const handleMarkNotificationAsRead = async (notificationId: string) => {
    if (!localUser?.id) return;
    
    try {
      const res = await axiosPublic.patch(`/userRoutes/notifications/${notificationId}/read`);
      
      if (res.data.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  // Mark all notifications as read
  const handleMarkAllNotificationsAsRead = async () => {
    if (!localUser?.id) return;
    
    try {
      const res = await axiosPublic.patch(`/userRoutes/notifications/read-all/${localUser.id}`);
      
      if (res.data.success) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, is_read: true }))
        );
        
        toast({ 
          title: "Success", 
          description: "All notifications marked as read" 
        });
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  const formatNotificationTime = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diff = now.getTime() - notifTime.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getDashboardRoute = (role: string): string => {
    switch (role) {
      case "admin":
        return "/admin";
      case "worker":
        return "/worker/dashboard";
      case "client":
      default:
        return "/profile";
    }
  };

  const isActive = (hash: string) => {
    return location.hash === `#${hash}` || (hash === "home" && !location.hash && location.pathname === "/");
  };

  const handleServiceMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    openTimeoutRef.current = setTimeout(() => {
      setServiceDropdownOpen(true);
    }, 150);
  };

  const handleServiceMouseLeave = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    closeTimeoutRef.current = setTimeout(() => {
      setServiceDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        serviceDropdownRef.current &&
        serviceTriggerRef.current &&
        !serviceDropdownRef.current.contains(event.target as Node) &&
        !serviceTriggerRef.current.contains(event.target as Node)
      ) {
        setServiceDropdownOpen(false);
      }
    };

    if (serviceDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [serviceDropdownOpen]);

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {serviceDropdownOpen && (
        <div className="fixed inset-0 z-[45] backdrop-blur-sm pointer-events-none" aria-hidden="true" />
      )}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border/40 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex h-20 items-center justify-between">
            {/* Branding */}
            <div className="flex items-center">
              <Link
                to="/"
                className="group flex items-center gap-2.5 transition-all duration-200"
              >
                <img
                  src={worksureLogo}
                  alt="WorkSure"
                  className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 object-contain transition-all duration-200 group-hover:scale-110 group-hover:brightness-110 group-hover:drop-shadow-sm"
                />
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary transition-all duration-200 group-hover:scale-110 group-hover:brightness-110 group-hover:drop-shadow-sm inline-block">
                  WorkSure
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 relative">
              <a
                href="#home"
                onClick={(event) => handleScroll(event, "home")}
                className={`group relative px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${isActive("home")
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

              <div
                className="relative"
                onMouseEnter={handleServiceMouseEnter}
                onMouseLeave={handleServiceMouseLeave}
              >
                <a
                  ref={serviceTriggerRef}
                  href="#service"
                  onClick={(event) => handleScroll(event, "service")}
                  className={`relative px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${isActive("service")
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                    } ${serviceDropdownOpen ? "text-primary" : ""}`}
                >
                  Service
                  {isActive("service") && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                  )}
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-transform duration-200 origin-center ${serviceDropdownOpen ? "scale-x-100" : "scale-x-0"
                    }`}></span>
                </a>
                <div
                  ref={serviceDropdownRef}
                  className={`absolute left-1/2 -translate-x-1/2 top-[calc(100%+0.5rem)] w-[520px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.08)] border border-border/40 z-[100] overflow-hidden transition-all duration-200 ease-out ${serviceDropdownOpen
                      ? "opacity-100 visible translate-y-0 pointer-events-auto"
                      : "opacity-0 invisible translate-y-[-4px] pointer-events-none"
                    }`}
                >
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/electrician"
                        className="group/item flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 transition-all duration-200 cursor-pointer border border-transparent hover:border-primary/20"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 flex items-center justify-center transition-all duration-200 group-hover/item:scale-110">
                          <Zap className="h-6 w-6 text-primary group-hover/item:text-primary transition-colors duration-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base text-foreground group-hover/item:text-primary transition-colors duration-200 mb-1">
                            Electrician
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            Fixes, wiring, and electrical safety
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/cleaner"
                        className="group/item flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 transition-all duration-200 cursor-pointer border border-transparent hover:border-primary/20"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 flex items-center justify-center transition-all duration-200 group-hover/item:scale-110">
                          <Sparkles className="h-6 w-6 text-primary group-hover/item:text-primary transition-colors duration-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base text-foreground group-hover/item:text-primary transition-colors duration-200 mb-1">
                            Cleaner
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            Deep cleaning and maintenance
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/ac-doctor"
                        className="group/item flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 transition-all duration-200 cursor-pointer border border-transparent hover:border-primary/20"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 flex items-center justify-center transition-all duration-200 group-hover/item:scale-110">
                          <Wind className="h-6 w-6 text-primary group-hover/item:text-primary transition-colors duration-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base text-foreground group-hover/item:text-primary transition-colors duration-200 mb-1">
                            AC Doctor
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            Installation, repair, and maintenance
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/pet-caring"
                        className="group/item flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 transition-all duration-200 cursor-pointer border border-transparent hover:border-primary/20"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 flex items-center justify-center transition-all duration-200 group-hover/item:scale-110">
                          <Heart className="h-6 w-6 text-primary group-hover/item:text-primary transition-colors duration-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base text-foreground group-hover/item:text-primary transition-colors duration-200 mb-1">
                            Pet Care
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            Pet sitting and care services
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/catering"
                        className="group/item flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 transition-all duration-200 cursor-pointer border border-transparent hover:border-primary/20"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 flex items-center justify-center transition-all duration-200 group-hover/item:scale-110">
                          <UtensilsCrossed className="h-6 w-6 text-primary group-hover/item:text-primary transition-colors duration-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base text-foreground group-hover/item:text-primary transition-colors duration-200 mb-1">
                            Catering
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            Event catering and meal prep
                          </div>
                        </div>
                      </Link>

                      <Link
                        to="/babysitter"
                        className="group/item flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 transition-all duration-200 cursor-pointer border border-transparent hover:border-primary/20"
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 flex items-center justify-center transition-all duration-200 group-hover/item:scale-110">
                          <Baby className="h-6 w-6 text-primary group-hover/item:text-primary transition-colors duration-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base text-foreground group-hover/item:text-primary transition-colors duration-200 mb-1">
                            Babysitter
                          </div>
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            Trusted childcare professionals
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/about"
                className={`group relative px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${location.pathname === "/about"
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                  }`}
              >
                About
                {location.pathname === "/about" && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                )}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"></span>
              </Link>

              <a
                href="#contact"
                onClick={(event) => handleScroll(event, "contact")}
                className={`group relative px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${isActive("contact")
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

              {isAuthenticated && localUser?.role === "client" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-10 w-10 hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
                    >
                      <Bell className="h-5 w-5 transition-all duration-200 group-hover:scale-110 group-hover:rotate-12" />
                      {notifications.filter(n => !n.is_read).length > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-semibold shadow-sm animate-pulse"
                        >
                          {notifications.filter(n => !n.is_read).length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-96 max-h-[32rem] overflow-hidden p-0 bg-white shadow-xl border-2 border-gray-200"
                  >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Bell className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
                            {notifications.length > 0 && (
                              <p className="text-xs text-muted-foreground">
                                {notifications.filter(n => !n.is_read).length} unread
                              </p>
                            )}
                          </div>
                        </div>
                        {notifications.filter(n => !n.is_read).length > 0 && (
                          <button
                            onClick={handleMarkAllNotificationsAsRead}
                            className="text-xs text-primary hover:text-primary/80 font-medium hover:underline transition-colors"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[28rem]">
                      {notificationsLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                            <Bell className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-4">Loading notifications...</p>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
                            <Bell className="h-8 w-8 text-primary/40" />
                          </div>
                          <p className="text-sm font-medium text-foreground mb-1">All caught up!</p>
                          <p className="text-xs text-muted-foreground">No new notifications</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border/40">
                          {notifications.map((notification, index) => (
                            <div
                              key={notification.id}
                              className={`group relative p-4 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent ${
                                !notification.is_read 
                                  ? "bg-gradient-to-r from-primary/8 to-primary/3" 
                                  : "hover:bg-gray-50/50"
                              }`}
                              onClick={() => !notification.is_read && handleMarkNotificationAsRead(notification.id)}
                            >
                              {/* Unread indicator line */}
                              {!notification.is_read && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/50" />
                              )}
                              
                              <div className="flex items-start gap-3 pl-2">
                                {/* Icon */}
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                                  !notification.is_read 
                                    ? "bg-primary/10 group-hover:bg-primary/20" 
                                    : "bg-gray-100 group-hover:bg-gray-200"
                                }`}>
                                  <Bell className={`h-4 w-4 ${
                                    !notification.is_read ? "text-primary" : "text-gray-400"
                                  }`} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <p className={`text-sm font-semibold line-clamp-1 ${
                                      !notification.is_read ? "text-foreground" : "text-foreground/70"
                                    }`}>
                                      {notification.title}
                                    </p>
                                    {!notification.is_read && (
                                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5 shadow-sm shadow-primary/50" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground font-medium">
                                      {formatNotificationTime(notification.created_at)}
                                    </span>
                                    {!notification.is_read && (
                                      <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                        Mark as read
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all duration-200"
                    type="button"
                    aria-label="Profile"
                    onClick={() => navigate(getDashboardRoute(localUser?.role || "user"))}
                  >
                    {localUser?.profile_picture ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage className="object-cover" src={localUser.profile_picture} alt={localUser.full_name} />
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    type="button"
                    aria-label="Logout"
                    onClick={handleLogout}
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="h-10 px-5 border-border/60 text-foreground/80 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all duration-200 font-semibold"
                    type="button"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="default"
                    className="h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 font-semibold"
                    type="button"
                    onClick={() => navigate("/user/register")}
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
        <div className={`md:hidden bg-white border-t border-border/40 overflow-hidden transition-all duration-200 ease-out ${mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
          }`}>
          <div className="px-4 pt-6 pb-8 space-y-1">
            <a
              href="#home"
              onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleScroll(e, 'home'); closeMobile(); }}
              className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${isActive("home")
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
                className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${isActive("service")
                    ? "text-primary bg-primary/5"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  }`}
              >
                Service
              </a>
              <div className="mt-2 ml-4 space-y-2">
                <Link
                  to="/electrician"
                  onClick={() => closeMobile()}
                  className="group/item flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 flex items-center justify-center transition-all duration-200">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="font-semibold text-sm text-foreground group-hover/item:text-primary transition-colors duration-200 mb-0.5">
                      Electrician
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      Fixes, wiring, and electrical safety
                    </div>
                  </div>
                </Link>
                <Link
                  to="/cleaner"
                  onClick={() => closeMobile()}
                  className="group/item flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 flex items-center justify-center transition-all duration-200">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="font-semibold text-sm text-foreground group-hover/item:text-primary transition-colors duration-200 mb-0.5">
                      Cleaner
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      Deep cleaning and maintenance
                    </div>
                  </div>
                </Link>
                <Link
                  to="/ac-doctor"
                  onClick={() => closeMobile()}
                  className="group/item flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 flex items-center justify-center transition-all duration-200">
                    <Wind className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="font-semibold text-sm text-foreground group-hover/item:text-primary transition-colors duration-200 mb-0.5">
                      AC Doctor
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      Installation, repair, and maintenance
                    </div>
                  </div>
                </Link>
                <Link
                  to="/pet-caring"
                  onClick={() => closeMobile()}
                  className="group/item flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 flex items-center justify-center transition-all duration-200">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="font-semibold text-sm text-foreground group-hover/item:text-primary transition-colors duration-200 mb-0.5">
                      Pet Care
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      Pet sitting and care services
                    </div>
                  </div>
                </Link>
                <Link
                  to="/catering"
                  onClick={() => closeMobile()}
                  className="group/item flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 flex items-center justify-center transition-all duration-200">
                    <UtensilsCrossed className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="font-semibold text-sm text-foreground group-hover/item:text-primary transition-colors duration-200 mb-0.5">
                      Catering
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      Event catering and meal prep
                    </div>
                  </div>
                </Link>
                <Link
                  to="/babysitter"
                  onClick={() => closeMobile()}
                  className="group/item flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-all duration-200 border border-transparent hover:border-primary/20"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 group-hover/item:bg-primary/20 flex items-center justify-center transition-all duration-200">
                    <Baby className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="font-semibold text-sm text-foreground group-hover/item:text-primary transition-colors duration-200 mb-0.5">
                      Babysitter
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      Trusted childcare professionals
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <Link
              to="/about"
              onClick={() => closeMobile()}
              className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${location.pathname === "/about"
                  ? "text-primary bg-primary/5"
                  : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                }`}
            >
              About
            </Link>

            <a
              href="#contact"
              onClick={(e: MouseEvent<HTMLAnchorElement>) => { handleScroll(e, 'contact'); closeMobile(); }}
              className={`block px-4 py-3 text-base font-semibold rounded-lg transition-all duration-200 ${isActive("contact")
                  ? "text-primary bg-primary/5"
                  : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                }`}
            >
              Contact
            </a>

            <div className="pt-4 mt-4 border-t border-border/40">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3">
                    {localUser?.profile_picture ? (
                      <img
                        src={localUser.profile_picture}
                        alt={localUser.full_name}
                        className="h-10 w-10 object-cover rounded-full ring-2 ring-primary/20"
                      />
                    ) : (
                      <div className="h-10 w-10 flex items-center justify-center bg-primary rounded-full text-white">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex-1">
                      <button
                        onClick={() => { navigate(getDashboardRoute(localUser?.role || "user")); closeMobile(); }}
                        className="text-left text-sm font-semibold text-foreground hover:text-primary transition-colors duration-200"
                      >
                        View profile
                      </button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full h-11 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Button
                    variant="outline"
                    className="w-full h-11 border-border/60 text-foreground/80 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all duration-200 font-semibold"
                    onClick={() => { navigate("/login"); closeMobile(); }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="default"
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                    onClick={() => { navigate("/user/register"); closeMobile(); }}
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
