import { useState, useEffect } from "react";
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
     DollarSign, 
     CheckCircle, 
     Clock, 
     Loader2, 
     Package, 
     User, 
     Phone, 
     Mail, 
     MapPin,
     Calendar,
     Star,
     CreditCard,
     FileText,
     AlertCircle
} from "lucide-react";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { Hiring } from "@/types/profile";
import { toast } from "sonner";

interface OrderItem {
     service_id: string;
     service_name: string;
     quantity: number;
     unit_price: number;
     total_price: number;
}

interface OrderItemRecord {
     id: string;
     items: OrderItem[];
     additional_notes: string | null;
     verified: boolean;
     created_at: string;
     updated_at: string;
}

interface PaymentRecord {
     id: string;
     amount: number;
     status: string;
     payment_method: string;
     trx_id: string;
     paid_at: string | null;
     created_at: string;
}

interface ReviewRecord {
     id: string;
     rating: number;
     comment: string;
     created_at: string;
     users_reviews_user_idTousers: {
          id: string;
          full_name: string;
          profile_picture: string;
     };
}

interface UserInfo {
     id: string;
     full_name: string;
     email: string;
     phone: string;
     profile_picture: string;
     worker_profiles?: {
          display_name: string;
          bio: string;
          years_experience: number;
          avg_rating: string;
          total_reviews: number;
          verification: string;
     };
}

interface AwaitingDetailsResponse {
     id: string;
     client_id: string;
     assigned_worker_id: string;
     status: string;
     work_start: string | null;
     work_end: string | null;
     total_amount: number;
     description: string;
     address: string;
     selected_time: string;
     payment_completed: boolean;
     cancel_reason: string | null;
     canceled_by: string | null;
     items_approval: boolean;
     created_at: string;
     updated_at: string;
     users_orders_client_idTousers: UserInfo;
     users_orders_assigned_worker_idTousers: UserInfo;
     order_items: OrderItemRecord[];
     payments: PaymentRecord[];
     reviews: ReviewRecord[];
}

interface HiringPricingDialogProps {
     open: boolean;
     onOpenChange: (open: boolean) => void;
     selectedHiring: Hiring | null | (Omit<Hiring, 'worker'> & { worker?: Worker });
     onConfirmSuccess?: () => void;
     userRole?: 'client' | 'worker';
}

