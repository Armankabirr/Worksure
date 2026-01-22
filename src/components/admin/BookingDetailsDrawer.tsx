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
    onUpdateNotes(booking.bookingId, adminNotes);
    setIsSavingNotes(false);
  };

  const getStatusColor = (status: BookingStatus) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-50',
      accepted: 'text-blue-600 bg-blue-50',
      in_progress: 'text-purple-600 bg-purple-50',
      completed: 'text-green-600 bg-green-50',
      cancelled: 'text-red-600 bg-red-50',
      disputed: 'text-orange-600 bg-orange-50',
      awaiting: 'text-gray-600 bg-gray-50',
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">Booking Details</SheetTitle>
          <SheetDescription>
            Complete information about booking {booking.bookingId}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Booking Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Current Booking Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge className={getStatusColor(booking.status)} variant="outline">
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
                </Badge>
              </div>

              {/* Status Change Control */}
              {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                <div className="pt-4 border-t">
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
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="awaiting">Awaiting</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
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
              <div>
                <p className="text-sm text-gray-500">Service Details</p>
                <p className="font-medium">{JSON.stringify(booking.service)}</p>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Scheduled</p>
                  <p className="font-medium">
                    {format(new Date(booking.scheduled), 'MMMM dd, yyyy HH:mm')}
                  </p>
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
                  <p className="text-sm text-gray-500">Booking Address</p>
                  <p className="font-medium">{booking.address}</p>
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
                    <p className="font-medium">{booking.worker.displayName}</p>
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
                        : 'bg-orange-100 text-orange-800 border-orange-300'
                    }
                    variant="outline"
                  >
                    {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-bold text-lg">৳{booking.amount.toLocaleString()}</p>
                </div>
              </div>
              {booking.paymentDetails && (
                <>
                  {booking.paymentDetails.payment_method && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-medium capitalize">{booking.paymentDetails.payment_method}</p>
                      </div>
                    </div>
                  )}
                  {booking.paymentDetails.trx_id && (
                    <div>
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                        {booking.paymentDetails.trx_id}
                      </p>
                    </div>
                  )}
                </>
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
              {booking.description && (
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <p className="text-sm text-blue-900">{booking.description}</p>
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
