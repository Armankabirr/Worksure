import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Camera, Phone, Mail, MapPin, LogOut } from "lucide-react";
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
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-8 text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary">Home</a>
            <span>/</span>
            <span>My Account</span>
          </div>

          {/* Welcome Message */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Manage My Account</h1>
            <p className="text-muted-foreground">
              Welcome! <span className="text-primary font-semibold">{user.name.split(" ")[0]}</span>
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-200 text-green-800 text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 rounded-md bg-destructive/10 border border-destructive/40 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-6">Manage My Account</h2>
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveMenu("my-profile")}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 font-medium transition-colors ${
                      activeMenu === "my-profile"
                        ? "bg-orange-50 text-primary"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <span className="text-lg">👤</span>
                    My Profile
                  </button>
                </nav>

                <h2 className="text-lg font-semibold text-foreground mt-8 mb-4">My Orders</h2>
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveMenu("my-services")}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 font-medium transition-colors ${
                      activeMenu === "my-services"
                        ? "bg-orange-50 text-primary"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <span className="text-lg">📋</span>
                    My Services
                  </button>
                  <button
                    onClick={() => setActiveMenu("my-offers")}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 font-medium transition-colors ${
                      activeMenu === "my-offers"
                        ? "bg-orange-50 text-primary"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <span className="text-lg">🎁</span>
                    My Offers
                  </button>
                  <button
                    onClick={() => setActiveMenu("my-wishlist")}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 font-medium transition-colors ${
                      activeMenu === "my-wishlist"
                        ? "bg-orange-50 text-primary"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <span className="text-lg">❤️</span>
                    My WishList
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="md:col-span-3">
              {activeMenu === "my-profile" && (
                <Card className="bg-white border border-border p-8 shadow-sm">
                  {/* Profile Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-1">My Profile</h2>
                      <p className="text-muted-foreground text-sm">View and manage your personal information</p>
                    </div>
                    {!isEditing && (
                      <Button
                        onClick={handleEditToggle}
                        className="bg-primary hover:bg-primary/90 text-white gap-2"
                      >
                        Update Info
                      </Button>
                    )}
                  </div>

                  {/* Profile Content */}
                  <div className="space-y-8">
                    {/* Avatar and Basic Info */}
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Avatar Section */}
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <Avatar className="h-32 w-32 border-4 border-primary/10">
                            {formData.avatar ? (
                              <AvatarImage src={formData.avatar} alt={user.name} />
                            ) : null}
                            <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-semibold">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          {isEditing && (
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                              aria-label="Change avatar"
                            >
                              <Camera className="h-5 w-5" />
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
                          <p className="text-xs text-muted-foreground text-center mt-2">
                            Click camera icon to change
                          </p>
                        )}
                      </div>

                      {/* Name and Role */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-foreground mb-1">{user.name}</h3>
                        <p className="text-muted-foreground capitalize mb-6">{user.role === "user" ? "Customer" : "Service Provider"}</p>

                        {/* Contact Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          {/* Full Name */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-primary text-lg">👤</span>
                              <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                            </div>
                            {isEditing ? (
                              <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Enter your full name"
                                className="border-border"
                              />
                            ) : (
                              <p className="text-foreground font-semibold">{user.name}</p>
                            )}
                          </div>

                          {/* Phone */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Phone className="h-5 w-5 text-primary" />
                              <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                            </div>
                            {isEditing ? (
                              <Input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="+1 234 567 8900"
                                className="border-border"
                              />
                            ) : (
                              <p className="text-foreground font-semibold">{user.phone}</p>
                            )}
                          </div>

                          {/* Email */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Mail className="h-5 w-5 text-primary" />
                              <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                            </div>
                            <p className="text-foreground font-semibold">{user.email}</p>
                          </div>

                          {/* Address */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-5 w-5 text-primary" />
                              <p className="text-sm font-medium text-muted-foreground">Address</p>
                            </div>
                            {isEditing ? (
                              <Input
                                value={formData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                placeholder="Enter your address"
                                className="border-border"
                              />
                            ) : (
                              <p className="text-foreground font-semibold">
                                {formData.address || "Not provided"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bio Section */}
                    {isEditing && (
                      <div className="pt-6 border-t border-border">
                        <Label htmlFor="bio" className="text-base font-semibold mb-3 block">About You</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          placeholder="Tell us about yourself..."
                          rows={4}
                          className="resize-none border-border"
                        />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-6 border-t border-border flex gap-4">
                      {isEditing ? (
                        <>
                          <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-primary hover:bg-primary/90 text-white flex-1"
                          >
                            {isSaving ? "Saving..." : "Save Changes"}
                          </Button>
                          <Button
                            onClick={handleEditToggle}
                            disabled={isSaving}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={handleLogout}
                          variant="destructive"
                          className="w-full gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {activeMenu === "my-services" && (
                <Card className="bg-white border border-border p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-foreground mb-4">My Services</h2>
                  <p className="text-muted-foreground">Coming soon...</p>
                </Card>
              )}

              {activeMenu === "my-offers" && (
                <Card className="bg-white border border-border p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-foreground mb-4">My Offers</h2>
                  <p className="text-muted-foreground">Coming soon...</p>
                </Card>
              )}

              {activeMenu === "my-wishlist" && (
                <Card className="bg-white border border-border p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-foreground mb-4">My WishList</h2>
                  <p className="text-muted-foreground">Coming soon...</p>
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
