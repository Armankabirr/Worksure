import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Briefcase } from "lucide-react";

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

const UserLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setErrors((prev) => ({ ...prev, general: undefined }));
    try {
      const { error } = await login(formData.email.trim(), formData.password);
      if (error) {
        setErrors({ general: error.message });
        return;
      }
      navigate("/", { replace: true });
    } catch {
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg border border-border">
        <div className="px-8 pt-8 pb-4 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-6 space-y-4">
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
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <p className="mt-4 text-xs text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/user/register"
              className="text-orange-500 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/worker/register")}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-orange-500/10 hover:from-orange-500/10 hover:to-orange-500/15 hover:border-orange-500/40 transition-all duration-200 group"
          >
            <Briefcase className="h-4 w-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold text-foreground">
              Want to offer services?
            </span>
            <span className="text-sm font-bold text-orange-500">
              Join as Worker →
            </span>
          </button>

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

export default UserLogin;


