import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Electrician from "./pages/Electrician";
import Cleaner from "./pages/Cleaner";
import ACDoctor from "./pages/ACDoctor";
import PetCaring from "./pages/PetCaring";
import Catering from "./pages/Catering";
import Babysitter from "./pages/Babysitter";
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";
import Profile from "./pages/Profile";
import WorkerDashboard from "./pages/WorkerDashboard";
import Cart from "./pages/Cart";
import Preloader from "./components/Preloader";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ProtectedRoute from "./components/ProtectedRoute";
import Search from "./pages/Search";
import WorkerDetail from "./pages/WorkerDetail";
import { CartProvider } from "./context/CartContext";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          {isLoading && <Preloader isLoading={isLoading} onComplete={() => setIsLoading(false)} />}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/electrician" element={<Electrician />} />
              <Route path="/ac-doctor" element={<ACDoctor />} />
              <Route path="/cleaner" element={<Cleaner />} />
              <Route path="/pet-caring" element={<PetCaring />} />
              <Route path="/catering" element={<Catering />} />
              <Route path="/babysitter" element={<Babysitter />} />
              <Route path="/user/register" element={<UserRegister />} />
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/search/workers" element={<Search />} />
              <Route path="/worker/:id" element={<WorkerDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/worker/dashboard"
                element={
                  <ProtectedRoute>
                    <WorkerDashboard />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <ScrollToTopButton />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
