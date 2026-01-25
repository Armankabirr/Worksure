import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ClipboardList,
  Bell,
  Calendar,
  Menu,
  X,
  Clock,
  MapPin,
  Loader2,
  Play,
} from "lucide-react";

// Types
import {
  ApiServiceRequest,
  ExtraItem,
  UpcomingDay,
  Notification,
  ProfileFormData,
  PasswordFormData,
  CompleteFormData,
  DashboardTodayWork,
  DashboardUpcomingWork,
  DashboardServiceRequest,
  DashboardSummary,
  WorkerDetailsData,
  WorkerDetailsResponse,
} from "@/types/workerDashboard";

// Utils
import {
  isConfirmedStatus,
  isPendingStatus,
  isCompletedStatus,
  isCancelledStatus,
  isCompletedByWorkerStatus,
  isToday,
  isFuture,
  getCountdown,
  getDefaultWorkTimes,
  filterWorkHistory,
  calculateStats,
} from "@/lib/workerDashboardUtils";

// Components
import {
  ServiceHistoryContent,
  ServiceRequestContent,
  AccountContent,
  EditProfileDialog,
  ChangePasswordDialog,
  RequestDetailsDialog,
  CompleteWorkDialogFull,
  PricingBreakdownDialog,
  CancelReasonDialog,
  WorkerSidebar,
} from "@/components/worker-dashboard";
import { ComplaintDetailsDialog } from "@/components/ComplaintDetailsDialog";
import { HiringPricingDialog } from "@/components/profile/HiringPricingDialog";

