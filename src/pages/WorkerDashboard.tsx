import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Camera,
  Edit,
  Save,
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
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  // Form states for editing
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    nidNumber: "",
    address: "",
    dateOfBirth: "",
    speciality: "",
    experience: "",
    certification: "",
    serviceAreas: "",
    hourlyRate: "",
    availability: "",
  });

  // Mock data - replace with real API calls
  const stats = {
    todayAppointments: 0,
    confirmed: 0,
    pending: 0,
    availableSlots: 0,
  };

  const servicesInProgress: ServiceInProgress[] = [];

  const serviceRequests: ServiceRequest[] = [];

  const upcomingDays: UpcomingDay[] = [
    { date: "Fri, Oct 17", appointments: 0, availableSlots: 0 },
    { date: "Sat, Oct 18", appointments: 0, availableSlots: 0 },
    { date: "Sun, Oct 19", appointments: 0, availableSlots: 0 },
    { date: "Mon, Oct 20", appointments: 0, availableSlots: 0 },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileUpdate = () => {
    // Validate NID number (should be 10 or 13 or 17 digits)
    const nidRegex = /^(\d{10}|\d{13}|\d{17})$/;
    if (profileForm.nidNumber && !nidRegex.test(profileForm.nidNumber)) {
      alert("Please provide a valid NID number (10, 13, or 17 digits)");
      return;
    }

    // TODO: API call to update profile
    console.log("Updating profile:", profileForm);
    setEditProfileOpen(false);
    // Show success message
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.todayAppointments}</p>
                <p className="text-xs text-gray-500 mt-2">Total bookings for today</p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-green-500 hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.confirmed}</p>
                <p className="text-xs text-gray-500 mt-2">Ready to start</p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-orange-500 hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-xs text-gray-500 mt-2">Awaiting confirmation</p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-purple-500 hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Available Slots</p>
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.availableSlots}</p>
                <p className="text-xs text-gray-500 mt-2">Open for bookings</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Content - Service In Process */}
              <div className="lg:col-span-3 space-y-6">
                {/* Service In Process */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-orange-500 flex items-center">
                      <ClipboardList className="h-6 w-6 mr-2" />
                      Service In Process (Today)
                    </h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {servicesInProgress.length} active
                    </span>
                  </div>
                  <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              User Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Task
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Progress
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Email address
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {servicesInProgress.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center justify-center">
                                  <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
                                  <p className="text-gray-600 text-lg font-medium">No services in progress</p>
                                  <p className="text-gray-400 text-sm mt-2">Active services will appear here</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            servicesInProgress.map((service) => (
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
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>

                {/* Service Request */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-orange-500 flex items-center">
                      <Bell className="h-6 w-6 mr-2" />
                      Service Request
                    </h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {serviceRequests.length} pending
                    </span>
                  </div>
                  <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              User Name
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Task
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Location
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Email address
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {serviceRequests.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center justify-center">
                                  <Bell className="h-16 w-16 text-gray-300 mb-4" />
                                  <p className="text-gray-600 text-lg font-medium">No service requests</p>
                                  <p className="text-gray-400 text-sm mt-2">New requests will appear here</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            serviceRequests.map((request) => (
                              <tr key={request.id} className="hover:bg-gray-50 transition-colors">
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
                                  <Button 
                                    size="sm"
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4"
                                  >
                                    View Details
                                  </Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Sidebar - Upcoming Days */}
              <div className="lg:col-span-1">
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                  <h2 className="text-xl font-bold">Upcoming Days</h2>
                </div>
                <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-6">
                    {upcomingDays.map((day, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0 hover:bg-gray-50 p-2 rounded transition-colors cursor-pointer">
                        <div className="flex items-center mb-3">
                          <Calendar className="h-4 w-4 text-orange-500 mr-2" />
                          <span className="text-sm font-semibold text-gray-700">{day.date}</span>
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
            <h2 className="text-2xl font-bold text-orange-500 mb-6">Service Request</h2>
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
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-lg font-medium">No service request available now</p>
                          <p className="text-gray-400 text-sm mt-2">New service requests will appear here</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );
      case "service-history":
        return (
          <div>
            <h2 className="text-2xl font-bold text-orange-500 mb-6">Service History</h2>
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
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <History className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-lg font-medium">No service history available now</p>
                          <p className="text-gray-400 text-sm mt-2">Completed services will appear here</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );
      case "account":
        return (
          <div>
            <h2 className="text-2xl font-bold text-orange-500 mb-6">Account Information</h2>
            
            {/* Profile Header Card */}
            <Card className="p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Profile Picture */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {user?.name?.charAt(0).toUpperCase() || "W"}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-colors">
                    <Camera className="h-5 w-5" />
                  </button>
                </div>

                {/* Profile Summary */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || "Worker Name"}</h3>
                  <p className="text-gray-600 mb-2">{user?.email || "email@example.com"}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      Professional Worker
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-green-700" />
                      0.0 Rating
                    </span>
                  </div>
                  <div className="flex gap-3 justify-center md:justify-start">
                    <Button 
                      onClick={() => setEditProfileOpen(true)}
                      className="bg-orange-500 hover:bg-orange-600 text-white flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                      View Public Profile
                    </Button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-gray-500">Services</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">৳0</p>
                    <p className="text-xs text-gray-500">Earned</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-xs text-gray-500">Reviews</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <User className="h-5 w-5 mr-2 text-orange-500" />
                    Personal Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-base text-gray-900 mt-1">{user?.name || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-base text-gray-900 mt-1">{user?.email || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="text-base text-gray-900 mt-1">{user?.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">NID Number</label>
                    <p className="text-base text-gray-900 mt-1">Not provided</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-base text-gray-900 mt-1">Not provided</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-base text-gray-900 mt-1">Not provided</p>
                  </div>
                </div>
              </Card>

              {/* Professional Information */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-orange-500" />
                    Professional Information
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Work Speciality</label>
                    <p className="text-base text-gray-900 mt-1">Not provided</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Work Experience</label>
                    <p className="text-base text-gray-900 mt-1">Not provided</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Certification</label>
                    <p className="text-base text-gray-900 mt-1">Not provided</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Service Areas</label>
                    <p className="text-base text-gray-900 mt-1">Not provided</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Hourly Rate</label>
                    <p className="text-base text-gray-900 mt-1">Not provided</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Availability</label>
                    <p className="text-base text-gray-900 mt-1">Not provided</p>
                  </div>
                </div>
              </Card>

              {/* Account Statistics */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2 text-orange-500" />
                  Account Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Total Services Completed</span>
                    <span className="text-lg font-semibold text-gray-900">0</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Total Earnings</span>
                    <span className="text-lg font-semibold text-green-600">৳ 0</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Average Rating</span>
                    <span className="text-lg font-semibold text-gray-900 flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                      0.0
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Pending Services</span>
                    <span className="text-lg font-semibold text-orange-600">0</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-500">Member Since</span>
                    <span className="text-lg font-semibold text-gray-900">2025</span>
                  </div>
                </div>
              </Card>

              {/* Account Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-orange-500" />
                  Account Settings
                </h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => setEditProfileOpen(true)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white justify-start"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update Profile Information
                  </Button>
                  <Button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 justify-start">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Profile Picture
                  </Button>
                  <Button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
                  </Button>
                  <Button className="w-full bg-white border border-red-300 text-red-600 hover:bg-red-50 justify-start mt-4">
                    Deactivate Account
                  </Button>
                </div>
              </Card>
            </div>
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

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-orange-500 flex items-center">
              <Edit className="h-6 w-6 mr-2" />
              Update Profile Information
            </DialogTitle>
            <DialogDescription>
              Update your personal and professional details. Email cannot be changed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center border-b pb-2">
                <User className="h-5 w-5 mr-2 text-orange-500" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address (Read-only)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nid">NID Number * (10, 13, or 17 digits)</Label>
                  <Input
                    id="nid"
                    value={profileForm.nidNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, nidNumber: e.target.value })}
                    placeholder="Enter valid NID number"
                    maxLength={17}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={profileForm.dateOfBirth}
                  onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  placeholder="Enter your full address"
                  rows={2}
                />
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center border-b pb-2">
                <Star className="h-5 w-5 mr-2 text-orange-500" />
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="speciality">Work Speciality *</Label>
                  <Input
                    id="speciality"
                    value={profileForm.speciality}
                    onChange={(e) => setProfileForm({ ...profileForm, speciality: e.target.value })}
                    placeholder="e.g., Electrician, Plumber"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Work Experience</Label>
                  <Input
                    id="experience"
                    value={profileForm.experience}
                    onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                    placeholder="e.g., 5 years"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certification">Certification</Label>
                <Input
                  id="certification"
                  value={profileForm.certification}
                  onChange={(e) => setProfileForm({ ...profileForm, certification: e.target.value })}
                  placeholder="Enter your certifications"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceAreas">Service Areas</Label>
                <Textarea
                  id="serviceAreas"
                  value={profileForm.serviceAreas}
                  onChange={(e) => setProfileForm({ ...profileForm, serviceAreas: e.target.value })}
                  placeholder="e.g., Dhaka, Chittagong, Sylhet"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (৳)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={profileForm.hourlyRate}
                    onChange={(e) => setProfileForm({ ...profileForm, hourlyRate: e.target.value })}
                    placeholder="500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    value={profileForm.availability}
                    onChange={(e) => setProfileForm({ ...profileForm, availability: e.target.value })}
                    placeholder="e.g., Mon-Fri, 9AM-6PM"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditProfileOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProfileUpdate}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkerDashboard;
