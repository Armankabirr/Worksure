import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

type LoginForm = { email: string; password: string };
type SignupForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "worker";
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthModal() {
  const {
    loginOpen,
    registerOpen,
    closeLogin,
    closeRegister,
    openLogin,
    openRegister,
    login,
    register,
    completeAuthAndResume,
  } = useAuth();

  const open = loginOpen || registerOpen;
  const defaultTab = registerOpen ? "signup" : "login";
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);

  const [loginForm, setLoginForm] = useState<LoginForm>({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState<SignupForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Keep tab in sync with open mode
  useEffect(() => {
    if (!open) return;
    setTab(registerOpen ? "signup" : "login");
  }, [open, registerOpen, loginOpen]);

  const closeAll = () => {
    closeLogin();
    closeRegister();
    setLoginError(null);
    setSignupError(null);
    setSubmitting(false);
  };

  const validateLogin = () => {
    if (!loginForm.email.trim() || !emailRegex.test(loginForm.email.trim())) {
      return "Enter a valid email.";
    }
    if (!loginForm.password) return "Password is required.";
    return null;
  };

  const validateSignup = () => {
    if (!signupForm.name.trim()) return "Name is required.";
    if (!signupForm.email.trim() || !emailRegex.test(signupForm.email.trim())) {
      return "Enter a valid email.";
    }
    if (!signupForm.phone.trim()) return "Phone is required.";
    if (!signupForm.password) return "Password is required.";
    return null;
  };

  const onSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const err = validateLogin();
    if (err) {
      setLoginError(err);
      return;
    }
    try {
      setSubmitting(true);
      await login(loginForm.email.trim(), loginForm.password);
      completeAuthAndResume();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    const err = validateSignup();
    if (err) {
      setSignupError(err);
      return;
    }
    try {
      setSubmitting(true);
      await register({
        name: signupForm.name.trim(),
        email: signupForm.email.trim(),
        phone: signupForm.phone.trim(),
        password: signupForm.password,
        role: signupForm.role,
      });
      completeAuthAndResume();
    } catch (error) {
      setSignupError(error instanceof Error ? error.message : "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeAll();
      }}
    >
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Continue to book</DialogTitle>
            <DialogDescription>
              Sign in or create an account to complete this action. You&apos;ll return right here.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={tab}
            onValueChange={(v) => {
              const next = v === "signup" ? "signup" : "login";
              setTab(next);
              if (next === "signup") openRegister();
              else openLogin();
              setLoginError(null);
              setSignupError(null);
            }}
            className="mt-5"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              <form onSubmit={onSubmitLogin} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="auth-email">Email</Label>
                  <Input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    value={loginForm.email}
                    onChange={(e) => {
                      setLoginForm((p) => ({ ...p, email: e.target.value }));
                      setLoginError(null);
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="auth-password">Password</Label>
                  <Input
                    id="auth-password"
                    type="password"
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(e) => {
                      setLoginForm((p) => ({ ...p, password: e.target.value }));
                      setLoginError(null);
                    }}
                  />
                </div>

                {loginError && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {loginError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={submitting}
                >
                  {submitting ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              <form onSubmit={onSubmitSignup} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="auth-name">Full name</Label>
                    <Input
                      id="auth-name"
                      autoComplete="name"
                      value={signupForm.name}
                      onChange={(e) => {
                        setSignupForm((p) => ({ ...p, name: e.target.value }));
                        setSignupError(null);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="auth-email-signup">Email</Label>
                    <Input
                      id="auth-email-signup"
                      type="email"
                      autoComplete="email"
                      value={signupForm.email}
                      onChange={(e) => {
                        setSignupForm((p) => ({ ...p, email: e.target.value }));
                        setSignupError(null);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="auth-phone">Phone</Label>
                    <Input
                      id="auth-phone"
                      type="tel"
                      autoComplete="tel"
                      value={signupForm.phone}
                      onChange={(e) => {
                        setSignupForm((p) => ({ ...p, phone: e.target.value }));
                        setSignupError(null);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="auth-new-password">Password</Label>
                    <Input
                      id="auth-new-password"
                      type="password"
                      autoComplete="new-password"
                      value={signupForm.password}
                      onChange={(e) => {
                        setSignupForm((p) => ({ ...p, password: e.target.value }));
                        setSignupError(null);
                      }}
                    />
                  </div>
                </div>

                {signupError && (
                  <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {signupError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={submitting}
                >
                  {submitting ? "Creating account..." : "Create account"}
                </Button>

                <p className="text-[11px] text-muted-foreground text-center">
                  By continuing, you agree to our Terms and Privacy Policy.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