export const HiringPricingDialog = ({
     open,
     onOpenChange,
     selectedHiring,
     onConfirmSuccess,
     userRole = 'client',
}: HiringPricingDialogProps) => {
     const axiosPublic = useAxiosPublic();
     const [loading, setLoading] = useState(false);
     const [confirmLoading, setConfirmLoading] = useState(false);
     const [awaitingDetails, setAwaitingDetails] = useState<AwaitingDetailsResponse | null>(null);
     const [error, setError] = useState<string | null>(null);

     useEffect(() => {
          if (open && selectedHiring?.id) {
               fetchAwaitingDetails();
          } else {
               setAwaitingDetails(null);
               setError(null);
          }
     }, [open, selectedHiring?.id]);

     async function fetchAwaitingDetails() {
          if (!selectedHiring?.id) return;

          setLoading(true);
          setError(null);
          try {
               const response = await axiosPublic.get<AwaitingDetailsResponse>(
                    `/orderRoutes/orders/${selectedHiring.id}/awaitingDetails`
               );
               setAwaitingDetails(response.data);
          } catch (err) {
               console.error("Error fetching awaiting details:", err);
               setError("Failed to load pricing details");
          } finally {
               setLoading(false);
          }
     }

     async function handleConfirm() {
          if (!selectedHiring?.id) return;

          setConfirmLoading(true);
          try {
               const result = await axiosPublic.patch(`/orderRoutes/orderItems/${selectedHiring.id}/accept`);
               if (result.status !== 200) {
                    toast.error("Failed to confirm order");
                    return;
               }
               toast.success("Work completed successfully!");
               onOpenChange(false);
               onConfirmSuccess?.();
          } catch (err) {
               console.error("Error confirming order:", err);
               toast.error("Failed to confirm order. Please try again.");
          } finally {
               setConfirmLoading(false);
          }
     }

     // Calculate extra items total from order_items
     const calculateExtraItemsTotal = () => {
          if (!awaitingDetails?.order_items) return 0;
          return awaitingDetails.order_items.reduce((total, record) => {
               const recordTotal = record.items?.reduce((sum, item) => sum + item.total_price, 0) || 0;
               return total + recordTotal;
          }, 0);
     };

     if (!selectedHiring) return null;

     const extraItemsTotal = awaitingDetails ? calculateExtraItemsTotal() : 0;
     const basePrice = awaitingDetails ? awaitingDetails.total_amount - extraItemsTotal : 0;
     const grandTotal = awaitingDetails?.total_amount || 0;

     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                         <DialogTitle className="text-xl font-semibold flex items-center text-blue-600">
                              <FileText className="h-5 w-5 mr-2" />
                              Order Details
                         </DialogTitle>
                         <DialogDescription>
                              Complete information about this work order.
                         </DialogDescription>
                    </DialogHeader>

                    {loading ? (
                         <div className="flex items-center justify-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                              <span className="ml-2 text-gray-500">Loading details...</span>
                         </div>
                    ) : error ? (
                         <div className="text-center py-8">
                              <p className="text-red-500">{error}</p>
                              <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={fetchAwaitingDetails}
                                   className="mt-2"
                              >
                                   Retry
                              </Button>
                         </div>
                    ) : awaitingDetails ? (
                         <Tabs defaultValue="overview" className="w-full">
                              <TabsList className="grid w-full grid-cols-5 bg-gray-300">
                                   <TabsTrigger value="overview">Overview</TabsTrigger>
                                   <TabsTrigger value="pricing">Pricing</TabsTrigger>
                                   <TabsTrigger value="worker">{userRole === 'worker' ? 'Client' : 'Worker'}</TabsTrigger>
                                   <TabsTrigger value="payment">Payment</TabsTrigger>
                                   <TabsTrigger value="reviews">Reviews</TabsTrigger>
                              </TabsList>

                              {/* Overview Tab */}
                              <TabsContent value="overview" className="space-y-4">
                                   {/* Order Status */}
                                   <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                                        <div className="flex items-center justify-between mb-3">
                                             <h3 className="font-semibold text-gray-900">Order Status</h3>
                                             <Badge className={`${
                                                  awaitingDetails.status === 'completed' ? 'bg-green-500' :
                                                  awaitingDetails.status === 'in_progress' ? 'bg-blue-500' :
                                                  awaitingDetails.status === 'cancelled' ? 'bg-red-500' :
                                                  'bg-amber-500'
                                             }`}>
                                                  {awaitingDetails.status.replace('_', ' ').toUpperCase()}
                                             </Badge>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                             <div className="flex items-center gap-2">
                                                  <FileText className="h-4 w-4 text-gray-600" />
                                                  <span className="text-gray-600">Order ID:</span>
                                                  <span className="font-medium">{awaitingDetails.id.slice(0, 8)}...</span>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                  <Calendar className="h-4 w-4 text-gray-600" />
                                                  <span className="text-gray-600">Created:</span>
                                                  <span className="font-medium">
                                                       {new Date(awaitingDetails.created_at).toLocaleString()}
                                                  </span>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Description */}
                                   <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                        <p className="text-gray-700">{awaitingDetails.description}</p>
                                   </div>

                                   {/* Location & Timing */}
                                   <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                             <div className="flex items-start gap-2 mb-2">
                                                  <MapPin className="h-4 w-4 text-orange-600 mt-1" />
                                                  <div>
                                                       <h3 className="font-semibold text-gray-900 text-sm">Service Location</h3>
                                                       <p className="text-gray-700 text-sm mt-1">{awaitingDetails.address}</p>
                                                  </div>
                                             </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                                             <div className="flex items-start gap-2">
                                                  <Clock className="h-4 w-4 text-blue-600 mt-1" />
                                                  <div>
                                                       <h3 className="font-semibold text-gray-900 text-sm">Scheduled Time</h3>
                                                       <p className="text-gray-700 text-sm mt-1">
                                                            {new Date(awaitingDetails.selected_time).toLocaleString()}
                                                       </p>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Work Duration */}
                                   {awaitingDetails.work_start && awaitingDetails.work_end && (
                                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                             <h3 className="font-semibold text-gray-900 mb-2">Work Duration</h3>
                                             <div className="grid grid-cols-2 gap-4 text-sm">
                                                  <div>
                                                       <span className="text-gray-600">Started:</span>
                                                       <p className="font-medium">{new Date(awaitingDetails.work_start).toLocaleString()}</p>
                                                  </div>
                                                  <div>
                                                       <span className="text-gray-600">Completed:</span>
                                                       <p className="font-medium">{new Date(awaitingDetails.work_end).toLocaleString()}</p>
                                                  </div>
                                             </div>
                                        </div>
                                   )}

                                   {/* Cancellation Info */}
                                   {awaitingDetails.cancel_reason && (
                                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                             <div className="flex items-start gap-2">
                                                  <AlertCircle className="h-4 w-4 text-red-600 mt-1" />
                                                  <div>
                                                       <h3 className="font-semibold text-red-900 text-sm">Cancellation Reason</h3>
                                                       <p className="text-red-700 text-sm mt-1">{awaitingDetails.cancel_reason}</p>
                                                       {awaitingDetails.canceled_by && (
                                                            <p className="text-red-600 text-xs mt-1">
                                                                 Canceled by: {awaitingDetails.canceled_by}
                                                            </p>
                                                       )}
                                                  </div>
                                             </div>
                                        </div>
                                   )}
                              </TabsContent>

                              {/* Pricing Tab */}
                              <TabsContent value="pricing" className="space-y-4">
                                   {/* Base Service Price */}
                                   <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-gray-600">Base Service Price</span>
                                        <span className="font-medium">
                                             ৳{basePrice.toFixed(2)}
                                        </span>
                                   </div>

                                   {/* Extra Items Section */}
                                   {awaitingDetails.order_items && awaitingDetails.order_items.length > 0 && (
                                        <div className="space-y-3">
                                             <h4 className="font-medium text-gray-900 flex items-center">
                                                  <Package className="h-4 w-4 mr-2" />
                                                  Extra Items / Materials
                                             </h4>

                                             {awaitingDetails.order_items.map((orderItem) => (
                                                  <div key={orderItem.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                                                       {/* Items List */}
                                                       {orderItem.items && Array.isArray(orderItem.items) && orderItem.items.map((item, index) => (
                                                            <div
                                                                 key={`${orderItem.id}-${index}`}
                                                                 className="flex justify-between items-center text-sm"
                                                            >
                                                                 <span className="text-gray-600">
                                                                      {item.service_name} (x{item.quantity})
                                                                 </span>
                                                                 <div className="flex items-center gap-2">
                                                                      <span className="text-xs text-gray-400">
                                                                           @৳{item.unit_price.toFixed(2)}
                                                                      </span>
                                                                      <span className="font-medium">
                                                                           ৳{item.total_price.toFixed(2)}
                                                                      </span>
                                                                 </div>
                                                            </div>
                                                       ))}

                                                       {/* Additional Notes */}
                                                       {orderItem.additional_notes && (
                                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                                 <p className="text-xs text-gray-500 italic">
                                                                      Note: {orderItem.additional_notes}
                                                                 </p>
                                                            </div>
                                                       )}

                                                       {/* Verified Status */}
                                                       <div className="flex justify-between items-center mt-1">
                                                            <span className="text-xs text-gray-500">
                                                                 Added: {new Date(orderItem.created_at).toLocaleString()}
                                                            </span>
                                                            <span
                                                                 className={`px-2 py-0.5 text-xs rounded-full ${orderItem.verified
                                                                      ? "bg-green-100 text-green-700"
                                                                      : "bg-amber-100 text-amber-700"
                                                                 }`}
                                                            >
                                                                 {orderItem.verified ? "Verified" : "Pending Verification"}
                                                            </span>
                                                       </div>
                                                  </div>
                                             ))}

                                             {/* Extra Items Total */}
                                             <div className="flex justify-between items-center py-2 border-t">
                                                  <span className="text-gray-600">Extra Items Total</span>
                                                  <span className="font-medium text-orange-600">
                                                       ৳{extraItemsTotal.toFixed(2)}
                                                  </span>
                                             </div>
                                        </div>
                                   )}

                                   {/* Grand Total */}
                                   <div className="flex justify-between items-center py-3 border-t-2 border-gray-200">
                                        <span className="text-lg font-semibold text-gray-900">Grand Total</span>
                                        <span className="text-lg font-bold text-green-600">
                                             ৳{grandTotal}
                                        </span>
                                   </div>

                                   {/* Items Approval Status */}
                                   <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-50">
                                        {awaitingDetails.items_approval ? (
                                             <>
                                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                                  <span className="text-green-600 font-medium">Items Approved</span>
                                             </>
                                        ) : (
                                             <>
                                                  <Clock className="h-5 w-5 text-amber-600" />
                                                  <span className="text-amber-600 font-medium">Awaiting Your Approval</span>
                                             </>
                                        )}
                                   </div>
                              </TabsContent>

                              {/* Worker/Client Tab */}
                              <TabsContent value="worker" className="space-y-4">
                                   {userRole === 'worker' ? (
                                        // Show Client Details for Workers
                                        awaitingDetails.users_orders_client_idTousers && (
                                             <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                  <div className="flex items-start gap-4">
                                                       <Avatar className="h-16 w-16 border-2 border-blue-200">
                                                            <AvatarImage 
                                                                 src={awaitingDetails.users_orders_client_idTousers.profile_picture} 
                                                                 alt={awaitingDetails.users_orders_client_idTousers.full_name} 
                                                            />
                                                            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                                                                 {awaitingDetails.users_orders_client_idTousers.full_name
                                                                      .split(" ")
                                                                      .map((n) => n[0])
                                                                      .join("")
                                                                      .toUpperCase()}
                                                            </AvatarFallback>
                                                       </Avatar>
                                                       <div className="flex-1">
                                                            <h3 className="font-semibold text-lg text-gray-900">
                                                                 {awaitingDetails.users_orders_client_idTousers.full_name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 mb-2">Client</p>
                                                            <div className="space-y-2 text-sm">
                                                                 <div className="flex items-center gap-2">
                                                                      <Phone className="h-4 w-4 text-gray-600" />
                                                                      <span className="text-gray-700">
                                                                           {awaitingDetails.users_orders_client_idTousers.phone}
                                                                      </span>
                                                                 </div>
                                                                 <div className="flex items-center gap-2">
                                                                      <Mail className="h-4 w-4 text-gray-600" />
                                                                      <span className="text-gray-700">
                                                                           {awaitingDetails.users_orders_client_idTousers.email}
                                                                      </span>
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                        )
                                   ) : (
                                        // Show Worker Details for Clients
                                        awaitingDetails.users_orders_assigned_worker_idTousers && (
                                             <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                  <div className="flex items-start gap-4">
                                                       <Avatar className="h-16 w-16 border-2 border-blue-200">
                                                            <AvatarImage 
                                                                 src={awaitingDetails.users_orders_assigned_worker_idTousers.profile_picture} 
                                                                 alt={awaitingDetails.users_orders_assigned_worker_idTousers.full_name} 
                                                            />
                                                            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                                                                 {awaitingDetails.users_orders_assigned_worker_idTousers.full_name
                                                                      .split(" ")
                                                                      .map((n) => n[0])
                                                                      .join("")
                                                                      .toUpperCase()}
                                                            </AvatarFallback>
                                                       </Avatar>
                                                       <div className="flex-1">
                                                            <h3 className="font-semibold text-lg text-gray-900">
                                                                 {awaitingDetails.users_orders_assigned_worker_idTousers.full_name}
                                                            </h3>
                                                            {awaitingDetails.users_orders_assigned_worker_idTousers.worker_profiles && (
                                                                 <>
                                                                      <p className="text-sm text-gray-600 mb-2">
                                                                           {awaitingDetails.users_orders_assigned_worker_idTousers.worker_profiles.display_name}
                                                                      </p>
                                                                      <div className="flex items-center gap-4 mb-3">
                                                                           <div className="flex items-center gap-1">
                                                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                                <span className="font-semibold text-sm">
                                                                                     {awaitingDetails.users_orders_assigned_worker_idTousers.worker_profiles.avg_rating}
                                                                                </span>
                                                                                <span className="text-xs text-gray-500">
                                                                                     ({awaitingDetails.users_orders_assigned_worker_idTousers.worker_profiles.total_reviews} reviews)
                                                                                </span>
                                                                           </div>
                                                                           <Badge variant="outline">
                                                                                {awaitingDetails.users_orders_assigned_worker_idTousers.worker_profiles.years_experience}+ years exp
                                                                           </Badge>
                                                                           {awaitingDetails.users_orders_assigned_worker_idTousers.worker_profiles.verification === 'verified' && (
                                                                                <Badge className="bg-green-500">Verified</Badge>
                                                                           )}
                                                                      </div>
                                                                      {awaitingDetails.users_orders_assigned_worker_idTousers.worker_profiles.bio && (
                                                                           <p className="text-sm text-gray-700 mb-3">
                                                                                {awaitingDetails.users_orders_assigned_worker_idTousers.worker_profiles.bio}
                                                                           </p>
                                                                      )}
                                                                 </>
                                                            )}
                                                            <div className="space-y-2 text-sm">
                                                                 <div className="flex items-center gap-2">
                                                                      <Phone className="h-4 w-4 text-gray-600" />
                                                                      <span className="text-gray-700">
                                                                           {awaitingDetails.users_orders_assigned_worker_idTousers.phone}
                                                                      </span>
                                                                 </div>
                                                                 <div className="flex items-center gap-2">
                                                                      <Mail className="h-4 w-4 text-gray-600" />
                                                                      <span className="text-gray-700">
                                                                           {awaitingDetails.users_orders_assigned_worker_idTousers.email}
                                                                      </span>
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                        )
                                   )}
                              </TabsContent>

                              {/* Payment Tab */}
                              <TabsContent value="payment" className="space-y-4">
                                   <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                                        <div className="flex items-center justify-between mb-2">
                                             <h3 className="font-semibold text-gray-900">Payment Status</h3>
                                             <Badge className={awaitingDetails.payment_completed ? 'bg-green-500' : 'bg-amber-500'}>
                                                  {awaitingDetails.payment_completed ? 'Paid' : 'Pending'}
                                             </Badge>
                                        </div>
                                        <div className="text-2xl font-bold text-green-600">
                                             ৳{awaitingDetails.total_amount}
                                        </div>
                                   </div>

                                   {awaitingDetails.payments && awaitingDetails.payments.length > 0 ? (
                                        <div className="space-y-3">
                                             <h4 className="font-medium text-gray-900">Payment History</h4>
                                             {awaitingDetails.payments.map((payment) => (
                                                  <div key={payment.id} className="bg-white rounded-lg p-4 border border-gray-200">
                                                       <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                 <CreditCard className="h-4 w-4 text-blue-600" />
                                                                 <span className="font-semibold">৳{payment.amount}</span>
                                                            </div>
                                                            <Badge className={
                                                                 payment.status === 'completed' ? 'bg-green-500' :
                                                                 payment.status === 'pending' ? 'bg-amber-500' :
                                                                 'bg-red-500'
                                                            }>
                                                                 {payment.status}
                                                            </Badge>
                                                       </div>
                                                       <div className="space-y-1 text-sm text-gray-600">
                                                            <p>Method: {payment.payment_method}</p>
                                                            <p>Transaction ID: {payment.trx_id}</p>
                                                            {payment.paid_at && (
                                                                 <p>Paid at: {new Date(payment.paid_at).toLocaleString()}</p>
                                                            )}
                                                            <p className="text-xs">Created: {new Date(payment.created_at).toLocaleString()}</p>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   ) : (
                                        <div className="text-center py-8 text-gray-500">
                                             <CreditCard className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                             <p>No payment records yet</p>
                                        </div>
                                   )}
                              </TabsContent>

                              {/* Reviews Tab */}
                              <TabsContent value="reviews" className="space-y-4">
                                   {awaitingDetails.reviews && awaitingDetails.reviews.length > 0 ? (
                                        <div className="space-y-3">
                                             {awaitingDetails.reviews.map((review) => (
                                                  <div key={review.id} className="bg-white rounded-lg p-4 border border-gray-200">
                                                       <div className="flex items-start gap-3">
                                                            <Avatar className="h-10 w-10">
                                                                 <AvatarImage 
                                                                      src={review.users_reviews_user_idTousers.profile_picture} 
                                                                      alt={review.users_reviews_user_idTousers.full_name} 
                                                                 />
                                                                 <AvatarFallback className="bg-purple-100 text-purple-600 text-sm font-semibold">
                                                                      {review.users_reviews_user_idTousers.full_name
                                                                           .split(" ")
                                                                           .map((n) => n[0])
                                                                           .join("")
                                                                           .toUpperCase()}
                                                                 </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1">
                                                                 <div className="flex items-center justify-between mb-2">
                                                                      <h4 className="font-semibold text-gray-900">
                                                                           {review.users_reviews_user_idTousers.full_name}
                                                                      </h4>
                                                                      <div className="flex items-center gap-1">
                                                                           {[1, 2, 3, 4, 5].map((star) => (
                                                                                <Star
                                                                                     key={star}
                                                                                     className={`h-4 w-4 ${
                                                                                          star <= review.rating
                                                                                               ? "fill-yellow-400 text-yellow-400"
                                                                                               : "text-gray-300"
                                                                                     }`}
                                                                                />
                                                                           ))}
                                                                      </div>
                                                                 </div>
                                                                 <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                                                                 <p className="text-xs text-gray-500">
                                                                      {new Date(review.created_at).toLocaleString()}
                                                                 </p>
                                                            </div>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   ) : (
                                        <div className="text-center py-8 text-gray-500">
                                             <Star className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                                             <p>No reviews yet</p>
                                        </div>
                                   )}
                              </TabsContent>
                         </Tabs>
                    ) : (
                         <div className="text-center py-8 text-gray-500">
                              No details available
                         </div>
                    )}

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                         <Button
                              variant="outline"
                              onClick={() => onOpenChange(false)}
                              disabled={confirmLoading}
                         >
                              Close
                         </Button>
                         {awaitingDetails && !awaitingDetails.items_approval && (
                              <Button
                                   className="bg-green-600 hover:bg-green-700 text-white"
                                   onClick={handleConfirm}
                                   disabled={confirmLoading}
                              >
                                   {confirmLoading ? (
                                        <>
                                             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                             Confirming...
                                        </>
                                   ) : (
                                        <>
                                             <CheckCircle className="h-4 w-4 mr-2" />
                                             Confirm Order
                                        </>
                                   )}
                              </Button>
                         )}
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     );
};

export default HiringPricingDialog;
