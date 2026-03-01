import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockBookings, calculateBookingStats } from '@/lib/mockBookingData';
import { Booking, BookingFilters, BookingStatus, BookingStats } from '@/types/booking';
import { bookingService } from '@/services/bookingService';
import BookingStatsCards from '@/components/admin/BookingStatsCards';
import BookingFiltersComponent from '@/components/admin/BookingFilters';
import BookingTable from '@/components/admin/BookingTable';
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
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
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

  // Fetch bookings and stats from API
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Fetching bookings from API...');
      const [bookingsResponse, statsResponse] = await Promise.all([
        bookingService.getAllBookings(filters, currentPage, 10),
        bookingService.getBookingStats(filters.dateFrom, filters.dateTo)
      ]);

      console.log("book: ", bookingsResponse);
       console.log("stats: ", statsResponse);
      

      console.log('✅ API Response:', { bookingsResponse, statsResponse });

      if (bookingsResponse.success) {
        console.log('📊 Setting bookings:', bookingsResponse.data?.length, 'items');
        setBookings(bookingsResponse.data || []);
        setTotalPages(bookingsResponse.pagination?.totalPages || 1);
        setTotalCount(bookingsResponse.pagination?.totalCount || 0);
      }

      if (statsResponse.success) {
        console.log('📈 Setting stats:', statsResponse.data);
        setStats(statsResponse.data || null);
      }
    } catch (error) {
      console.error('❌ API Error - Falling back to mock data:', error);
      // Fallback to mock data if API fails
      setBookings(mockBookings as any);
      setStats(calculateBookingStats(mockBookings as any));
      toast({
        title: 'Using Demo Data',
        description: 'Could not connect to server. Showing demo bookings.',
        variant: 'default',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch bookings on mount and when filters/page change
  useEffect(() => {
    fetchBookings();
  }, [filters, currentPage]);

  // For local display only (API handles filtering)
  const filteredBookings = useMemo(() => {
    return bookings;
  }, [bookings]);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      category: 'all',
      paymentStatus: 'all',
      dateFrom: '',
      dateTo: '',
    });
    setCurrentPage(1); // Reset to first page when filters are cleared
  };

  const handleFiltersChange = (newFilters: BookingFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleViewDetails = (booking: Booking) => {
    navigate(`/admin/bookings/${booking.bookingId || booking.id}`);
  };

  const handleAssignWorker = (booking: Booking) => {
    setActionDialog({ isOpen: true, type: 'assign', booking });
  };

  const handleChangeStatus = async (booking: Booking, newStatus: BookingStatus) => {
    try {
      const response = await bookingService.updateBookingStatus(
        booking.bookingId || booking.id || '',
        newStatus
      );
      
      if (response.success) {
        toast({
          title: 'Status Updated',
          description: `Booking ${booking.bookingId || booking.bookingNumber} status changed to ${newStatus}`,
        });
        fetchBookings();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update booking status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelBooking = (booking: Booking) => {
    setActionDialog({ isOpen: true, type: 'cancel', booking });
  };

  const handleRefundPayment = (booking: Booking) => {
    setActionDialog({ isOpen: true, type: 'refund', booking });
  };

  const handleConfirmAction = async () => {
    if (!actionDialog.booking) return;

    try {
      if (actionDialog.type === 'cancel') {
        const response = await bookingService.cancelBooking(
          actionDialog.booking.bookingId || actionDialog.booking.id || '',
          'Cancelled by admin'
        );

        if (response.success) {
          toast({
            title: 'Booking Cancelled',
            description: `Booking ${actionDialog.booking.bookingId || actionDialog.booking.bookingNumber} has been cancelled`,
            variant: 'destructive',
          });
          fetchBookings();
        }
      } else if (actionDialog.type === 'refund') {
        const response = await bookingService.processRefund(
          actionDialog.booking.bookingId || actionDialog.booking.id || '',
          actionDialog.booking.amount || actionDialog.booking.totalAmount || 0
        );

        if (response.success) {
          toast({
            title: 'Refund Processed',
            description: `Refund of ৳${actionDialog.booking.totalAmount || actionDialog.booking.amount} has been processed`,
          });
          fetchBookings();
        }
      } else if (actionDialog.type === 'assign') {
        toast({
          title: 'Worker Assignment',
          description: 'Worker assignment feature will be implemented',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${actionDialog.type} booking. Please try again.`,
        variant: 'destructive',
      });
    }

    setActionDialog({ isOpen: false, type: null, booking: null });
  };

  const handleUpdateNotes = async (bookingId: string, notes: string) => {
    try {
      const response = await bookingService.updateAdminNotes(bookingId, notes);
      
      if (response.success) {
        toast({
          title: 'Notes Saved',
          description: 'Admin notes have been updated successfully',
        });
        fetchBookings();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save notes. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRefreshData = () => {
    fetchBookings();
  };

  const handleExportData = async () => {
    try {
      const response = await bookingService.exportBookings(filters);
      
      if (response.success && response.data) {
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings-export-${new Date().toUTCString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast({
          title: 'Export Successful',
          description: 'Booking data has been exported to CSV',
        });
      }
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export booking data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
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
        onFiltersChange={handleFiltersChange}
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
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          onViewDetails={handleViewDetails}
          onAssignWorker={handleAssignWorker}
          onChangeStatus={handleChangeStatus}
          onCancelBooking={handleCancelBooking}
          onRefundPayment={handleRefundPayment}
        />
      </div>



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
  );
};

export default AdminBookings;
