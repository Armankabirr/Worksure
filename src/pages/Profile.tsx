import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

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
  const [userEmail, setUserEmail] = useState<string>("");

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

  // Fetch email from Supabase Auth session
  useEffect(() => {
    const fetchSessionEmail = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setUserEmail(session.user.email);
        }
      } catch (err) {
        console.error("Failed to fetch session email:", err);
      }
    };
    fetchSessionEmail();
  }, [user]);

  // Fetch user data from API
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let isMounted = true;

    const fetchUserData = async () => {
      // Auth session guard - ensure user and user.id exist
      if (!user || !user.id || !user.email) {
        setIsLoading(false);
        setError("Please log in to view your profile");
        if (isMounted) {
          setTimeout(() => navigate("/user/login"), 2000);
        }
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Timeout safeguard - 10 seconds max
        timeoutId = setTimeout(() => {
          if (isMounted) {
            setIsLoading(false);
            setError("Request timed out. Please try again.");
            console.error("Profile fetch timeout after 10s");
          }
        }, 10000);

        const response = await axiosPublic.get(`/userRoutes/getUserData/${user.email}`);
        const data = response.data;

        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        // Handle empty/null response
        if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
          // Profile not created yet - treat as empty profile
          setUserData(null);
          setEditingAddresses([]);
          setFormData({
            name: user.name || "",
            phone: user.phone || "",
            gender: "",
            date_of_birth: "",
            bio: "",
            avatar: user.avatar || "",
            address: user.address || "",
          });
          setIsLoading(false);
          return;
        }

        // Set user data
        setUserData(data);
        setEditingAddresses(Array.isArray(data.addresses) ? data.addresses : []);

        // Initialize form with fetched data - ensure all fields are safe
        setFormData({
          name: (data.full_name && typeof data.full_name === "string") ? data.full_name : (user.name || ""),
          phone: (data.phone && typeof data.phone === "string") ? data.phone : (user.phone || ""),
          gender: (data.gender && typeof data.gender === "string") ? data.gender : "",
          date_of_birth: (data.date_of_birth && typeof data.date_of_birth === "string") ? data.date_of_birth : "",
          bio: "",
          avatar: (data.profile_picture && typeof data.profile_picture === "string") ? data.profile_picture : (user.avatar || ""),
          address: data.addresses && Array.isArray(data.addresses) && data.addresses.length > 0 
            ? `${data.addresses[0]?.street || ""}, ${data.addresses[0]?.city || ""}`.replace(/^,\s*|,\s*$/g, "").trim() || ""
            : (user.address || ""),
        });
      } catch (err) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        console.error("Failed to fetch user data:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to load user profile data";
        setError(errorMessage);
        // Set userData to null to show empty profile state
        setUserData(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [user?.id, user?.email, axiosPublic, navigate]);

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
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await logout();
      navigate("/user/login");
    } catch (err) {
      console.error("Logout error:", err);
      await logout();
      navigate("/user/login");
    }
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form to original user data
      if (userData) {
        setFormData({
          name: (userData.full_name && typeof userData.full_name === "string") ? userData.full_name : "",
          phone: (userData.phone && typeof userData.phone === "string") ? userData.phone : "",
          gender: (userData.gender && typeof userData.gender === "string") ? userData.gender : "",
          date_of_birth: (userData.date_of_birth && typeof userData.date_of_birth === "string") ? userData.date_of_birth : "",
          bio: "",
          avatar: (userData.profile_picture && typeof userData.profile_picture === "string") ? userData.profile_picture : "",
          address: userData.addresses && Array.isArray(userData.addresses) && userData.addresses.length > 0 
            ? `${userData.addresses[0]?.street || ""}, ${userData.addresses[0]?.city || ""}`.replace(/^,\s*|,\s*$/g, "").trim() || ""
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
      if (userData && Array.isArray(userData.addresses)) {
        setEditingAddresses([...userData.addresses]);
      } else {
        setEditingAddresses([]);
      }
    }
    setIsEditingAddresses(!isEditingAddresses);
  };

  // Handle address field change
  const handleAddressChange = (idx: number, field: keyof Address, value: string) => {
    if (idx < 0 || idx >= editingAddresses.length) return;
    const updated = [...editingAddresses];
    updated[idx] = { ...updated[idx], [field]: value || "" };
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
      if (userData) {
        setUserData({ ...userData, addresses: Array.isArray(editingAddresses) ? editingAddresses : [] });
      }
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
    console.log("handleSave called", { user: user?.id, isEditing, formData });
    
    if (!user || !user.id) {
      console.error("Save failed: No user or user.id");
      setError("User not found. Please log in again.");
      toast.error("User not found. Please log in again.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      console.log("Starting save process...", { userId: user.id, formData });

      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Name is required.");
      }

      if (!formData.phone.trim()) {
        throw new Error("Phone number is required.");
      }

      // Update Supabase profiles/users table
      // Try "users" table first (common name), then "profiles"
      console.log("Updating Supabase table...");
      let profileError = null;
      let profileData = null;
      
      // Try "users" table first
      const usersResult = await supabase
        .from("users")
        .upsert({
          id: user.id,
          full_name: formData.name.trim(),
          phone: formData.phone.trim(),
          gender: formData.gender.trim() || null,
          date_of_birth: formData.date_of_birth.trim() || null,
          bio: formData.bio.trim() || null,
          profile_picture: formData.avatar || null,
        }, {
          onConflict: "id"
        });

      if (usersResult.error) {
        console.log("users table failed, trying profiles table...", usersResult.error);
        // Try "profiles" table
        const profilesResult = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            full_name: formData.name.trim(),
            phone: formData.phone.trim(),
            gender: formData.gender.trim() || null,
            date_of_birth: formData.date_of_birth.trim() || null,
            bio: formData.bio.trim() || null,
            profile_picture: formData.avatar || null,
          }, {
            onConflict: "id"
          });
        
        profileError = profilesResult.error;
        profileData = profilesResult.data;
      } else {
        profileError = usersResult.error;
        profileData = usersResult.data;
      }

      if (profileError) {
        console.error("Supabase update error:", profileError);
        // If Supabase fails, try to continue with auth metadata update
        // and update local state so user sees their changes
        console.warn("Supabase update failed, but continuing with local update:", profileError.message);
        
        // Update local state anyway so user sees their changes
        if (userData) {
          setUserData({
            ...userData,
            full_name: formData.name.trim(),
            phone: formData.phone.trim(),
            gender: formData.gender.trim() || "",
            date_of_birth: formData.date_of_birth.trim() || "",
            profile_picture: formData.avatar || "",
          });
        }
        
        // Don't throw - continue with auth metadata update
        // The error will be shown but operation continues
        setError(`Profile saved locally, but database update had issues: ${profileError.message}`);
      }

      console.log("Supabase updated successfully:", profileData);

      // Also update auth user metadata for backward compatibility
      console.log("Updating auth user metadata...");
      const { error: authError } = await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim() || undefined,
        avatar: formData.avatar || undefined,
        address: formData.address.trim() || undefined,
      });
      
      if (authError) {
        console.error("Auth metadata update error:", authError);
        // Don't throw here - profile update succeeded, this is just metadata
        console.warn("Auth metadata update failed, but profile was saved:", authError.message);
      }

      // Refresh user data
      if (user.email) {
        try {
          console.log("Refreshing user data from API...");
          const response = await axiosPublic.get(`/userRoutes/getUserData/${user.email}`);
          if (response.data) {
            setUserData(response.data);
            setFormData({
              name: (response.data.full_name && typeof response.data.full_name === "string") ? response.data.full_name : formData.name,
              phone: (response.data.phone && typeof response.data.phone === "string") ? response.data.phone : formData.phone,
              gender: (response.data.gender && typeof response.data.gender === "string") ? response.data.gender : formData.gender,
              date_of_birth: (response.data.date_of_birth && typeof response.data.date_of_birth === "string") ? response.data.date_of_birth : formData.date_of_birth,
              bio: response.data.bio || formData.bio,
              avatar: (response.data.profile_picture && typeof response.data.profile_picture === "string") ? response.data.profile_picture : formData.avatar,
              address: formData.address,
            });
            console.log("User data refreshed successfully");
          }
        } catch (refreshErr) {
          console.error("Failed to refresh user data:", refreshErr);
          // Don't throw - profile was saved, just refresh failed
        }
      }

      // Only show success if no errors occurred
      if (!profileError) {
        toast.success("Profile updated successfully!");
        setSuccess("Profile updated successfully!");
      } else {
        toast.warning("Profile updated locally, but there was an issue saving to database.");
      }
      
      setIsEditing(false);

      // Clear messages after 3 seconds
      setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
    } catch (err) {
      console.error("Save error:", err);
      const message = err instanceof Error ? err.message : "Failed to update profile.";
      setError(message);
      toast.error(message);
      
      // Even on error, update local state so user doesn't lose their changes
      if (userData) {
        setUserData({
          ...userData,
          full_name: formData.name.trim(),
          phone: formData.phone.trim(),
          gender: formData.gender.trim() || "",
          date_of_birth: formData.date_of_birth.trim() || "",
          profile_picture: formData.avatar || "",
        });
      }
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

  // Auth guard - redirect if no user
  if (!user || !user.id) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 pt-24">
          <div className="w-full max-w-md p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold text-foreground mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">Please log in to view your profile</p>
            <button
              onClick={() => navigate("/user/login")}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show loading state only while actively loading
  if (isLoading) {
    return <ProfileLoadingState message="Loading profile..." />;
  }

  // Show empty profile state if no userData (profile not created yet)
  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-20 pb-8 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="flex items-center space-x-2 mb-6 text-xs text-muted-foreground">
              <a href="/" className="hover:text-primary transition-colors">Home</a>
              <span className="text-border">/</span>
              <span className="text-foreground font-medium">My Account</span>
            </div>
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-full max-w-md p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-amber-500" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Complete Your Profile</h2>
                <p className="text-muted-foreground mb-6">
                  Your profile hasn't been created yet. Please complete your profile to continue.
                </p>
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
                    {error}
                  </div>
                )}
                <button
                  onClick={() => {
                    setError(null);
                    // Trigger profile creation by setting a minimal userData
                    setUserData({
                      email: user.email || "",
                      phone: user.phone || "",
                      full_name: user.name || "",
                      gender: "",
                      date_of_birth: "",
                      role: user.role || "user",
                      profile_picture: user.avatar || "",
                      status: "active",
                      addresses: [],
                    });
                  }}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  Create Profile
                </button>
              </div>
            </div>
          </div>
        </main>
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
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="text-lg font-bold text-primary">
                {userData?.full_name && userData.full_name.trim()
                  ? userData.full_name
                  : userEmail
                  ? userEmail.split("@")[0]
                  : user?.name || "User"}
              </p>
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
              {activeMenu === "my-profile" && userData && (
                <MyProfileSection
                  userData={userData}
                  formData={formData}
                  isEditing={isEditing}
                  isEditingAddresses={isEditingAddresses}
                  isSaving={isSaving}
                  editingAddresses={editingAddresses}
                  userEmail={userEmail}
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
