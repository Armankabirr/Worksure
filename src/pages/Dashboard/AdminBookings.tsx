import { useState, useMemo } from 'react';
import { mockBookings, calculateBookingStats } from '@/lib/mockBookingData';
import { Booking, BookingFilters, BookingStatus } from '@/types/booking';
import BookingStatsCards from '@/components/admin/BookingStatsCards';
import BookingFiltersComponent from '@/components/admin/BookingFilters';
import BookingTable from '@/components/admin/BookingTable';
import BookingDetailsDrawer from '@/components/admin/BookingDetailsDrawer';
import { Button } from '@/components/ui/button';
import { Download, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean;
    type: 'cancel' | 'refund' | 'assign' | null;
    booking: Booking | null;
  }>({ isOpen: false, type: null, booking: null });

  const [filters, setFilters] = useState<BookingFilters>({
    search: '',
    status: 'all',
    category: 'all',
    paymentStatus: 'all',
    dateFrom: '',
    dateTo: '',
  });

  // Filter bookings based on active filters
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          booking.bookingNumber.toLowerCase().includes(searchLower) ||
          booking.user.name.toLowerCase().includes(searchLower) ||
          booking.user.phone.toLowerCase().includes(searchLower) ||
          booking.worker?.name.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && booking.status !== filters.status) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && booking.serviceCategory !== filters.category) {
        return false;
      }

      // Payment status filter
      if (filters.paymentStatus !== 'all' && booking.paymentStatus !== filters.paymentStatus) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom) {
        const bookingDate = new Date(booking.scheduledDate);
        const fromDate = new Date(filters.dateFrom);
        if (bookingDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const bookingDate = new Date(booking.scheduledDate);
        const toDate = new Date(filters.dateTo);
        if (bookingDate > toDate) return false;
      }

      return true;
    });
  }, [bookings, filters]);

  const stats = useMemo(() => calculateBookingStats(filteredBookings), [filteredBookings]);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      category: 'all',
      paymentStatus: 'all',
      dateFrom: '',
      dateTo: '',
    });
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsDrawerOpen(true);
  };

  const handleAssignWorker = (booking: Booking) => {
    setActionDialog({ isOpen: true, type: 'assign', booking });
  };

  const handleChangeStatus = (booking: Booking, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? {
              ...b,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              statusHistory: [
                ...b.statusHistory,
                {
                  status: newStatus,
                  timestamp: new Date().toISOString(),
                  note: `Status changed by admin`,
                },
              ],
            }
          : b
      )
    );

    toast({
      title: 'Status Updated',
      description: `Booking ${booking.bookingNumber} status changed to ${newStatus}`,
    });
  };

  const handleCancelBooking = (booking: Booking) => {
    setActionDialog({ isOpen: true, type: 'cancel', booking });
  };

  const handleRefundPayment = (booking: Booking) => {
    setActionDialog({ isOpen: true, type: 'refund', booking });
  };

  const handleConfirmAction = () => {
    if (!actionDialog.booking) return;

    if (actionDialog.type === 'cancel') {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === actionDialog.booking!.id
            ? {
                ...b,
                status: 'cancelled' as BookingStatus,
                updatedAt: new Date().toISOString(),
                statusHistory: [
                  ...b.statusHistory,
                  {
                    status: 'cancelled' as BookingStatus,
                    timestamp: new Date().toISOString(),
                    note: 'Cancelled by admin',
                  },
                ],
              }
            : b
        )
      );

      toast({
        title: 'Booking Cancelled',
        description: `Booking ${actionDialog.booking.bookingNumber} has been cancelled`,
        variant: 'destructive',
      });
    } else if (actionDialog.type === 'refund') {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === actionDialog.booking!.id
            ? {
                ...b,
                paymentStatus: 'refunded',
                updatedAt: new Date().toISOString(),
              }
            : b
        )
      );

      toast({
        title: 'Refund Processed',
        description: `Refund of ৳${actionDialog.booking.totalAmount} has been processed`,
      });
    } else if (actionDialog.type === 'assign') {
      toast({
        title: 'Worker Assignment',
        description: 'Worker assignment feature will be implemented',
      });
    }

    setActionDialog({ isOpen: false, type: null, booking: null });
  };

  const handleUpdateNotes = (bookingId: string, notes: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              adminNotes: notes,
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );

    toast({
      title: 'Notes Saved',
      description: 'Admin notes have been updated successfully',
    });
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Data Refreshed',
        description: 'Booking data has been updated',
      });
    }, 1000);
  };

  const handleExportData = () => {
    toast({
      title: 'Export Started',
      description: 'Booking data is being exported to CSV',
    });
    // Export logic would go here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage all service bookings</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRefreshData}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleExportData} className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <BookingStatsCards stats={stats} isLoading={isLoading} />

        {/* Filters */}
        <BookingFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">All Bookings</h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
          </div>

          <BookingTable
            bookings={filteredBookings}
            onViewDetails={handleViewDetails}
            onAssignWorker={handleAssignWorker}
            onChangeStatus={handleChangeStatus}
            onCancelBooking={handleCancelBooking}
            onRefundPayment={handleRefundPayment}
          />
        </div>

        {/* Booking Details Drawer */}
        <BookingDetailsDrawer
          booking={selectedBooking}
          isOpen={isDetailsDrawerOpen}
          onClose={() => {
            setIsDetailsDrawerOpen(false);
            setSelectedBooking(null);
          }}
          onUpdateStatus={handleChangeStatus}
          onUpdateNotes={handleUpdateNotes}
        />

        {/* Confirmation Dialogs */}
        <AlertDialog
          open={actionDialog.isOpen}
          onOpenChange={(open) =>
            !open && setActionDialog({ isOpen: false, type: null, booking: null })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionDialog.type === 'cancel' && 'Cancel Booking'}
                {actionDialog.type === 'refund' && 'Process Refund'}
                {actionDialog.type === 'assign' && 'Assign Worker'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionDialog.type === 'cancel' &&
                  `Are you sure you want to cancel booking ${actionDialog.booking?.bookingNumber}? This action cannot be undone.`}
                {actionDialog.type === 'refund' &&
                  `Are you sure you want to process a refund of ৳${actionDialog.booking?.totalAmount} for booking ${actionDialog.booking?.bookingNumber}?`}
                {actionDialog.type === 'assign' &&
                  `Worker assignment functionality will open a worker selection dialog. This feature is ready to be integrated with your worker management system.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmAction}>
                {actionDialog.type === 'cancel' && 'Yes, Cancel Booking'}
                {actionDialog.type === 'refund' && 'Process Refund'}
                {actionDialog.type === 'assign' && 'Assign Worker'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminBookings;
