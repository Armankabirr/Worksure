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
import { DollarSign, CheckCircle, Clock, Loader2, Package } from "lucide-react";
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
}

interface AwaitingDetailsResponse {
     id: string;
     total_amount: number;
     status: string;
     items_approval: boolean;
     order_items: OrderItemRecord[];
}

interface HiringPricingDialogProps {
     open: boolean;
     onOpenChange: (open: boolean) => void;
     selectedHiring: Hiring | null;
     onConfirmSuccess?: () => void;
}

export const HiringPricingDialog = ({
     open,
     onOpenChange,
     selectedHiring,
     onConfirmSuccess,
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
               setAwaitingDetails(response.data?.order);
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
               <DialogContent className="max-w-lg">
                    <DialogHeader>
                         <DialogTitle className="text-xl font-semibold flex items-center text-blue-600">
                              <DollarSign className="h-5 w-5 mr-2" />
                              Pricing Breakdown
                         </DialogTitle>
                         <DialogDescription>
                              View the complete pricing details for this work order.
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
                         <div className="space-y-4 py-2">
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
                                                  <div className="flex justify-end mt-1">
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
                         </div>
                    ) : (
                         <div className="text-center py-8 text-gray-500">
                              No pricing details available
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
