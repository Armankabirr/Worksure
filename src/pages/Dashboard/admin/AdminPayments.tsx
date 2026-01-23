import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Flag,
  Eye,
  RotateCw,
  Download,
  FilterIcon,
  ArrowUpDown,
  Calendar,
  Search,
  Loader,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';
import paymentService from '@/services/paymentService';
import { useToast } from '@/hooks/use-toast';
import { date } from 'zod';

// Types
interface PaymentResponse {
  payment_id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id: string;
  payer?: {
    id: string;
    name: string;
    email: string;
  };
  booking?: {
    id: string;
    status: string;
    client?: {
      id: string;
      name: string;
      email: string;
    };
  };
  paid_at?: string;
  created_at: string;
}

interface PaymentSummary {
  totalPayments: number;
  totalRevenue: number;
  statusBreakdown: {
    [key: string]: {
      count: number;
      total: number;
    };
  };
  methodBreakdown: {
    [key: string]: {
      count: number;
      total: number;
    };
  };
}

interface AdminNote {
  id: string;
  paymentId: string;
  note: string;
  createdAt: string;
  createdBy: string;
}

const AdminPayments: React.FC = () => {
  // State management
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState<AdminNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'amount' | 'status'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<PaymentResponse | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [flagReason, setFlagReason] = useState('');
  const [noteText, setNoteText] = useState('');
  const [refunding, setRefunding] = useState(false);
  const itemsPerPage = 10;

  // Load payments and summary on mount and filter changes
  useEffect(() => {
    loadData();
  }, [filterStatus, filterMethod, dateRangeFilter, sortBy, sortDirection, currentPage]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const filters: any = {
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        sortOrder: sortDirection,
      };

      if (filterStatus !== 'all') {
        filters.status = filterStatus;
      }
      if (filterMethod !== 'all') {
        filters.paymentMethod = filterMethod;
      }
      if (dateRangeFilter !== 'all') {
        const now = new Date();
        const dateFrom = new Date(now);
        const dateTo = new Date(now);

        switch (dateRangeFilter) {
          case 'today':
            dateFrom.setHours(0, 0, 0, 0);
            dateTo.setHours(23, 59, 59, 999);
            break;
          case 'week':
            dateFrom.setDate(now.getDate() - now.getDay());
            dateFrom.setHours(0, 0, 0, 0);
            dateTo.setDate(now.getDate() + (6 - now.getDay()));
            dateTo.setHours(23, 59, 59, 999);
            break;
          case 'month':
            dateFrom.setDate(1);
            dateFrom.setHours(0, 0, 0, 0);
            dateTo.setMonth(dateTo.getMonth() + 1);
            dateTo.setDate(0);
            dateTo.setHours(23, 59, 59, 999);
            break;
          default:
            break;
        }

        filters.dateFrom = dateFrom.toISOString();
        filters.dateTo = dateTo.toISOString();
      }

      // Load payments
      const paymentsResponse = await paymentService.getPayments(filters);
      console.log("Payment details: ", paymentsResponse);

      // Handle paginated response format
      if (paymentsResponse.data && paymentsResponse.pagination) {
        // Paginated response with pagination metadata
        setPayments(paymentsResponse.data.map((p: any) => paymentService.transformPayment(p)));
        setTotalPages(paymentsResponse.pagination.totalPages);
        setTotalCount(paymentsResponse.pagination.totalCount);
      } else if (Array.isArray(paymentsResponse)) {
        // Array response (backward compatibility)
        setPayments(paymentsResponse.map((p: any) => paymentService.transformPayment(p)));
        setTotalPages(1);
        setTotalCount(paymentsResponse.length);
      } else if (paymentsResponse.data && !paymentsResponse.pagination) {
        // Data-only response
        setPayments(paymentsResponse.data.map((p: any) => paymentService.transformPayment(p)));
      }

      // Load summary
      const summaryResponse = await paymentService.getPaymentSummary();
      setSummary(summaryResponse);
    } catch (error: any) {
      console.error('Error loading payments:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load payments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter logic (client-side filtering for search)
  const filteredPayments = useMemo(() => {
    let result = payments;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.payment_id.toLowerCase().includes(query) ||
          p.booking?.id.toLowerCase().includes(query) ||
          p.payer?.name.toLowerCase().includes(query) ||
          p.transaction_id.toLowerCase().includes(query)
      );
    }

    return result;
  }, [payments, searchQuery]);

  // Use server-provided pagination data
  const paginatedPayments = filteredPayments;

  // Handlers
  const handleViewDetails = (payment: PaymentResponse) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const handleAddNote = () => {
    if (selectedPayment && noteText.trim()) {
      const newNote: AdminNote = {
        id: `NOTE-${Date.now()}`,
        paymentId: selectedPayment.payment_id,
        note: noteText,
        createdAt: new Date().toISOString(),
        createdBy: 'Admin User',
      };
      setAdminNotes([...adminNotes, newNote]);
      setNoteText('');

      toast({
        title: 'Success',
        description: 'Note added successfully',
      });
    }
  };

  const handleRefund = async () => {
    if (!selectedPayment || !refundReason.trim()) return;

    setRefunding(true);
    try {
      await paymentService.refundPayment(
        selectedPayment.payment_id,
        refundReason
      );

      toast({
        title: 'Success',
        description: 'Payment refunded successfully',
      });

      // Reload data
      loadData();
      setShowRefundDialog(false);
      setRefundReason('');
      setShowDetailModal(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to refund payment',
        variant: 'destructive',
      });
    } finally {
      setRefunding(false);
    }
  };

  const handleFlagPayment = () => {
    if (selectedPayment) {
      // This would typically call an API endpoint to flag the payment
      toast({
        title: 'Success',
        description: 'Payment flagged for review',
      });
      setShowFlagDialog(false);
      setFlagReason('');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; icon: any }> = {
      paid: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      success: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      failed: { color: 'bg-red-100 text-red-800', icon: XCircle },
      refunded: { color: 'bg-blue-100 text-blue-800', icon: RotateCw },
    };

    const config = statusMap[status] || { color: 'bg-gray-100 text-gray-800', icon: CreditCard };
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} capitalize`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      card: 'Credit Card',
      mobile_banking: 'Mobile Banking',
      bkash: 'bKash',
      nagad: 'Nagad',
      rocket: 'Rocket',
      wallet: 'Wallet',
      bank_transfer: 'Bank Transfer',
      cash: 'Cash',
    };
    return labels[method] || method;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 mt-2">Monitor and manage all transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalPayments || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time payments processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{(summary?.totalRevenue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary?.statusBreakdown?.paid?.count || 0} successful payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.statusBreakdown?.pending?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              ৳{(summary?.statusBreakdown?.pending?.total || 0).toLocaleString()} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed/Refunded</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(summary?.statusBreakdown?.failed?.count || 0) +
                (summary?.statusBreakdown?.refunded?.count || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              ৳{(summary?.statusBreakdown?.refunded?.total || 0).toLocaleString()} refunded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, name, or reference..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Select value={filterStatus} onValueChange={(value: string) => {
              setFilterStatus(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterMethod} onValueChange={(value: string) => {
              setFilterMethod(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="mobile-banking">Mobile Banking</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRangeFilter} onValueChange={(value) => {
              setDateRangeFilter(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className="w-4 h-4 mr-1" />
              {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Payment ID</TableHead>
                  <TableHead className="w-20">Booking ID</TableHead>
                  <TableHead className="w-32">User/Worker</TableHead>
                  <TableHead className="text-right w-20">Amount</TableHead>
                  <TableHead className="w-28">Method</TableHead>
                  <TableHead className="w-20">Status</TableHead>
                  <TableHead className="w-32">Date</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        Loading payments...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPayments.map((payment) => (
                    <TableRow key={payment.payment_id}>
                      <TableCell className="font-mono text-sm">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">
                                {payment.payment_id.substring(0, 6)}...
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {payment.payment_id}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">
                                {payment.booking?.id.substring(0, 6) || 'N/A'}...
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {payment.booking?.id || 'No booking'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{payment.payer?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{payment.booking?.client?.name || 'N/A'}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ৳{payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getMethodLabel(payment.payment_method)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(payment.created_at), 'MMM dd, HH:mm')}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <div className="flex gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(payment)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Details</TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

{/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages || 1} • Total: {totalCount} payments
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                disabled={loading}
                className="w-8 h-8 p-0"
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0 || loading}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Payment Details Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              {selectedPayment?.payment_id} - {selectedPayment?.booking?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">User</p>
                  <p className="text-sm font-semibold">{selectedPayment.payer?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{selectedPayment.payer?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Booking Client</p>
                  <p className="text-sm font-semibold">{selectedPayment.booking?.client?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-500">{selectedPayment.booking?.client?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Amount</p>
                  <p className="text-lg font-bold">৳{selectedPayment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <p className="mt-1">{getStatusBadge(selectedPayment.status)}</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Transaction Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">{getMethodLabel(selectedPayment.payment_method)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-xs">{selectedPayment.transaction_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">৳{selectedPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid At</span>
                    <span className="font-medium">
                      {selectedPayment.paid_at
                        ? format(new Date(selectedPayment.paid_at), 'MMM dd, yyyy HH:mm')
                        : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created At</span>
                    <span className="font-medium">
                      {format(new Date(selectedPayment.created_at), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              {selectedPayment.booking && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Booking Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID</span>
                      <span className="font-medium">{selectedPayment.booking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Status</span>
                      <Badge>{selectedPayment.booking.status}</Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Notes
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Admin Notes</h4>
                <div className="space-y-2">
                  <div className="text-sm text-gray-700 min-h-[40px]">
                    {adminNotes
                      .filter((n) => n.paymentId === selectedPayment.payment_id)
                      .map((note) => (
                        <div key={note.id} className="mb-2 pb-2 border-b last:border-b-0">
                          <p className="text-sm">{note.note}</p>
                          <p className="text-xs text-gray-500">
                            {note.createdBy} - {format(new Date(note.createdAt), 'MMM dd, HH:mm')}
                          </p>
                        </div>
                      ))}
                    {adminNotes.filter((n) => n.paymentId === selectedPayment.payment_id).length === 0 && (
                      <p className="text-gray-500">No notes added yet</p>
                    )}
                  </div>
                  <div className="space-y-2 mt-3 pt-3 border-t">
                    <Textarea
                      placeholder="Add a note..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddNote}
                      disabled={!noteText.trim()}
                    >
                      Add Note
                    </Button>
                  </div>
                </div>
              </div> */}

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                {selectedPayment.status === 'paid' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowRefundDialog(true)}
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      Refund
                    </Button>

                    {/* <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowFlagDialog(true)}
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Flag Payment
                    </Button> */}
                  </>
                )}

                <Button
                  size="sm"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Refund Confirmation Dialog */}
      <AlertDialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Refund</AlertDialogTitle>
            <AlertDialogDescription>
              This will refund ৳{selectedPayment?.amount.toLocaleString()} to the customer. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter reason for refund..."
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="text-sm"
            />
            <div className="flex justify-end gap-2">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                onClick={handleRefund}
                disabled={!refundReason.trim() || refunding}
                className="bg-red-600 hover:bg-red-700"
              >
                {refunding ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RotateCw className="w-4 h-4 mr-2" />
                    Confirm Refund
                  </>
                )}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Flag Payment Dialog */}
      <AlertDialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Flag Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Mark this payment as flagged for suspicious activity or fraud review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter reason for flagging..."
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowFlagDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleFlagPayment}
                disabled={!flagReason.trim()}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Flag Payment
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPayments;
