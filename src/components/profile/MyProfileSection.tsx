import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Camera, 
  Phone, 
  Mail, 
  MapPin, 
  Save,
  X,
  Settings
} from "lucide-react";
import { UserData, Address, ProfileFormData } from "@/types/profile";

interface MyProfileSectionProps {
  userData: UserData | null;
  formData: ProfileFormData;
  isEditing: boolean;
  isEditingAddresses: boolean;
  isSaving: boolean;
  editingAddresses: Address[];
  userEmail: string;
  onEditToggle: () => void;
  onAddressEditToggle: () => void;
  onInputChange: (field: keyof ProfileFormData, value: string) => void;
  onAddressChange: (idx: number, field: keyof Address, value: string) => void;
  onSave: () => void;
  onSaveAddresses: () => void;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

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

const MyProfileSection = ({
  userData,
  formData,
  isEditing,
  isEditingAddresses,
  isSaving,
  editingAddresses,
  userEmail,
  onEditToggle,
  onAddressEditToggle,
  onInputChange,
  onAddressChange,
  onSave,
  onSaveAddresses,
  onAvatarChange,
}: MyProfileSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Safety check - should not happen but handle gracefully
  if (!userData) {
    return (
      <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden p-6">
        <p className="text-muted-foreground text-center">Profile data not available</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-slate-200 shadow-lg rounded-xl overflow-hidden">
      {/* Profile Header with Background */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-5 border-b border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-0.5">My Profile</h2>
            <p className="text-xs text-muted-foreground">Update and manage your personal information</p>
          </div>
          {!isEditing && (
            <Button
              onClick={onEditToggle}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium"
            >
              <Settings className="h-3 w-3 mr-1.5" />
              Edit Profile
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
                  {(userData.full_name && typeof userData.full_name === "string" && userData.full_name.trim())
                    ? userData.full_name.split(" ").filter((n) => n.length > 0).map((n) => n[0] || "").join("").toUpperCase().slice(0, 2) || "U"
                    : (formData.name && formData.name.trim())
                    ? formData.name.split(" ").filter((n) => n.length > 0).map((n) => n[0] || "").join("").toUpperCase().slice(0, 2) || "U"
                    : "U"}
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
              onChange={onAvatarChange}
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
            <h3 className="text-xl font-bold text-foreground mb-1">
              {userData.full_name || formData.name || "User"}
            </h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-xs text-muted-foreground capitalize font-medium">
                {userData.status || "active"}
              </p>
            </div>

            {/* Contact Information - Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200 hover:border-primary/30 transition-colors duration-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Settings className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Name</p>
                </div>
                {isEditing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => onInputChange("name", e.target.value)}
                    placeholder="Full name"
                    className="border-slate-300 bg-white text-sm h-8 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                ) : (
                  <p className="text-foreground font-semibold text-sm">
                    {userData.full_name || formData.name || "Not provided"}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200 hover:border-primary/30 transition-colors duration-200 shadow-sm">
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
                    onChange={(e) => onInputChange("phone", e.target.value)}
                    placeholder="Phone number"
                    className="border-slate-300 bg-white text-sm h-8 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                ) : (
                  <p className="text-foreground font-semibold text-sm">
                    {userData.phone || formData.phone || "Not provided"}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200 hover:border-primary/30 transition-colors duration-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Mail className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Email</p>
                </div>
                <p className="text-foreground font-semibold text-sm">
                  {userEmail || userData.email || "Loading..."}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Read-only</p>
              </div>

              {/* Gender */}
              <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200 hover:border-primary/30 transition-colors duration-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Settings className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Gender</p>
                </div>
                {isEditing ? (
                  <Select
                    value={formData.gender || ""}
                    onValueChange={(value) => onInputChange("gender", value)}
                  >
                    <SelectTrigger className="border-slate-300 bg-white text-sm h-8 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Rather not to say">Rather not to say</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-foreground font-semibold text-sm">
                    {userData.gender || formData.gender || <span className="text-muted-foreground">Not provided</span>}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200 hover:border-primary/30 transition-colors duration-200 shadow-sm">
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
                    onChange={(e) => onInputChange("date_of_birth", e.target.value)}
                    className="border-slate-300 bg-white text-sm h-8 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                ) : (
                  <p className="text-foreground font-semibold text-sm">
                    {userData.date_of_birth ? formatDate(userData.date_of_birth) : <span className="text-muted-foreground">Not provided</span>}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200 hover:border-primary/30 transition-colors duration-200 shadow-sm sm:col-span-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <MapPin className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Primary Address</p>
                </div>
                {isEditing ? (
                  <Input
                    value={formData.address}
                    onChange={(e) => onInputChange("address", e.target.value)}
                    placeholder="Address"
                    className="border-slate-300 bg-white text-sm h-8 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                onChange={(e) => onInputChange("bio", e.target.value)}
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
              onChange={(e) => onInputChange("bio", e.target.value)}
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
                  onClick={onAddressEditToggle}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium"
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
                        value={editingAddresses[idx]?.street || ""}
                        onChange={(e) => onAddressChange(idx, "street", e.target.value)}
                        className="border-slate-300 bg-white text-sm h-8"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="City"
                          value={editingAddresses[idx]?.city || ""}
                          onChange={(e) => onAddressChange(idx, "city", e.target.value)}
                          className="border-slate-300 bg-white text-sm h-8"
                        />
                        <Input
                          placeholder="District"
                          value={editingAddresses[idx]?.district || ""}
                          onChange={(e) => onAddressChange(idx, "district", e.target.value)}
                          className="border-slate-300 bg-white text-sm h-8"
                        />
                      </div>
                      <Input
                        placeholder="Postal Code"
                        value={editingAddresses[idx]?.postal_code || ""}
                        onChange={(e) => onAddressChange(idx, "postal_code", e.target.value)}
                        className="border-slate-300 bg-white text-sm h-8"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Latitude"
                          value={editingAddresses[idx]?.lat || ""}
                          onChange={(e) => onAddressChange(idx, "lat", e.target.value)}
                          className="border-slate-300 bg-white text-sm h-8"
                        />
                        <Input
                          placeholder="Longitude"
                          value={editingAddresses[idx]?.lon || ""}
                          onChange={(e) => onAddressChange(idx, "lon", e.target.value)}
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
                        <p className="text-sm font-semibold text-foreground">{addr.street}</p>
                        <p className="text-xs text-muted-foreground">
                          {addr.city}, {addr.district} {addr.postal_code}
                        </p>
                        {addr.lat && addr.lon && (
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            Coordinates: {addr.lat}, {addr.lon}
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
                  onClick={onAddressEditToggle}
                  disabled={isSaving}
                  variant="outline"
                  size="sm"
                  className="border-slate-300 gap-1.5 text-sm hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium"
                >
                  <X className="h-3 w-3" />
                  Cancel
                </Button>
                <Button
                  onClick={onSaveAddresses}
                  disabled={isSaving}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white gap-1.5 shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-3 w-3" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-2">
          {isEditing ? (
            <>
              <Button
                onClick={onEditToggle}
                disabled={isSaving}
                variant="outline"
                size="sm"
                className="border-slate-300 gap-1.5 text-sm hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium"
              >
                <X className="h-3 w-3" />
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Save button clicked", { isSaving, onSave: typeof onSave });
                  if (!isSaving && onSave) {
                    onSave();
                  }
                }}
                disabled={isSaving}
                size="sm"
                type="button"
                className="bg-primary hover:bg-primary/90 text-white gap-1.5 shadow-md hover:shadow-lg transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-3 w-3" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </Card>
  );
};

export default MyProfileSection;
