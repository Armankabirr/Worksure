import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, Download, MoreVertical, Eye, Ban, CheckCircle, Users, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import UserDetailsDialog from './components/UserDetailsDialog';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

/**
 * User type definition (based on API response)
 */
interface User {
  id: string;
  name: string;
  avatar: string | null;
  email: string;
  phone: string;
  status: 'active' | 'suspended';
  bookingCount: number;
  joinedDate: string;
  gender: string;
  lastLoginAt: string | null;
}

/**
 * AdminUsers Component
 * 
 * Full-featured users management page with:
 * - Real-time data fetching from API
 * - Search and filtering capabilities
 * - Users table with sorting
 * - Row actions (view, suspend, activate)
 * - Bulk selection
 * - Pagination support
 * - Loading, empty, and error states
 */
const AdminUsers = () => {
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<'bookingCount' | 'joinedDate' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  /**
   * Fetch users from API
   */
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await axiosPublic.get('/userRoutes/users');
      return response.data;
    },
    select: (data) => data || [],
  });

  /**
   * Filter users based on search query and filters
   */
  const filteredUsers = (users || []).filter((user) => {
    // Search filter
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.includes(searchQuery) ||
      user.id?.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /**
   * Sort users based on selected field and direction
   */
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortField) return 0;

    let comparison = 0;
    if (sortField === 'bookingCount') {
      comparison = a.bookingCount - b.bookingCount;
    } else if (sortField === 'joinedDate') {
      comparison = new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  /**
   * Handle sort column click
   */
  const handleSort = (field: 'bookingCount' | 'joinedDate') => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with default desc direction
      setSortField(field);
      setSortDirection('desc');
    }
  };

  /**
   * Get sort icon for column
   */
  const getSortIcon = (field: 'bookingCount' | 'joinedDate') => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  /**
   * Pagination calculations
   */
  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, pageSize]);

  /**
   * Handle user suspension/activation with API call
   */
  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, currentStatus }: { userId: string; currentStatus: 'active' | 'suspended' }) => {
      // Use different endpoints based on current status
      if (currentStatus === 'active') {
        // Suspend the user
        const response = await axiosPublic.patch(`/userRoutes/suspendUser/${userId}`, {
          status: "suspended",
        });
        return response.data;
      } else {
        // Activate the user
        const response = await axiosPublic.patch(`/userRoutes/activateUser/${userId}`, {
          status: "active",
        });
        return response.data;
      }
    },
    onSuccess: () => {
      // Refresh user list
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Success',
        description: 'User status updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update user status',
        variant: 'destructive',
      });
    },
  });

  const handleToggleStatus = (userId: string, currentStatus: 'active' | 'suspended') => {
    toggleUserStatusMutation.mutate({ userId, currentStatus });
  };

  /**
   * Handle bulk selection
   */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(sortedUsers.map((u) => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  /**
   * Handle individual user selection
   */
  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
  };

  /**
   * Get status badge styling
   */
  const getStatusBadge = (status?: 'active' | 'suspended') => {
    if (!status) {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Unknown
        </Badge>
      );
    }
    
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
   * Get user initials for avatar
   */
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load users
          </h3>
          <p className="text-gray-500 mb-4">
            {error instanceof Error ? error.message : 'An error occurred while fetching users'}
          </p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-users'] })}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  /**
   * No data state
   */
  if (!users || users.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-2">Manage platform customers</p>
        </div>
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500">
                There are no users in the system yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-2">Manage platform customers</p>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>Search and filter users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, phone, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing{' '}
          <span className="font-semibold">
            {sortedUsers.length > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, sortedUsers.length)}
          </span>{' '}
          of <span className="font-semibold">{sortedUsers.length}</span> users
          {selectedUsers.size > 0 && (
            <span className="ml-2">
              ({selectedUsers.size} selected)
            </span>
          )}
        </p>
      </div>

      {/* Users Table */}
      {sortedUsers.length === 0 ? (
        // Empty State
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedUsers.size === sortedUsers.length &&
                          sortedUsers.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 font-medium hover:bg-gray-100"
                        onClick={() => handleSort('bookingCount')}
                      >
                        Bookings
                        <span className="ml-2">
                          {getSortIcon('bookingCount')}
                        </span>
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 font-medium hover:bg-gray-100"
                        onClick={() => handleSort('joinedDate')}
                      >
                        Joined Date
                        <span className="ml-2">
                          {getSortIcon('joinedDate')}
                        </span>
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      {/* Checkbox */}
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.has(user.id)}
                          onCheckedChange={(checked) =>
                            handleSelectUser(user.id, checked as boolean)
                          }
                        />
                      </TableCell>

                      {/* User Info */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-semibold text-blue-700">
                                {getUserInitials(user.name)}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.name}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="text-gray-700">
                        {user.email}
                      </TableCell>

                      {/* Phone */}
                      <TableCell className="text-gray-700">
                        {user.phone}
                      </TableCell>

                      {/* Status */}
                      <TableCell>{getStatusBadge(user.status)}</TableCell>

                      {/* Booking Count */}
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-sm font-medium text-blue-700">
                          {user.bookingCount}
                        </span>
                      </TableCell>

                      {/* Joined Date */}
                      <TableCell className="text-gray-700">
                        {new Date(user.joinedDate).toLocaleDateString('en-US', {
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
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setIsDetailsOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(user.id, user.status)}
                              className={
                                user.status === 'active'
                                  ? 'text-red-600'
                                  : 'text-green-600'
                              }
                              disabled={toggleUserStatusMutation.isPending}
                            >
                              {user.status === 'active' ? (
                                <>
                                  <Ban className="w-4 h-4 mr-2" />
                                  Suspend User
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Activate User
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => setPageSize(Number(value))}
                >
                  <SelectTrigger className="w-20">
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

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {totalPages <= 7 ? (
                    // Show all pages if 7 or fewer
                    Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))
                  ) : (
                    // Show ellipsis for many pages
                    <>
                      {/* First page */}
                      <Button
                        variant={currentPage === 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        className="w-8 h-8 p-0"
                      >
                        1
                      </Button>
                      
                      {currentPage > 3 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      
                      {/* Pages around current */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          return page > 1 && 
                                 page < totalPages && 
                                 page >= currentPage - 1 && 
                                 page <= currentPage + 1;
                        })
                        .map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                      
                      {currentPage < totalPages - 2 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      
                      {/* Last page */}
                      {totalPages > 1 && (
                        <Button
                          variant={currentPage === totalPages ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-8 h-8 p-0"
                        >
                          {totalPages}
                        </Button>
                      )}
                    </>
                  )}
                </div>
                
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

      {/* User Details Dialog */}
      <UserDetailsDialog
        userId={selectedUserId}
        open={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
};

export default AdminUsers;
