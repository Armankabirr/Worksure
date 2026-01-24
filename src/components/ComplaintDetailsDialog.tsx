import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Loader2, User, AlertCircle, FileText, Clock, CheckCircle, XCircle, DollarSign, MapPin, Calendar, Phone, Mail } from "lucide-react";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { toast } from "sonner";
import { format } from "date-fns";

interface ComplaintDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
}

interface ComplaintDetails {
  id: string;
  raisedBy: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    role: string;
  };
  against: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    role: string;
  };
  booking: {
    id: string;
    status: string;
    scheduledTime: string;
    totalAmount: number;
    description: string;
    address: string;
    workStart: string;
    workEnd: string;
    createdAt: string;
  } | null;
  payment: {
    id: string;
    amount: number;
    status: string;
    method: string;
    transactionId: string;
    paidAt: string;
    createdAt: string;
  } | null;
  category: string;
  subCategory: string;
  priority: string;
  subject: string;
  description: string;
  attachments: string[];
  status: string;
  adminNotes: string;
  resolution: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string;
}

export function ComplaintDetailsDialog({ open, onOpenChange, bookingId }: ComplaintDetailsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<ComplaintDetails | null>(null);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    if (open && bookingId) {
      fetchComplaintDetails();
    }
  }, [open, bookingId]);

  const fetchComplaintDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosPublic.get(`/userRoutes/getComplaintDetails/${bookingId}`);
      setDetails(response.data.complaintDetails);
    } catch (error: any) {
      console.error("Error fetching complaint details:", error);
      toast.error(error.response?.data?.message || "Failed to load complaint details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-orange-600" />
            Complaint Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !details ? (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No complaint details available</p>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="parties">Parties</TabsTrigger>
              <TabsTrigger value="booking">Booking</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="resolution">Resolution</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Complaint ID</Label>
                  <p className="font-mono text-sm">{details.id}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(details.status)}>
                      {details.status.replace(/_/g, " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600">Priority</Label>
                  <div className="mt-1">
                    <Badge className={getPriorityColor(details.priority)}>
                      {details.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-600">Category</Label>
                  <p className="font-medium">{details.category}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-gray-600">Sub-Category</Label>
                  <p className="font-medium">{details.subCategory}</p>
                </div>
              </div>

              {details.subject && (
                <div>
                  <Label className="text-gray-600">Subject</Label>
                  <p className="font-medium">{details.subject}</p>
                </div>
              )}

              <div>
                <Label className="text-gray-600">Description</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                  <p className="text-sm whitespace-pre-wrap">{details.description}</p>
                </div>
              </div>

              {details.attachments && details.attachments.length > 0 && (
                <div>
                  <Label className="text-gray-600">Attachments ({details.attachments.length})</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {details.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-blue-600 hover:underline truncate">
                          Attachment {index + 1}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Created At
                  </Label>
                  <p className="text-sm">{format(new Date(details.createdAt), "PPp")}</p>
                </div>
                <div>
                  <Label className="text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated At
                  </Label>
                  <p className="text-sm">{format(new Date(details.updatedAt), "PPp")}</p>
                </div>
              </div>
            </TabsContent>

            {/* Parties Tab */}
            <TabsContent value="parties" className="space-y-6 mt-4">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Raised By
                </h3>
                <div className="border rounded-lg p-4 bg-blue-50/50">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={details.raisedBy.avatar} />
                      <AvatarFallback>{details.raisedBy.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="font-semibold text-lg">{details.raisedBy.name}</p>
                        <Badge variant="outline" className="mt-1">
                          {details.raisedBy.role.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          {details.raisedBy.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          {details.raisedBy.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Against
                </h3>
                <div className="border rounded-lg p-4 bg-red-50/50">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={details.against.avatar} />
                      <AvatarFallback>{details.against.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="font-semibold text-lg">{details.against.name}</p>
                        <Badge variant="outline" className="mt-1">
                          {details.against.role.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          {details.against.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4" />
                          {details.against.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Booking Tab */}
            <TabsContent value="booking" className="space-y-4 mt-4">
              {details.booking ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Booking ID</Label>
                      <p className="font-mono text-sm">{details.booking.id}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Status</Label>
                      <div className="mt-1">
                        <Badge className={getStatusColor(details.booking.status)}>
                          {details.booking.status.replace(/_/g, " ").toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-600 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Total Amount
                      </Label>
                      <p className="font-semibold text-lg">${details.booking.totalAmount}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Scheduled Time
                      </Label>
                      <p className="text-sm">{format(new Date(details.booking.scheduledTime), "PPp")}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Address
                    </Label>
                    <p className="mt-1">{details.booking.address}</p>
                  </div>

                  <div>
                    <Label className="text-gray-600">Job Description</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                      <p className="text-sm whitespace-pre-wrap">{details.booking.description}</p>
                    </div>
                  </div>

                  {details.booking.workStart && details.booking.workEnd && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          Work Started
                        </Label>
                        <p className="text-sm">{format(new Date(details.booking.workStart), "PPp")}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-blue-600" />
                          Work Ended
                        </Label>
                        <p className="text-sm">{format(new Date(details.booking.workEnd), "PPp")}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-gray-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Booking Created
                    </Label>
                    <p className="text-sm">{format(new Date(details.booking.createdAt), "PPp")}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No booking information available</p>
                </div>
              )}
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="space-y-4 mt-4">
              {details.payment ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600">Payment ID</Label>
                      <p className="font-mono text-sm">{details.payment.id}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Status</Label>
                      <div className="mt-1">
                        <Badge className={getStatusColor(details.payment.status)}>
                          {details.payment.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-600 flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Amount
                      </Label>
                      <p className="font-semibold text-lg">${details.payment.amount}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600">Payment Method</Label>
                      <p className="font-medium">{details.payment.method.toUpperCase()}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-gray-600">Transaction ID</Label>
                      <p className="font-mono text-sm">{details.payment.transactionId}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Paid At
                      </Label>
                      <p className="text-sm">{format(new Date(details.payment.paidAt), "PPp")}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Created At
                      </Label>
                      <p className="text-sm">{format(new Date(details.payment.createdAt), "PPp")}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No payment information available</p>
                </div>
              )}
            </TabsContent>

            {/* Resolution Tab */}
            <TabsContent value="resolution" className="space-y-4 mt-4">
              <div>
                <Label className="text-gray-600">Complaint Status</Label>
                <div className="mt-2">
                  <Badge className={`${getStatusColor(details.status)} text-lg px-4 py-2`}>
                    {details.status.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                </div>
              </div>

              {details.adminNotes && (
                <div>
                  <Label className="text-gray-600 font-semibold">Admin Notes</Label>
                  <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm whitespace-pre-wrap">{details.adminNotes}</p>
                  </div>
                </div>
              )}

              {details.resolution && (
                <div>
                  <Label className="text-gray-600 font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Resolution
                  </Label>
                  <div className="mt-2 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm whitespace-pre-wrap">{details.resolution}</p>
                  </div>
                </div>
              )}

              {details.resolvedAt && (
                <div>
                  <Label className="text-gray-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Resolved At
                  </Label>
                  <p className="text-sm font-medium">{format(new Date(details.resolvedAt), "PPp")}</p>
                </div>
              )}

              {!details.resolution && !details.adminNotes && details.status.toLowerCase() === "pending" && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="font-medium">Your complaint is pending review</p>
                  <p className="text-sm mt-2">Our admin team will review your complaint soon.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
