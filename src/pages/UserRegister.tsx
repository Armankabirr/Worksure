import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
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

const UserRegister = () => {
  const navigate = useNavigate();

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

  const validate = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone is required.";

    if (!formData.role) newErrors.role = "Please select a role.";

    if (!formData.password) newErrors.password = "Password is required.";

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      // TODO: Replace with real API call:
      // await axios.post("http://localhost:5000/api/user/register", formData);

      // For now, simulate success and go to login:
      navigate("/user/login");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: "Registration failed. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg border border-border">
        <div className="px-8 pt-8 pb-4 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Create Account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign up to get started with our services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-6 space-y-4">
          <div className="space-y-1 text-left">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1 text-left">
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

          <div className="space-y-1 text-left">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
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

          <div className="space-y-1 text-left">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
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

          <div className="space-y-1 text-left">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
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

          <div className="space-y-1 text-left">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
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
            <div className="mt-2 rounded-md bg-destructive/10 border border-destructive/40 px-3 py-2 text-xs text-destructive">
              {errors.general}
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-3 bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </Button>

          <p className="mt-4 text-xs text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/user/login"
              className="text-orange-500 hover:underline font-medium"
            >
              Login
            </Link>
          </p>

          <p className="mt-4 text-[11px] text-center text-muted-foreground">
            ←{" "}
            <Link to="/" className="hover:underline">
              Back to Home
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default UserRegister;


