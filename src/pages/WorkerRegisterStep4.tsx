import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileText, Award, Loader2, ArrowRight, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function WorkerRegisterStep4() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    years_of_experience: "",
  });

  useEffect(() => {
    const step3Data = localStorage.getItem("worker_registration_step3");
    if (!step3Data) {
      toast({
        title: "Previous steps incomplete",
        description: "Please complete the previous steps first",
        variant: "destructive",
      });
      navigate("/worker/register/step3");
    }
  }, [navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.display_name.trim()) {
      toast({
        title: "Missing display name",
        description: "Please enter your professional display name",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.bio.trim()) {
      toast({
        title: "Missing bio",
        description: "Please provide a brief description about yourself",
        variant: "destructive",
      });
      return false;
    }

    if (formData.bio.trim().length < 50) {
      toast({
        title: "Bio too short",
        description: "Please provide at least 50 characters in your bio",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.years_of_experience) {
      toast({
        title: "Missing experience",
        description: "Please enter your years of experience",
        variant: "destructive",
      });
      return false;
    }

    const experience = parseInt(formData.years_of_experience);
    if (isNaN(experience) || experience < 0 || experience > 50) {
      toast({
        title: "Invalid experience",
        description: "Please enter a valid number between 0 and 50",
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
      localStorage.setItem("worker_registration_step4", JSON.stringify({
        display_name: formData.display_name.trim(),
        bio: formData.bio.trim(),
        years_of_experience: parseInt(formData.years_of_experience),
      }));

      toast({
        title: "Progress saved",
        description: "Moving to service details",
      });

      navigate("/worker/register/step5");
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Professional Profile</CardTitle>
            <CardDescription className="text-center">
              Step 4 of 6: Share your professional experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="display_name"
                    name="display_name"
                    type="text"
                    placeholder="How you want to be known professionally"
                    value={formData.display_name}
                    onChange={handleInputChange}
                    className="pl-9"
                    disabled={loading}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This will be displayed to clients
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio *</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell clients about your expertise, experience, and what makes you unique..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="pl-9 min-h-[120px] resize-none"
                    disabled={loading}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.bio.length} / 500 characters (minimum 50)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="years_of_experience">Years of Experience *</Label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="years_of_experience"
                    name="years_of_experience"
                    type="number"
                    min="0"
                    max="50"
                    placeholder="0"
                    value={formData.years_of_experience}
                    onChange={handleInputChange}
                    className="pl-9"
                    disabled={loading}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  How many years have you been providing this service?
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Tip:</strong> A well-written bio and accurate experience help clients trust and choose you. Highlight your unique skills and achievements!
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
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
