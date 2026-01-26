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
import PetCareServiceDetail from "./pages/PetCareServiceDetail";
import Catering from "./pages/Catering";
import Babysitter from "./pages/Babysitter";
import ElectricalRepairs from "./pages/ElectricalRepairs";
import DeepCleaning from "./pages/DeepCleaning";
import CleaningPricing from "./pages/CleaningPricing";
import ACDoctorServiceDetail from "./pages/ACDoctorServiceDetail";
import ACDoctorPricing from "./pages/ACDoctorPricing";
import ElectricianServiceDetail from "./pages/ElectricianServiceDetail";
import ElectricianPricing from "./pages/ElectricianPricing";
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";
import Profile from "./pages/Profile";
import WorkerDashboard from "./pages/WorkerDashboard";
import Cart from "./pages/Cart";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import PaymentCancelled from "./pages/PaymentCancelled";
import Preloader from "./components/Preloader";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Search from "./pages/Search";
import WorkerDetail from "./pages/WorkerDetail";
import About from "./pages/About";
import { CartProvider } from "./context/CartContext";
import AdminDashboardLayout from "./pages/Dashboard/admin/AdminDashboardLayout";
import AdminDashboard from "./pages/Dashboard/admin/AdminDashboard";
import AdminUsers from "./pages/Dashboard/admin/AdminUsers";
import AdminWorkers from "./pages/Dashboard/admin/AdminWorkers";
import AdminServices from "./pages/Dashboard/admin/AdminServices";
import AdminBookings from "./pages/Dashboard/admin/AdminBookings";
import AdminPayments from "./pages/Dashboard/admin/AdminPayments";
import AdminReviews from "./pages/Dashboard/admin/AdminReviews";
import AdminComplaints from "./pages/Dashboard/admin/AdminComplaints";
import AdminAddresses from "./pages/Dashboard/admin/AdminAddresses";
import AdminReports from "./pages/Dashboard/admin/AdminReports";
import AdminSettings from "./pages/Dashboard/admin/AdminSettings";
import AuthRedirectHandler from "./components/AuthRedirectHandler";

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
            <ErrorBoundary>
              <ScrollToTop />
              <AuthRedirectHandler />
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/electrician" element={<Electrician />} />
              <Route path="/electrician/pricing" element={<ElectricianPricing />} />
              <Route path="/electrician/electrical-repairs" element={<ElectricalRepairs />} />
              <Route path="/electrician/:slug" element={<ElectricianServiceDetail />} />
              <Route path="/ac-doctor" element={<ACDoctor />} />
              <Route path="/ac-doctor/pricing" element={<ACDoctorPricing />} />
              <Route path="/ac-doctor/:slug" element={<ACDoctorServiceDetail />} />
              <Route path="/cleaner" element={<Cleaner />} />
              <Route path="/cleaner/pricing" element={<CleaningPricing />} />
              <Route path="/cleaner/:slug" element={<DeepCleaning />} />
              <Route path="/pet-caring" element={<PetCaring />} />
              <Route path="/pet-care/:slug" element={<PetCareServiceDetail />} />
              <Route path="/catering" element={<Catering />} />
              <Route path="/babysitter" element={<Babysitter />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/user/register" element={<UserRegister />} />
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/search/workers" element={<Search />} />
              <Route path="/worker/:id" element={<WorkerDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/booking"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute role="user">
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/worker/dashboard"
                element={
                  <ProtectedRoute role="worker">
                    <ErrorBoundary>
                      <WorkerDashboard />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failed" element={<PaymentFailed />} />
              <Route path="/payment/cancelled" element={<PaymentCancelled />} />
              
              {/* Admin Dashboard Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="workers" element={<AdminWorkers />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="complaints" element={<AdminComplaints />} />
                <Route path="addresses" element={<AdminAddresses />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              
              <Route path="/about" element={<About />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </ErrorBoundary>
          </BrowserRouter>
          <ScrollToTopButton />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );

  
};

export default App;
