import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Edit2, Save, X, LogOut, User, Camera } from "lucide-react";
import Header from "@/components/Header";

/**
 * Profile page component with edit functionality.
 * Displays user information and allows editing name, bio, phone, and avatar.
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

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    avatar: "",
  });

  // Initialize form data when user loads or changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
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
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-100 to-slate-200">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 pt-24">
          <Card className="w-full max-w-md p-8 text-center">
            <p className="text-muted-foreground">Loading profile...</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 flex flex-col">
      <Header />
      <div className="container mx-auto max-w-2xl px-4 py-10 pt-24 flex-1">
        <Card className="p-6 md:p-8 shadow-lg border border-border bg-card">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
            {!isEditing && (
              <Button
                onClick={handleEditToggle}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-800 text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/40 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Profile Content */}
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary/20">
                  {formData.avatar ? (
                    <AvatarImage src={formData.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl md:text-3xl font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
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
                <p className="text-xs text-muted-foreground text-center">
                  Click the camera icon to change your profile picture
                </p>
              )}
            </div>

            {/* User Information */}
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className={error && !formData.name.trim() ? "border-destructive" : ""}
                  />
                ) : (
                  <p className="text-foreground font-medium">{user.name}</p>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground italic">
                  Email cannot be changed
                </p>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 234 567 8900"
                    className={error && !formData.phone.trim() ? "border-destructive" : ""}
                  />
                ) : (
                  <p className="text-foreground font-medium">{user.phone}</p>
                )}
              </div>

              {/* Role Field (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <p className="text-foreground font-medium capitalize">{user.role}</p>
              </div>

              {/* Bio Field */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="resize-none"
                  />
                ) : (
                  <p className="text-foreground whitespace-pre-wrap">
                    {user.bio || (
                      <span className="text-muted-foreground italic">
                        No bio added yet.
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={handleEditToggle}
                  variant="outline"
                  disabled={isSaving}
                  className="flex-1 gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
