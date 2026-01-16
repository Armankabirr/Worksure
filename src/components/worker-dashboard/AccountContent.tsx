import { useRef, type ChangeEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Edit, User, Star, ClipboardList, Bell, Lock } from "lucide-react";
import { ProfileFormData } from "@/types/workerDashboard";

interface AccountContentProps {
  user: { name?: string; email?: string; phone?: string; avatar?: string } | null;
  savedProfile: ProfileFormData;
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEditProfile: () => void;
  onChangePassword: () => void;
}

export const AccountContent = ({
  user,
  savedProfile,
  onAvatarChange,
  onEditProfile,
  onChangePassword,
}: AccountContentProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-orange-500 mb-6">Account Information</h2>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onAvatarChange}
      />

      {/* Profile Header Card */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden">
              {savedProfile.avatarUrl ? (
                <img
                  src={savedProfile.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "W"
              )}
            </div>
            <button
              onClick={handleAvatarButtonClick}
              className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-colors"
            >
              <Camera className="h-5 w-5" />
            </button>
          </div>

          {/* Profile Summary */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {savedProfile.name || user?.name || "Worker Name"}
            </h3>
            <p className="text-gray-600 mb-2">{user?.email || "email@example.com"}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                {savedProfile.speciality || "Professional Worker"}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center">
                <Star className="h-3 w-3 mr-1 fill-green-700" />
                0.0 Rating
              </span>
            </div>
            <div className="flex gap-3 justify-center md:justify-start">
              <Button
                onClick={onEditProfile}
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-500">Services</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">৳0</p>
              <p className="text-xs text-gray-500">Earned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-500">Reviews</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <User className="h-5 w-5 mr-2 text-orange-500" />
              Personal Information
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              <p className="text-base text-gray-900 mt-1">
                {savedProfile.name || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email Address</label>
              <p className="text-base text-gray-900 mt-1">
                {user?.email || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone Number</label>
              <p className="text-base text-gray-900 mt-1">
                {savedProfile.phone || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">NID Number</label>
              <p className="text-base text-gray-900 mt-1">
                {savedProfile.nidNumber || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="text-base text-gray-900 mt-1">
                {savedProfile.address || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date of Birth</label>
              <p className="text-base text-gray-900 mt-1">
                {savedProfile.dateOfBirth || "Not provided"}
              </p>
            </div>
          </div>
        </Card>

        {/* Professional Information */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Star className="h-5 w-5 mr-2 text-orange-500" />
              Professional Information
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Work Speciality</label>
              <p className="text-base text-gray-900 mt-1">
                {savedProfile.speciality || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Work Experience</label>
              <p className="text-base text-gray-900 mt-1">
                {savedProfile.experience || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Certification</label>
              <p className="text-base text-gray-900 mt-1">
                {savedProfile.certification || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Service Areas</label>
              <p className="text-base text-gray-900 mt-1">
                {savedProfile.serviceAreas || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Hourly Rate</label>
              <p className="text-base text-gray-900 mt-1">
                {savedProfile.hourlyRate ? `৳${savedProfile.hourlyRate}` : "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Availability</label>
              <p className="text-base text-gray-900 mt-1">
                {savedProfile.availability || "Not provided"}
              </p>
            </div>
          </div>
        </Card>

        {/* Account Statistics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <ClipboardList className="h-5 w-5 mr-2 text-orange-500" />
            Account Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">
                Total Services Completed
              </span>
              <span className="text-lg font-semibold text-gray-900">0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Total Earnings</span>
              <span className="text-lg font-semibold text-green-600">৳ 0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Average Rating</span>
              <span className="text-lg font-semibold text-gray-900 flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                0.0
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Pending Services</span>
              <span className="text-lg font-semibold text-orange-600">0</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-500">Member Since</span>
              <span className="text-lg font-semibold text-gray-900">2025</span>
            </div>
          </div>
        </Card>

        {/* Account Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-orange-500" />
            Account Settings
          </h3>
          <div className="space-y-3">
            <Button
              onClick={onEditProfile}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white justify-start"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update Profile Information
            </Button>
            <Button
              onClick={handleAvatarButtonClick}
              className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
            >
              <Camera className="h-4 w-4 mr-2" />
              Change Profile Picture
            </Button>
            <Button
              onClick={onChangePassword}
              className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Notification Settings
            </Button>
            <Button className="w-full bg-white border border-red-300 text-red-600 hover:bg-red-50 justify-start mt-4">
              Deactivate Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountContent;
