import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Phone, 
  MapPin, 
  AlertCircle,
  Loader2,
  Clock,
  DollarSign,
  CheckCheck,
  Briefcase,
  Star,
  CheckCircle,
  XCircle,
  PlayCircle,
  HourglassIcon,
  Eye,
  CreditCard
} from "lucide-react";
import { Hiring } from "@/types/profile";
import { HiringPricingDialog } from "./HiringPricingDialog";

// Status tab types
type StatusTab = "pending" | "accepted" | "in_progress" | "awaiting" | "completed" | "cancelled";

interface StatusTabConfig {
  key: StatusTab;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const statusTabs: StatusTabConfig[] = [
  { 
    key: "pending", 
    label: "Pending", 
    icon: <HourglassIcon className="h-4 w-4" />,
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300"
  },
  { 
    key: "accepted", 
    label: "Accepted", 
    icon: <CheckCircle className="h-4 w-4" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300"
  },
  { 
    key: "in_progress", 
    label: "In Progress", 
    icon: <PlayCircle className="h-4 w-4" />,
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300"
  },
  { 
    key: "awaiting", 
    label: "Awaiting", 
    icon: <Clock className="h-4 w-4" />,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300"
  },
  { 
    key: "completed", 
    label: "Completed", 
    icon: <CheckCheck className="h-4 w-4" />,
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-300"
  },
  { 
    key: "cancelled", 
    label: "Cancelled", 
    icon: <XCircle className="h-4 w-4" />,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-300"
  },
];

interface MyHiringsSectionProps {
  hirings: Hiring[];
  isLoading: boolean;
  error: string | null;
  onCancelOrder: (hiringId: string) => void;
  onMakePayment?: (hiring: Hiring) => void;
}

const MyHiringsSection = ({ 
  hirings, 
  isLoading, 
  error, 
  onCancelOrder,
  onMakePayment
}: MyHiringsSectionProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StatusTab>("pending");
  const [pricingDialogOpen, setPricingDialogOpen] = useState(false);
  const [selectedHiring, setSelectedHiring] = useState<Hiring | null>(null);

  const handleViewPricing = (hiring: Hiring) => {
    setSelectedHiring(hiring);
    setPricingDialogOpen(true);
  };

  const handleMakePayment = (hiring: Hiring) => {
    if (onMakePayment) {
      onMakePayment(hiring);
    } else {
      // Default behavior - navigate to payment page or open payment dialog
      navigate(`/payment/${hiring.id}`);
    }
  };

  // Filter hirings based on active tab
  const filteredHirings = hirings.filter((hiring) => {
    // Handle different status naming conventions (e.g., "in-progress" vs "in_progress")
    const normalizedStatus = hiring.status?.toLowerCase().replace("-", "_");
    return normalizedStatus === activeTab;
  });

  // Get count for each status
  const getStatusCount = (status: StatusTab): number => {
    return hirings.filter((h) => {
      const normalizedStatus = h.status?.toLowerCase().replace("-", "_");
      return normalizedStatus === status;
    }).length;
  };

  return (
    <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-5 border-b border-slate-200">
        <h2 className="text-xl font-bold text-foreground mb-0.5">My Hirings</h2>
        <p className="text-xs text-muted-foreground">View and manage your service hirings</p>
      </div>

      {/* Status Tabs */}
      <div className="border-b border-slate-200 bg-slate-50/50">
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => {
              const count = getStatusCount(tab.key);
              const isActive = activeTab === tab.key;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 border
                    ${isActive 
                      ? `${tab.bgColor} ${tab.color} ${tab.borderColor} shadow-sm` 
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span className={`
                    ml-1 px-2 py-0.5 rounded-full text-xs font-semibold
                    ${isActive ? "bg-white/60" : "bg-slate-100"}
                  `}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-sm">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading your hirings...</p>
          </div>
        ) : filteredHirings && filteredHirings.length > 0 ? (
          <div className="space-y-4">
            {filteredHirings.map((hiring) => (
              <HiringCard 
                key={hiring.id} 
                hiring={hiring} 
                onCancel={onCancelOrder}
                onViewPricing={handleViewPricing}
                onMakePayment={handleMakePayment}
              />
            ))}
          </div>
        ) : hirings.length > 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No {activeTab.replace("_", " ")} Hirings</h3>
            <p className="text-sm text-muted-foreground mb-4">You don't have any hirings with this status</p>
            <Button
              onClick={() => setActiveTab("pending")}
              variant="outline"
              className="border-slate-300"
            >
              View Pending Hirings
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Hirings Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">You haven't hired any services yet</p>
            <Button
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Explore Services
            </Button>
          </div>
        )}
      </div>

      {/* Pricing Dialog */}
      <HiringPricingDialog
        open={pricingDialogOpen}
        onOpenChange={setPricingDialogOpen}
        selectedHiring={selectedHiring}
      />
    </Card>
  );
};

interface HiringCardProps {
  hiring: Hiring;
  onCancel: (hiringId: string) => void;
  onViewPricing: (hiring: Hiring) => void;
  onMakePayment?: (hiring: Hiring) => void;
}

