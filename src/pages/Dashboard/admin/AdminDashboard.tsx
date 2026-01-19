import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Stat card type definition
 */
interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Mock statistics data
 */
const stats: StatCard[] = [
  {
    title: 'Total Users',
    value: '2,543',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Active Workers',
    value: '1,247',
    change: '+8.2%',
    trend: 'up',
    icon: Briefcase,
  },
  {
    title: 'Total Bookings',
    value: '5,892',
    change: '+15.3%',
    trend: 'up',
    icon: Calendar,
  },
  {
    title: 'Revenue',
    value: '$45,231',
    change: '-3.1%',
    trend: 'down',
    icon: DollarSign,
  },
];

/**
 * AdminDashboard Component
 * 
 * Overview dashboard showing key metrics and statistics.
 */
const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="w-4 h-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center mt-1">
                  <TrendIcon
                    className={`w-4 h-4 mr-1 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New user registered</p>
                  <p className="text-xs text-gray-500">John Doe joined the platform</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Booking completed</p>
                  <p className="text-xs text-gray-500">Electrician service #5892</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">15 minutes ago</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">New review posted</p>
                  <p className="text-xs text-gray-500">5-star rating for AC Doctor</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
