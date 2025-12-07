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
  Heart
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Profile page component matching Worksure My Account design.
 * Displays user information with sidebar navigation.
 * Protected route - only accessible to authenticated users.
 */
const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState("my-profile");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    avatar: "",
    address: "",
  });

  // Initialize form data when user loads or changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form to original user data
      if (user) {
        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          bio: user.bio || "",
          avatar: user.avatar || "",
          address: user.address || "",
        });
      }
      setError(null);
      setSuccess(null);
    }
    setIsEditing(!isEditing);
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
    if (!user) return;

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

  // Show loading/empty state
  if (!user) {
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
              <p className="text-lg font-bold text-primary">{user.name.split(" ")[0]}</p>
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
                      onClick={() => setActiveMenu("my-services")}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                        activeMenu === "my-services"
                          ? "bg-primary text-white shadow-md"
                          : "text-foreground hover:bg-slate-100"
                      }`}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      My Services
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
                              <AvatarImage src={formData.avatar} alt={user.name} />
                            ) : null}
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-3xl font-bold">
                              {getInitials(user.name)}
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
                        <h3 className="text-xl font-bold text-foreground mb-1">{user.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <p className="text-xs text-muted-foreground capitalize font-medium">
                            {user.role === "user" ? "Customer" : "Service Provider"}
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
                              <p className="text-foreground font-semibold text-sm">{user.name}</p>
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
                              <p className="text-foreground font-semibold text-sm">{user.phone}</p>
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
                            <p className="text-foreground font-semibold text-sm">{user.email}</p>
                            {!isEditing && <p className="text-xs text-muted-foreground mt-0.5">Read-only</p>}
                          </div>

                          {/* Address */}
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="p-1.5 bg-primary/10 rounded-lg">
                                <MapPin className="h-3 w-3 text-primary" />
                              </div>
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Address</p>
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
              {activeMenu === "my-services" && (
                <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-8 text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                  <h2 className="text-lg font-bold text-foreground mb-1">My Services</h2>
                  <p className="text-sm text-muted-foreground">Coming soon...</p>
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
