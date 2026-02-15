import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function UserRegisterStep4() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const axiosPublic = useAxiosPublic();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    district: "",
    postal_code: "",
  });

  useEffect(() => {
    // Verify that user has completed previous steps
    const storedEmail = localStorage.getItem("registration_email");
    if (!storedEmail) {
      toast({
        title: "Session expired",
        description: "Please start the registration process again",
        variant: "destructive",
      });
      navigate("/user/register/step1");
    }
  }, [navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.street.trim()) {
      toast({
        title: "Missing street address",
        description: "Please enter your street address",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.city.trim()) {
      toast({
        title: "Missing city",
        description: "Please enter your city",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.district.trim()) {
      toast({
        title: "Missing district",
        description: "Please enter your district",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.postal_code.trim()) {
      toast({
        title: "Missing postal code",
        description: "Please enter your postal code",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const storedEmail = localStorage.getItem("registration_email");
      if (!storedEmail) {
        toast({
          title: "Session expired",
          description: "Please start the registration process again",
          variant: "destructive",
        });
        navigate("/user/register/step1");
        return;
      }

      // Prepare address data
      const addressData = {
        email: storedEmail,
        street: formData.street.trim(),
        city: formData.city.trim(),
        district: formData.district.trim(),
        postal_code: formData.postal_code.trim(),
      };

      const response = await axiosPublic.post("/userRoutes/createUserAddress", addressData);

      if (response.status === 201) {
        // Clear registration email from localStorage
        localStorage.removeItem("registration_email");

        toast({
          title: "Registration complete!",
          description: "Your account has been created successfully",
        });

        // Navigate to home
        navigate("/", { replace: true });
      } else {
        throw new Error(response.data.error || "Failed to save address");
      }
    } catch (error) {
      console.error("Address save error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <div className="flex-1 flex items-center justify-center mt-20 p-4 py-12">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Add Your Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Street Address */}
              <div className="space-y-2">
                <Label htmlFor="street">Street *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="street"
                    name="street"
                    type="text"
                    placeholder="House/Flat No, Road, Area"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="pl-9"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  name="district"
                  type="text"
                  placeholder="Enter your district"
                  value={formData.district}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>

              {/* Postal Code */}
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code *</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  type="text"
                  placeholder="Enter your postal code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing registration...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Registration
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
