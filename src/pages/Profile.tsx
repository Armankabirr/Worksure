import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { 
  Camera, 
  Phone, 
  Mail, 
  MapPin, 
  LogOut, 
  CheckCircle,
  AlertCircle,
  Save,
  X,
  Settings,
  ShoppingBag,
  Gift,
  Heart,
  Loader2,
  Clock,
  DollarSign,
  CheckCheck,
  Briefcase,
  Star,
  User
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { toast } from "sonner";

// Type definitions
interface Address {
  street: string;
  city: string;
  district: string;
  postal_code: string;
  lat: string;
  lon: string;
}

interface UserData {
  email: string;
  phone: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  role: string;
  profile_picture: string;
  is_active: boolean;
  addresses: Address[];
}

interface WorkerProfile {
  display_name: string;
  avg_rating: number;
  total_reviews: number;
}

interface Worker {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  profile_picture: string;
  worker_profiles: WorkerProfile;
}

interface Hiring {
  id: string;
  client_id: string;
  assigned_worker_id: string;
  selected_time: string;
  address: string;
  description: string;
  status: string;
  total_amount: number;
  payment_completed: boolean;
  created_at: string;
  work_start: string;
  work_end: string;
  worker: Worker;
}

/**
 * Profile page component matching Worksure My Account design.
 * Displays user information with sidebar navigation.
 * Protected route - only accessible to authenticated users.
 */
const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const axiosPublic = useAxiosPublic();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddresses, setIsEditingAddresses] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState("my-profile");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editingAddresses, setEditingAddresses] = useState<Address[]>([]);
  const [hirings, setHirings] = useState<Hiring[]>([]);
  const [isLoadingHirings, setIsLoadingHirings] = useState(false);
  const [hiringError, setHiringError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    bio: "",
    avatar: "",
    address: "",
  });

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await axiosPublic.get(`/userRoutes/getUserData/${user.email}`);
        const data = response.data;
        setUserData(data);
        setEditingAddresses(data.addresses || []);
        
        // Initialize form with fetched data
        setFormData({
          name: data.full_name || "",
          phone: data.phone || "",
          gender: data.gender || "",
          date_of_birth: data.date_of_birth || "",
          bio: "",
          avatar: data.profile_picture || "",
          address: data.addresses && data.addresses.length > 0 
            ? `${data.addresses[0].street}, ${data.addresses[0].city}` 
            : "",
        });
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load user profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, axiosPublic]);

  // Fetch user hirings from API
  useEffect(() => {
    const fetchHirings = async () => {
      if (!user?.email) return;

      try {
        setIsLoadingHirings(true);
        setHiringError(null);
        const response = await axiosPublic.get(`orderRoutes/orders/user/${user.email}`);
        setHirings(response.data || []);
      } catch (err) {
        console.error("Failed to fetch hirings:", err);
        setHiringError("Failed to load hirings data");
        setHirings([]);
      } finally {
        setIsLoadingHirings(false);
      }
    };

    if (activeMenu === "my-hirings") {
      fetchHirings();
    }
  }, [user, axiosPublic, activeMenu]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form to original user data
      if (userData) {
        setFormData({
          name: userData.full_name || "",
          phone: userData.phone || "",
          gender: userData.gender || "",
          date_of_birth: userData.date_of_birth || "",
          bio: "",
          avatar: userData.profile_picture || "",
          address: userData.addresses && userData.addresses.length > 0 
            ? `${userData.addresses[0].street}, ${userData.addresses[0].city}` 
            : "",
        });
      }
      setError(null);
      setSuccess(null);
    }
    setIsEditing(!isEditing);
  };

  // Handle address edit toggle
  const handleAddressEditToggle = () => {
    if (isEditingAddresses) {
      // Cancel editing - reset to original addresses
      if (userData) {
        setEditingAddresses([...userData.addresses]);
      }
    }
    setIsEditingAddresses(!isEditingAddresses);
  };

  // Handle address field change
  const handleAddressChange = (idx: number, field: keyof Address, value: string) => {
    const updated = [...editingAddresses];
    updated[idx] = { ...updated[idx], [field]: value };
    setEditingAddresses(updated);
  };

  // Handle address save
  const handleSaveAddresses = async () => {
    if (!user || !userData) return;
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Here you would typically make an API call to save addresses
      // For now, we'll update local state
      setUserData({ ...userData, addresses: editingAddresses });
      setSuccess("Addresses updated successfully!");
      setIsEditingAddresses(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save addresses.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    field: keyof typeof formData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  // Handle avatar file selection
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB.");
      return;
    }

    // Convert to base64 for storage (mock implementation)
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      handleInputChange("avatar", base64String);
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSave = async () => {
    if (!user || !userData) return;

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Name is required.");
      }

      if (!formData.phone.trim()) {
        throw new Error("Phone number is required.");
      }

      // Update profile
      await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim() || undefined,
        avatar: formData.avatar || undefined,
        address: formData.address.trim() || undefined,
      });

      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update profile.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  // Get user initials for fallback avatar
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date of birth to show only date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const cancelOrders = async (hiringId: string) => {
    try {
      const response = await axiosPublic.post(`/orderRoutes/cancelOrder/${hiringId}`);
      console.log(response);
      if (response.status === 200) {
        toast.success("Order cancelled successfully");
      }
    } catch (err) {
      console.error("Failed to cancel order:", err);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 pt-24">
          <Card className="w-full max-w-md p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-muted-foreground">Loading profile...</p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Show loading/empty state
  if (!user || !userData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 pt-24">
          <Card className="w-full max-w-md p-8 text-center">
            <p className="text-muted-foreground">Loading profile...</p>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 pt-20 pb-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6 text-xs text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span className="text-border">/</span>
            <span className="text-foreground font-medium">My Account</span>
          </div>

          {/* Page Header with Welcome */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Account Management</h1>
              <p className="text-sm text-muted-foreground">Manage your profile and account settings</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Welcome back,</p>
              <p className="text-lg font-bold text-primary">{userData.full_name.split(" ")[0]}</p>
            </div>
          </div>

          {/* Success/Error Messages - Enhanced */}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3 animate-in slide-in-from-top text-sm">
              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 animate-in slide-in-from-top text-sm">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Navigation - Enhanced */}
            <aside className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 border-b border-slate-200">
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Manage
                  </h2>
                </div>

                <nav className="p-3 space-y-1">
                  <button
                    onClick={() => setActiveMenu("my-profile")}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                      activeMenu === "my-profile"
                        ? "bg-primary text-white shadow-md"
                        : "text-foreground hover:bg-slate-100"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    My Profile
                  </button>
                </nav>

                <div className="px-4 py-3 border-t border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wide mb-2 text-muted-foreground">My Orders</h3>
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveMenu("my-hirings")}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                        activeMenu === "my-hirings"
                          ? "bg-primary text-white shadow-md"
                          : "text-foreground hover:bg-slate-100"
                      }`}
                    >
                      <Briefcase className="h-4 w-4" />
                      My Hirings
                    </button>
                    <button
                      onClick={() => setActiveMenu("my-offers")}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                        activeMenu === "my-offers"
                          ? "bg-primary text-white shadow-md"
                          : "text-foreground hover:bg-slate-100"
                      }`}
                    >
                      <Gift className="h-4 w-4" />
                      My Offers
                    </button>
                    <button
                      onClick={() => setActiveMenu("my-wishlist")}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                        activeMenu === "my-wishlist"
                          ? "bg-primary text-white shadow-md"
                          : "text-foreground hover:bg-slate-100"
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                      My WishList
                    </button>
                  </nav>
                </div>

                <div className="p-3 border-t border-slate-200">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs"
                  >
                    <LogOut className="h-3 w-3 mr-1.5" />
                    Logout
                  </Button>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="md:col-span-3">
              {activeMenu === "my-profile" && (
                <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden">
                  {/* Profile Header with Background */}
                  <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-5 border-b border-slate-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-foreground mb-0.5">My Profile</h2>
                        <p className="text-xs text-muted-foreground">Update and manage your personal information</p>
                      </div>
                      {!isEditing && (
                        <Button
                          onClick={handleEditToggle}
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all text-sm"
                        >
                          <Settings className="h-3 w-3 mr-1.5" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Profile Content */}
                  <div className="p-6 space-y-6">
                    {/* Avatar and Basic Info Section */}
                    <div className="flex flex-col md:flex-row gap-5 pb-6 border-b border-slate-200">
                      {/* Avatar */}
                      <div className="flex flex-col items-center md:items-start">
                        <div className="relative group">
                          <Avatar className="h-28 w-28 border-4 border-primary/20 shadow-lg">
                            {formData.avatar ? (
                              <AvatarImage src={formData.avatar} alt={userData.full_name} />
                            ) : null}
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-3xl font-bold">
                              {userData.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          {isEditing && (
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute bottom-1 right-1 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 opacity-0 group-hover:opacity-100"
                              aria-label="Change avatar"
                            >
                              <Camera className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        {isEditing && (
                          <p className="text-xs text-muted-foreground text-center mt-2 max-w-xs">
                            Hover and click camera to change
                          </p>
                        )}
                      </div>

                      {/* Name and Role */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-1">{userData.full_name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <p className="text-xs text-muted-foreground capitalize font-medium">
                            {userData.is_active ? "Active" : "Inactive"}
                          </p>
                        </div>

                        {/* Contact Information - Grid Layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Full Name */}
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Settings className="h-3 w-3 text-primary" />
                              </div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Name</p>
                            </div>
                            {isEditing ? (
                              <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Full name"
                                className="border-slate-300 bg-white text-sm h-8"
                              />
                            ) : (
                              <p className="text-foreground font-semibold text-sm">{userData.full_name}</p>
                            )}
                          </div>

                          {/* Phone */}
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Phone className="h-3 w-3 text-primary" />
                              </div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Phone</p>
                            </div>
                            {isEditing ? (
                              <Input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="Phone number"
                                className="border-slate-300 bg-white text-sm h-8"
                              />
                            ) : (
                              <p className="text-foreground font-semibold text-sm">{userData.phone}</p>
                            )}
                          </div>

                          {/* Email */}
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Mail className="h-3 w-3 text-primary" />
                              </div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Email</p>
                            </div>
                            <p className="text-foreground font-semibold text-sm">{userData.email}</p>
                            {!isEditing && <p className="text-xs text-muted-foreground mt-0.5">Read-only</p>}
                          </div>

                          {/* Gender */}
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Settings className="h-3 w-3 text-primary" />
                              </div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Gender</p>
                            </div>
                            {isEditing ? (
                              <Input
                                value={formData.gender}
                                onChange={(e) => handleInputChange("gender", e.target.value)}
                                placeholder="Gender"
                                className="border-slate-300 bg-white text-sm h-8"
                              />
                            ) : (
                              <p className="text-foreground font-semibold text-sm">
                                {userData.gender || <span className="text-muted-foreground">Not provided</span>}
                              </p>
                            )}
                          </div>

                          {/* Date of Birth */}
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Settings className="h-3 w-3 text-primary" />
                              </div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Date of Birth</p>
                            </div>
                            {isEditing ? (
                              <Input
                                type="date"
                                value={formData.date_of_birth}
                                onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                                className="border-slate-300 bg-white text-sm h-8"
                              />
                            ) : (
                              <p className="text-foreground font-semibold text-sm">
                                {userData.date_of_birth ? formatDate(userData.date_of_birth) : <span className="text-muted-foreground">Not provided</span>}
                              </p>
                            )}
                          </div>

                          {/* Address */}
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 sm:col-span-2">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="p-1.5 bg-primary/10 rounded-lg">
                                <MapPin className="h-3 w-3 text-primary" />
                              </div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Primary Address</p>
                            </div>
                            {isEditing ? (
                              <Input
                                value={formData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                placeholder="Address"
                                className="border-slate-300 bg-white text-sm h-8"
                              />
                            ) : (
                              <p className="text-foreground font-semibold text-sm">
                                {formData.address || <span className="text-muted-foreground">Not provided</span>}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bio Section - Full Width */}
                    {formData.bio && (
                      <div className="pb-6 border-b border-slate-200">
                        <Label className="text-sm font-bold mb-2 block text-foreground">About You</Label>
                        {isEditing ? (
                          <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows={3}
                            className="resize-none border-slate-300 bg-white text-sm"
                          />
                        ) : (
                          <p className="text-foreground text-sm whitespace-pre-wrap bg-slate-50 p-3 rounded-lg border border-slate-200">
                            {formData.bio}
                          </p>
                        )}
                      </div>
                    )}

                    {isEditing && !formData.bio && (
                      <div className="pb-6 border-b border-slate-200">
                        <Label htmlFor="bio" className="text-sm font-bold mb-2 block text-foreground">About You</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          placeholder="Tell us about yourself..."
                          rows={3}
                          className="resize-none border-slate-300 bg-white text-sm"
                        />
                      </div>
                    )}

                    {/* Addresses Section */}
                    {userData.addresses && (
                      <div className="pb-6 border-b border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-sm font-bold text-foreground">Saved Addresses</h3>
                          {!isEditingAddresses && (
                            <Button
                              onClick={handleAddressEditToggle}
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all text-sm"
                            >
                              <Settings className="h-3 w-3 mr-1.5" />
                              Edit
                            </Button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {(isEditingAddresses ? editingAddresses : userData.addresses).map((addr, idx) => (
                            <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                              {isEditingAddresses ? (
                                <div className="space-y-3">
                                  <Input
                                    placeholder="Street"
                                    value={userData.addresses[0].street}
                                    onChange={(e) => handleAddressChange(idx, "street", e.target.value)}
                                    className="border-slate-300 bg-white text-sm h-8"
                                  />
                                  <div className="grid grid-cols-2 gap-3">
                                    <Input
                                      placeholder="City"
                                      value={userData?.addresses[0].city}
                                      onChange={(e) => handleAddressChange(idx, "city", e.target.value)}
                                      className="border-slate-300 bg-white text-sm h-8"
                                    />
                                    <Input
                                      placeholder="District"
                                      value={userData.addresses[0].district}
                                      onChange={(e) => handleAddressChange(idx, "district", e.target.value)}
                                      className="border-slate-300 bg-white text-sm h-8"
                                    />
                                  </div>
                                  <Input
                                    placeholder="Postal Code"
                                    value={userData.addresses[0].postal_code}
                                    onChange={(e) => handleAddressChange(idx, "postal_code", e.target.value)}
                                    className="border-slate-300 bg-white text-sm h-8"
                                  />
                                  <div className="grid grid-cols-2 gap-3">
                                    <Input
                                      placeholder="Latitude"
                                      value={userData.addresses[0].lat}
                                      onChange={(e) => handleAddressChange(idx, "lat", e.target.value)}
                                      className="border-slate-300 bg-white text-sm h-8"
                                    />
                                    <Input
                                      placeholder="Longitude"
                                      value={userData.addresses[0].lon}
                                      onChange={(e) => handleAddressChange(idx, "lon", e.target.value)}
                                      className="border-slate-300 bg-white text-sm h-8"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start gap-3">
                                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                    <MapPin className="h-4 w-4 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground">{userData.addresses[0].street}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {userData.addresses[0].city}, {userData.addresses[0].district} {userData.addresses[0].postal_code}
                                    </p>
                                    {userData.addresses[0].lat && userData.addresses[0].lon && (
                                      <p className="text-xs text-muted-foreground/60 mt-1">
                                        Coordinates: {userData.addresses[0].lat}, {userData.addresses[0].lon}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {isEditingAddresses && (
                          <div className="flex gap-3 justify-end mt-4">
                            <Button
                              onClick={handleAddressEditToggle}
                              disabled={isSaving}
                              variant="outline"
                              size="sm"
                              className="border-slate-300 gap-1.5 text-sm"
                            >
                              <X className="h-3 w-3" />
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSaveAddresses}
                              disabled={isSaving}
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-white gap-1.5 shadow-md hover:shadow-lg transition-all text-sm"
                            >
                              <Save className="h-3 w-3" />
                              {isSaving ? "Saving..." : "Save"}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                      {isEditing ? (
                        <>
                          <Button
                            onClick={handleEditToggle}
                            disabled={isSaving}
                            variant="outline"
                            size="sm"
                            className="border-slate-300 gap-1.5 text-sm"
                          >
                            <X className="h-3 w-3" />
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white gap-1.5 shadow-md hover:shadow-lg transition-all text-sm"
                          >
                            <Save className="h-3 w-3" />
                            {isSaving ? "Saving..." : "Save"}
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </Card>
              )}

              {/* Placeholder Cards for Other Sections */}
              {activeMenu === "my-hirings" && (
                <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-5 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-foreground mb-0.5">My Hirings</h2>
                    <p className="text-xs text-muted-foreground">View and manage your service hirings</p>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {hiringError && (
                      <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-800 font-medium">{hiringError}</p>
                      </div>
                    )}

                    {isLoadingHirings ? (
                      <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        <p className="text-sm text-muted-foreground">Loading your hirings...</p>
                      </div>
                    ) : hirings && hirings.length > 0 ? (
                      <div className="space-y-4">
                        {hirings.map((hiring) => (
                          <div
                            key={hiring.id}
                            className="border border-slate-200 rounded-lg p-4 hover:border-primary/50 hover:shadow-md transition-all duration-200"
                          >
                            {/* Header with Status */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground text-sm">{hiring.description}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Order ID: {hiring.id.slice(0, 8)}...
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    hiring.status === "completed"
                                      ? "bg-green-100 text-green-700"
                                      : hiring.status === "in-progress"
                                      ? "bg-blue-100 text-blue-700"
                                      : hiring.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {hiring.status?.charAt(0).toUpperCase() + hiring.status?.slice(1)}
                                </span>
                              </div>
                            </div>

                            {/* Worker Information */}
                            {hiring.users_orders_assigned_worker_idTousers && (
                              <div className="border-b border-slate-200 pb-4 mb-4">
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-10 w-10 flex-shrink-0 border border-slate-200">
                                    <AvatarImage src={hiring.users_orders_assigned_worker_idTousers.profile_picture} alt={hiring.users_orders_assigned_worker_idTousers.full_name} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                      {hiring.users_orders_assigned_worker_idTousers.full_name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-semibold text-foreground text-sm">{hiring.users_orders_assigned_worker_idTousers.full_name}</p>
                                      {hiring.users_orders_assigned_worker_idTousers.worker_profiles && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
                                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                          <span className="text-xs font-semibold text-amber-700">
                                            {hiring.users_orders_assigned_worker_idTousers.worker_profiles.avg_rating}
                                          </span>
                                        </span>
                                      )}
                                    </div>
                                    <div className="space-y-1 text-xs text-muted-foreground">
                                      {hiring.users_orders_assigned_worker_idTousers.worker_profiles?.display_name && (
                                        <p>{hiring.users_orders_assigned_worker_idTousers.worker_profiles.display_name}</p>
                                      )}
                                      <div className="flex items-center gap-3 flex-wrap">
                                        <span className="flex items-center gap-1">
                                          <Phone className="h-3 w-3" />
                                          {hiring.users_orders_assigned_worker_idTousers.phone}
                                        </span>
                                        {hiring.users_orders_assigned_worker_idTousers.worker_profiles && (
                                          <span className="flex items-center gap-1">
                                            ({hiring.users_orders_assigned_worker_idTousers.worker_profiles.total_reviews} reviews)
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3 text-xs">
                              {/* Address */}
                              <div className="flex items-start gap-2 col-span-2 md:col-span-3">
                                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-muted-foreground text-xs">Location</p>
                                  <p className="text-foreground font-medium">{hiring.address}</p>
                                </div>
                              </div>

                              {/* Date/Time */}
                              <div>
                                <p className="text-muted-foreground text-xs mb-0.5">Scheduled Time</p>
                                <p className="text-foreground font-medium flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(hiring.selected_time).toLocaleDateString()}
                                </p>
                              </div>

                              {/* Amount */}
                              <div>
                                <p className="text-muted-foreground text-xs mb-0.5">Amount</p>
                                <p className="text-foreground font-semibold flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {hiring.total_amount}
                                </p>
                              </div>

                              {/* Payment Status */}
                              <div>
                                <p className="text-muted-foreground text-xs mb-0.5">Payment</p>
                                <p className={`flex items-center gap-1 font-medium ${hiring.payment_completed ? "text-green-600" : "text-yellow-600"}`}>
                                  {hiring.payment_completed ? (
                                    <>
                                      <CheckCheck className="h-3 w-3" />
                                      Completed
                                    </>
                                  ) : (
                                    <>
                                      <Clock className="h-3 w-3" />
                                      Pending
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Work Duration if available */}
                            {hiring.work_start && hiring.work_end && (
                              <div className="border-t border-slate-200 pt-3 mt-3 text-xs">
                                <p className="text-muted-foreground mb-2">Work Duration</p>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">
                                    {new Date(hiring.work_start).toLocaleString()}
                                  </span>
                                  <span className="text-muted-foreground">to</span>
                                  <span className="font-medium text-foreground">
                                    {new Date(hiring.work_end).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Created Date */}
                            <div className="border-t border-slate-200 pt-3 mt-3 flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                Created: {new Date(hiring.created_at).toLocaleDateString()} at {new Date(hiring.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                              <Button
                                onClick={() => cancelOrders(hiring.id)}
                                size="sm"
                                className="mt-2 bg-primary hover:bg-primary/90 text-white text-xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Briefcase className="h-12 w-12 text-muted-foreground/40 mb-3" />
                        <h3 className="text-lg font-semibold text-foreground mb-1">No Hirings Yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">You haven't hired any services yet</p>
                        <Button
                          onClick={() => navigate("/")}
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          Explore Services
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {activeMenu === "my-offers" && (
                <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-8 text-center">
                  <Gift className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <h2 className="text-lg font-bold text-foreground mb-1">My Offers</h2>
                  <p className="text-sm text-muted-foreground">Coming soon...</p>
                </Card>
              )}

              {activeMenu === "my-wishlist" && (
                <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-8 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <h2 className="text-lg font-bold text-foreground mb-1">My WishList</h2>
                  <p className="text-sm text-muted-foreground">Coming soon...</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
