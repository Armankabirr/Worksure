import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Lock,
  Clock,
  MapPin,
  CheckCircle,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  DollarSign,
} from "lucide-react";

// Extra item interface for additional work items
interface ExtraItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  status: "pending" | "approved" | "rejected";
}

// Extended interface for service requests with extra items
interface ApiServiceRequest {
  id: string;
  client_id?: string;
  assigned_worker_id?: string;
  selected_date?: string | null;
  selected_time?: string | null;
  address?: string | null;
  description?: string | null;
  status?: string | null;
  total_amount?: number | null;
  payment_completed?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  work_start?: string | null;
  work_end?: string | null;
  users_orders_client_idTousers?: any;
  extra_items?: ExtraItem[];
  base_price?: number;
  labor_cost?: number;
}

interface UpcomingDay {
  date: string;
  appointments: number;
  availableSlots: number;
}

const WorkerDashboard = () => {
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Mock notifications
  const [notifications] = useState([
    {
      id: 1,
      title: "New Service Request",
      message: "You have a new service request from Sarah Johnson for electrical work.",
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
    },
    {
      id: 2,
      title: "Service Completed",
      message: "Your service for Ahmed Hassan has been completed and rated 5 stars.",
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: false,
    },
    {
      id: 3,
      title: "Payment Received",
      message: "You have received ৳2,500 payment for the plumbing service.",
      timestamp: new Date(Date.now() - 1 * 86400000),
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Saved profile data that will be displayed
  const [savedProfile, setSavedProfile] = useState({
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
    avatarUrl: "",
  });

  // Form states for editing
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    avatarUrl: "",
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

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) return;

    setProfileForm((prev) => ({
      ...prev,
      name: user.name,
      phone: user.phone,
      email: user.email,
      avatarUrl: user.avatar || prev.avatarUrl,
    }));

    setSavedProfile((prev) => ({
      ...prev,
      name: user.name,
      phone: user.phone,
      avatarUrl: user.avatar || prev.avatarUrl,
    }));
  }, [user]);

  const [serviceRequests, setServiceRequests] = useState<ApiServiceRequest[]>([]);
  const [serviceRequestsLoading, setServiceRequestsLoading] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<ApiServiceRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelRequestId, setCancelRequestId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  // Complete work dialog states
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [completeRequestId, setCompleteRequestId] = useState<string | null>(null);
  const [completeForm, setCompleteForm] = useState({
    workStartTime: "",
    workEndTime: "",
    completionNotes: "",
  });

  // Extra items state management
  const [extraItems, setExtraItems] = useState<ExtraItem[]>([]);
  const [newExtraItem, setNewExtraItem] = useState({ name: "", quantity: 1, unitPrice: 0 });
  const [extraItemsLoading, setExtraItemsLoading] = useState(false);
  const [savingExtraItems, setSavingExtraItems] = useState(false);

  // Pricing breakdown dialog
  const [pricingDialogOpen, setPricingDialogOpen] = useState(false);
  const [selectedPricingWork, setSelectedPricingWork] = useState<ApiServiceRequest | null>(null);

  const [workHistory, setWorkHistory] = useState<ApiServiceRequest[]>([]);
  const [workHistoryLoading, setWorkHistoryLoading] = useState(false);
  const [historyTab, setHistoryTab] = useState("all");

  const axiosPublic = useAxiosPublic();
  const { toast } = useToast();

  // Fetch work history
  useEffect(() => {
    async function fetchWorkHistory() {
      if (!user?.email) return;
      setWorkHistoryLoading(true);
      try {
        const res = await axiosPublic.get(`/workerRoutes/hirings/${user?.email}`);
        const items = res.data?.data || res.data || [];
        setWorkHistory(items);
      } catch (err) {
        console.error("Error fetching work history:", err);
        setWorkHistory([]);
      } finally {
        setWorkHistoryLoading(false);
      }
    }
    fetchWorkHistory();
  }, [axiosPublic, user?.email]);

  // Helper: check if a date is today
  function isToday(dateStr: string | null | undefined): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  // Helper: check if a date is in the future
  function isFuture(dateStr: string | null | undefined): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    return date > now;
  }

  // Helper: get countdown string
  function getCountdown(dateStr: string | null | undefined, timeStr?: string | null): string {
    if (!dateStr) return "";
    let targetStr = dateStr;
    if (timeStr) {
      // Combine date and time for more accurate countdown
      targetStr = `${dateStr.split('T')[0]}T${timeStr}`;
    }
    const target = new Date(targetStr);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    if (diff <= 0) return "";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  }

  // Compute stats from work history
  // Include "accepted" as confirmed status since API may return "accepted"
  const isConfirmedStatus = (status: string | null | undefined) => 
    ["confirmed", "Confirmed", "accepted", "Accepted", "in_progress", "IN_PROGRESS"].includes(status || "");
  const isPendingStatus = (status: string | null | undefined) => 
    ["pending", "Pending"].includes(status || "");
  const isCompletedStatus = (status: string | null | undefined) => 
    ["completed", "Completed", "done", "Done"].includes(status || "");
  const isCancelledStatus = (status: string | null | undefined) => 
    ["cancelled", "Cancelled", "canceled", "Canceled"].includes(status || "");
  const isCompletedByWorkerStatus = (status: string | null | undefined) =>
    ["completed_by_worker", "COMPLETED_BY_WORKER"].includes(status || "");
  const isInProgressStatus = (status: string | null | undefined) =>
    ["in_progress", "IN_PROGRESS", "confirmed", "Confirmed", "accepted", "Accepted"].includes(status || "");

  const todaysWorks = workHistory.filter((w) => isToday(w.selected_date) && isConfirmedStatus(w.status));
  const upcomingWorks = workHistory.filter((w) => isFuture(w.selected_date) && !isToday(w.selected_date) && isConfirmedStatus(w.status));
  const confirmedWorks = workHistory.filter((w) => isConfirmedStatus(w.status) && !isCompletedByWorkerStatus(w.status));
  const pendingWorks = workHistory.filter((w) => isPendingStatus(w.status));
  const completedWorks = workHistory.filter((w) => isCompletedStatus(w.status));
  const cancelledWorks = workHistory.filter((w) => isCancelledStatus(w.status));
  const awaitingConfirmationWorks = workHistory.filter((w) => isCompletedByWorkerStatus(w.status));

  const stats = {
    todayAppointments: todaysWorks.length,
    confirmed: confirmedWorks.length,
    pending: pendingWorks.length,
    availableSlots: 10 - todaysWorks.length, // Assuming max 10 slots per day
  };

  useEffect(() => {
    async function fetchServiceRequests() {
      setServiceRequestsLoading(true);
      try {
        const res = await axiosPublic.get(
          `/workerRoutes/hirings/requests/${user?.email}`
        );

        // Accept either data.data or data
        const items = res.data?.data || res.data || [];
        setServiceRequests(items);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error fetching service requests:", err);
        setServiceRequests([]);
      } finally {
        setServiceRequestsLoading(false);
      }
    }

    fetchServiceRequests();
  }, [axiosPublic]);

  async function acceptRequest(id: string) {
    setActionLoading(true);
    try {
      await axiosPublic.patch(`/orderRoutes/acceptWorkRequest/${id}`, {
        workerEmail: user?.email,
      });

      // Update local state
      setServiceRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Confirmed" } : r)));
      setSelectedRequest((prev) => (prev && prev.id === id ? { ...prev, status: "Confirmed" } : prev));
    } catch (err) {
      console.error("Error accepting request:", err);
      toast({
        title: "Error",
        description: "Failed to accept request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  }

  // Fetch extra items for a specific work order
  async function fetchExtraItems(orderId: string) {
    setExtraItemsLoading(true);
    try {
      const res = await axiosPublic.get(`/orderRoutes/extraItems/${orderId}`);
      const items = res.data?.data || res.data || [];
      setExtraItems(items);
    } catch (err) {
      console.error("Error fetching extra items:", err);
      setExtraItems([]);
    } finally {
      setExtraItemsLoading(false);
    }
  }

  // Add new extra item
  function addExtraItem() {
    if (!newExtraItem.name.trim()) {
      toast({
        title: "Item Name Required",
        description: "Please provide a name for the extra item.",
        variant: "destructive",
      });
      return;
    }
    if (newExtraItem.unitPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please provide a valid unit price.",
        variant: "destructive",
      });
      return;
    }

    const newItem: ExtraItem = {
      id: `temp-${Date.now()}`,
      name: newExtraItem.name.trim(),
      quantity: newExtraItem.quantity,
      unitPrice: newExtraItem.unitPrice,
      status: "pending",
    };
    setExtraItems((prev) => [...prev, newItem]);
    setNewExtraItem({ name: "", quantity: 1, unitPrice: 0 });
  }

  // Remove extra item (only pending ones)
  function removeExtraItem(itemId: string) {
    setExtraItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  // Update extra item
  function updateExtraItem(itemId: string, field: keyof ExtraItem, value: string | number) {
    setExtraItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  }

  // Check if there are pending extra items
  const hasPendingExtraItems = extraItems.some((item) => item.status === "pending");

  // Calculate total extra items cost
  const calculateExtraItemsTotal = () => {
    return extraItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  };

  function openCompleteDialog(id: string) {
    setCompleteRequestId(id);
    // Set default times
    const now = new Date();
    const defaultEndTime = now.toTimeString().slice(0, 5);
    // Default start time is 1 hour before end time
    const startTime = new Date(now.getTime() - 60 * 60 * 1000);
    const defaultStartTime = startTime.toTimeString().slice(0, 5);
    
    setCompleteForm({
      workStartTime: defaultStartTime,
      workEndTime: defaultEndTime,
      completionNotes: "",
    });
    
    // Reset and fetch extra items
    setExtraItems([]);
    setNewExtraItem({ name: "", quantity: 1, unitPrice: 0 });
    fetchExtraItems(id);
    
    setCompleteDialogOpen(true);
  }

  // Save extra items to backend
  async function saveExtraItems() {
    if (!completeRequestId) return;
    
    setSavingExtraItems(true);
    try {
      await axiosPublic.post(`/orderRoutes/extraItems/${completeRequestId}`, {
        workerEmail: user?.email,
        extraItems: extraItems,
      });
      toast({
        title: "Success",
        description: "Extra items saved successfully!",
      });
    } catch (err) {
      console.error("Error saving extra items:", err);
      toast({
        title: "Error",
        description: "Failed to save extra items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingExtraItems(false);
    }
  }

  async function confirmCompleteWork() {
    if (!completeRequestId) return;

    // Validate required fields
    if (!completeForm.workStartTime || !completeForm.workEndTime) {
      toast({
        title: "Required Fields",
        description: "Please provide both work start and end times.",
        variant: "destructive",
      });
      return;
    }

    // Validate that end time is after start time
    if (completeForm.workStartTime >= completeForm.workEndTime) {
      toast({
        title: "Invalid Time Range",
        description: "Work end time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    // Check for pending extra items that need approval
    if (hasPendingExtraItems) {
      toast({
        title: "Pending Items",
        description: "Please wait for all extra items to be approved before completing.",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      // First, save extra items if any
      if (extraItems.length > 0) {
        await axiosPublic.post(`/orderRoutes/extraItems/${completeRequestId}`, {
          workerEmail: user?.email,
          extraItems: extraItems,
        });
      }

      // Mark as COMPLETED_BY_WORKER (not final completion)
      await axiosPublic.patch(`/orderRoutes/completeByWorker/${completeRequestId}`, {
        workerEmail: user?.email,
        workStartTime: completeForm.workStartTime,
        workEndTime: completeForm.workEndTime,
        completionNotes: completeForm.completionNotes.trim(),
        extraItems: extraItems,
      });
      
      // Update local state - mark as completed_by_worker (waiting for user confirmation)
      setWorkHistory((prev) => prev.map((w) => (w.id === completeRequestId ? { ...w, status: "completed_by_worker", extra_items: extraItems } : w)));
      setCompleteDialogOpen(false);
      setCompleteRequestId(null);
      setCompleteForm({ workStartTime: "", workEndTime: "", completionNotes: "" });
      setExtraItems([]);
      toast({
        title: "Submitted for Confirmation",
        description: "Work submitted! Waiting for user confirmation.",
      });
    } catch (err) {
      console.error("Error completing work:", err);
      toast({
        title: "Error",
        description: "Failed to submit work. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  }

  // Open pricing breakdown dialog
  function openPricingDialog(work: ApiServiceRequest) {
    setSelectedPricingWork(work);
    setPricingDialogOpen(true);
  }

  function openCancelDialog(id: string) {
    setCancelRequestId(id);
    setCancelReason("");
    setCancelDialogOpen(true);
  }

  async function confirmCancelRequest() {
    if (!cancelRequestId) return;
    if (!cancelReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for cancellation.",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      await axiosPublic.patch(`/orderRoutes/cancelWorkRequest/${cancelRequestId}`, {
        workerEmail: user?.email,
        reason: cancelReason.trim(),
      });
      // Update local state - both service requests and work history
      setServiceRequests((prev) => prev.map((r) => (r.id === cancelRequestId ? { ...r, status: "Cancelled" } : r)));
      setSelectedRequest((prev) => (prev && prev.id === cancelRequestId ? { ...prev, status: "Cancelled" } : prev));
      setWorkHistory((prev) => prev.map((w) => (w.id === cancelRequestId ? { ...w, status: "cancelled" } : w)));
      setCancelDialogOpen(false);
      setCancelRequestId(null);
      setCancelReason("");
      toast({
        title: "Success",
        description: "Work cancelled successfully.",
      });
    } catch (err) {
      console.error("Error cancelling request:", err);
      toast({
        title: "Error",
        description: "Failed to cancel request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  }

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

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload a valid image file.",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    const maxSizeBytes = 2 * 1024 * 1024; // 2MB limit to avoid huge previews
    if (file.size > maxSizeBytes) {
      toast({
        title: "File Too Large",
        description: "Image size should be under 2MB.",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setProfileForm((prev) => ({ ...prev, avatarUrl: dataUrl }));
      setSavedProfile((prev) => ({ ...prev, avatarUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const resetPasswordDialog = () => {
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setIsPasswordSaving(false);
  };

  const handlePasswordUpdate = async () => {
    setPasswordError("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setPasswordError("New password must be different from current password.");
      return;
    }

    try {
      setIsPasswordSaving(true);
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast({
        title: "Success",
        description: "Password updated successfully.",
      });
      setChangePasswordOpen(false);
      resetPasswordDialog();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update password.";
      setPasswordError(message);
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handleProfileUpdate = () => {
    // Validate NID number (should be 10 or 13 or 17 digits)
    const nidRegex = /^(\d{10}|\d{13}|\d{17})$/;
    if (profileForm.nidNumber && !nidRegex.test(profileForm.nidNumber)) {
      toast({
        title: "Invalid NID",
        description: "Please provide a valid NID number (10, 13, or 17 digits).",
        variant: "destructive",
      });
      return;
    }

    // TODO: API call to update profile
    console.log("Updating profile:", profileForm);
    
    // Update saved profile to display the new information
    setSavedProfile((prev) => ({
      ...prev,
      ...profileForm,
      avatarUrl: profileForm.avatarUrl || prev.avatarUrl,
    }));
    
    setEditProfileOpen(false);
    toast({
      title: "Success",
      description: "Profile updated successfully!",
    });
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
              {/* Main Content - Today's Works & Upcoming */}
              <div className="lg:col-span-3 space-y-6">
                {/* Today's Works */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-orange-500 flex items-center">
                      <ClipboardList className="h-6 w-6 mr-2" />
                      Today's Works
                    </h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {todaysWorks.length} scheduled
                    </span>
                  </div>
                  <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Client
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Service
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Time
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Countdown
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Location
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {todaysWorks.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center justify-center">
                                  <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
                                  <p className="text-gray-600 text-lg font-medium">No works scheduled for today</p>
                                  <p className="text-gray-400 text-sm mt-2">Accepted work for today will appear here</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            todaysWorks.map((work) => (
                              <tr key={work.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                      {(work.users_orders_client_idTousers?.select?.profile_picture || work.users_orders_client_idTousers?.profile_picture) && (
                                        <img
                                          src={work.users_orders_client_idTousers?.select?.profile_picture || work.users_orders_client_idTousers?.profile_picture}
                                          alt="Client"
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {work.users_orders_client_idTousers?.select?.full_name || work.users_orders_client_idTousers?.full_name || "Client"}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {work.description || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                    {work.selected_date ? new Date(work.selected_date).toLocaleDateString() : "-"} 
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {(() => {
                                    const countdown = getCountdown(work.selected_date, work.selected_time);
                                    return countdown ? (
                                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                        {countdown}
                                      </span>
                                    ) : (
                                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                        Now
                                      </span>
                                    );
                                  })()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                    {work.address || "-"}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {work.status || "confirmed"}
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

                {/* Upcoming Works */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-orange-500 flex items-center">
                      <Calendar className="h-6 w-6 mr-2" />
                      Upcoming Works
                    </h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {upcomingWorks.length} upcoming
                    </span>
                  </div>
                  <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Client
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Service
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Days Until
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Location
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {upcomingWorks.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center justify-center">
                                  <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                                  <p className="text-gray-600 text-lg font-medium">No upcoming works</p>
                                  <p className="text-gray-400 text-sm mt-2">Future scheduled works will appear here</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            upcomingWorks.map((work) => (
                              <tr key={work.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                      {(work.users_orders_client_idTousers?.select?.profile_picture || work.users_orders_client_idTousers?.profile_picture) && (
                                        <img
                                          src={work.users_orders_client_idTousers?.select?.profile_picture || work.users_orders_client_idTousers?.profile_picture}
                                          alt="Client"
                                          className="w-full h-full object-cover"
                                        />
                                      )}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {work.users_orders_client_idTousers?.select?.full_name || work.users_orders_client_idTousers?.full_name || "Client"}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {work.description || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                    {work.selected_date ? new Date(work.selected_date).toLocaleDateString() : "-"} {work.selected_time || ""}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {(() => {
                                    const countdown = getCountdown(work.selected_date, work.selected_time);
                                    return countdown ? (
                                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                        {countdown}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    );
                                  })()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                    {work.address || "-"}
                                  </div>
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
                            serviceRequests.map((request: ApiServiceRequest) => (
                              <tr
                                key={request.id}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setDetailsOpen(true);
                                }}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                      {(
                                        request.users_orders_client_idTousers?.select?.profile_picture ||
                                        request.users_orders_client_idTousers?.profile_picture
                                      ) ? (
                                        <img
                                          src={
                                            request.users_orders_client_idTousers?.select?.profile_picture ||
                                            request.users_orders_client_idTousers?.profile_picture
                                          }
                                          alt={
                                            request.users_orders_client_idTousers?.select?.full_name ||
                                            request.users_orders_client_idTousers?.full_name ||
                                            "Client"
                                          }
                                          className="w-full h-full object-cover"
                                        />
                                      ) : null}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {request.users_orders_client_idTousers?.select?.full_name || request.users_orders_client_idTousers?.full_name || "Client"}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {request.description || request.selected_time || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {request.address || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {request.users_orders_client_idTousers?.select?.email || request.users_orders_client_idTousers?.email || "-"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                    {request.status || "-"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white px-3"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      acceptRequest(request.id);
                                    }}
                                    disabled={actionLoading || request.status === "Confirmed"}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-600 border border-red-200 px-3"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openCancelDialog(request.id);
                                    }}
                                    disabled={actionLoading || request.status === "Cancelled"}
                                  >
                                    Cancel
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
                    {serviceRequestsLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg font-medium">Loading service requests...</p>
                          </div>
                        </td>
                      </tr>
                    ) : serviceRequests.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
                            <p className="text-gray-500 text-lg font-medium">No service request available now</p>
                            <p className="text-gray-400 text-sm mt-2">New service requests will appear here</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      serviceRequests.map((req: ApiServiceRequest) => (
                        <tr
                          key={req.id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedRequest(req);
                            setDetailsOpen(true);
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                {(req.users_orders_client_idTousers?.select?.profile_picture || req.users_orders_client_idTousers?.profile_picture) ? (
                                  <img
                                    src={req.users_orders_client_idTousers?.select?.profile_picture || req.users_orders_client_idTousers?.profile_picture}
                                    alt={req.users_orders_client_idTousers?.select?.full_name || req.users_orders_client_idTousers?.full_name || 'Client'}
                                    className="w-full h-full object-cover"
                                  />
                                ) : null}
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {req.users_orders_client_idTousers?.select?.full_name || req.users_orders_client_idTousers?.full_name || 'Client'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.description || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.total_amount != null ? `৳${req.total_amount}` : '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.address || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                              {req.status || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white px-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                acceptRequest(req.id);
                              }}
                              disabled={actionLoading || req.status === "Confirmed"}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 border border-red-200 px-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                openCancelDialog(req.id);
                              }}
                              disabled={actionLoading || req.status === "Cancelled"}
                            >
                              Cancel
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
        );
      case "service-history":
        const renderHistoryTable = (data: ApiServiceRequest[], emptyMessage: string, showActions: boolean = false) => (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {showActions && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={showActions ? 6 : 5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <History className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-lg font-medium">{emptyMessage}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                              {(item.users_orders_client_idTousers?.select?.profile_picture || item.users_orders_client_idTousers?.profile_picture) && (
                                <img
                                  src={item.users_orders_client_idTousers?.select?.profile_picture || item.users_orders_client_idTousers?.profile_picture}
                                  alt="Client"
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {item.users_orders_client_idTousers?.select?.full_name || item.users_orders_client_idTousers?.full_name || "Client"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.description || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.selected_date ? new Date(item.selected_date).toLocaleDateString() : "-"} {item.selected_time || ""}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.address || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isCompletedStatus(item.status) ? "bg-green-100 text-green-800" :
                            isCompletedByWorkerStatus(item.status) ? "bg-amber-100 text-amber-800" :
                            isConfirmedStatus(item.status) ? "bg-blue-100 text-blue-800" :
                            isCancelledStatus(item.status) ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            {isCompletedByWorkerStatus(item.status) ? "Awaiting Confirmation" : (item.status || "-")}
                          </span>
                        </td>
                        {showActions && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                            {/* Show Complete button for in-progress/confirmed tasks */}
                            {isInProgressStatus(item.status) && !isCompletedByWorkerStatus(item.status) && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white px-3"
                                  onClick={() => openCompleteDialog(item.id)}
                                  disabled={actionLoading}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Complete
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 border border-red-200 px-3"
                                  onClick={() => openCancelDialog(item.id)}
                                  disabled={actionLoading}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                            
                            {/* Show waiting state for completed_by_worker */}
                            {isCompletedByWorkerStatus(item.status) && (
                              <div className="flex items-center gap-2">
                                <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  <span className="text-sm font-medium">Waiting for User Confirmation</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-blue-600 border-blue-200 px-3"
                                  onClick={() => openPricingDialog(item)}
                                >
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  View Pricing
                                </Button>
                              </div>
                            )}
                            
                            {/* Show view pricing for completed tasks */}
                            {isCompletedStatus(item.status) && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-200 px-3"
                                onClick={() => openPricingDialog(item)}
                              >
                                <DollarSign className="h-4 w-4 mr-1" />
                                View Pricing
                              </Button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        );

        return (
          <div>
            <h2 className="text-2xl font-bold text-orange-500 mb-6">Service History</h2>
            {workHistoryLoading ? (
              <Card className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading work history...</p>
              </Card>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="all">All ({workHistory.length})</TabsTrigger>
                  <TabsTrigger value="confirmed">In Progress ({confirmedWorks.length})</TabsTrigger>
                  <TabsTrigger value="awaiting" className="text-amber-600">Awaiting ({awaitingConfirmationWorks.length})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({completedWorks.length})</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled ({cancelledWorks.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  {renderHistoryTable(workHistory, "No work history available", true)}
                </TabsContent>
                <TabsContent value="confirmed">
                  {renderHistoryTable(confirmedWorks, "No in-progress works", true)}
                </TabsContent>
                <TabsContent value="awaiting">
                  {renderHistoryTable(awaitingConfirmationWorks, "No works awaiting user confirmation", true)}
                </TabsContent>
                <TabsContent value="completed">
                  {renderHistoryTable(completedWorks, "No completed works", true)}
                </TabsContent>
                <TabsContent value="cancelled">
                  {renderHistoryTable(cancelledWorks, "No cancelled works")}
                </TabsContent>
              </Tabs>
            )}
          </div>
        );
      case "account":
        return (
          <div>
            <h2 className="text-2xl font-bold text-orange-500 mb-6">Account Information</h2>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            
            {/* Profile Header Card */}
            <Card className="p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Profile Picture */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg overflow-hidden">
                    {savedProfile.avatarUrl ? (
                      <img
                        src={savedProfile.avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || "W"
                    )}
                  </div>
                  <button
                    onClick={handleAvatarButtonClick}
                    className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </div>

                {/* Profile Summary */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{savedProfile.name || user?.name || "Worker Name"}</h3>
                  <p className="text-gray-600 mb-2">{user?.email || "email@example.com"}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {savedProfile.speciality || "Professional Worker"}
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
                    <p className="text-base text-gray-900 mt-1">{savedProfile.name || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-base text-gray-900 mt-1">{user?.email || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="text-base text-gray-900 mt-1">{savedProfile.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">NID Number</label>
                    <p className="text-base text-gray-900 mt-1">{savedProfile.nidNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-base text-gray-900 mt-1">{savedProfile.address || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-base text-gray-900 mt-1">{savedProfile.dateOfBirth || "Not provided"}</p>
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
                    <p className="text-base text-gray-900 mt-1">{savedProfile.speciality || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Work Experience</label>
                    <p className="text-base text-gray-900 mt-1">{savedProfile.experience || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Certification</label>
                    <p className="text-base text-gray-900 mt-1">{savedProfile.certification || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Service Areas</label>
                    <p className="text-base text-gray-900 mt-1">{savedProfile.serviceAreas || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Hourly Rate</label>
                    <p className="text-base text-gray-900 mt-1">{savedProfile.hourlyRate ? `৳${savedProfile.hourlyRate}` : "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Availability</label>
                    <p className="text-base text-gray-900 mt-1">{savedProfile.availability || "Not provided"}</p>
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
                  <Button
                    onClick={handleAvatarButtonClick}
                    className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Change Profile Picture
                  </Button>
                  <Button
                    onClick={() => {
                      setChangePasswordOpen(true);
                      resetPasswordDialog();
                    }}
                    className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 justify-start"
                  >
                    <Lock className="h-4 w-4 mr-2" />
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
        className={`fixed top-0 left-0 h-screen z-40 bg-orange-500 text-white flex flex-col transition-all duration-300 ${
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
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
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
            <ClipboardList className="h-5 w-5 flex-shrink-0" />
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

        {/* Home & Features Buttons */}
        <div className="p-4 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center px-4 py-3 rounded-lg transition-colors text-white hover:bg-orange-600"
            title={sidebarMinimized ? "Home" : ""}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            {!sidebarMinimized && <span className="ml-3">Home</span>}
          </Link>

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
      <div className={`flex-1 flex flex-col ${sidebarMinimized ? "md:ml-20" : "md:ml-64"} transition-all duration-300`}>
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
              <button
                onClick={() => setNotificationsOpen(true)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Notifications"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
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
                  <Select 
                    value={profileForm.speciality} 
                    onValueChange={(value) => setProfileForm({ ...profileForm, speciality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select speciality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electrician">Electrician</SelectItem>
                      <SelectItem value="Plumber">Plumber</SelectItem>
                      <SelectItem value="Carpenter">Carpenter</SelectItem>
                      <SelectItem value="AC Technician">AC Technician</SelectItem>
                      <SelectItem value="Painter">Painter</SelectItem>
                      <SelectItem value="Mechanic">Mechanic</SelectItem>
                      <SelectItem value="Cleaner">Cleaner</SelectItem>
                      <SelectItem value="Gardener">Gardener</SelectItem>
                      <SelectItem value="Security Guard">Security Guard</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Work Experience</Label>
                  <Select 
                    value={profileForm.experience} 
                    onValueChange={(value) => setProfileForm({ ...profileForm, experience: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                      <SelectItem value="1-2 years">1-2 years</SelectItem>
                      <SelectItem value="3-5 years">3-5 years</SelectItem>
                      <SelectItem value="6-10 years">6-10 years</SelectItem>
                      <SelectItem value="More than 10 years">More than 10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certification">Certification</Label>
                <Select 
                  value={profileForm.certification} 
                  onValueChange={(value) => setProfileForm({ ...profileForm, certification: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select certification status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Certified">Certified</SelectItem>
                    <SelectItem value="Trade License">Trade License</SelectItem>
                    <SelectItem value="Government Approved">Government Approved</SelectItem>
                    <SelectItem value="Self-trained">Self-trained</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Select 
                    value={profileForm.availability} 
                    onValueChange={(value) => setProfileForm({ ...profileForm, availability: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time (Mon-Sat)">Full-time (Mon-Sat)</SelectItem>
                      <SelectItem value="Part-time (Weekdays)">Part-time (Weekdays)</SelectItem>
                      <SelectItem value="Part-time (Weekends)">Part-time (Weekends)</SelectItem>
                      <SelectItem value="Flexible Hours">Flexible Hours</SelectItem>
                      <SelectItem value="Evening Only">Evening Only</SelectItem>
                      <SelectItem value="Morning Only">Morning Only</SelectItem>
                      <SelectItem value="On-Demand">On-Demand</SelectItem>
                    </SelectContent>
                  </Select>
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

      {/* Change Password Dialog */}
      <Dialog
        open={changePasswordOpen}
        onOpenChange={(open) => {
          setChangePasswordOpen(open);
          if (!open) {
            resetPasswordDialog();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center text-orange-500">
              <Lock className="h-5 w-5 mr-2" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Update your password to keep your account secure.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
              />
            </div>

            {passwordError && (
              <p className="text-sm text-red-600" role="alert">{passwordError}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setChangePasswordOpen(false);
                resetPasswordDialog();
              }}
              disabled={isPasswordSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordUpdate}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isPasswordSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isPasswordSaving ? "Saving..." : "Save Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center">
              <Bell className="h-5 w-5 mr-2 text-orange-500" />
              Notifications
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.read
                      ? "bg-gray-50 border-gray-200"
                      : "bg-orange-50 border-orange-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.read ? "bg-gray-400" : "bg-orange-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{notification.title}</p>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        {
                          (() => {
                            const now = new Date();
                            const diff = now.getTime() - notification.timestamp.getTime();
                            const mins = Math.floor(diff / 60000);
                            const hours = Math.floor(diff / 3600000);
                            const days = Math.floor(diff / 86400000);

                            if (mins < 1) return "just now";
                            if (mins < 60) return `${mins}m ago`;
                            if (hours < 24) return `${hours}h ago`;
                            return `${days}d ago`;
                          })()
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Request Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center text-orange-500">Service Request Details</DialogTitle>
          </DialogHeader>

          {selectedRequest ? (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                  {(selectedRequest.users_orders_client_idTousers?.select?.profile_picture || selectedRequest.users_orders_client_idTousers?.profile_picture) ? (
                    <img src={selectedRequest.users_orders_client_idTousers?.select?.profile_picture || selectedRequest.users_orders_client_idTousers?.profile_picture} alt={selectedRequest.users_orders_client_idTousers?.select?.full_name || 'Client'} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedRequest.users_orders_client_idTousers?.select?.full_name || selectedRequest.users_orders_client_idTousers?.full_name || 'Client'}</p>
                  <p className="text-sm text-gray-500">{selectedRequest.users_orders_client_idTousers?.select?.email || selectedRequest.users_orders_client_idTousers?.email || '-'}</p>
                  <p className="text-sm text-gray-500">{selectedRequest.users_orders_client_idTousers?.select?.phone || selectedRequest.users_orders_client_idTousers?.phone || '-'}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">Description</h4>
                <p className="text-sm text-gray-900">{selectedRequest.description || '-'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Address</h4>
                  <p className="text-sm text-gray-900">{selectedRequest.address || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Amount</h4>
                  <p className="text-sm text-gray-900">{selectedRequest.total_amount != null ? `৳${selectedRequest.total_amount}` : '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Selected Time</h4>
                  <p className="text-sm text-gray-900">{selectedRequest.selected_time || '-'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Status</h4>
                  <p className="text-sm text-gray-900">{selectedRequest.status || '-'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">No request selected</div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
            <div className="flex gap-2">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => selectedRequest && acceptRequest(selectedRequest.id)}
                disabled={actionLoading || selectedRequest?.status === "Confirmed"}
              >
                Accept
              </Button>
              <Button
                variant="ghost"
                className="text-red-600 border border-red-200"
                onClick={() => selectedRequest && openCancelDialog(selectedRequest.id)}
                disabled={actionLoading || selectedRequest?.status === "Cancelled"}
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Work Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              Complete Work
            </DialogTitle>
            <DialogDescription>
              Add work details and any extra items before submitting for user confirmation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Work Time Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Work Duration
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workStartTime">Start Time *</Label>
                  <Input
                    id="workStartTime"
                    type="time"
                    value={completeForm.workStartTime}
                    onChange={(e) => setCompleteForm((prev) => ({ ...prev, workStartTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workEndTime">End Time *</Label>
                  <Input
                    id="workEndTime"
                    type="time"
                    value={completeForm.workEndTime}
                    onChange={(e) => setCompleteForm((prev) => ({ ...prev, workEndTime: e.target.value }))}
                  />
                </div>
              </div>

              {completeForm.workStartTime && completeForm.workEndTime && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-700">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Duration: {(() => {
                      const start = completeForm.workStartTime.split(':').map(Number);
                      const end = completeForm.workEndTime.split(':').map(Number);
                      const startMins = start[0] * 60 + start[1];
                      const endMins = end[0] * 60 + end[1];
                      const diff = endMins - startMins;
                      if (diff <= 0) return "Invalid time range";
                      const hours = Math.floor(diff / 60);
                      const mins = diff % 60;
                      return `${hours > 0 ? `${hours}h ` : ""}${mins}m`;
                    })()}
                  </p>
                </div>
              )}
            </div>

            {/* Extra Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Extra Items / Materials
                </h3>
                {extraItemsLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>
              
              {/* Add New Extra Item Form */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <Label className="text-xs">Item Name</Label>
                    <Input
                      placeholder="e.g., Wire, Switch"
                      value={newExtraItem.name}
                      onChange={(e) => setNewExtraItem((prev) => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      min={1}
                      value={newExtraItem.quantity}
                      onChange={(e) => setNewExtraItem((prev) => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label className="text-xs">Unit Price (৳)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={newExtraItem.unitPrice}
                      onChange={(e) => setNewExtraItem((prev) => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-2 flex items-end">
                    <Button
                      type="button"
                      size="sm"
                      onClick={addExtraItem}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Extra Items List */}
              {extraItems.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium">Item</th>
                        <th className="text-center px-3 py-2 font-medium">Qty</th>
                        <th className="text-right px-3 py-2 font-medium">Unit Price</th>
                        <th className="text-right px-3 py-2 font-medium">Total</th>
                        <th className="text-center px-3 py-2 font-medium">Status</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {extraItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            {item.status === "pending" ? (
                              <Input
                                value={item.name}
                                onChange={(e) => updateExtraItem(item.id, "name", e.target.value)}
                                className="h-8 text-sm"
                              />
                            ) : (
                              <span>{item.name}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {item.status === "pending" ? (
                              <Input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => updateExtraItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                                className="h-8 text-sm w-16 mx-auto text-center"
                              />
                            ) : (
                              <span>{item.quantity}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {item.status === "pending" ? (
                              <Input
                                type="number"
                                min={0}
                                value={item.unitPrice}
                                onChange={(e) => updateExtraItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                                className="h-8 text-sm w-24 ml-auto text-right"
                              />
                            ) : (
                              <span>৳{item.unitPrice.toFixed(2)}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            ৳{(item.quantity * item.unitPrice).toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              item.status === "approved" ? "bg-green-100 text-green-700" :
                              item.status === "rejected" ? "bg-red-100 text-red-700" :
                              "bg-amber-100 text-amber-700"
                            }`}>
                              {item.status === "pending" ? "Pending" : item.status === "approved" ? "Approved" : "Rejected"}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            {item.status === "pending" && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExtraItem(item.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-medium">
                      <tr>
                        <td colSpan={3} className="px-3 py-2 text-right">Extra Items Total:</td>
                        <td className="px-3 py-2 text-right text-orange-600">৳{calculateExtraItemsTotal().toFixed(2)}</td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* Pending Items Warning */}
              {hasPendingExtraItems && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-700">
                    Extra items are pending approval. You can still submit for completion, but the final amount may change after user approval.
                  </p>
                </div>
              )}
            </div>

            {/* Completion Notes */}
            <div className="space-y-2">
              <Label htmlFor="completionNotes">Completion Notes (Optional)</Label>
              <Textarea
                id="completionNotes"
                value={completeForm.completionNotes}
                onChange={(e) => setCompleteForm((prev) => ({ ...prev, completionNotes: e.target.value }))}
                placeholder="Add any notes about the completed work..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setCompleteDialogOpen(false);
                setCompleteRequestId(null);
                setCompleteForm({ workStartTime: "", workEndTime: "", completionNotes: "" });
                setExtraItems([]);
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={confirmCompleteWork}
              disabled={actionLoading || !completeForm.workStartTime || !completeForm.workEndTime}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit for Confirmation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pricing Breakdown Dialog */}
      <Dialog open={pricingDialogOpen} onOpenChange={setPricingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center text-blue-600">
              <DollarSign className="h-5 w-5 mr-2" />
              Pricing Breakdown
            </DialogTitle>
            <DialogDescription>
              View the complete pricing details for this work order.
            </DialogDescription>
          </DialogHeader>

          {selectedPricingWork && (
            <div className="space-y-4 py-2">
              {/* Base Price */}
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Base Service Price</span>
                <span className="font-medium">৳{(selectedPricingWork.base_price || selectedPricingWork.total_amount || 0).toFixed(2)}</span>
              </div>

              {/* Labor Cost */}
              {selectedPricingWork.labor_cost && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Labor Cost</span>
                  <span className="font-medium">৳{selectedPricingWork.labor_cost.toFixed(2)}</span>
                </div>
              )}

              {/* Extra Items */}
              {selectedPricingWork.extra_items && selectedPricingWork.extra_items.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Extra Items</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    {selectedPricingWork.extra_items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          {item.name} (x{item.quantity})
                          <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
                            item.status === "approved" ? "bg-green-100 text-green-700" :
                            item.status === "rejected" ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {item.status}
                          </span>
                        </span>
                        <span className={`font-medium ${item.status === "rejected" ? "line-through text-gray-400" : ""}`}>
                          ৳{(item.quantity * item.unitPrice).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center py-3 border-t-2 border-gray-200">
                <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                <span className="text-lg font-bold text-green-600">
                  ৳{(selectedPricingWork.total_amount || 0).toFixed(2)}
                </span>
              </div>

              {/* Payment Status */}
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-50">
                {selectedPricingWork.payment_completed ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-medium">Payment Completed</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span className="text-amber-600 font-medium">Payment Pending</span>
                  </>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPricingDialogOpen(false);
                setSelectedPricingWork(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Reason Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center text-red-600">
              Cancel Work Request
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this work request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="cancelReason">Reason for Cancellation *</Label>
              <Textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please explain why you are cancelling this request..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setCancelRequestId(null);
                setCancelReason("");
              }}
              disabled={actionLoading}
            >
              Go Back
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmCancelRequest}
              disabled={actionLoading || !cancelReason.trim()}
            >
              {actionLoading ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkerDashboard;