const HiringCard = ({ hiring, onCancel, onViewPricing, onMakePayment }: HiringCardProps) => {
  const worker = hiring.users_orders_assigned_worker_idTousers;
  const isCompleted = hiring.status?.toLowerCase() === "completed";
  const isAwaiting = hiring.status?.toLowerCase() === "awaiting";

  // Get status badge styling
  const getStatusStyle = (status: string) => {
    const normalizedStatus = status?.toLowerCase().replace("-", "_");
    switch (normalizedStatus) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "accepted":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "in_progress":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "awaiting":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Format status label
  const formatStatus = (status: string) => {
    if (!status) return "Unknown";
    return status
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Minimized card for completed orders
  if (isCompleted) {
    return (
      <div className="border border-slate-200 rounded-lg p-4 hover:border-primary/50 hover:shadow-md transition-all duration-200 bg-green-50/30">
        {/* Header with Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {worker && (
              <Avatar className="h-10 w-10 flex-shrink-0 border border-slate-200">
                <AvatarImage src={worker.profile_picture} alt={worker.full_name} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {worker.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm truncate">{hiring.description}</h3>
              <div className="flex items-center gap-2 mt-1">
                {worker && (
                  <span className="text-xs text-muted-foreground">{worker.full_name}</span>
                )}
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-semibold text-foreground">৳{hiring.total_amount}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(hiring.status)}`}
            >
              {formatStatus(hiring.status)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            {hiring.payment_completed ? (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <CheckCheck className="h-3 w-3" />
                Payment Completed
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                <Clock className="h-3 w-3" />
                Payment Pending
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onViewPricing(hiring)}
              size="sm"
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Pricing
            </Button>
            {!hiring.payment_completed && (
              <Button
                onClick={() => onMakePayment?.(hiring)}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white text-xs"
              >
                <CreditCard className="h-3 w-3 mr-1" />
                Make Payment
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full card for other statuses
  return (
    <div className="border border-slate-200 rounded-lg p-4 hover:border-primary/50 hover:shadow-md transition-all duration-200">
      {/* Header with Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm">{hiring.description}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Order ID: {hiring.id.slice(0, 8)}...
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(hiring.status)}`}
          >
            {formatStatus(hiring.status)}
          </span>
        </div>
      </div>

      {/* Worker Information */}
      {worker && (
        <div className="border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0 border border-slate-200">
              <AvatarImage src={worker.profile_picture} alt={worker.full_name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {worker.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-foreground text-sm">{worker.full_name}</p>
                {worker.worker_profiles && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-semibold text-amber-700">
                      {worker.worker_profiles.avg_rating}
                    </span>
                  </span>
                )}
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                {worker.worker_profiles?.display_name && (
                  <p>{worker.worker_profiles.display_name}</p>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {worker.phone}
                  </span>
                  {worker.worker_profiles && (
                    <span className="flex items-center gap-1">
                      ({worker.worker_profiles.total_reviews} reviews)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3 text-xs">
        {/* Address */}
        <div className="flex items-start gap-2 col-span-2 md:col-span-3">
          <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-muted-foreground text-xs">Location</p>
            <p className="text-foreground font-medium">{hiring.address}</p>
          </div>
        </div>

        {/* Date/Time */}
        <div>
          <p className="text-muted-foreground text-xs mb-0.5">Scheduled Time</p>
          <p className="text-foreground font-medium flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(hiring.selected_time).toLocaleDateString()}
          </p>
        </div>

        {/* Amount */}
        <div>
          <p className="text-muted-foreground text-xs mb-0.5">Amount</p>
          <p className="text-foreground font-semibold flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {hiring.total_amount}
          </p>
        </div>

        {/* Payment Status */}
        <div>
          <p className="text-muted-foreground text-xs mb-0.5">Payment</p>
          <p className={`flex items-center gap-1 font-medium ${hiring.payment_completed ? "text-green-600" : "text-yellow-600"}`}>
            {hiring.payment_completed ? (
              <>
                <CheckCheck className="h-3 w-3" />
                {hiring.status}
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" />
                {hiring.status}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Work Duration if available */}
      {hiring.work_start && hiring.work_end && (
        <div className="border-t border-slate-200 pt-3 mt-3 text-xs">
          <p className="text-muted-foreground mb-2">Work Duration</p>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">
              {new Date(hiring.work_start).toLocaleString()}
            </span>
            <span className="text-muted-foreground">to</span>
            <span className="font-medium text-foreground">
              {new Date(hiring.work_end).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Created Date */}
      <div className="border-t border-slate-200 pt-3 mt-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Created: {new Date(hiring.created_at).toLocaleDateString()} at {new Date(hiring.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
        <div className="flex items-center gap-2">
          {/* Show View Pricing only for completed and awaiting tasks */}
          {(hiring.status?.toLowerCase() === "completed" || hiring.status?.toLowerCase() === "awaiting") && (
            <Button
              onClick={() => onViewPricing(hiring)}
              size="sm"
              variant="outline"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Pricing
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyHiringsSection;
