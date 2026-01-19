import { useQuery } from '@tanstack/react-query';
import { X, Mail, Phone, Calendar, MapPin, Briefcase, CreditCard, Star, User as UserIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useAxiosPublic from '@/hooks/useAxiosPublic';

/**
 * UserDetails type definition (based on API response)
 */
interface UserDetails {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string | null;
  nid: string | null;
  profilePicture: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  addresses: any[];
  workerProfile: any | null;
  statistics: {
    totalBookingsAsClient: number;
    totalBookingsAsWorker: number;
    totalPayments: number;
    totalReviews: number;
  };
}

interface UserDetailsDialogProps {
  userId: string | null;
  open: boolean;
  onClose: () => void;
}

/**
 * UserDetailsDialog Component
 * 
 * Displays detailed information about a user including:
 * - Personal information
 * - Contact details
 * - Addresses
 * - Statistics (bookings, payments, reviews)
 * - Worker profile (if applicable)
 */
const UserDetailsDialog = ({ userId, open, onClose }: UserDetailsDialogProps) => {
  const axiosPublic = useAxiosPublic();

  // Fetch user details
  const { data: userDetails, isLoading, error } = useQuery<UserDetails>({
    queryKey: ['user-details', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      const response = await axiosPublic.get(`/userRoutes/adminGetUserData/${userId}`);
      return response.data;
    },
    enabled: !!userId && open,
  });

  /**
   * Get user initials for avatar fallback
   */
  const getUserInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'NA';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">User Details</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load user details</p>
            <p className="text-sm text-gray-500 mt-2">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
        )}

        {userDetails && (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userDetails.profilePicture || undefined} alt={userDetails.fullName} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                  {getUserInitials(userDetails.fullName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">{userDetails.fullName}</h3>
                  <Badge className={userDetails.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                    {userDetails.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {userDetails.role}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{userDetails.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{userDetails.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined {new Date(userDetails.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {userDetails.lastLoginAt && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Last login: {new Date(userDetails.lastLoginAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm font-medium">Client Bookings</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {userDetails.statistics.totalBookingsAsClient}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm font-medium">Worker Jobs</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {userDetails.statistics.totalBookingsAsWorker}
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm font-medium">Payments</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {userDetails.statistics.totalPayments}
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-600 mb-1">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Reviews</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {userDetails.statistics.totalReviews}
                </p>
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-gray-900 capitalize">{userDetails.gender || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="text-gray-900">
                    {userDetails.dateOfBirth
                      ? new Date(userDetails.dateOfBirth).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">NID</label>
                  <p className="text-gray-900">{userDetails.nid || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-gray-900 font-mono text-sm">{userDetails.id}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Addresses */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Addresses ({userDetails.addresses?.length || 0})
              </h4>
              {userDetails.addresses && userDetails.addresses.length > 0 ? (
                <div className="space-y-3">
                  {userDetails.addresses.map((address: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{address.label || `Address ${index + 1}`}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {address.address_line1}
                            {address.address_line2 && `, ${address.address_line2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city && `${address.city}, `}
                            {address.state && `${address.state}, `}
                            {address.postal_code}
                          </p>
                          {address.country && (
                            <p className="text-sm text-gray-600">{address.country}</p>
                          )}
                        </div>
                        {address.is_default && (
                          <Badge variant="outline" className="text-xs">Default</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No addresses added</p>
              )}
            </div>

            {/* Worker Profile */}
            {userDetails.workerProfile && (
              <>
                <Separator />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Worker Profile
                  </h4>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Service Type</label>
                        <p className="text-gray-900 capitalize">
                          {userDetails.workerProfile.service_type || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Experience</label>
                        <p className="text-gray-900">
                          {userDetails.workerProfile.experience_years 
                            ? `${userDetails.workerProfile.experience_years} years`
                            : 'Not specified'}
                        </p>
                      </div>
                      {userDetails.workerProfile.hourly_rate && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Hourly Rate</label>
                          <p className="text-gray-900">${userDetails.workerProfile.hourly_rate}/hr</p>
                        </div>
                      )}
                      {userDetails.workerProfile.bio && (
                        <div className="col-span-2">
                          <label className="text-sm font-medium text-gray-500">Bio</label>
                          <p className="text-gray-900 text-sm">{userDetails.workerProfile.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Account Details */}
            <Separator />
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created At</label>
                  <p className="text-gray-900">
                    {new Date(userDetails.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900">
                    {new Date(userDetails.updatedAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
