import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format } from 'date-fns';

// Types
interface Payment {
  paymentId: string;
  bookingId: string;
  userId: string;
  workerId: string;
  userName: string;
  workerName: string;
  amount: number;
  platformFee: number;
  workerPayout: number;
  paymentMethod: 'card' | 'mobile_banking' | 'wallet' | 'bank_transfer';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  transactionDate: string;
  gatewayReferenceId: string;
  adminReviewed: boolean;
  adminNotes: string;
  flagged: boolean;
  flagReason?: string;
}

interface AdminNote {
  id: string;
  paymentId: string;
  note: string;
  createdAt: string;
  createdBy: string;
}

// Mock data
const mockPayments: Payment[] = [
  {
    paymentId: 'PAY-001',
    bookingId: 'BK-101',
    userId: 'USR-001',
    workerId: 'WKR-001',
    userName: 'Ahmed Hassan',
    workerName: 'Karim Ali',
    amount: 5000,
    platformFee: 500,
    workerPayout: 4500,
    paymentMethod: 'card',
    status: 'success',
    transactionDate: '2024-01-15T10:30:00',
    gatewayReferenceId: 'TXN-2024-001',
    adminReviewed: true,
    adminNotes: 'Payment verified and processed',
    flagged: false,
  },
  {
    paymentId: 'PAY-002',
    bookingId: 'BK-102',
    userId: 'USR-002',
    workerId: 'WKR-002',
    userName: 'Fatima Khan',
    workerName: 'Raza Ahmed',
    amount: 3500,
    platformFee: 350,
    workerPayout: 3150,
    paymentMethod: 'mobile_banking',
    status: 'pending',
    transactionDate: '2024-01-15T14:22:00',
    gatewayReferenceId: 'TXN-2024-002',
    adminReviewed: false,
    adminNotes: '',
    flagged: false,
  },
  {
    paymentId: 'PAY-003',
    bookingId: 'BK-103',
    userId: 'USR-003',
    workerId: 'WKR-003',
    userName: 'Sarah Smith',
    workerName: 'Hassan Khan',
    amount: 7500,
    platformFee: 750,
    workerPayout: 6750,
    paymentMethod: 'card',
    status: 'failed',
    transactionDate: '2024-01-15T16:45:00',
    gatewayReferenceId: 'TXN-2024-003',
    adminReviewed: true,
    adminNotes: 'Card declined. Customer contacted.',
    flagged: false,
  },
  {
    paymentId: 'PAY-004',
    bookingId: 'BK-104',
    userId: 'USR-004',
    workerId: 'WKR-004',
    userName: 'Ali Raza',
    workerName: 'Mohammad Hassan',
    amount: 4200,
    platformFee: 420,
    workerPayout: 3780,
    paymentMethod: 'wallet',
    status: 'success',
    transactionDate: '2024-01-14T09:15:00',
    gatewayReferenceId: 'TXN-2024-004',
    adminReviewed: false,
    adminNotes: '',
    flagged: true,
    flagReason: 'Multiple transactions from same account',
  },
  {
    paymentId: 'PAY-005',
    bookingId: 'BK-105',
    userId: 'USR-005',
    workerId: 'WKR-005',
    userName: 'Zainab Ahmed',
    workerName: 'Ibrahim Khan',
    amount: 6000,
    platformFee: 600,
    workerPayout: 5400,
    paymentMethod: 'bank_transfer',
    status: 'refunded',
    transactionDate: '2024-01-13T13:30:00',
    gatewayReferenceId: 'TXN-2024-005',
    adminReviewed: true,
    adminNotes: 'Refunded due to service cancellation',
    flagged: false,
  },
];

