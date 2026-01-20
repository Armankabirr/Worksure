import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  X,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  CreditCard,
  Star,
  User as UserIcon,
  FileText,
  ClipboardList,
  MessageSquare,
  Activity,
  CheckCircle,
  XCircle,
  DollarSign,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { log } from 'console';

/**
 * WorkerDetails type definition (based on API response)
 */
interface WorkerDetails {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string | null;
  nid: string | null;
  profilePicture: string | null;
  role: string;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  workerProfile: {
    displayName: string;
    bio: string;
    yearsExperience: number;
    avgRating: number;
    totalReviews: number;
    verification: 'verified' | 'pending' | 'rejected' | 'unverified';
    documentsCount: number;
    profileCreatedAt: string;
    profileUpdatedAt: string;
  } | null;
  addresses: Array<{
    id: string;
    street: string;
    city: string;
    district: string;
    postal_code: string;
    lat: number;
    lon: number;
  }>;
  services: Array<{
    id: string;
    basePrice: number;
    priceUnit: string;
    skills: string[];
    category: string;
    categorySlug: string;
    categoryDescription: string;
    createdAt: string;
  }>;
  availabilities: Array<any>;
  verificationDocuments: Array<{
    id: string;
    document_type: string;
    document_url: string;
    verification_status: 'verified' | 'pending' | 'rejected';
    uploaded_at: string;
  }>;
  recentReviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: {
      name: string;
      avatar: string | null;
    };
  }>;
  statistics: {
    totalHirings: number;
    totalPayments: number;
    totalReviews: number;
  };
}

interface WorkerDetailsDialogProps {
  workerId: string | null;
  open: boolean;
  onClose: () => void;
}

/**
 * WorkerDetailsDialog Component
 * 
 * Displays detailed information about a worker with tabs:
 * - Profile: Personal info, verification, stats
 * - Services & Pricing: List of services, pricing, skills
 * - Documents: Verification documents
 * - Addresses: Service locations
 * - Bookings: Booking history
 * - Reviews: Customer reviews
 * - Activity Log: Recent activity
 */
