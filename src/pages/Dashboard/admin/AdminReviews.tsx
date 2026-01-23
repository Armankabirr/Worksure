import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reviewService } from '@/services/reviewService';
import { Review, ReviewFilters, ReviewStats } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  Search,
  Filter,
  RefreshCcw,
  EyeOff,
  Flag,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Loader2,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const AdminReviews = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean;
    type: 'approve' | 'hide' | 'flag' | 'delete' | null;
    review: Review | null;
    reason: string;
  }>({ isOpen: false, type: null, review: null, reason: '' });

  const [filters, setFilters] = useState<ReviewFilters>({
    search: '',
    status: 'all',
    rating: 'all',
    category: '',
    section: '',
    dateFrom: '',
    dateTo: '',
    flaggedOnly: false,
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [filters, currentPage, sortBy, sortOrder]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await reviewService.getAllReviews(
        filters,
        currentPage,
        10,
        sortBy,
        sortOrder
      );

      if (response.success) {
        setReviews(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalCount(response.pagination?.totalCount || 0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await reviewService.getReviewStats(
        filters.dateFrom,
        filters.dateTo
      );
      if (response.success) {
        setStats(response.data || null);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (key: keyof ReviewFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      rating: 'all',
      category: '',
      section: '',
      dateFrom: '',
      dateTo: '',
      flaggedOnly: false,
    });
    setCurrentPage(1);
  };

  const handleAction = (type: 'approve' | 'hide' | 'flag' | 'delete', review: Review) => {
    setActionDialog({ isOpen: true, type, review, reason: '' });
  };

  const handleConfirmAction = async () => {
    if (!actionDialog.review) return;

    try {
      let response;
      const reviewId = actionDialog.review.review_id;

      switch (actionDialog.type) {
        case 'approve':
          response = await reviewService.approveReview(reviewId);
          break;
        case 'hide':
          response = await reviewService.hideReview(reviewId, actionDialog.reason);
          break;
        case 'flag':
          response = await reviewService.flagReview(reviewId, actionDialog.reason);
          break;
        case 'delete':
          response = await reviewService.deleteReview(reviewId, actionDialog.reason);
          break;
      }

      if (response?.success) {
        toast({
          title: 'Success',
          description: `Review ${actionDialog.type}d successfully`,
        });
        fetchReviews();
        fetchStats();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${actionDialog.type} review`,
        variant: 'destructive',
      });
    }

    setActionDialog({ isOpen: false, type: null, review: null, reason: '' });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getTruncatedWords = (text: string, wordCount: number = 3) => {
    const words = text.split(' ');
    if (words.length <= wordCount) return text;
    return words.slice(0, wordCount).join(' ') + '...';
  };

  const truncateIdDisplay = (id: string, charCount: number = 8) => {
    if (id.length <= charCount) return id;
    return id.substring(0, charCount) + '...';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-gray-600 mt-1">Monitor, moderate, and analyze user reviews</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 hidden"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              fetchReviews();
              fetchStats();
            }}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      {stats && (
        <div className="space-y-4">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card className="">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <p className="text-2xl font-bold">{stats.total_reviews}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <p className="text-2xl font-bold">{stats.average_rating.toFixed(1)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">5 Stars</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <p className="text-2xl font-bold">{stats.by_rating[5] || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">4 Stars</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <p className="text-2xl font-bold">{stats.by_rating[4] || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">3 Stars</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <p className="text-2xl font-bold">{stats.by_rating[3] || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Below 3 Stars</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-gray-300" />
                  <p className="text-2xl font-bold">{(stats.by_rating[2] || 0) + (stats.by_rating[1] || 0)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rating Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Breakdown</CardTitle>
              <CardDescription>Distribution of reviews by rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.by_rating[rating] || 0;
                  const percentage = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-12">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600 w-12 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Filter reviews by various criteria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="User, worker, or booking ID..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <Label>Rating</Label>
                <Select
                  value={filters.rating.toString()}
                  onValueChange={(value) =>
                    handleFilterChange('rating', value === 'all' ? 'all' : parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <Label>Date From</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <Label>Date To</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>

              {/* Flagged Only Toggle */}
              <div className="space-y-2">
                <Label>Show Flagged Only</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    checked={filters.flaggedOnly}
                    onCheckedChange={(checked) => handleFilterChange('flaggedOnly', checked)}
                  />
                  <Label className="text-sm text-gray-600">
                    {filters.flaggedOnly ? 'Yes' : 'No'}
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={handleClearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Reviews</CardTitle>
              <CardDescription>
                Showing {reviews.length} of {totalCount} reviews
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm">Sort by:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reviews found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Review ID</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="min-w-[250px]">Comment</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.review_id}>
                      <TableCell className="font-mono text-xs">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">
                                {truncateIdDisplay(review.review_id)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{review.review_id}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>{renderStars(review.rating)}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-sm cursor-help">
                                  {getTruncatedWords(review.comment, 3)}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <p>{review.comment}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {review.user ? review.user.name : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {review.worker ? (
                            <>
                              <p>{review.worker.name}</p>
                              <p className="text-xs text-gray-500">
                                ★ {review.worker.avg_rating}
                              </p>
                            </>
                          ) : (
                            'N/A'
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {review.service ? (
                            <>
                              <p className="font-medium">{review.service.category}</p>
                              <p className="text-xs text-gray-500">{review.service.section}</p>
                            </>
                          ) : (
                            'N/A'
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {review.booking_id ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0 font-mono text-xs cursor-help"
                                >
                                  {truncateIdDisplay(review.booking_id)}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{review.booking_id}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(review.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction('delete', review)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Complete information about this review
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-500">Review ID</Label>
                <p className="font-mono text-sm">{selectedReview.review_id}</p>
              </div>


              <Separator />

              <div>
                <Label className="text-sm text-gray-500">Rating</Label>
                <div className="mt-1">{renderStars(selectedReview.rating)}</div>
              </div>

              <div>
                <Label className="text-sm text-gray-500">Review Comment</Label>
                <p className="mt-1 text-sm bg-gray-50 p-3 rounded-md">{selectedReview.comment}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">User</Label>
                  <p className="text-sm font-medium">
                    {selectedReview.user ? selectedReview.user.name : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Worker</Label>
                  <p className="text-sm font-medium">
                    {selectedReview.worker ? selectedReview.worker.name : 'N/A'}
                  </p>
                  {selectedReview.worker && (
                    <p className="text-xs text-gray-500">
                      Avg Rating: ★ {selectedReview.worker.avg_rating.toFixed(1)}
                    </p>
                  )}
                </div>
              </div>

              {selectedReview.service && (
                <div>
                  <Label className="text-sm text-gray-500">Service</Label>
                  <p className="text-sm font-medium">{selectedReview.service.category}</p>
                  <p className="text-xs text-gray-500">{selectedReview.service.section}</p>
                </div>
              )}

              {selectedReview.booking_id && (
                <div>
                  <Label className="text-sm text-gray-500">Booking ID</Label>
                  <Button
                    variant="link"
                    className="h-auto p-0 font-mono text-sm"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      navigate(`/admin/bookings/${selectedReview.booking_id}`);
                    }}
                  >
                    {selectedReview.booking_id}
                  </Button>
                </div>
              )}

              <Separator />

              <div>
                <Label className="text-sm text-gray-500">Created At</Label>
                <p className="text-sm">
                  {format(new Date(selectedReview.created_at), 'MMMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <AlertDialog
        open={actionDialog.isOpen}
        onOpenChange={(open) =>
          !open && setActionDialog({ isOpen: false, type: null, review: null, reason: '' })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.type === 'approve' && 'Approve Review'}
              {actionDialog.type === 'hide' && 'Hide Review'}
              {actionDialog.type === 'flag' && 'Flag Review'}
              {actionDialog.type === 'delete' && 'Delete Review'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.type === 'approve' &&
                'Are you sure you want to approve this review? It will be visible to all users.'}
              {actionDialog.type === 'hide' &&
                'Are you sure you want to hide this review? It will not be visible to users.'}
              {actionDialog.type === 'flag' &&
                'Are you sure you want to flag this review as abusive or fake?'}
              {actionDialog.type === 'delete' &&
                'Are you sure you want to permanently delete this review? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {(actionDialog.type === 'hide' ||
            actionDialog.type === 'flag' ||
            actionDialog.type === 'delete') && (
            <div className="space-y-2">
              <Label>Reason {actionDialog.type !== 'delete' && '(Optional)'}</Label>
              <Textarea
                placeholder="Enter reason..."
                value={actionDialog.reason}
                onChange={(e) =>
                  setActionDialog((prev) => ({ ...prev, reason: e.target.value }))
                }
                rows={3}
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={
                actionDialog.type === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : ''
              }
            >
              {actionDialog.type === 'approve' && 'Approve'}
              {actionDialog.type === 'hide' && 'Hide'}
              {actionDialog.type === 'flag' && 'Flag'}
              {actionDialog.type === 'delete' && 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminReviews;
