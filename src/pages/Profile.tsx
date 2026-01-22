import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { toast } from "sonner";

// Import profile components
import {
  ProfileSidebar,
  MyProfileSection,
  MyHiringsSection,
  MyReviewsSection,
  SavedServicesSection,
  ProfileLoadingState,
} from "@/components/profile";

// Import types
import { 
  UserData, 
  Address, 
  Hiring, 
  ProfileFormData,
  ActiveMenuType 
} from "@/types/profile";

/**
 * Profile page component matching Worksure My Account design.
 * Displays user information with sidebar navigation.
 * Protected route - only accessible to authenticated users.
 */
const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  
  // UI State
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddresses, setIsEditingAddresses] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<ActiveMenuType>("my-profile");
  
  // Data State
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editingAddresses, setEditingAddresses] = useState<Address[]>([]);
  const [hirings, setHirings] = useState<Hiring[]>([]);
  const [isLoadingHirings, setIsLoadingHirings] = useState(false);
  const [hiringError, setHiringError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<ProfileFormData>({
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
  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
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

      const { error } = await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim() || undefined,
        avatar: formData.avatar || undefined,
        address: formData.address.trim() || undefined,
      });
      if (error) throw error;

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

  // Cancel orders
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
    return <ProfileLoadingState />;
  }

  // Show loading/empty state
  if (!user || !userData) {
    return <ProfileLoadingState message="Loading profile..." />;
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

          {/* Success/Error Messages */}
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
            {/* Sidebar Navigation */}
            <ProfileSidebar 
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              onLogout={handleLogout}
            />

            {/* Main Content Area */}
            <div className="md:col-span-3">
              {activeMenu === "my-profile" && (
                <MyProfileSection
                  userData={userData}
                  formData={formData}
                  isEditing={isEditing}
                  isEditingAddresses={isEditingAddresses}
                  isSaving={isSaving}
                  editingAddresses={editingAddresses}
                  onEditToggle={handleEditToggle}
                  onAddressEditToggle={handleAddressEditToggle}
                  onInputChange={handleInputChange}
                  onAddressChange={handleAddressChange}
                  onSave={handleSave}
                  onSaveAddresses={handleSaveAddresses}
                  onAvatarChange={handleAvatarChange}
                />
              )}

              {activeMenu === "my-hirings" && (
                <MyHiringsSection
                  hirings={hirings}
                  isLoading={isLoadingHirings}
                  error={hiringError}
                  onCancelOrder={cancelOrders}
                />
              )}

              {activeMenu === "my-reviews" && <MyReviewsSection />}

              {activeMenu === "saved-services" && <SavedServicesSection />}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
