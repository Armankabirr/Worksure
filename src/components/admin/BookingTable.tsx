import { useState } from 'react';
import { Booking, BookingStatus } from '@/types/booking';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  MoreVertical,
  UserCog,
  Edit,
  XCircle,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { format } from 'date-fns';

interface BookingTableProps {
  bookings: Booking[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onViewDetails: (booking: Booking) => void;
  onAssignWorker: (booking: Booking) => void;
  onChangeStatus: (booking: Booking, newStatus: BookingStatus) => void;
  onCancelBooking: (booking: Booking) => void;
  onRefundPayment: (booking: Booking) => void;
}

const BookingTable = ({
  bookings,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onViewDetails,
  onAssignWorker,
  onChangeStatus,
  onCancelBooking,
  onRefundPayment,
}: BookingTableProps) => {
  const [sortField, setSortField] = useState<keyof Booking>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Sorting logic (client-side for current page only)
  const sortedBookings = [...bookings].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const handleSort = (field: keyof Booking) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Pending' },
      accepted: { color: 'bg-blue-100 text-blue-800 border-blue-300', label: 'Accepted' },
      in_progress: { color: 'bg-purple-100 text-purple-800 border-purple-300', label: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-800 border-green-300', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-300', label: 'Cancelled' },
      disputed: { color: 'bg-orange-100 text-orange-800 border-orange-300', label: 'Disputed' },
      awaiting: { color: 'bg-gray-100 text-gray-800 border-gray-300', label: 'Awaiting' },
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} border`} variant="outline">
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const paymentConfig = {
      paid: { color: 'bg-green-100 text-green-800 border-green-300', label: 'Paid' },
      unpaid: { color: 'bg-orange-100 text-orange-800 border-orange-300', label: 'Unpaid' },
    };

    const config = paymentConfig[paymentStatus as keyof typeof paymentConfig];
    return (
      <Badge className={`${config.color} border`} variant="outline">
        {config.label}
      </Badge>
    );
  };

  const getCategoryDisplay = (category: string) => {
    const categoryMap: Record<string, string> = {
      'cleaning': 'Cleaning',
      'electrician': 'Electrician',
      'plumbing': 'Plumbing',
      'catering': 'Catering',
      'babysitting': 'Babysitting',
      'pet-care': 'Pet Care',
      'ac-doctor': 'AC Doctor',
    };
    return categoryMap[category] || category;
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg">No bookings found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  console.log(bookings);
  

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('bookingId')}
              >
                Booking ID
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Worker</TableHead>
              <TableHead>Service</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('scheduled')}
              >
                Scheduled
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('createdAt')}
              >
                Created
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBookings.map((booking) => (
              <TableRow key={booking.bookingId || booking.bookingNumber} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {(booking.bookingId || booking.bookingNumber || '').substring(0, 8)}...
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{booking.user.name}</div>
                    <div className="text-xs text-gray-500">{booking.user.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {booking.worker ? (
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {booking.worker.name ||booking.worker.displayName}
                          <ShieldCheck className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="text-xs text-gray-500">
                          ⭐ {booking.worker.rating}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <ShieldAlert className="h-3 w-3 mr-1" />
                      Not Assigned
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">{booking.serviceSection.name
}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {booking.scheduled || booking.scheduledDate ? format(new Date(booking.scheduled || booking.scheduledDate), 'MMM dd, yyyy') : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.scheduled ? format(new Date(booking.scheduled), 'HH:mm') : (booking.scheduledTime || 'N/A')}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>{getPaymentBadge(booking.paymentStatus)}</TableCell>
                <TableCell className="text-right font-medium">
                  ৳{booking?.amount}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {booking.createdAt ? format(new Date(booking.createdAt), 'MMM dd, HH:mm') : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewDetails(booking)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {!booking.worker && (
                        <DropdownMenuItem onClick={() => onAssignWorker(booking)}>
                          <UserCog className="mr-2 h-4 w-4" />
                          Assign Worker
                        </DropdownMenuItem>
                      )}
                      {booking.worker && booking.status === 'pending' && (
                        <DropdownMenuItem onClick={() => onAssignWorker(booking)}>
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Reassign Worker
                        </DropdownMenuItem>
                      )}
                      {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => onChangeStatus(booking, 'completed')}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onCancelBooking(booking)}
                            className="text-red-600"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Booking
                          </DropdownMenuItem>
                        </>
                      )}
                      {booking.paymentStatus === 'paid' && booking.status === 'cancelled' && (
                        <DropdownMenuItem onClick={() => onRefundPayment(booking)}>
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Process Refund
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages} ({totalCount} total bookings)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex gap-1">
              {[...Array(Math.min(totalPages, 10))].map((_, i) => {
                // Show first 5 and last 5 pages if there are more than 10 pages
                let pageNum;
                if (totalPages <= 10) {
                  pageNum = i + 1;
                } else if (currentPage <= 5) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 4) {
                  pageNum = totalPages - 9 + i;
                } else {
                  pageNum = currentPage - 4 + i;
                }
                
                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="w-8"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTable;
