import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  ClipboardList,
  History,
  User,
  Star,
  Gift,
  Bell,
  Calendar,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ServiceInProgress {
  id: string;
  userName: string;
  avatar: string;
  task: string;
  progress: number;
  email: string;
  status: "Pending" | "Done";
}

interface ServiceRequest {
  id: string;
  userName: string;
  avatar: string;
  task: string;
  location: string;
  email: string;
  status: "Pending" | "Confirmed";
}

interface UpcomingDay {
  date: string;
  appointments: number;
  availableSlots: number;
}

const WorkerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock data - replace with real API calls
  const stats = {
    todayAppointments: 12,
    confirmed: 9,
    pending: 3,
    availableSlots: 4,
  };

  const servicesInProgress: ServiceInProgress[] = [
    {
      id: "1",
      userName: "Kristin Watson",
      avatar: "/placeholder.svg",
      task: "Ac Repair",
      progress: 0,
      email: "michelle.rivera@example.com",
      status: "Pending",
    },
    {
      id: "2",
      userName: "Cody Fisher",
      avatar: "/placeholder.svg",
      task: "Ac Filter Cleaning",
      progress: 100,
      email: "nathan.roberts@example.com",
      status: "Done",
    },
    {
      id: "3",
      userName: "Marvin McKinney",
      avatar: "/placeholder.svg",
      task: "Ac installation",
      progress: 100,
      email: "debbie.baker@example.com",
      status: "Done",
    },
  ];

  const serviceRequests: ServiceRequest[] = [
    {
      id: "1",
      userName: "Leslie Alexander",
      avatar: "/placeholder.svg",
      task: "Ac Cooling Problem",
      location: "Bashundhara R/A, Dhaka",
      email: "tim.jennings@example.com",
      status: "Pending",
    },
  ];

  const upcomingDays: UpcomingDay[] = [
    { date: "Fri, Oct 17", appointments: 8, availableSlots: 4 },
    { date: "Sat, Oct 18", appointments: 6, availableSlots: 6 },
    { date: "Sun, Oct 19", appointments: 10, availableSlots: 2 },
    { date: "Mon, Oct 20", appointments: 5, availableSlots: 7 },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Today's Appointments</p>
                <p className="text-3xl font-bold">{stats.todayAppointments}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Confirmed</p>
                <p className="text-3xl font-bold">{stats.confirmed}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Pending</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Available Slots</p>
                <p className="text-3xl font-bold">{stats.availableSlots}</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content - Service In Process */}
              <div className="lg:col-span-3 space-y-6">
                {/* Service In Process */}
                <div>
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">
                    Service In Process (Today)
                  </h2>
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Task
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Progress
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email address
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {servicesInProgress.map((service) => (
                            <tr key={service.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {service.userName}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {service.task}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {service.progress}%
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {service.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    service.status === "Done"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {service.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>

                {/* Service Request */}
                <div>
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Service Request</h2>
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Task
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email address
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {serviceRequests.map((request) => (
                            <tr key={request.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {request.userName}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {request.task}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                  {request.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button className="text-orange-600 hover:text-orange-900">
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Sidebar - Upcoming Days */}
              <div className="lg:col-span-1">
                <h2 className="text-xl font-bold mb-4">Upcoming Days</h2>
                <Card className="p-4">
                  <div className="space-y-6">
                    {upcomingDays.map((day, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-center mb-3">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium">{day.date}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Appointments</span>
                            <span className="font-semibold">{day.appointments}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Available Slots</span>
                            <span
                              className={`font-semibold ${
                                day.availableSlots < 5 ? "text-red-600" : "text-green-600"
                              }`}
                            >
                              {day.availableSlots}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </>
        );
      case "service-request":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Service Request</h2>
            <Card className="p-6">
              <p className="text-gray-500">Service request content coming soon...</p>
            </Card>
          </div>
        );
      case "service-history":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Service History</h2>
            <Card className="p-6">
              <p className="text-gray-500">Service history content coming soon...</p>
            </Card>
          </div>
        );
      case "account":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Account</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-lg">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-lg">{user?.phone}</p>
                </div>
              </div>
            </Card>
          </div>
        );
      case "rating":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Rating</h2>
            <Card className="p-6">
              <p className="text-gray-500">Rating content coming soon...</p>
            </Card>
          </div>
        );
      case "features":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <Card className="p-6">
              <p className="text-gray-500">Features content coming soon...</p>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-orange-500 text-white rounded-lg"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen md:h-auto z-40 bg-orange-500 text-white flex flex-col transition-all duration-300 ${
          sidebarMinimized ? "w-20" : "w-64"
        } ${mobileMenuOpen ? "w-64" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center justify-center ${sidebarMinimized ? "hidden" : ""}`}>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
            </div>
            <h1 className="ml-3 text-xl font-bold">WorkSure</h1>
          </div>
          {!sidebarMinimized && (
            <button
              onClick={() => setSidebarMinimized(true)}
              className="hidden md:block p-1 hover:bg-orange-600 rounded transition-colors"
              title="Minimize sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>

        {sidebarMinimized && (
          <button
            onClick={() => setSidebarMinimized(false)}
            className="hidden md:flex justify-center p-2 hover:bg-orange-600 rounded transition-colors mx-2 mb-2"
            title="Expand sidebar"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === "dashboard"
                ? "bg-orange-700 text-white"
                : "text-white hover:bg-orange-600"
            }`}
            title={sidebarMinimized ? "Dashboard" : ""}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            {!sidebarMinimized && <span className="ml-3">Dashboard</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("service-request");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === "service-request"
                ? "bg-orange-700 text-white"
                : "text-white hover:bg-orange-600"
            }`}
            title={sidebarMinimized ? "Service Request" : ""}
          >
            <ClipboardList className="h-5 w-5 flex-shrink-0" />
            {!sidebarMinimized && <span className="ml-3">Service Request</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("service-history");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === "service-history"
                ? "bg-orange-700 text-white"
                : "text-white hover:bg-orange-600"
            }`}
            title={sidebarMinimized ? "Service History" : ""}
          >
            <History className="h-5 w-5 flex-shrink-0" />
            {!sidebarMinimized && <span className="ml-3">Service History</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("account");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === "account"
                ? "bg-orange-700 text-white"
                : "text-white hover:bg-orange-600"
            }`}
            title={sidebarMinimized ? "Account" : ""}
          >
            <User className="h-5 w-5 flex-shrink-0" />
            {!sidebarMinimized && <span className="ml-3">Account</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("rating");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === "rating"
                ? "bg-orange-700 text-white"
                : "text-white hover:bg-orange-600"
            }`}
            title={sidebarMinimized ? "Rating" : ""}
          >
            <Star className="h-5 w-5 flex-shrink-0" />
            {!sidebarMinimized && <span className="ml-3">Rating</span>}
          </button>
        </nav>

        {/* Features Button */}
        <div className="p-4">
          <button
            onClick={() => {
              setActiveTab("features");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
              activeTab === "features"
                ? "bg-orange-700 text-white"
                : "text-white hover:bg-orange-600"
            }`}
            title={sidebarMinimized ? "Features" : ""}
          >
            <div className="flex items-center">
              <Gift className="h-5 w-5 flex-shrink-0" />
              {!sidebarMinimized && <span className="ml-3">Features</span>}
            </div>
            {!sidebarMinimized && <span className="px-2 py-0.5 bg-orange-700 text-xs rounded">NEW</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Your trusted partner for
              </h2>
              <p className="text-sm text-gray-600">quick, reliable services</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-blue-500 rounded-full"></span>
              </button>
              <Button
                onClick={handleLogout}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Log out
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8">{renderContent()}</main>
      </div>
    </div>
  );
};

export default WorkerDashboard;
