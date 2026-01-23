import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Package,
  Calendar,
  CreditCard,
  Star,
  MessageSquare,
  MapPin,
  FileText,
  Settings,
  Home,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

/**
 * Navigation item type definition
 */
interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

/**
 * Admin navigation items configuration
 */
const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Workers', icon: Briefcase, href: '/admin/workers' },
  { label: 'Services', icon: Package, href: '/admin/services' },
  { label: 'Bookings', icon: Calendar, href: '/admin/bookings' },
  { label: 'Payments', icon: CreditCard, href: '/admin/payments' },
  { label: 'Reviews', icon: Star, href: '/admin/reviews' },
  { label: 'Complaints', icon: MessageSquare, href: '/admin/complaints' },
  { label: 'Reports', icon: FileText, href: '/admin/reports' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

/**
 * AdminSidebar Component
 * 
 * Fixed navigation sidebar for admin dashboard.
 * Features:
 * - Fixed width (256px)
 * - Scrollable content
 * - Active route highlighting
 * - Icon + label navigation items
 */
const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Worksure</h1>
        <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
      </div>

      {/* Navigation Items - Scrollable */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'w-5 h-5',
                          isActive ? 'text-blue-700' : 'text-gray-500'
                        )}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* User Profile Section */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-700">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@worksure.com</p>
          </div>
        </div>

        {/* Home Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors border border-gray-200"
        >
          <Home className="w-5 h-5 text-gray-500" />
          <span>Go to Home</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors border border-red-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
