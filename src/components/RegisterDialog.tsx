import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "user" | "worker" | "";
}

interface RegisterFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
  role?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

const RegisterDialog = ({ open, onOpenChange, onSwitchToLogin }: RegisterDialogProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset step when dialog opens/closes
  useEffect(() => {
    if (open) {
      setStep(1);
    }
  }, [open]);

  const handleChange =
    (field: keyof RegisterFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
        general: undefined,
      }));
    };

  const validateStep1 = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.role) newErrors.role = "Please select a role.";
    if (!formData.name.trim()) newErrors.name = "Name is required.";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.password) newErrors.password = "Password is required.";

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateStep2()) return;

    try {
      setIsSubmitting(true);

      // TODO: Replace with real API call:
      // await axios.post("http://localhost:5000/api/user/register", formData);
      // onOpenChange(false);
      // onSwitchToLogin(); // Switch to login after successful registration

      // Mock success for UI demonstration:
      setTimeout(() => {
        onOpenChange(false);
        setTimeout(() => {
          onSwitchToLogin();
        }, 200);
      }, 600);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Registration failed. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchToLogin = () => {
    onOpenChange(false);
    setTimeout(() => {
      onSwitchToLogin();
    }, 200); // Small delay for smooth transition
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            Create Account
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 1 
              ? "Sign up to get started with our services" 
              : "Create a secure password"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {step === 1 ? (
            <>
              <div className="space-y-1">
                <Label>Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "user" | "worker") => {
                    setFormData((prev) => ({ ...prev, role: value }));
                    setErrors((prev) => ({ ...prev, role: undefined, general: undefined }));
                  }}
                >
                  <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="worker">Worker</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-xs text-destructive mt-1">{errors.role}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="register-name">Full Name</Label>
                <Input
                  id="register-name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="register-phone">Phone Number</Label>
                <Input
                  id="register-phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleNext}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Next
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange("password")}
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="register-confirm-password">Confirm Password</Label>
                <Input
                  id="register-confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {errors.general && (
                <div className="rounded-md bg-destructive/10 border border-destructive/40 px-3 py-2 text-xs text-destructive">
                  {errors.general}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </Button>
              </div>
            </>
          )}

          <p className="text-xs text-center text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={handleSwitchToLogin}
              className="text-orange-500 hover:underline font-medium"
            >
              Login
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;

