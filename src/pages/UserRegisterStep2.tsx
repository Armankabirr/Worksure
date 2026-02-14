import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function UserRegisterStep2() {
  const navigate = useNavigate();
  const { checkEmailVerified, resendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from localStorage
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
    setEmail(storedEmail);
  }, [navigate, toast]);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCheckVerification = async () => {
    setChecking(true);

    try {
      const { verified, error } = await checkEmailVerified();

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (verified) {
        toast({
          title: "Email verified!",
          description: "Proceeding to complete your profile",
        });
        // Navigate to step 3
        navigate("/user/register/step3");
      } else {
        toast({
          title: "Not verified yet",
          description: "Please check your email and click the verification link",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0) return;

    setResending(true);

    try {
      const { error } = await resendVerificationEmail();

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Email sent!",
        description: "Verification email has been resent. Please check your inbox.",
      });

      // Start 60 second countdown
      setCountdown(60);
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  const handleGoBack = () => {
    navigate("/user/register/step1");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <div className="flex-1 flex items-center justify-center mt-20 p-4 py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  We've sent a verification link to:
                </p>
                <p className="font-medium text-foreground">{email}</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2 w-full">
                <p className="text-sm font-medium">What to do next:</p>
                <ol className="text-sm text-muted-foreground space-y-1 text-left list-decimal list-inside">
                  <li>Check your email inbox</li>
                  <li>Click the verification link we sent</li>
                  <li>Return here and click "I've Verified My Email"</li>
                </ol>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleCheckVerification} 
                className="w-full" 
                disabled={checking}
                size="lg"
              >
                {checking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    I've Verified My Email
                  </>
                )}
              </Button>

              <Button
                onClick={handleResendEmail}
                variant="outline"
                className="w-full"
                disabled={resending || countdown > 0}
              >
                {resending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  <>
                    Resend available in {countdown}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              <Button
                onClick={handleGoBack}
                variant="ghost"
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Step 1
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              <p>Didn't receive the email? Check your spam folder or try resending.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
