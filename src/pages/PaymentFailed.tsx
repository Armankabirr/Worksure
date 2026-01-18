import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle, Home, RotateCcw } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Failed Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          We couldn't process your payment. Please try again or choose a different payment method.
        </p>

        {/* Error Details */}
        <div className="bg-red-50 rounded-lg p-4 mb-8 border border-red-200">
          <p className="text-sm text-red-700">
            If this issue persists, please contact our support team or try paying with cash on hand.
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
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