const WorkerDetailsDialog = ({ workerId, open, onClose }: WorkerDetailsDialogProps) => {
  const axiosPublic = useAxiosPublic();
  const [activeTab, setActiveTab] = useState('profile');

  // Fetch worker details from API
  const { data: workerDetails, isLoading, error } = useQuery<WorkerDetails>({
    queryKey: ['worker-details', workerId],
    queryFn: async () => {
      if (!workerId) throw new Error('Worker ID is required');
      const response = await axiosPublic.get(`/workerRoutes/adminGetWorkerData/${workerId}`);
      console.log(response.data);
      return response.data;
    },
    enabled: !!workerId && open,
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

  /**
   * Get verification badge
   */
  const getVerificationBadge = (verification: string) => {
    const badges = {
      verified: (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      ),
      pending: (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Activity className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      ),
      rejected: (
        <Badge className="bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      ),
      unverified: (
        <Badge className="bg-gray-100 text-gray-800">
          Unverified
        </Badge>
      ),
    };
    return badges[verification as keyof typeof badges] || badges.unverified;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Worker Details</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load worker details</p>
            <p className="text-sm text-gray-500 mt-2">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
        )}

        {workerDetails && (
          <div className="space-y-6">
            {/* Worker Header */}
            <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <Avatar className="w-24 h-24">
                <AvatarImage src={workerDetails.profilePicture || undefined} alt={workerDetails.fullName} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                  {getUserInitials(workerDetails.fullName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {workerDetails.workerProfile?.displayName || workerDetails.fullName}
                  </h3>
                  {workerDetails.workerProfile && getVerificationBadge(workerDetails.workerProfile.verification)}
                  <Badge className={workerDetails.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}>
                    {workerDetails.status === 'active' ? 'Active' : 'Suspended'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{workerDetails.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{workerDetails.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{workerDetails.workerProfile?.yearsExperience || 0} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {workerDetails.workerProfile?.avgRating.toFixed(1) || '0.0'} ({workerDetails.workerProfile?.totalReviews || 0} reviews)
                    </span>
                  </div>
                </div>

                {workerDetails.workerProfile?.bio && (
                  <p className="text-gray-600 text-sm">{workerDetails.workerProfile.bio}</p>
                )}
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <ClipboardList className="w-4 h-4" />
                  <span className="text-sm font-medium">Total Hirings</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {workerDetails.statistics.totalHirings}
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">Payments</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {workerDetails.statistics.totalPayments}
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-600 mb-1">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Reviews</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {workerDetails.statistics.totalReviews}
                </p>
              </div>
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900">{workerDetails.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Display Name</label>
                      <p className="text-gray-900">{workerDetails.workerProfile?.displayName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-gray-900 capitalize">{workerDetails.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-gray-900">
                        {workerDetails.dateOfBirth
                          ? new Date(workerDetails.dateOfBirth).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">NID</label>
                      <p className="text-gray-900">{workerDetails.nid || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Worker ID</label>
                      <p className="text-gray-900 font-mono text-sm">{workerDetails.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Hirings</label>
                      <p className="text-gray-900">{workerDetails.statistics.totalHirings}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Role</label>
                      <p className="text-gray-900 capitalize">{workerDetails.role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Joined</label>
                      <p className="text-gray-900">
                        {new Date(workerDetails.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Login</label>
                      <p className="text-gray-900">
                        {workerDetails.lastLoginAt
                          ? new Date(workerDetails.lastLoginAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Services & Pricing ({workerDetails.services.length})
                  </h4>
                  <Button size="sm">Add Service</Button>
                </div>
                
                <div className="space-y-3">
                  {workerDetails.services.map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-gray-900">{service.category}</h5>
                            <Badge variant="outline">{service.categorySlug}</Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">৳{service.basePrice}</span>
                            <span>/ {service.priceUnit}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Edit Price</Button>
                      </div>
                      
                      {service.skills && service.skills.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 mb-2 block">Skills</label>
                          <div className="flex flex-wrap gap-2">
                            {service.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {service.categoryDescription && (
                        <p className="text-sm text-gray-600 mt-2">{service.categoryDescription}</p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Documents ({workerDetails.verificationDocuments.length})
                  </h4>
                </div>
                
                <div className="space-y-3">
                  {workerDetails.verificationDocuments.map((doc) => (
                    <div key={doc.id} className="p-4 border rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.document_type}</p>
                          <p className="text-sm text-gray-500">
                            Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.verification_status === 'verified' ? (
                          <Badge className="bg-green-100 text-green-800">Verified</Badge>
                        ) : doc.verification_status === 'pending' ? (
                          <>
                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                            <Button size="sm" variant="outline">Preview</Button>
                            <Button size="sm">Approve</Button>
                            <Button size="sm" variant="destructive">Reject</Button>
                          </>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Service Addresses ({workerDetails.addresses.length})
                </h4>
                
                {workerDetails.addresses.length > 0 ? (
                  <div className="space-y-3">
                    {workerDetails.addresses.map((address, index) => (
                      <div key={address.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-gray-600" />
                              <p className="font-medium text-gray-900">Address {index + 1}</p>
                            </div>
                            <p className="text-sm text-gray-600">
                              {address.street}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.district} {address.postal_code}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Coordinates: {address.lat.toFixed(4)}, {address.lon.toFixed(4)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No addresses added</p>
                  </div>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Customer Reviews ({workerDetails.recentReviews.length})
                </h4>
                
                {workerDetails.recentReviews.length > 0 ? (
                  <div className="space-y-4">
                    {workerDetails.recentReviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3 mb-2">
                          <Avatar>
                            <AvatarImage src={review.reviewer.avatar || undefined} alt={review.reviewer.name} />
                            <AvatarFallback className="bg-gray-100 text-gray-700">
                              {getUserInitials(review.reviewer.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-gray-900">{review.reviewer.name}</p>
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-1">{review.rating}/5</span>
                            </div>
                            {review.comment && (
                              <p className="text-sm text-gray-600">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No reviews yet</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkerDetailsDialog;
