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

/**
 * WorkerDetails type definition (for detailed worker data)
 */
interface WorkerDetails {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  profile_picture: string | null;
  status: 'active' | 'suspended';
  created_at: string;
  last_login_at: string | null;
  worker_profile: {
    display_name: string;
    bio: string;
    verification: 'verified' | 'pending' | 'rejected' | 'unverified';
    years_experience: number;
    avg_rating: number;
    total_reviews: number;
    total_hirings: number;
  };
  services: Array<{
    id: string;
    category: string;
    section: string;
    base_price: number;
    price_unit: string;
    skills: string[];
    is_active: boolean;
  }>;
  documents: Array<{
    id: string;
    type: string;
    status: 'verified' | 'pending' | 'rejected';
    uploaded_at: string;
  }>;
  addresses: Array<{
    id: string;
    label: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    postal_code: string;
    is_default: boolean;
  }>;
  statistics: {
    total_bookings: number;
    completed_bookings: number;
    cancelled_bookings: number;
    total_earnings: number;
    total_reviews: number;
    avg_rating: number;
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

  // Mock fetch - Replace with real API endpoint
  const { data: workerDetails, isLoading, error } = useQuery<WorkerDetails>({
    queryKey: ['worker-details', workerId],
    queryFn: async () => {
      if (!workerId) throw new Error('Worker ID is required');
      // TODO: Replace with actual API endpoint
      // const response = await axiosPublic.get(`/workerRoutes/workers/${workerId}`);
      // return response.data;
      
      // Mock data for now
      return {
        id: workerId,
        full_name: 'Rahim Uddin',
        email: 'rahim@example.com',
        phone: '+880 1712-345678',
        profile_picture: null,
        status: 'active',
        created_at: '2024-01-15T10:30:00Z',
        last_login_at: '2026-01-19T14:20:00Z',
        worker_profile: {
          display_name: 'Rahim Electrician',
          bio: 'Professional electrician with 10 years of experience',
          verification: 'verified',
          years_experience: 10,
          avg_rating: 4.7,
          total_reviews: 120,
          total_hirings: 250,
        },
        services: [
          {
            id: '1',
            category: 'Electrical',
            section: 'Installation',
            base_price: 500,
            price_unit: 'per service',
            skills: ['Wiring', 'Circuit Installation', 'Panel Upgrade'],
            is_active: true,
          },
          {
            id: '2',
            category: 'Electrical',
            section: 'Repair',
            base_price: 300,
            price_unit: 'per hour',
            skills: ['Troubleshooting', 'Emergency Repair'],
            is_active: true,
          },
        ],
        documents: [
          {
            id: '1',
            type: 'NID',
            status: 'verified',
            uploaded_at: '2024-01-16T10:00:00Z',
          },
          {
            id: '2',
            type: 'Trade License',
            status: 'verified',
            uploaded_at: '2024-01-16T10:00:00Z',
          },
          {
            id: '3',
            type: 'Certificate',
            status: 'pending',
            uploaded_at: '2026-01-18T10:00:00Z',
          },
        ],
        addresses: [
          {
            id: '1',
            label: 'Home',
            address_line1: 'House 12, Road 5',
            address_line2: 'Block A',
            city: 'Dhaka',
            state: 'Dhaka',
            postal_code: '1212',
            is_default: true,
          },
        ],
        statistics: {
          total_bookings: 250,
          completed_bookings: 235,
          cancelled_bookings: 15,
          total_earnings: 125000,
          total_reviews: 120,
          avg_rating: 4.7,
        },
      } as WorkerDetails;
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
                <AvatarImage src={workerDetails.profile_picture || undefined} alt={workerDetails.full_name} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                  {getUserInitials(workerDetails.full_name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {workerDetails.worker_profile.display_name}
                  </h3>
                  {getVerificationBadge(workerDetails.worker_profile.verification)}
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
                    <span>{workerDetails.worker_profile.years_experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {workerDetails.worker_profile.avg_rating.toFixed(1)} ({workerDetails.worker_profile.total_reviews} reviews)
                    </span>
                  </div>
                </div>

                {workerDetails.worker_profile.bio && (
                  <p className="text-gray-600 text-sm">{workerDetails.worker_profile.bio}</p>
                )}
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <ClipboardList className="w-4 h-4" />
                  <span className="text-sm font-medium">Total Bookings</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {workerDetails.statistics.total_bookings}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {workerDetails.statistics.completed_bookings}
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">Earnings</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ৳{workerDetails.statistics.total_earnings.toLocaleString()}
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-600 mb-1">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Avg Rating</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {workerDetails.statistics.avg_rating.toFixed(1)}
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
                      <p className="text-gray-900">{workerDetails.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Display Name</label>
                      <p className="text-gray-900">{workerDetails.worker_profile.display_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Worker ID</label>
                      <p className="text-gray-900 font-mono text-sm">{workerDetails.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Total Hirings</label>
                      <p className="text-gray-900">{workerDetails.worker_profile.total_hirings}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Joined</label>
                      <p className="text-gray-900">
                        {new Date(workerDetails.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Login</label>
                      <p className="text-gray-900">
                        {workerDetails.last_login_at
                          ? new Date(workerDetails.last_login_at).toLocaleDateString('en-US', {
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
                            <Badge variant="outline">{service.section}</Badge>
                            {service.is_active ? (
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-600">Inactive</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold">৳{service.base_price}</span>
                            <span>/ {service.price_unit}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Edit Price</Button>
                      </div>
                      
                      {service.skills.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 mb-2 block">Skills</label>
                          <div className="flex flex-wrap gap-2">
                            {service.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Documents ({workerDetails.documents.length})
                  </h4>
                </div>
                
                <div className="space-y-3">
                  {workerDetails.documents.map((doc) => (
                    <div key={doc.id} className="p-4 border rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.type}</p>
                          <p className="text-sm text-gray-500">
                            Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status === 'verified' ? (
                          <Badge className="bg-green-100 text-green-800">Verified</Badge>
                        ) : doc.status === 'pending' ? (
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
                
                <div className="space-y-3">
                  {workerDetails.addresses.map((address) => (
                    <div key={address.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <p className="font-medium text-gray-900">{address.label}</p>
                            {address.is_default && (
                              <Badge variant="outline" className="text-xs">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.address_line1}
                            {address.address_line2 && `, ${address.address_line2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} {address.postal_code}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Customer Reviews
                </h4>
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Reviews functionality coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkerDetailsDialog;
