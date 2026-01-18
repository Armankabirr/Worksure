import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Banknote, 
  Loader2, 
  CheckCircle,
  DollarSign
} from "lucide-react";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Hiring } from "@/types/profile";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedHiring: Hiring | null;
  onPaymentSuccess?: () => void;
}

export const PaymentDialog = ({
  open,
  onOpenChange,
  selectedHiring,
  onPaymentSuccess,
}: PaymentDialogProps) => {
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCashPayment = async () => {
    if (!selectedHiring || !user?.email) return;

    setLoading(true);
    try {
      const res = await axiosPublic.post("/paymentRoutes/cash", {
        order_id: selectedHiring.id,
        payer_email: user.email,
        amount: selectedHiring.total_amount,
      });

      if(res.status !== 201) {
        throw new Error("Failed to process cash payment");
      }

      toast.success("Cash payment recorded successfully!");
      onOpenChange(false);
      setPaymentMethod(null);
      onPaymentSuccess?.();
    } catch (err) {
      console.error("Error processing cash payment:", err);
      toast.error("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!selectedHiring || !user?.email) return;

    setLoading(true);
    try {

     console.log(selectedHiring.id, "<--->", user.email);
     

      const res = await axiosPublic.post("/paymentRoutes/ssl/initiate", {
        order_id: selectedHiring.id,
        payer_email: user.email,
      });

      console.log("init response: ",res.data);
      

      if (res.data?.paymentUrl) {
        // Redirect to SSLCommerz payment gateway
        window.location.href = res.data.paymentUrl;
      } else {
        throw new Error("Failed to get payment URL");
      }
    } catch (err) {
      console.error("Error initiating online payment:", err);
      toast.error("Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  const handleConfirmPayment = () => {
    if (paymentMethod === "cash") {
      handleCashPayment();
    } else if (paymentMethod === "online") {
      handleOnlinePayment();
    }
  };

  if (!selectedHiring) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setPaymentMethod(null);
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center text-green-600">
            <CreditCard className="h-5 w-5 mr-2" />
            Make Payment
          </DialogTitle>
          <DialogDescription>
            Choose your preferred payment method to complete the order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount Display */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <span className="text-4xl font-bold text-green-700">
                ৳{selectedHiring.total_amount}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Order: {selectedHiring.description}
            </p>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Select Payment Method</p>
            
            {/* Pay on Hand Option */}
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-4 ${
                paymentMethod === "cash"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className={`p-3 rounded-full ${
                paymentMethod === "cash" ? "bg-green-100" : "bg-gray-100"
              }`}>
                <Banknote className={`h-6 w-6 ${
                  paymentMethod === "cash" ? "text-green-600" : "text-gray-600"
                }`} />
              </div>
              <div className="flex-1 text-left">
                <p className={`font-semibold ${
                  paymentMethod === "cash" ? "text-green-700" : "text-gray-900"
                }`}>
                  Pay on Hand
                </p>
                <p className="text-xs text-gray-500">
                  Pay cash directly to the worker
                </p>
              </div>
              {paymentMethod === "cash" && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </button>

            {/* Pay Online Option */}
            <button
              onClick={() => setPaymentMethod("online")}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center gap-4 ${
                paymentMethod === "online"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className={`p-3 rounded-full ${
                paymentMethod === "online" ? "bg-blue-100" : "bg-gray-100"
              }`}>
                <CreditCard className={`h-6 w-6 ${
                  paymentMethod === "online" ? "text-blue-600" : "text-gray-600"
                }`} />
              </div>
              <div className="flex-1 text-left">
                <p className={`font-semibold ${
                  paymentMethod === "online" ? "text-blue-700" : "text-gray-900"
                }`}>
                  Pay Online
                </p>
                <p className="text-xs text-gray-500">
                  Pay securely using card or mobile banking
                </p>
              </div>
              {paymentMethod === "online" && (
                <CheckCircle className="h-5 w-5 text-blue-600" />
              )}
            </button>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPayment}
            disabled={!paymentMethod || loading}
            className={`${
              paymentMethod === "cash" 
                ? "bg-green-600 hover:bg-green-700" 
                : paymentMethod === "online"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400"
            } text-white`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {paymentMethod === "cash" && <Banknote className="h-4 w-4 mr-2" />}
                {paymentMethod === "online" && <CreditCard className="h-4 w-4 mr-2" />}
                Confirm Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
