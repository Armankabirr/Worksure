import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DollarSign, CheckCircle, Clock } from "lucide-react";
import { ApiServiceRequest, ExtraItem } from "@/types/workerDashboard";

interface PricingBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedWork: ApiServiceRequest | null;
}

export const PricingBreakdownDialog = ({
  open,
  onOpenChange,
  selectedWork,
}: PricingBreakdownDialogProps) => {
  if (!selectedWork) return null;

  const extraItems = (selectedWork.extra_items || []) as ExtraItem[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

        <div className="space-y-4 py-2">
          {/* Base Price */}
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Base Service Price</span>
            <span className="font-medium">
              ৳{(selectedWork.base_price || selectedWork.total_amount || 0).toFixed(2)}
            </span>
          </div>

          {/* Labor Cost */}
          {selectedWork.labor_cost && (
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Labor Cost</span>
              <span className="font-medium">
                ৳{selectedWork.labor_cost.toFixed(2)}
              </span>
            </div>
          )}

          {/* Extra Items */}
          {extraItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Extra Items</h4>
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                {extraItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600">
                      {item.name} (x{item.quantity})
                      <span
                        className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
                          item.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : item.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </span>
                    <span
                      className={`font-medium ${
                        item.status === "rejected"
                          ? "line-through text-gray-400"
                          : ""
                      }`}
                    >
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
              ৳{(selectedWork.total_amount || 0).toFixed(2)}
            </span>
          </div>

          {/* Payment Status */}
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-50">
            {selectedWork.payment_completed ? (
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

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PricingBreakdownDialog;