const WorkerDashboard = () => {
  const { logout, changePassword } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  // UI State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dialog States
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [pricingDialogOpen, setPricingDialogOpen] = useState(false);
  const [complainDetailsDialogOpen, setComplainDetailsDialogOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<ApiServiceRequest | null>(null);

  // Loading States
  const [actionLoading, setActionLoading] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [serviceRequestsLoading, setServiceRequestsLoading] = useState(false);
  const [workHistoryLoading, setWorkHistoryLoading] = useState(false);
  const [extraItemsLoading, setExtraItemsLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Error States
  const [passwordError, setPasswordError] = useState("");

  // Dashboard Overview Data States
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary>({
    todaysAppointments: 0,
    confirmed: 0,
    pending: 0,
    completed: 0,
  });
  const [dashboardTodaysWorks, setDashboardTodaysWorks] = useState<DashboardTodayWork[]>([]);
  const [dashboardUpcomingWorks, setDashboardUpcomingWorks] = useState<DashboardUpcomingWork[]>([]);
  const [dashboardUpcomingDays, setDashboardUpcomingDays] = useState<UpcomingDay[]>([]);
  const [dashboardServiceRequests, setDashboardServiceRequests] = useState<DashboardServiceRequest[]>([]);

  // Worker Details Data States
  const [workerDetails, setWorkerDetails] = useState<WorkerDetailsData | null>(null);
  const [workerDetailsLoading, setWorkerDetailsLoading] = useState(false);

  // Data States
  const [serviceRequests, setServiceRequests] = useState<ApiServiceRequest[]>([]);
  const [workHistory, setWorkHistory] = useState<ApiServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ApiServiceRequest | null>(null);
  const [selectedPricingWork, setSelectedPricingWork] = useState<ApiServiceRequest | null>(null);
  const [cancelRequestId, setCancelRequestId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [completeRequestId, setCompleteRequestId] = useState<string | null>(null);
  const [extraItems, setExtraItems] = useState<ExtraItem[]>([]);
  const [newExtraItem, setNewExtraItem] = useState({ name: "", quantity: 1, unitPrice: 0 });
  const [user, setLocalUser] = useState<any>(null);

  // Form States
  const [completeForm, setCompleteForm] = useState<CompleteFormData>({
    workStartTime: "",
    workEndTime: "",
    completionNotes: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savedProfile, setSavedProfile] = useState<ProfileFormData>({
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

  const [profileForm, setProfileForm] = useState<ProfileFormData>({
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

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Filtered work data
  const {
    todaysWorks,
    upcomingWorks,
    confirmedWorks,
    inProgressWorks,
    pendingWorks,
    completedWorks,
    cancelledWorks,
    awaitingConfirmationWorks,
  } = filterWorkHistory(workHistory);

  const stats = calculateStats(todaysWorks, confirmedWorks, pendingWorks);

  useEffect(() => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setLocalUser(JSON.parse(storedUser));
        } else {
          setLocalUser(null);
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setLocalUser(null);
      }
    }, []);

  // Effects
  useEffect(() => {
    if (!user) return;
    setProfileForm((prev) => ({
      ...prev,
      name: user.name,
      phone: user.phone,
      avatarUrl: user.avatar || prev.avatarUrl,
    }));
    setSavedProfile((prev) => ({
      ...prev,
      name: user.name,
      phone: user.phone,
      avatarUrl: user.avatar || prev.avatarUrl,
    }));
  }, [user]);

  // Fetch Dashboard Summary Data
  useEffect(() => {
    async function fetchDashboardSummary() {
      if (!user?.email) return;
      setDashboardLoading(true);
      try {
        const res = await axiosPublic.get(`/workerRoutes/dashboard/summary/${user?.email}`);
        const data = res.data;
        
        if (data.success) {
          setDashboardSummary(data.summary);
        }
      } catch (err) {
        console.error("Error fetching dashboard summary:", err);
        // Reset to defaults on error
        setDashboardSummary({
          todaysAppointments: 0,
          confirmed: 0,
          pending: 0,
          completed: 0,
        });
      } finally {
        setDashboardLoading(false);
      }
    }
    fetchDashboardSummary();
  }, [axiosPublic, user?.email]);

  // Fetch Notifications
  useEffect(() => {
    async function fetchNotifications() {
      if (!user?.email) return;
      setNotificationsLoading(true);
      try {
        const res = await axiosPublic.get(`/workerRoutes/notifications/${user.id}`);
        const data = res.data;
        
        if (data.success && Array.isArray(data.data)) {
          setNotifications(data.data);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
      } finally {
        setNotificationsLoading(false);
      }
    }
    fetchNotifications();
  }, [axiosPublic, user?.email]);

  // Fetch Dashboard Tasks Data
  useEffect(() => {
    async function fetchDashboardTasks() {
      if (!user?.email) return;
      try {
        const res = await axiosPublic.get(`/workerRoutes/dashboard/tasks/${user?.email}`);
        const data = res.data;
        
        if (data.success) {
          setDashboardTodaysWorks(data.todaysWorks || []);
          setDashboardUpcomingWorks(data.upcomingWorks || []);
          setDashboardServiceRequests(data.serviceRequests || []);
          // Transform upcomingDays to match our interface
          setDashboardUpcomingDays(
            (data.upcomingDays || []).map((day) => ({
              date: day.date,
              day_name: day.day_name,
              appointments: day.total_appointments || day.appointments || 0,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching dashboard tasks:", err);
        setDashboardTodaysWorks([]);
        setDashboardUpcomingWorks([]);
        setDashboardUpcomingDays([]);
        setDashboardServiceRequests([]);
      }
    }
    fetchDashboardTasks();
  }, [axiosPublic, user?.email]);

  console.log("todays: ", dashboardTodaysWorks);
  console.log("upcoming: ", dashboardUpcomingWorks);
  console.log("requested: ", dashboardServiceRequests);
  

  useEffect(() => {
    async function fetchWorkHistory() {
      if (!user?.email) return;
      setWorkHistoryLoading(true);
      try {
        const res = await axiosPublic.get(`/workerRoutes/hirings/${user?.email}`);
        const rawData = res.data?.data || res.data;
        
        // Normalize data to always be an array
        let items: ApiServiceRequest[] = [];
        if (Array.isArray(rawData)) {
          items = rawData;
        } else if (rawData && typeof rawData === 'object') {
          // If it's a single object, wrap it in an array
          items = [rawData];
        } else {
          items = [];
        }
        
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

  useEffect(() => {
    async function fetchServiceRequests() {
      setServiceRequestsLoading(true);
      try {
        const res = await axiosPublic.get(`/workerRoutes/hirings/requests/${user?.email}`);
        const rawData = res.data?.data || res.data;
        
        // Normalize data to always be an array
        let items: ApiServiceRequest[] = [];
        if (Array.isArray(rawData)) {
          items = rawData;
        } else if (rawData && typeof rawData === 'object') {
          // If it's a single object, wrap it in an array
          items = [rawData];
        } else {
          items = [];
        }
        
        setServiceRequests(items);
      } catch (err) {
        console.error("Error fetching service requests:", err);
        setServiceRequests([]);
      } finally {
        setServiceRequestsLoading(false);
      }
    }
    fetchServiceRequests();
  }, [axiosPublic, user?.email]);

  // Fetch Worker Details for Account Page
  useEffect(() => {
    async function fetchWorkerDetails() {
      if (!user?.email) return;
      setWorkerDetailsLoading(true);
      try {
        const res = await axiosPublic.get(`/workerRoutes/dashboard/details/${user.email}`);
        const data: WorkerDetailsResponse = res.data;
        if (data.success && data.data) {
          setWorkerDetails(data.data);
        }
      } catch (err) {
        console.error("Error fetching worker details:", err);
        setWorkerDetails(null);
      } finally {
        setWorkerDetailsLoading(false);
      }
    }
    fetchWorkerDetails();
  }, [axiosPublic, user?.email]);

  // Handlers
  const handleLogout = () => {
    logout();
    navigate("/");
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

    const maxSizeBytes = 2 * 1024 * 1024;
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
      const { error } = await changePassword(passwordForm.newPassword);
      if (error) {
        setPasswordError(error.message);
        return;
      }
      toast({ title: "Success", description: "Password updated successfully." });
      setChangePasswordOpen(false);
      resetPasswordDialog();
    } catch {
      setPasswordError("Failed to update password.");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handleProfileUpdate = () => {
    const nidRegex = /^(\d{10}|\d{13}|\d{17})$/;
    if (profileForm.nidNumber && !nidRegex.test(profileForm.nidNumber)) {
      toast({
        title: "Invalid NID",
        description: "Please provide a valid NID number (10, 13, or 17 digits).",
        variant: "destructive",
      });
      return;
    }

    setSavedProfile((prev) => ({
      ...prev,
      ...profileForm,
      avatarUrl: profileForm.avatarUrl || prev.avatarUrl,
    }));

    setEditProfileOpen(false);
    toast({ title: "Success", description: "Profile updated successfully!" });
  };

  // Mark single notification as read
  const handleMarkNotificationAsRead = async (notificationId: string) => {
    if (!user?.email) return;
    
    try {
      const res = await axiosPublic.patch(`/workerRoutes/notifications/${notificationId}/read`);
      
      if (res.data.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, is_read: true } : notif
          )
        );
        
        toast({ 
          title: "Success", 
          description: "Notification marked as read" 
        });
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  // Mark all notifications as read
  const handleMarkAllNotificationsAsRead = async () => {
    if (!user?.email) return;
    
    try {
      const res = await axiosPublic.patch(`/workerRoutes/notifications/read-all/${user.id}`);
      
      if (res.data.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, is_read: true }))
        );
        
        toast({ 
          title: "Success", 
          description: "All notifications marked as read" 
        });
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  // Service Request Handlers
  async function acceptRequest(id: string) {
    setActionLoading(true);
    try {
      await axiosPublic.patch(`/orderRoutes/acceptWorkRequest/${id}`, {
        workerEmail: user?.email,
      });
      setServiceRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "Confirmed" } : r))
      );
      setSelectedRequest((prev) =>
        prev && prev.id === id ? { ...prev, status: "Confirmed" } : prev
      );
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

  async function startWork(id: string) {
    setActionLoading(true);
    try {
      await axiosPublic.patch(`/orderRoutes/startWork/${id}`, {
        workerEmail: user?.email,
      });
      // Update local state to reflect the work has started
      setWorkHistory((prev) =>
        prev.map((w) => (w.id === id ? { ...w, status: "in_progress" } : w))
      );
      toast({ title: "Success", description: "Work started successfully!" });
      
      // Refresh dashboard data
      try {
        const tasksRes = await axiosPublic.get(`/workerRoutes/dashboard/tasks/${user?.email}`);
        if (tasksRes.data.success) {
          setDashboardTodaysWorks(tasksRes.data.todaysWorks || []);
          setDashboardUpcomingWorks(tasksRes.data.upcomingWorks || []);
          setDashboardServiceRequests(tasksRes.data.serviceRequests || []);
        }
      } catch (refreshErr) {
        console.error("Error refreshing dashboard:", refreshErr);
      }
    } catch (err) {
      console.error("Error starting work:", err);
      toast({
        title: "Error",
        description: "Failed to start work. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  }

  function openCancelDialog(id: string) {
    setCancelRequestId(id);
    setCancelReason("");
    setCancelDialogOpen(true);
  }

  const handleViewComplaint = (work: ApiServiceRequest) => {
    setSelectedWork(work);
    setComplainDetailsDialogOpen(true);
  };

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
      setServiceRequests((prev) =>
        prev.map((r) => (r.id === cancelRequestId ? { ...r, status: "Cancelled" } : r))
      );
      setSelectedRequest((prev) =>
        prev && prev.id === cancelRequestId ? { ...prev, status: "Cancelled" } : prev
      );
      setWorkHistory((prev) =>
        prev.map((w) => (w.id === cancelRequestId ? { ...w, status: "cancelled" } : w))
      );
      setCancelDialogOpen(false);
      setCancelRequestId(null);
      setCancelReason("");
      toast({ title: "Success", description: "Work cancelled successfully." });
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

  // Complete Work Handlers
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

  async function openCompleteDialog(id: string) {
    setCompleteRequestId(id);
    const { endTime } = getDefaultWorkTimes();
    
    // Fetch start time from API
    let startTime = "";
    try {
      const res = await axiosPublic.get(`/orderRoutes/getStartTime/${id}`);
      if (res.data?.work_start) {
        // Convert the start time to HH:mm format
        const startDate = new Date(res.data.work_start);
        startTime = startDate.toTimeString().slice(0, 5);
      }
    } catch (err) {
      console.error("Error fetching start time:", err);
      // Use default start time if API fails
      startTime = getDefaultWorkTimes().startTime;
    }
    
    setCompleteForm({
      workStartTime: startTime,
      workEndTime: endTime,
      completionNotes: "",
    });
    setExtraItems([]);
    setNewExtraItem({ name: "", quantity: 1, unitPrice: 0 });
    fetchExtraItems(id);
    setCompleteDialogOpen(true);
  }

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

  function removeExtraItem(itemId: string) {
    setExtraItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  function updateExtraItem(itemId: string, field: keyof ExtraItem, value: string | number) {
    setExtraItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, [field]: value } : item))
    );
  }

  async function confirmCompleteWork() {
    if (!completeRequestId) return;

    if (!completeForm.workStartTime || !completeForm.workEndTime) {
      toast({
        title: "Required Fields",
        description: "Please provide both work start and end times.",
        variant: "destructive",
      });
      return;
    }

    if (completeForm.workStartTime >= completeForm.workEndTime) {
      toast({
        title: "Invalid Time Range",
        description: "Work end time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      // Transform extraItems to match the order_items table structure
      const orderItemsPayload = {
        items: extraItems.map((item) => ({
          service_id: item.id,
          service_name: item.name,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.quantity * item.unitPrice,
        })),
        additional_notes: completeForm.completionNotes.trim() || null
      };

      // Submit order items if there are extra items
      if (extraItems.length > 0) {
        await axiosPublic.post(`/orderRoutes/orderItems/${completeRequestId}`, orderItemsPayload);
      }

      setWorkHistory((prev) =>
        prev.map((w) =>
          w.id === completeRequestId
            ? { ...w, status: "awaiting", extra_items: extraItems }
            : w
        )
      );
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

  function openPricingDialog(work: ApiServiceRequest) {
    setSelectedPricingWork(work);
    setPricingDialogOpen(true);
  }

  async function confirmPayment(id: string) {
    setActionLoading(true);
    try {
      await axiosPublic.patch(`/paymentRoutes/verify/${id}`);
      // Update local state to reflect payment is confirmed
      setWorkHistory((prev) =>
        prev.map((w) => (w.id === id ? { ...w, payment_completed: true } : w))
      );
      toast({ title: "Success", description: "Payment confirmed successfully!" });
    } catch (err) {
      console.error("Error confirming payment:", err);
      toast({
        title: "Error",
        description: "Failed to confirm payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  }

  // Content Renderer
  const renderContent = () => {
    // Show loading state if user is not loaded or role check is pending
    if (!user) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      );
    }

    // Show access denied message if user is not a worker
    if (user.role !== "worker") {
      return (
        <div className="flex items-center justify-center py-20">
          <Card className="p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">You don't have permission to access the Worker Dashboard.</p>
            <Button onClick={() => navigate("/")} className="bg-orange-500 hover:bg-orange-600 text-white">
              Go to Home
            </Button>
          </Card>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardContent
            summary={dashboardSummary}
            todaysWorks={dashboardTodaysWorks}
            upcomingWorks={dashboardUpcomingWorks}
            serviceRequests={dashboardServiceRequests}
            upcomingDays={dashboardUpcomingDays}
            loading={dashboardLoading}
            actionLoading={actionLoading}
            onAcceptRequest={async (id) => {
              await acceptRequest(id);
              // Refresh dashboard data after accepting
              try {
                const [summaryRes, tasksRes] = await Promise.all([
                  axiosPublic.get(`/workerRoutes/dashboard/summary/${user?.email}`),
                  axiosPublic.get(`/workerRoutes/dashboard/tasks/${user?.email}`)
                ]);
                
                if (summaryRes.data.success) {
                  setDashboardSummary(summaryRes.data.summary);
                }
                if (tasksRes.data.success) {
                  setDashboardTodaysWorks(tasksRes.data.todaysWorks || []);
                  setDashboardUpcomingWorks(tasksRes.data.upcomingWorks || []);
                  setDashboardServiceRequests(tasksRes.data.serviceRequests || []);
                }
              } catch (err) {
                console.error("Error refreshing dashboard:", err);
              }
            }}
            onCancelRequest={openCancelDialog}
            onStartWork={startWork}
          />
        );
      case "service-request":
        return (
          <ServiceRequestContent
            serviceRequests={serviceRequests}
            serviceRequestsLoading={serviceRequestsLoading}
            actionLoading={actionLoading}
            onViewDetails={(req) => {
              setSelectedRequest(req);
              setDetailsOpen(true);
            }}
            onAccept={acceptRequest}
            onCancel={openCancelDialog}
          />
        );
      case "service-history":
        return (
          <ServiceHistoryContent
            workHistory={workHistory}
            workHistoryLoading={workHistoryLoading}
            confirmedWorks={confirmedWorks}
            inProgressWorks={inProgressWorks}
            awaitingConfirmationWorks={awaitingConfirmationWorks}
            completedWorks={completedWorks}
            cancelledWorks={cancelledWorks}
            actionLoading={actionLoading}
            onCompleteWork={openCompleteDialog}
            onCancelWork={openCancelDialog}
            onViewPricing={openPricingDialog}
            onStartWork={startWork}
            onConfirmPayment={confirmPayment}
            onViewComplaint={handleViewComplaint}
          />
        );
      case "account":
        return (
          <AccountContent
            user={user}
            savedProfile={savedProfile}
            workerDetails={workerDetails}
            workerDetailsLoading={workerDetailsLoading}
            onAvatarChange={handleAvatarChange}
            onEditProfile={() => setEditProfileOpen(true)}
            onChangePassword={() => {
              setChangePasswordOpen(true);
              resetPasswordDialog();
            }}
          />
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
        return (
          <div className="flex items-center justify-center py-20">
            <Card className="p-8 text-center">
              <p className="text-gray-500">Content not found</p>
            </Card>
          </div>
        );
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
      <WorkerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarMinimized={sidebarMinimized}
        setSidebarMinimized={setSidebarMinimized}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${
          sidebarMinimized ? "md:ml-20" : "md:ml-64"
        } transition-all duration-300`}
      >
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

      {/* Dialogs */}
      <EditProfileDialog
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        profileForm={profileForm}
        setProfileForm={setProfileForm}
        userEmail={user?.email || ""}
        onSave={handleProfileUpdate}
      />

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
        passwordForm={passwordForm}
        setPasswordForm={setPasswordForm}
        passwordError={passwordError}
        isPasswordSaving={isPasswordSaving}
        onSave={handlePasswordUpdate}
        onReset={resetPasswordDialog}
      />

      <NotificationsDialog
        open={notificationsOpen}
        onOpenChange={setNotificationsOpen}
        notifications={notifications}
        notificationsLoading={notificationsLoading}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
      />

      <RequestDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        selectedRequest={selectedRequest}
        actionLoading={actionLoading}
        onAccept={acceptRequest}
        onCancel={openCancelDialog}
      />

      <CompleteWorkDialogFull
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        completeForm={completeForm}
        setCompleteForm={setCompleteForm}
        extraItems={extraItems}
        newExtraItem={newExtraItem}
        setNewExtraItem={setNewExtraItem}
        extraItemsLoading={extraItemsLoading}
        actionLoading={actionLoading}
        onAddExtraItem={addExtraItem}
        onRemoveExtraItem={removeExtraItem}
        onUpdateExtraItem={updateExtraItem}
        onConfirmComplete={confirmCompleteWork}
        onClose={() => {
          setCompleteDialogOpen(false);
          setCompleteRequestId(null);
          setCompleteForm({ workStartTime: "", workEndTime: "", completionNotes: "" });
          setExtraItems([]);
        }}
      />

      <ComplaintDetailsDialog
        open={complainDetailsDialogOpen}
        onOpenChange={setComplainDetailsDialogOpen}
        bookingId={selectedWork?.complain_id || ""}
      />

      <HiringPricingDialog
        open={pricingDialogOpen}
        onOpenChange={setPricingDialogOpen}
        selectedHiring={selectedPricingWork as any}
        userRole="worker"
      />

      <CancelReasonDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        actionLoading={actionLoading}
        onConfirm={confirmCancelRequest}
        onClose={() => {
          setCancelDialogOpen(false);
          setCancelRequestId(null);
          setCancelReason("");
        }}
      />
    </div>
  );
};

// Dashboard Content Component (kept inline as it's specific to this page)
interface DashboardContentProps {
  summary: DashboardSummary;
  todaysWorks: DashboardTodayWork[];
  upcomingWorks: DashboardUpcomingWork[];
  serviceRequests: DashboardServiceRequest[];
  upcomingDays: UpcomingDay[];
  loading: boolean;
  actionLoading: boolean;
  onAcceptRequest: (id: string) => void;
  onCancelRequest: (id: string) => void;
  onStartWork: (id: string) => void;
}

const DashboardContent = ({
  summary,
  todaysWorks,
  upcomingWorks,
  serviceRequests,
  upcomingDays,
  loading,
  actionLoading,
  onAcceptRequest,
  onCancelRequest,
  onStartWork,
}: DashboardContentProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{summary.todaysAppointments}</p>
          <p className="text-xs text-gray-500 mt-2">Total bookings for today</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-green-500 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Confirmed</p>
            <div className="bg-green-100 p-2 rounded-lg">
              <ClipboardList className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{summary.confirmed}</p>
          <p className="text-xs text-gray-500 mt-2">Ready to start</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-orange-500 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Bell className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{summary.pending}</p>
          <p className="text-xs text-gray-500 mt-2">Awaiting confirmation</p>
        </Card>
        <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-orange-500 hover:scale-105">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Bell className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{summary?.completed || 0}</p>
          <p className="text-xs text-gray-500 mt-2">Completed works</p>
        </Card>
      </div>

      <div className="space-y-6">
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
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Countdown</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {todaysWorks.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
                            <p className="text-gray-600 text-lg font-medium">No works scheduled for today</p>
                            <p className="text-gray-400 text-sm mt-2">Accepted work for today will appear here</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      todaysWorks.map((work) => (
                        <tr key={work.booking_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                {work.client_picture && (
                                  <img
                                    src={work.client_picture}
                                    alt="Client"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {work.client_name || "Client"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{work.service_name || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-gray-400" />
                              {work.start_time ? new Date(work.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {work.countdown ? (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">{work.countdown}</span>
                            ) : (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Now</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              {work.location || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {work.status || "confirmed"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white px-3"
                              onClick={() => onStartWork(work.booking_id)}
                              disabled={actionLoading || work.status === "in_progress"}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Start
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
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Days Until</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
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
                        <tr key={work.booking_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                {work.client_picture && (
                                  <img
                                    src={work.client_picture}
                                    alt="Client"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {work.client_name || "Client"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{work.service_name || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              {work.scheduled_date ? new Date(work.scheduled_date).toLocaleString() : "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {work.days_until ? (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{work.days_until}</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              {work.location || "-"}
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

          {/* Service Requests */}
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
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Task</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email address</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
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
                        <tr
                          key={request.request_id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
                                {request.client_picture && (
                                  <img
                                    src={request.client_picture}
                                    alt="Client"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {request.client_name || "Client"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.task_name || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.location || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.client_email || "-"}
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
                                onAcceptRequest(request.request_id);
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
                                onCancelRequest(request.request_id);
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
    </>
  );
};

// Notifications Dialog
interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  notificationsLoading: boolean;
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationsDialog = ({ 
  open, 
  onOpenChange, 
  notifications, 
  notificationsLoading,
  onMarkAsRead,
  onMarkAllAsRead 
}: NotificationsDialogProps) => {
  const formatTime = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diff = now.getTime() - notifTime.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const hasUnread = unreadNotifications.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center">
              <Bell className="h-5 w-5 mr-2 text-orange-500" />
              Notifications
              {hasUnread && (
                <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                  {unreadNotifications.length}
                </span>
              )}
            </DialogTitle>
            {hasUnread && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs text-orange-600 hover:text-orange-700"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {notificationsLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 text-orange-500 animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.is_read ? "bg-gray-50 border-gray-200" : "bg-orange-50 border-orange-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.is_read ? "bg-gray-400" : "bg-orange-500"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{notification.title}</p>
                    <p className="text-gray-600 text-xs mt-1">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-gray-500 text-xs">{formatTime(notification.created_at)}</p>
                      {!notification.is_read && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkerDashboard;
