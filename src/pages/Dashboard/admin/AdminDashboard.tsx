import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Star,
  ArrowRight,
  RefreshCcw,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dashboardService } from '@/services/dashboardService';
import {
  DashboardSummary,
  BookingStats,
  RevenueStats,
  ComplaintStats,
  ReviewStats,
  RecentActivities,
} from '@/types/dashboard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

/**
 * AdminDashboard Component
 * 
 * Comprehensive overview dashboard showing key metrics and statistics.
 */
const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  // State for different data sections
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [complaintStats, setComplaintStats] = useState<ComplaintStats | null>(null);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivities | null>(null);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [summaryRes, bookingsRes, revenueRes, complaintsRes, reviewsRes, activitiesRes] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getBookingStats(dateRange),
        dashboardService.getRevenueStats(dateRange),
        dashboardService.getComplaintStats(),
        dashboardService.getReviewStats(),
        dashboardService.getRecentActivities(10),
      ]);

      console.log("Summary: ", summaryRes);
      console.log("booking Statistics: ", bookingsRes);
      console.log("Revenue Statistics: ", revenueRes);
      console.log("Complaints", complaintsRes);
      console.log("recent-acti", activitiesRes);
      console.log("Review Statistics: ", reviewsRes);
      

      if (summaryRes.success && summaryRes.data) setSummary(summaryRes.data);
      if (bookingsRes.success && bookingsRes.data) setBookingStats(bookingsRes.data);
      if (revenueRes.success && revenueRes.data) setRevenueStats(revenueRes.data);
      if (complaintsRes.success && complaintsRes.data) setComplaintStats(complaintsRes.data);
      if (reviewsRes.success && reviewsRes.data) setReviewStats(reviewsRes.data);
      if (activitiesRes.success && activitiesRes.data) setRecentActivities(activitiesRes.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and key metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchDashboardData}
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Users */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/users')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.users.total.toLocaleString() || '0'}</div>
            <div className="flex items-center mt-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              {summary?.users.new || 0} new
            </div>
          </CardContent>
        </Card>

        {/* Total Workers */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/workers')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Workers</CardTitle>
            <Briefcase className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.workers.total.toLocaleString() || '0'}</div>
            <div className="flex items-center mt-1 text-xs text-orange-600">
              <Clock className="w-3 h-3 mr-1" />
              {summary?.workers.pending_verification || 0} pending
            </div>
          </CardContent>
        </Card>

        {/* Active Bookings */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/bookings')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Bookings</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.bookings.active.toLocaleString() || '0'}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {summary?.bookings.total.toLocaleString() || 0} total
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{summary?.revenue.total.toLocaleString() || '0'}</div>
            <div className="text-xs text-muted-foreground mt-1">All time</div>
          </CardContent>
        </Card>

        {/* Platform Earnings */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Platform Earnings</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{summary?.revenue.platform_earnings.toLocaleString() || '0'}</div>
            <div className="text-xs text-muted-foreground mt-1">Commission</div>
          </CardContent>
        </Card>

        {/* Pending Complaints */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/complaints')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Complaints</CardTitle>
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(complaintStats?.open || 0) + (complaintStats?.under_review || 0)}</div>
            <div className="text-xs text-red-600 mt-1">
              {complaintStats?.open || 0} open
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings & Revenue Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Bookings Overview</CardTitle>
                <CardDescription>Booking trends over selected period</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/bookings')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {bookingStats?.labels && bookingStats.labels.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={bookingStats.labels.map((label, index) => ({
                    date: label,
                    bookings: bookingStats.data[index]
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} name="Total Bookings" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-xs text-green-700">Completed</div>
                    <div className="text-lg font-bold text-green-900">{bookingStats.status_breakdown.completed}</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-xs text-blue-700">Ongoing</div>
                    <div className="text-lg font-bold text-blue-900">{bookingStats.status_breakdown.ongoing}</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="text-xs text-red-700">Cancelled</div>
                    <div className="text-lg font-bold text-red-900">{bookingStats.status_breakdown.cancelled}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No booking data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue & Payments</CardTitle>
                <CardDescription>Revenue trends over selected period</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {revenueStats?.daily_revenue && revenueStats.daily_revenue.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={revenueStats.daily_revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#3b82f6" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <div className="text-xs text-orange-700">Pending Payouts</div>
                    <div className="text-lg font-bold text-orange-900">৳{revenueStats.pending_payouts.toLocaleString()}</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="text-xs text-red-700">Refunds</div>
                    <div className="text-lg font-bold text-red-900">৳{revenueStats.refunds.toLocaleString()}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No revenue data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Complaints & Reviews Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints & Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Complaints & Alerts</CardTitle>
                <CardDescription>Recent urgent complaints</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/complaints')}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xs text-red-700 mb-1">Open</div>
                <div className="text-2xl font-bold text-red-900">{complaintStats?.open || 0}</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-xs text-yellow-700 mb-1">Under Review</div>
                <div className="text-2xl font-bold text-yellow-900">{complaintStats?.under_review || 0}</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xs text-orange-700 mb-1">Awaiting</div>
                <div className="text-2xl font-bold text-orange-900">{complaintStats?.awaiting_response || 0}</div>
              </div>
            </div>
            <div className="space-y-2">
              {complaintStats?.urgent && complaintStats.urgent.length > 0 ? (
                complaintStats.urgent.slice(0, 5).map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={complaint.priority === 'high' ? 'destructive' : 'secondary'}>
                          {complaint.priority}
                        </Badge>
                        <span className="text-sm font-medium">{complaint.category}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <Badge variant="outline">{complaint.status}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">No urgent complaints</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reviews & Ratings */}
        <Card>
          <CardHeader>
            <CardTitle>Reviews & Ratings</CardTitle>
            <CardDescription>Platform rating overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold">{reviewStats?.average_rating.toFixed(1) || '0.0'}</div>
                <div className="flex items-center justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(reviewStats?.average_rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {reviewStats?.total_reviews || 0} reviews
                </div>
              </div>
              <div className="flex-1 ml-6 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="text-muted-foreground">New reviews:</span>
                  <span className="font-semibold">{reviewStats?.new_reviews || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-muted-foreground">Low ratings (≤2★):</span>
                  <span className="font-semibold text-red-600">{reviewStats?.low_ratings || 0}</span>
                </div>
              </div>
            </div>
            {reviewStats?.rating_distribution && (
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const key = `${rating}_star` as keyof typeof reviewStats.rating_distribution;
                  const count = reviewStats.rating_distribution[key] || 0;
                  const percentage = reviewStats.total_reviews ? (count / reviewStats.total_reviews) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-xs w-8">{rating}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs w-12 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Recent Bookings */}
            {recentActivities?.recent_bookings && recentActivities.recent_bookings.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Recent Bookings
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recentActivities.recent_bookings.map((booking) => (
                    <Card key={booking.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={
                            booking.status === 'completed' ? 'default' : 
                            booking.status === 'accepted' ? 'secondary' : 
                            'outline'
                          }>
                            {booking.status}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full ${
                            booking.status === 'completed' ? 'bg-green-500' : 
                            booking.status === 'accepted' ? 'bg-blue-500' : 
                            'bg-gray-500'
                          }`}></div>
                        </div>
                        <p className="text-sm font-medium mb-1">{booking.users_orders_client_idTousers.full_name}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">৳{booking.total_amount}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(booking.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Users */}
            {recentActivities?.recent_users && recentActivities.recent_users.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Recent Users
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {recentActivities.recent_users.slice(0, 4).map((user) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={user.role === 'worker' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full ${
                            user.role === 'worker' ? 'bg-purple-500' : 'bg-blue-500'
                          }`}></div>
                        </div>
                        <p className="text-sm font-medium mb-1 truncate">{user.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate mb-2">{user.email}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Complaints */}
            {recentActivities?.recent_complaints && recentActivities.recent_complaints.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Recent Complaints
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recentActivities.recent_complaints.map((complaint) => (
                    <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={
                            complaint.priority === 'high' ? 'destructive' : 
                            complaint.priority === 'medium' ? 'default' : 
                            'outline'
                          }>
                            {complaint.priority}
                          </Badge>
                          <Badge variant="outline">{complaint.status}</Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">{complaint.category}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {(!recentActivities || 
              (!recentActivities.recent_bookings?.length && 
               !recentActivities.recent_users?.length && 
               !recentActivities.recent_complaints?.length)) && (
              <div className="text-center py-8 text-muted-foreground">No recent activity</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
