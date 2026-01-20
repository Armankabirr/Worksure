import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  FileText,
  Briefcase,
  ClipboardList,
  MapPin,
  Star,
  Users as UsersIcon,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import WorkerDetailsDialog from './components/WorkerDetailsDialog';

/**
 * Worker type definition (based on API response)
 */
interface Worker {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  verification: 'verified' | 'pending' | 'rejected' | 'unverified';
  avg_rating: number;
  total_reviews: number;
  services_count: number;
  documents_count: number;
  has_address: boolean;
  status: 'active' | 'suspended';
  years_experience: number;
  total_hirings: number;
  created_at: string;
  last_login_at: string | null;
}

/**
 * AdminWorkers Component
 * 
 * Full-featured workers management page with:
 * - Real-time data fetching from API
 * - Advanced search and filtering capabilities
 * - Workers table with sorting
 * - Row actions (view, verify, suspend, activate)
 * - Bulk selection and actions
 * - Pagination support
 * - Loading, empty, and error states
 * - Worker details dialog with tabs
 */
const AdminWorkers = () => {
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedWorkers, setSelectedWorkers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  /**
   * Fetch workers from API
   */
  const { data: workers, isLoading, error } = useQuery<Worker[]>({
    queryKey: ['admin-workers'],
    queryFn: async () => {
      const response = await axiosPublic.get('/workerRoutes/workers');
      return response.data;
    },
    select: (data) => data || [],
  });

  /**
   * Filter workers based on search query and filters
   */
  const filteredWorkers = (workers || []).filter((worker) => {
    // Search filter
    const matchesSearch =
      worker.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.phone?.includes(searchQuery) ||
      worker.id?.toLowerCase().includes(searchQuery.toLowerCase());

    // Verification filter
    const matchesVerification =
      verificationFilter === 'all' || worker.verification === verificationFilter;

    // Status filter
    const matchesStatus =
      statusFilter === 'all' || worker.status === statusFilter;

    // Category filter
    const matchesCategory =
      categoryFilter === 'all' || worker.category === categoryFilter;

    // Rating filter
    const matchesRating = (() => {
      if (ratingFilter === 'all') return true;
      if (ratingFilter === '5') return worker.avg_rating === 5;
      if (ratingFilter === '4') return worker.avg_rating >= 4;
      if (ratingFilter === '3') return worker.avg_rating >= 3;
      return true;
    })();

    return (
      matchesSearch &&
      matchesVerification &&
      matchesStatus &&
      matchesCategory &&
      matchesRating
    );
  });

  /**
   * Pagination
   */
  const totalPages = Math.ceil(filteredWorkers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedWorkers = filteredWorkers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, verificationFilter, statusFilter, categoryFilter, ratingFilter, pageSize]);

  /**
   * Get unique categories from workers
   */
  const categories = Array.from(new Set(workers?.map((w) => w.category) || []));

  /**
   * Handle worker suspension/activation with API call
   */
  const toggleWorkerStatusMutation = useMutation({
    mutationFn: async ({ workerId, currentStatus }: { workerId: string; currentStatus: 'active' | 'suspended' }) => {
      if (currentStatus === 'active') {
        const response = await axiosPublic.patch(`/userRoutes/suspendUser/${workerId}`, {
          status: 'suspended',
        });
        return response.data;
      } else {
        const response = await axiosPublic.patch(`/userRoutes/activateUser/${workerId}`);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-workers'] });
      toast({
        title: 'Success',
        description: 'Worker status updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update worker status',
        variant: 'destructive',
      });
    },
  });

  const handleToggleStatus = (workerId: string, currentStatus: 'active' | 'suspended') => {
    toggleWorkerStatusMutation.mutate({ workerId, currentStatus });
  };

  /**
   * Handle bulk selection
   */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedWorkers(new Set(paginatedWorkers.map((w) => w.id)));
    } else {
      setSelectedWorkers(new Set());
    }
  };

  /**
   * Handle individual worker selection
   */
  const handleSelectWorker = (workerId: string, checked: boolean) => {
    const newSelected = new Set(selectedWorkers);
    if (checked) {
      newSelected.add(workerId);
    } else {
      newSelected.delete(workerId);
    }
    setSelectedWorkers(newSelected);
  };

  /**
   * Get verification badge styling
   */
  const getVerificationBadge = (verification: Worker['verification']) => {
    const badges = {
      verified: (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      ),
      pending: (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      ),
      rejected: (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      ),
      unverified: (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          <AlertCircle className="w-3 h-3 mr-1" />
          Unverified
        </Badge>
      ),
    };
    return badges[verification] || badges.unverified;
  };

  /**
   * Get status badge styling
   */
  const getStatusBadge = (status: 'active' | 'suspended') => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        Suspended
      </Badge>
    );
  };

  /**
   * Render star rating
   */
  const renderStarRating = (rating: number, reviewCount: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
        <span className="text-gray-500 text-sm">({reviewCount})</span>
      </div>
    );
  };

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
   * Generate page numbers for pagination
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Workers</h1>
        <p className="text-gray-500 mt-2">Manage service providers and verification</p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by name, phone, email, worker ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>

            {/* Filters Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Verification Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Verification</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Account Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Service Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">★★★★★ (5.0)</SelectItem>
                  <SelectItem value="4">★★★★☆+ (4.0+)</SelectItem>
                  <SelectItem value="3">★★★☆☆+ (3.0+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedWorkers.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-900">
                {selectedWorkers.size} worker(s) selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Verify Selected
                </Button>
                <Button size="sm" variant="outline">
                  Suspend Selected
                </Button>
                <Button size="sm" variant="outline">
                  Export Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workers Table */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500">Loading workers...</p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-red-600 mb-2">Failed to load workers</p>
              <p className="text-sm text-gray-500">
                {error instanceof Error ? error.message : 'An error occurred'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : filteredWorkers.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No workers found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Workers ({filteredWorkers.length})
              </span>
              <div className="flex items-center gap-2 text-sm font-normal">
                <span className="text-gray-500">Rows per page:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => setPageSize(Number(value))}
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          paginatedWorkers.length > 0 &&
                          paginatedWorkers.every((worker) =>
                            selectedWorkers.has(worker.id)
                          )
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedWorkers.map((worker) => (
                    <TableRow key={worker.id}>
                      {/* Checkbox */}
                      <TableCell>
                        <Checkbox
                          checked={selectedWorkers.has(worker.id)}
                          onCheckedChange={(checked) =>
                            handleSelectWorker(worker.id, checked as boolean)
                          }
                        />
                      </TableCell>

                      {/* Worker Name & Avatar */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={worker.profile_picture} alt={worker.name} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {getUserInitials(worker.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {worker.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {worker.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {worker.category}
                        </Badge>
                      </TableCell>

                      {/* Verification Status */}
                      <TableCell>{getVerificationBadge(worker.verification)}</TableCell>

                      {/* Rating */}
                      <TableCell>
                        {worker.total_reviews > 0 ? (
                          renderStarRating(worker.avg_rating, worker.total_reviews)
                        ) : (
                          <span className="text-gray-400 text-sm">No reviews</span>
                        )}
                      </TableCell>

                      {/* Services Count */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span>{worker.services_count}</span>
                        </div>
                      </TableCell>

                      {/* Documents Count */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span>{worker.documents_count}</span>
                        </div>
                      </TableCell>

                      {/* Experience */}
                      <TableCell>
                        <span className="text-sm">{worker.years_experience}y</span>
                      </TableCell>

                      {/* Joined Date */}
                      <TableCell>
                        {new Date(worker.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedWorkerId(worker.id);
                                setIsDetailsOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="w-4 h-4 mr-2" />
                              View Documents
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Briefcase className="w-4 h-4 mr-2" />
                              View Services
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ClipboardList className="w-4 h-4 mr-2" />
                              View Bookings
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Star className="w-4 h-4 mr-2" />
                              View Reviews
                            </DropdownMenuItem>
                            {worker.verification === 'pending' && (
                              <>
                                <DropdownMenuItem className="text-green-600">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Verify Worker
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject Verification
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(worker.id, worker.status)}
                              className={
                                worker.status === 'active'
                                  ? 'text-red-600'
                                  : 'text-green-600'
                              }
                              disabled={toggleWorkerStatusMutation.isPending}
                            >
                              {worker.status === 'active' ? (
                                <>
                                  <Ban className="w-4 h-4 mr-2" />
                                  Suspend Worker
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Activate Worker
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredWorkers.length)} of{' '}
                {filteredWorkers.length} workers
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                
                {getPageNumbers().map((page, index) => (
                  <Button
                    key={index}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages || totalPages === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Worker Details Dialog */}
      <WorkerDetailsDialog
        workerId={selectedWorkerId}
        open={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedWorkerId(null);
        }}
      />
    </div>
  );
};

export default AdminWorkers;
