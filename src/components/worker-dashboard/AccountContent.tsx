import { useRef, type ChangeEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Edit,
  User,
  Star,
  ClipboardList,
  Bell,
  Lock,
  Loader2,
  MapPin,
  Clock,
  Calendar,
  Briefcase,
  BadgeCheck,
  FileText,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import {
  ProfileFormData,
  WorkerDetailsData,
} from "@/types/workerDashboard";

interface AccountContentProps {
  user: { name?: string; email?: string; phone?: string; avatar?: string } | null;
  savedProfile: ProfileFormData;
  workerDetails: WorkerDetailsData | null;
  workerDetailsLoading: boolean;
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEditProfile: () => void;
  onChangePassword: () => void;
}

export const AccountContent = ({
  user,
  savedProfile,
  workerDetails,
  workerDetailsLoading,
  onAvatarChange,
  onEditProfile,
  onChangePassword,
}: AccountContentProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Get worker profile data
  const workerProfile = workerDetails?.worker_profiles?.[0];
  const workerServices = workerDetails?.worker_services || [];
  const availability = workerDetails?.availabilities?.[0];
  const address = workerDetails?.addresses?.[0];
  const reviews = workerDetails?.reviews_reviews_worker_idTousers || [];

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time helper
  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (workerDetailsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-gray-600">Loading account details...</span>
      </div>
    );
  }

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
              {workerDetails?.profile_picture || savedProfile.avatarUrl ? (
                <img
                  src={workerDetails?.profile_picture || savedProfile.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                (workerDetails?.full_name || user?.name)?.charAt(0).toUpperCase() || "W"
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
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {workerProfile?.display_name || workerDetails?.full_name || savedProfile.name || user?.name || "Worker Name"}
              </h3>
              {workerProfile?.verification === "verified" && (
                <BadgeCheck className="h-6 w-6 text-blue-500" />
              )}
            </div>
            <p className="text-gray-600 mb-2">{workerDetails?.email || user?.email || "email@example.com"}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              {workerServices.length > 0 && workerServices[0].service_categories && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  {workerServices[0].service_categories.name}
                </span>
              )}
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center">
                <Star className="h-3 w-3 mr-1 fill-green-700" />
                {workerProfile?.avg_rating?.toFixed(1) || "0.0"} Rating
              </span>
              {workerProfile?.years_experience && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {workerProfile.years_experience} years exp
                </span>
              )}
            </div>
            {workerProfile?.bio && (
              <p className="text-gray-600 text-sm mb-4 max-w-lg">{workerProfile.bio}</p>
            )}
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
              <p className="text-2xl font-bold text-gray-900">{workerServices.length}</p>
              <p className="text-xs text-gray-500">Services</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">৳0</p>
              <p className="text-xs text-gray-500">Earned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{workerProfile?.total_reviews || 0}</p>
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
                {workerDetails?.full_name || savedProfile.name || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="h-4 w-4 mr-1" /> Email Address
              </label>
              <p className="text-base text-gray-900 mt-1">
                {workerDetails?.email || user?.email || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center">
                <Phone className="h-4 w-4 mr-1" /> Phone Number
              </label>
              <p className="text-base text-gray-900 mt-1">
                {workerDetails?.phone || savedProfile.phone || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-base text-gray-900 mt-1 capitalize">
                {workerDetails?.gender || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> Date of Birth
              </label>
              <p className="text-base text-gray-900 mt-1">
                {workerDetails?.date_of_birth
                  ? formatDate(workerDetails.date_of_birth)
                  : savedProfile.dateOfBirth || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Account Status</label>
              <p className="text-base mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workerDetails?.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {workerDetails?.status}
                </span>
              </p>
            </div>
          </div>
        </Card>

        {/* Professional Information */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-orange-500" />
              Professional Information
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Display Name</label>
              <p className="text-base text-gray-900 mt-1">
                {workerProfile?.display_name || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Work Experience</label>
              <p className="text-base text-gray-900 mt-1">
                {workerProfile?.years_experience
                  ? `${workerProfile.years_experience} years`
                  : savedProfile.experience || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Verification Status</label>
              <p className="text-base mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workerProfile?.verification === "verified"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {workerProfile?.verification || "Pending"}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center">
                <FileText className="h-4 w-4 mr-1" /> Documents Submitted
              </label>
              <p className="text-base text-gray-900 mt-1">
                {workerProfile?.documents_count || 0} document(s)
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Average Rating</label>
              <p className="text-base text-gray-900 mt-1 flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                {workerProfile?.avg_rating?.toFixed(1) || "0.0"} ({workerProfile?.total_reviews || 0} reviews)
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Bio</label>
              <p className="text-base text-gray-900 mt-1">
                {workerProfile?.bio || "Not provided"}
              </p>
            </div>
          </div>
        </Card>

        {/* Services Offered */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <ClipboardList className="h-5 w-5 mr-2 text-orange-500" />
              Services Offered
            </h3>
          </div>
          {workerServices.length === 0 ? (
            <p className="text-gray-500 text-sm">No services added yet</p>
          ) : (
            <div className="space-y-4">
              {workerServices.map((service) => (
                <div
                  key={service.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {service.service_categories?.name || "Service"}
                    </h4>
                    <span className="text-orange-600 font-semibold">
                      ৳{service.base_price || 0}/{service.price_unit || "hour"}
                    </span>
                  </div>
                  {service.service_sections && (
                    <p className="text-sm text-gray-600 mb-2">
                      Section: {service.service_sections.name}
                    </p>
                  )}
                  {service.skills && service.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {service.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Availability & Address */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-orange-500" />
              Availability & Location
            </h3>
          </div>
          <div className="space-y-4">
            {/* Availability */}
            <div>
              <label className="text-sm font-medium text-gray-500">Working Hours</label>
              {availability ? (
                <p className="text-base text-gray-900 mt-1">
                  {formatTime(availability.available_from)} - {formatTime(availability.available_to)}
                </p>
              ) : (
                <p className="text-base text-gray-900 mt-1">
                  {savedProfile.availability || "Not provided"}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Weekend Availability</label>
              <p className="text-base mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    availability?.weekend
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {availability?.weekend ? "Available on weekends" : "Weekdays only"}
                </span>
              </p>
            </div>

            {/* Address */}
            <div className="pt-4 border-t border-gray-100">
              <label className="text-sm font-medium text-gray-500 flex items-center">
                <MapPin className="h-4 w-4 mr-1" /> Address
              </label>
              {address ? (
                <div className="mt-2 space-y-1">
                  {address.street && (
                    <p className="text-base text-gray-900">{address.street}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {[address.city, address.district, address.postal_code]
                      .filter(Boolean)
                      .join(", ") || "Not provided"}
                  </p>
                </div>
              ) : (
                <p className="text-base text-gray-900 mt-1">
                  {savedProfile.address || "Not provided"}
                </p>
              )}
            </div>

            {/* Service Areas */}
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center">
                <Globe className="h-4 w-4 mr-1" /> Service Areas
              </label>
              <p className="text-base text-gray-900 mt-1">
                {address?.district || savedProfile.serviceAreas || "Not provided"}
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
                Total Services Offered
              </span>
              <span className="text-lg font-semibold text-gray-900">{workerServices.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Total Reviews</span>
              <span className="text-lg font-semibold text-gray-900">
                {workerProfile?.total_reviews || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Average Rating</span>
              <span className="text-lg font-semibold text-gray-900 flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                {workerProfile?.avg_rating?.toFixed(1) || "0.0"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Member Since</span>
              <span className="text-lg font-semibold text-gray-900">
                {workerDetails?.created_at
                  ? new Date(workerDetails.created_at).getFullYear()
                  : "2025"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-500">Last Login</span>
              <span className="text-sm font-semibold text-gray-900">
                {workerDetails?.last_login_at
                  ? formatDate(workerDetails.last_login_at)
                  : "N/A"}
              </span>
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

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-orange-500" />
            Recent Reviews ({reviews.length})
          </h3>
          <div className="space-y-4">
            {reviews.slice(0, 5).map((review) => (
              <div
                key={review.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                    {review.users_reviews_reviewer_idTousers?.profile_picture ? (
                      <img
                        src={review.users_reviews_reviewer_idTousers.profile_picture}
                        alt="Reviewer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-orange-200 flex items-center justify-center text-orange-700 font-medium">
                        {review.users_reviews_reviewer_idTousers?.full_name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {review.users_reviews_reviewer_idTousers?.full_name || "Anonymous"}
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (review.rating || 0)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment || "No comment"}</p>
                    <p className="text-gray-400 text-xs mt-2">
                      {review.created_at ? formatDate(review.created_at) : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AccountContent;
