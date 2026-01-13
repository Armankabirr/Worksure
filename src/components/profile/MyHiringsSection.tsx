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
  Star
} from "lucide-react";
import { Hiring } from "@/types/profile";

interface MyHiringsSectionProps {
  hirings: Hiring[];
  isLoading: boolean;
  error: string | null;
  onCancelOrder: (hiringId: string) => void;
}

const MyHiringsSection = ({ 
  hirings, 
  isLoading, 
  error, 
  onCancelOrder 
}: MyHiringsSectionProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-5 border-b border-slate-200">
        <h2 className="text-xl font-bold text-foreground mb-0.5">My Hirings</h2>
        <p className="text-xs text-muted-foreground">View and manage your service hirings</p>
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
        ) : hirings && hirings.length > 0 ? (
          <div className="space-y-4">
            {hirings.map((hiring) => (
              <HiringCard 
                key={hiring.id} 
                hiring={hiring} 
                onCancel={onCancelOrder} 
              />
            ))}
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
    </Card>
  );
};

interface HiringCardProps {
  hiring: Hiring;
  onCancel: (hiringId: string) => void;
}

const HiringCard = ({ hiring, onCancel }: HiringCardProps) => {
  const worker = hiring.users_orders_assigned_worker_idTousers;

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
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              hiring.status === "completed"
                ? "bg-green-100 text-green-700"
                : hiring.status === "in-progress"
                ? "bg-blue-100 text-blue-700"
                : hiring.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {hiring.status?.charAt(0).toUpperCase() + hiring.status?.slice(1)}
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
        <Button
          onClick={() => onCancel(hiring.id)}
          size="sm"
          className="mt-2 bg-primary hover:bg-primary/90 text-white text-xs"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default MyHiringsSection;
