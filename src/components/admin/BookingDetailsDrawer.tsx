import { useState } from 'react';
import { Booking, BookingStatus } from '@/types/booking';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  FileText,
  ShieldCheck,
  Star,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BookingDetailsDrawerProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (booking: Booking, newStatus: BookingStatus) => void;
  onUpdateNotes: (bookingId: string, notes: string) => void;
}

const BookingDetailsDrawer = ({
  booking,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateNotes,
}: BookingDetailsDrawerProps) => {
  const [adminNotes, setAdminNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  if (!booking) return null;

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onUpdateNotes(booking.id, adminNotes);
    setIsSavingNotes(false);
  };

  const getStatusColor = (status: BookingStatus) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-50',
      accepted: 'text-blue-600 bg-blue-50',
      ongoing: 'text-purple-600 bg-purple-50',
      completed: 'text-green-600 bg-green-50',
      cancelled: 'text-red-600 bg-red-50',
    };
    return colors[status];
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">Booking Details</SheetTitle>
          <SheetDescription>
            Complete information about booking {booking.bookingNumber}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Booking Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Booking Status Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {booking.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      history.status === 'completed' ? 'bg-green-500' :
                      history.status === 'cancelled' ? 'bg-red-500' :
                      history.status === 'ongoing' ? 'bg-purple-500' :
                      history.status === 'accepted' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(history.status)} variant="outline">
                          {history.status.charAt(0).toUpperCase() + history.status.slice(1)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {format(new Date(history.timestamp), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      {history.note && (
                        <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Change Control */}
              {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                <div className="mt-4 pt-4 border-t">
                  <label className="text-sm font-medium mb-2 block">
                    Change Booking Status
                  </label>
                  <Select
                    defaultValue={booking.status}
                    onValueChange={(value) => onUpdateStatus(booking, value as BookingStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Service Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Service Category</p>
                  <p className="font-medium capitalize">{booking.serviceCategory.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service Section</p>
                  <p className="font-medium">{booking.serviceSection}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service Name</p>
                <p className="font-medium">{booking.serviceName}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Scheduled Date</p>
                    <p className="font-medium">
                      {format(new Date(booking.scheduledDate), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Scheduled Time</p>
                    <p className="font-medium">{booking.scheduledTime}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{booking.user.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{booking.user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-sm">{booking.user.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{booking.user.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-500">Customer Rating</p>
                  <p className="font-medium">{booking.user.rating} / 5.0</p>
                </div>
              </div>
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
              {booking.worker ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{booking.worker.name}</p>
                    {booking.worker.verified && (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{booking.worker.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <p className="font-medium">{booking.worker.rating} / 5.0</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completed Jobs</p>
                    <p className="font-medium">{booking.worker.completedJobs}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Specialization</p>
                    <div className="flex flex-wrap gap-2">
                      {booking.worker.specialization.map((spec, index) => (
                        <Badge key={index} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
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

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <Badge
                    className={
                      booking.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : booking.paymentStatus === 'refunded'
                        ? 'bg-gray-100 text-gray-800 border-gray-300'
                        : 'bg-orange-100 text-orange-800 border-orange-300'
                    }
                    variant="outline"
                  >
                    {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-bold text-lg">৳{booking.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              {booking.paymentMethod && (
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium capitalize">{booking.paymentMethod}</p>
                  </div>
                </div>
              )}
              {booking.transactionId && (
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {booking.transactionId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Admin Notes
              </CardTitle>
              <CardDescription>Internal notes (not visible to customer or worker)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {booking.adminNotes && (
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <p className="text-sm text-blue-900">{booking.adminNotes}</p>
                </div>
              )}
              <Textarea
                placeholder="Add internal notes about this booking..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
              />
              <Button
                onClick={handleSaveNotes}
                disabled={isSavingNotes || !adminNotes.trim()}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSavingNotes ? 'Saving...' : 'Save Notes'}
              </Button>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Created At</p>
                  <p className="font-medium">
                    {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {format(new Date(booking.updatedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookingDetailsDrawer;
