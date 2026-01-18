import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, FileText } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Your payment has been processed successfully. Thank you for using our service.
        </p>

        {/* Success Details */}
        <div className="bg-green-50 rounded-lg p-4 mb-8 border border-green-200">
          <p className="text-sm text-green-700">
            A confirmation has been sent to your email address. You can view your order details in your profile.
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
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