const AdminPayments: React.FC = () => {
  // State management
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [adminNotes, setAdminNotes] = useState<AdminNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<Payment['status'] | 'all'>('all');
  const [filterMethod, setFilterMethod] = useState<Payment['paymentMethod'] | 'all'>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all'); // today, week, month, all
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [noteText, setNoteText] = useState('');
  const itemsPerPage = 10;

  // Filter logic
  const filteredPayments = useMemo(() => {
    let result = payments;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.paymentId.toLowerCase().includes(query) ||
          p.bookingId.toLowerCase().includes(query) ||
          p.userName.toLowerCase().includes(query) ||
          p.workerName.toLowerCase().includes(query) ||
          p.gatewayReferenceId.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter((p) => p.status === filterStatus);
    }

    // Payment method filter
    if (filterMethod !== 'all') {
      result = result.filter((p) => p.paymentMethod === filterMethod);
    }

    // Date range filter
    const now = new Date();
    const dayInMs = 24 * 60 * 60 * 1000;

    if (dateRangeFilter === 'today') {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      result = result.filter((p) => new Date(p.transactionDate) >= todayStart);
    } else if (dateRangeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * dayInMs);
      result = result.filter((p) => new Date(p.transactionDate) >= weekAgo);
    } else if (dateRangeFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * dayInMs);
      result = result.filter((p) => new Date(p.transactionDate) >= monthAgo);
    }

    // Sort
    result.sort((a, b) => {
      let compareValue = 0;

      if (sortBy === 'date') {
        compareValue = new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime();
      } else if (sortBy === 'amount') {
        compareValue = a.amount - b.amount;
      } else if (sortBy === 'status') {
        compareValue = a.status.localeCompare(b.status);
      }

      return sortDirection === 'asc' ? compareValue : -compareValue;
    });

    return result;
  }, [payments, searchQuery, filterStatus, filterMethod, dateRangeFilter, sortBy, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Summary calculations
  const summaryStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const calculateStats = (filterFn: (p: Payment) => boolean) => {
      const filtered = payments.filter(filterFn);
      const successful = filtered.filter((p) => p.status === 'success');
      const pending = filtered.filter((p) => p.status === 'pending');
      const failed = filtered.filter((p) => p.status === 'failed');
      const refunded = filtered.filter((p) => p.status === 'refunded');

      return {
        totalRevenue: successful.reduce((sum, p) => sum + p.platformFee, 0),
        totalPayments: filtered.length,
        successfulCount: successful.length,
        pendingCount: pending.length,
        failedCount: failed.length,
        refundedCount: refunded.length,
        totalRefunded: refunded.reduce((sum, p) => sum + p.amount, 0),
        workerPayouts: successful.reduce((sum, p) => sum + p.workerPayout, 0),
      };
    };

    return {
      today: calculateStats((p) => new Date(p.transactionDate) >= today),
      week: calculateStats((p) => new Date(p.transactionDate) >= thisWeekStart),
      month: calculateStats((p) => new Date(p.transactionDate) >= thisMonthStart),
      all: calculateStats(() => true),
    };
  }, [payments]);

  // Handlers
  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const handleAddNote = () => {
    if (selectedPayment && noteText.trim()) {
      const newNote: AdminNote = {
        id: `NOTE-${Date.now()}`,
        paymentId: selectedPayment.paymentId,
        note: noteText,
        createdAt: new Date().toISOString(),
        createdBy: 'Admin User',
      };
      setAdminNotes([...adminNotes, newNote]);

      // Update payment notes
      setPayments(
        payments.map((p) =>
          p.paymentId === selectedPayment.paymentId
            ? {
                ...p,
                adminNotes: (p.adminNotes ? p.adminNotes + '\n' : '') + noteText,
              }
            : p
        )
      );

      setNoteText('');
      if (selectedPayment) {
        setSelectedPayment({
          ...selectedPayment,
          adminNotes: (selectedPayment.adminNotes ? selectedPayment.adminNotes + '\n' : '') + noteText,
        });
      }
    }
  };

  const handleRefund = () => {
    if (selectedPayment) {
      setPayments(
        payments.map((p) =>
          p.paymentId === selectedPayment.paymentId
            ? {
                ...p,
                status: 'refunded',
                adminReviewed: true,
                adminNotes: `${p.adminNotes}\nManual refund processed by admin`,
              }
            : p
        )
      );

      if (selectedPayment) {
        setSelectedPayment({
          ...selectedPayment,
          status: 'refunded',
          adminReviewed: true,
          adminNotes: `${selectedPayment.adminNotes}\nManual refund processed by admin`,
        });
      }

      setShowRefundDialog(false);
    }
  };

  const handleMarkReviewed = () => {
    if (selectedPayment) {
      setPayments(
        payments.map((p) =>
          p.paymentId === selectedPayment.paymentId
            ? { ...p, adminReviewed: true }
            : p
        )
      );

      setSelectedPayment({ ...selectedPayment, adminReviewed: true });
    }
  };

  const handleFlagPayment = () => {
    if (selectedPayment) {
      setPayments(
        payments.map((p) =>
          p.paymentId === selectedPayment.paymentId
            ? { ...p, flagged: true, flagReason }
            : p
        )
      );

      setSelectedPayment({ ...selectedPayment, flagged: true, flagReason });
      setShowFlagDialog(false);
      setFlagReason('');
    }
  };

  const getStatusBadge = (status: Payment['status']) => {
    const config = {
      success: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      failed: { color: 'bg-red-100 text-red-800', icon: XCircle },
      refunded: { color: 'bg-blue-100 text-blue-800', icon: RotateCw },
    };

    const { color, icon: Icon } = config[status];

    return (
      <Badge className={`${color} capitalize`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getMethodLabel = (method: Payment['paymentMethod']) => {
    const labels = {
      card: 'Credit Card',
      mobile_banking: 'Mobile Banking',
      wallet: 'Wallet',
      bank_transfer: 'Bank Transfer',
    };
    return labels[method];
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
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{summaryStats.today.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{summaryStats.today.successfulCount} successful payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Week Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{summaryStats.week.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{summaryStats.week.successfulCount} successful payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.all.pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              ৳{payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toLocaleString()} pending
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
              {summaryStats.all.failedCount + summaryStats.all.refundedCount}
            </div>
            <p className="text-xs text-muted-foreground">
              ৳{summaryStats.all.totalRefunded.toLocaleString()} refunded
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

            <Select value={filterStatus} onValueChange={(value: any) => {
              setFilterStatus(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterMethod} onValueChange={(value: any) => {
              setFilterMethod(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="card">Credit Card</SelectItem>
                <SelectItem value="mobile_banking">Mobile Banking</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
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
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <p className="text-gray-600">
              Showing {paginatedPayments.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            >
              <ArrowUpDown className="w-4 h-4 mr-1" />
              {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
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
                  <TableHead className="text-right w-24">Fee/Payout</TableHead>
                  <TableHead className="w-28">Method</TableHead>
                  <TableHead className="w-20">Status</TableHead>
                  <TableHead className="w-32">Date</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPayments.map((payment) => (
                  <TableRow key={payment.paymentId} className={payment.flagged ? 'bg-orange-50' : ''}>
                    <TableCell className="font-mono text-sm">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">
                              {payment.paymentId.substring(0, 6)}...
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {payment.paymentId}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help">
                              {payment.bookingId.substring(0, 6)}...
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {payment.bookingId}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{payment.userName}</p>
                        <p className="text-xs text-gray-500">{payment.workerName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ৳{payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      <div>
                        <p>Fee: ৳{payment.platformFee.toLocaleString()}</p>
                        <p className="text-gray-500">Out: ৳{payment.workerPayout.toLocaleString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getMethodLabel(payment.paymentMethod)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(payment.status)}
                        {payment.flagged && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Flag className="w-4 h-4 text-orange-600 fill-orange-600" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Flagged: {payment.flagReason}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(payment.transactionDate), 'MMM dd, HH:mm')}
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
              className="w-8 h-8 p-0"
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
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
              {selectedPayment?.paymentId} - {selectedPayment?.bookingId}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">User</p>
                  <p className="text-sm font-semibold">{selectedPayment.userName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Worker</p>
                  <p className="text-sm font-semibold">{selectedPayment.workerName}</p>
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

              {/* Fee Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Fee Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Amount</span>
                    <span className="font-medium">৳{selectedPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Platform Fee (10%)</span>
                    <span className="font-medium">৳{selectedPayment.platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900 font-semibold">Worker Payout</span>
                    <span className="font-bold text-green-600">৳{selectedPayment.workerPayout.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-600">Payment Method</p>
                  <p>{getMethodLabel(selectedPayment.paymentMethod)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Gateway Reference</p>
                  <p className="font-mono text-xs">{selectedPayment.gatewayReferenceId}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Transaction Date</p>
                  <p>{format(new Date(selectedPayment.transactionDate), 'MMM dd, yyyy HH:mm')}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Admin Reviewed</p>
                  <p>{selectedPayment.adminReviewed ? '✓ Yes' : '✗ No'}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Admin Notes</h4>
                <p className="text-sm text-gray-700 mb-3">
                  {selectedPayment.adminNotes || 'No notes added yet'}
                </p>
                <div className="space-y-2">
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

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                {!selectedPayment.adminReviewed && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleMarkReviewed}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Reviewed
                  </Button>
                )}

                {selectedPayment.status === 'success' && !selectedPayment.flagged && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowRefundDialog(true)}
                    >
                      <RotateCw className="w-4 h-4 mr-2" />
                      Refund
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowFlagDialog(true)}
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Flag Payment
                    </Button>
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRefund} className="bg-red-600 hover:bg-red-700">
            Confirm Refund
          </AlertDialogAction>
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
