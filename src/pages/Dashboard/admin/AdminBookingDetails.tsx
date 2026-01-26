import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '@/services/bookingService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Star,
  Package,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface BookingDetailsData {
  id: string;
  status: string;
  selected_time: string;
  work_start: string | null;
  work_end: string | null;
  total_amount: string;
  payment_completed: boolean;
  created_at: string;
  updated_at: string;
  address: string;
  description: string;
  cancel_reason: string | null;
  canceled_by: string | null;
  items_approval: boolean;
  users_orders_client_idTousers: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    profile_picture: string;
    date_of_birth: string;
    gender: string;
    addresses: Array<{
      street: string;
      city: string;
      district: string;
      postal_code: string;
    }>;
  };
  users_orders_assigned_worker_idTousers: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    profile_picture: string;
    worker_profiles: {
      display_name: string;
      bio: string;
      years_experience: number;
      avg_rating: string;
      total_reviews: number;
      verification: string;
    };
  } | null;
  payments: Array<{
    id: string;
    amount: string;
    status: string;
    payment_method: string;
    trx_id: string;
    paid_at: string;
    created_at: string;
  }>;
  order_items: Array<{
    id: string;
    items: Array<{
      quantity: number;
      service_id: string;
      unit_price: number;
      total_price: number;
      service_name: string;
    }>;
    additional_notes: string;
    verified: boolean;
    created_at: string;
  }>;
  reviews: Array<any>;
}

const AdminBookingDetails = () => {
  const { booking_id } = useParams<{ booking_id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookingData, setBookingData] = useState<BookingDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (booking_id) {
      fetchBookingDetails();
    }
  }, [booking_id]);

  const fetchBookingDetails = async () => {
    setIsLoading(true);
    try {
      const response = await bookingService.getBookingById(booking_id!);
      if (response.success && response.data) {
        setBookingData(response.data);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load booking details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const response = await bookingService.updateBookingStatus(booking_id!, newStatus as any);
      if (response.success) {
        toast({
          title: 'Status Updated',
          description: `Booking status changed to ${newStatus}`,
        });
        fetchBookingDetails();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update booking status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      accepted: 'bg-blue-100 text-blue-800 border-blue-300',
      in_progress: 'bg-purple-100 text-purple-800 border-purple-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      disputed: 'bg-orange-100 text-orange-800 border-orange-300',
      awaiting: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
        <Button onClick={() => navigate('/admin/bookings')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/bookings')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
            <p className="text-gray-600 mt-1">Booking ID: {bookingData.id}</p>
          </div>
        </div>
        <Badge className={getStatusColor(bookingData.status)} variant="outline">
          {bookingData.status.charAt(0).toUpperCase() + bookingData.status.slice(1).replace('_', ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Booking Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(bookingData.status !== 'completed' && bookingData.status !== 'cancelled' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Change Status</label>
                  <Select
                    defaultValue={bookingData.status}
                    onValueChange={handleStatusChange}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="awaiting">Awaiting</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )) || <p className="text-sm font-medium">{bookingData.status === 'completed' ? 'Completed' : 'Cancelled'}</p>}
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={bookingData.users_orders_client_idTousers.profile_picture}
                  alt={bookingData.users_orders_client_idTousers.full_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-lg">
                    {bookingData.users_orders_client_idTousers.full_name}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {bookingData.users_orders_client_idTousers.gender}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{bookingData.users_orders_client_idTousers.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-sm">{bookingData.users_orders_client_idTousers.email}</p>
                  </div>
                </div>
              </div>
              {bookingData.users_orders_client_idTousers.addresses.length > 0 && (
                <>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Registered Address</p>
                      <p className="font-medium">
                        {bookingData.users_orders_client_idTousers.addresses[0].street}, {' '}
                        {bookingData.users_orders_client_idTousers.addresses[0].city}, {' '}
                        {bookingData.users_orders_client_idTousers.addresses[0].district} - {' '}
                        {bookingData.users_orders_client_idTousers.addresses[0].postal_code}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Worker Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Worker Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingData.users_orders_assigned_worker_idTousers ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={bookingData.users_orders_assigned_worker_idTousers.profile_picture}
                      alt={bookingData.users_orders_assigned_worker_idTousers.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-lg">
                        {bookingData.users_orders_assigned_worker_idTousers.full_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {bookingData.users_orders_assigned_worker_idTousers.worker_profiles.display_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          {bookingData.users_orders_assigned_worker_idTousers.worker_profiles.verification}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">
                          {bookingData.users_orders_assigned_worker_idTousers.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <p className="font-medium">
                          {bookingData.users_orders_assigned_worker_idTousers.worker_profiles.avg_rating} / 5.0
                          <span className="text-xs text-gray-500 ml-1">
                            ({bookingData.users_orders_assigned_worker_idTousers.worker_profiles.total_reviews} reviews)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Bio</p>
                    <p className="text-sm mt-1">
                      {bookingData.users_orders_assigned_worker_idTousers.worker_profiles.bio}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Experience: {bookingData.users_orders_assigned_worker_idTousers.worker_profiles.years_experience} years
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="h-5 w-5" />
                  <p>No worker assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingData.order_items.map((orderItem) => (
                <div key={orderItem.id} className="space-y-3">
                  {orderItem.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.service_name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} × ৳{item.unit_price}
                        </p>
                      </div>
                      <p className="font-semibold">৳{item.total_price}</p>
                    </div>
                  ))}
                  {orderItem.additional_notes && (
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">Additional Notes:</p>
                      <p className="text-sm text-blue-800 mt-1">{orderItem.additional_notes}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {orderItem.verified ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline">Pending Verification</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Schedule Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Selected Time</p>
                <p className="font-medium">
                  {format(new Date(bookingData.selected_time), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              {bookingData.work_start && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Work Started</p>
                    <p className="font-medium">
                      {format(new Date(bookingData.work_start), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </>
              )}
              {bookingData.work_end && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Work Completed</p>
                    <p className="font-medium">
                      {format(new Date(bookingData.work_end), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Service Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Service Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{bookingData.address}</p>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-bold text-2xl">৳{bookingData.total_amount}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <Badge
                  className={
                    bookingData.payment_completed
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : 'bg-orange-100 text-orange-800 border-orange-300'
                  }
                  variant="outline"
                >
                  {bookingData.payment_completed ? 'Paid' : 'Pending'}
                </Badge>
              </div>
              {bookingData.payments.length > 0 && (
                <>
                  <Separator />
                  {bookingData.payments.map((payment) => (
                    <div key={payment.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Payment Method</p>
                          <p className="font-medium capitalize">{payment.payment_method}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Transaction ID</p>
                        <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                          {payment.trx_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Paid At</p>
                        <p className="text-sm font-medium">
                          {format(new Date(payment.paid_at), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          {bookingData.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{bookingData.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="text-sm font-medium">
                  {format(new Date(bookingData.created_at), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm font-medium">
                  {format(new Date(bookingData.updated_at), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              {bookingData.items_approval && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-green-600">Items Approved</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetails;
