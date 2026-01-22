import { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
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
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/context/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^.{8,}$/;

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

type Step = 1 | 2 | 3 | "success";

export default function RegisterDialog({
  open,
  onOpenChange,
  onSwitchToLogin,
}: RegisterDialogProps) {
  const {
    requestSignupOtp,
    verifyOtp,
    resendOtp,
    changePassword,
    completeSignupProfile,
    logout,
    closeRegister,
    openLogin,
  } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"user" | "worker" | "">("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSentAt, setOtpSentAt] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      setStep(1);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setOtp("");
      setName("");
      setPhone("");
      setRole("");
      setErrors({});
    }
  }, [open]);

  const clearError = (key: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!emailRegex.test(email.trim())) e.email = "Please enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (!passwordRegex.test(password)) e.password = "Password must be at least 8 characters.";
    if (!confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {};
    const t = otp.trim();
    if (!t) {
      e.otp = "Enter the 6-digit verification code from your email.";
    } else if (t.length !== 6) {
      e.otp = "Code must be exactly 6 digits.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!phone.trim()) e.phone = "Phone is required.";
    if (!role) e.role = "Please select a role.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onStep1Next = async () => {
    if (!validateStep1()) return;
    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, general: "" }));
    try {
      const { error } = await requestSignupOtp(email.trim());
      if (error) {
        setErrors((prev) => ({ ...prev, general: error.message }));
        return;
      }
      setOtpSentAt(Date.now());
      setStep(2);
    } catch {
      setErrors((prev) => ({ ...prev, general: "Failed to send code. Please try again." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setErrors((prev) => ({ ...prev, general: "", otp: "" }));
    try {
      const { error } = await resendOtp(email.trim());
      if (error) {
        setErrors((prev) => ({ ...prev, general: error.message }));
        return;
      }
      setOtpSentAt(Date.now());
      setOtp("");
    } catch {
      setErrors((prev) => ({ ...prev, general: "Failed to resend code. Please try again." }));
    } finally {
      setIsResending(false);
    }
  };

  const onStep2Next = async () => {
    if (!validateStep2()) return;
    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, general: "", otp: "" }));
    try {
      const { error } = await verifyOtp(email.trim(), otp.trim());
      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("expired") || msg.includes("invalid") || msg.includes("token")) {
          setErrors((prev) => ({
            ...prev,
            otp: "Invalid or expired code. Please request a new one.",
            general: "",
          }));
        } else {
          setErrors((prev) => ({ ...prev, general: error.message, otp: "" }));
        }
        return;
      }
      setStep(3);
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: "Verification failed. Please try again.",
        otp: "",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onStep3Submit = async () => {
    if (!validateStep3()) return;
    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, general: "" }));
    try {
      const { error: pwErr } = await changePassword(password);
      if (pwErr) {
        setErrors((prev) => ({ ...prev, general: pwErr.message }));
        return;
      }
      const { error } = await completeSignupProfile({
        name: name.trim(),
        phone: phone.trim(),
        role: role as UserRole,
      });
      if (error) {
        setErrors((prev) => ({ ...prev, general: error.message }));
        return;
      }
      await logout();
      setStep("success");
    } catch {
      setErrors((prev) => ({ ...prev, general: "Profile update failed. Please try again." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginNow = () => {
    onOpenChange(false);
    closeRegister();
    setTimeout(() => openLogin(), 150);
  };

  const handleSwitchToLogin = () => {
    onOpenChange(false);
    setTimeout(() => onSwitchToLogin(), 150);
  };

  if (step === "success") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="py-6 px-2 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                Signup completed successfully
              </h3>
              <p className="text-sm text-muted-foreground">
                Please log in to continue.
              </p>
            </div>
            <Button
              type="button"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleLoginNow}
            >
              Login Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            Create Account
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 1 && "Email and password"}
            {step === 2 && "Verify your email"}
            {step === 3 && "Complete your profile"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {step === 1 && (
            <>
              <div className="space-y-1">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError("password");
                    }}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="reg-confirm">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="reg-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearError("confirmPassword");
                    }}
                    className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
              {errors.general && (
                <div className="rounded-md bg-destructive/10 border border-destructive/40 px-3 py-2 text-xs text-destructive">
                  {errors.general}
                </div>
              )}
              <Button
                type="button"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isSubmitting}
                onClick={onStep1Next}
              >
                {isSubmitting ? "Sending…" : "Next"}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-muted-foreground">
                We sent a 6-digit verification code to <strong>{email}</strong>. Enter it below.
              </p>
              <div className="space-y-1">
                <Label htmlFor="reg-otp">Verification code</Label>
                <Input
                  id="reg-otp"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                    clearError("otp");
                    clearError("general");
                  }}
                  className={errors.otp ? "border-destructive" : ""}
                />
                {errors.otp && (
                  <p className="text-xs text-destructive">{errors.otp}</p>
                )}
              </div>
              {errors.general && (
                <div className="rounded-md bg-destructive/10 border border-destructive/40 px-3 py-2 text-xs text-destructive">
                  {errors.general}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isSubmitting || otp.length !== 6}
                    onClick={onStep2Next}
                  >
                    {isSubmitting ? "Verifying…" : "Verify"}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                  disabled={isResending}
                  onClick={handleResendOtp}
                >
                  {isResending ? "Sending…" : "Resend verification code"}
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-1">
                <Label>Role</Label>
                <Select
                  value={role}
                  onValueChange={(v: "user" | "worker") => {
                    setRole(v);
                    clearError("role");
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
                  <p className="text-xs text-destructive">{errors.role}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="reg-name">Full name</Label>
                <Input
                  id="reg-name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError("name");
                  }}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="reg-phone">Phone</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearError("phone");
                  }}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone}</p>
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
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={isSubmitting}
                  onClick={onStep3Submit}
                >
                  {isSubmitting ? "Saving…" : "Complete"}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
