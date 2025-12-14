import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "@/context/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister: () => void;
}

const LoginDialog = ({ open, onOpenChange, onSwitchToRegister }: LoginDialogProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleChange =
    (field: keyof LoginFormData) =>
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

  const validate = (): boolean => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await login(formData.email.trim(), formData.password);
      onOpenChange(false);
      
      // Get user from localStorage to check role
      const currentUserStr = localStorage.getItem("mock_current_user");
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        
        // Redirect based on role
        if (currentUser.role === "worker") {
          navigate("/worker/dashboard");
        } else {
          navigate("/profile");
        }
      }
    } catch (error) {
      let message = "Login failed. Please try again.";
      if (error instanceof Error) {
        message = error.message;
      }
      setErrors((prev) => ({
        ...prev,
        general: message,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchToRegister = () => {
    onOpenChange(false);
    setTimeout(() => {
      onSwitchToRegister();
    }, 200); // Small delay for smooth transition
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to your account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
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
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
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

          {errors.general && (
            <div className="rounded-md bg-destructive/10 border border-destructive/40 px-3 py-2 text-xs text-destructive">
              {errors.general}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={handleSwitchToRegister}
              className="text-orange-500 hover:underline font-medium"
            >
              Sign Up
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;

