import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';

/**
 * AdminDashboardLayout Component
 * 
 * Main layout for the admin dashboard with a fixed sidebar and dynamic content area.
 * Uses React Router's Outlet to render nested routes.
 */
const AdminDashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Fixed Sidebar - Left Section */}
      <AdminSidebar />

      {/* Main Content Area - Right Section */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
