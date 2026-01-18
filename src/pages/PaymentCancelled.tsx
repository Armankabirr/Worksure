import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ban, Home, RotateCcw } from "lucide-react";

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Cancelled Icon */}
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Ban className="h-12 w-12 text-amber-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          You have cancelled the payment process. Your order is still pending and no charges have been made.
        </p>

        {/* Info Details */}
        <div className="bg-amber-50 rounded-lg p-4 mb-8 border border-amber-200">
          <p className="text-sm text-amber-700">
            You can complete the payment later from your profile or choose to pay with cash on hand.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="flex-1"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
          <Button
            onClick={() => navigate("/profile")}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
