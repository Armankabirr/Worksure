import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, IdCard, Calendar, Camera, Loader2, ArrowRight, Briefcase, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function WorkerRegisterStep3() {
  const navigate = useNavigate();
  const { checkEmailVerified } = useAuth();
  const { toast } = useToast();
  const axiosPublic = useAxiosPublic();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    nid: "",
    date_of_birth: "",
    gender: "",
  });
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  useEffect(() => {
    const checkPreviousSteps = async () => {
      const storedEmail = localStorage.getItem("worker_registration_email");
      if (!storedEmail) {
        toast({
          title: "Session expired",
          description: "Please start the registration process again",
          variant: "destructive",
        });
        navigate("/worker/register/step1");
        return;
      }

      const { verified } = await checkEmailVerified();
      if (!verified) {
        toast({
          title: "Email not verified",
          description: "Please verify your email first",
          variant: "destructive",
        });
        navigate("/worker/register/step2");
      }
    };

    checkPreviousSteps();
  }, [navigate, toast, checkEmailVerified]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setProfilePictureFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadProfilePicture = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      
      // Convert file to base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Remove data URL prefix (data:image/...;base64,)
          const base64Data = base64String.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Create FormData for ImgBB API
      const formData = new FormData();
      formData.append('image', base64Image);

      // Upload to ImgBB
      const imgbbApiKey = import.meta.env.VITE_imgbb_api_key;
      if (!imgbbApiKey) {
        throw new Error('ImgBB API key is not configured');
      }

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload to ImgBB');
      }

      const data = await response.json();
      
      if (data.success && data.data.url) {
        return data.data.url;
      } else {
        throw new Error('Invalid response from ImgBB');
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. You can add it later.",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Missing name",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Missing phone",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return false;
    }

    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid phone",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.nid.trim()) {
      toast({
        title: "Missing NID",
        description: "Please enter your National ID number",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.date_of_birth) {
      toast({
        title: "Missing date of birth",
        description: "Please select your date of birth",
        variant: "destructive",
      });
      return false;
    }

    const birthDate = new Date(formData.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      toast({
        title: "Age restriction",
        description: "You must be at least 18 years old to register as a worker",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.gender) {
      toast({
        title: "Missing gender",
        description: "Please select your gender",
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
      const storedEmail = localStorage.getItem("worker_registration_email");
      if (!storedEmail) {
        toast({
          title: "Session expired",
          description: "Please start the registration process again",
          variant: "destructive",
        });
        navigate("/worker/register/step1");
        return;
      }

      let profilePictureUrl = "";
      if (profilePictureFile) {
        const uploadedUrl = await uploadProfilePicture(profilePictureFile);
        if (uploadedUrl) {
          profilePictureUrl = uploadedUrl;
        }
      }

      // Create user in database via API
      const userData = {
        email: storedEmail,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        nid: formData.nid.trim(),
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        profile_picture: profilePictureUrl
      };

      const response = await axiosPublic.post("/userRoutes/createUser", userData);

      if (response.status === 201) {
        // Store data in localStorage for next steps
        localStorage.setItem("worker_registration_step3", JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          nid: formData.nid.trim(),
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          profile_picture: profilePictureUrl,
        }));

        toast({
          title: "Profile created!",
          description: "Moving to professional information",
        });

        navigate("/worker/register/step4");
      } else {
        throw new Error(response.data.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Registration error:", error);
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
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profilePicture} alt="Profile" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-4 w-4" />
                      {profilePicture ? "Change Photo" : "Add Photo"}
                    </>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground">
                  Optional, max 5MB
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-9"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-9"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nid">National ID (NID) *</Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nid"
                    name="nid"
                    type="text"
                    placeholder="Enter NID number"
                    value={formData.nid}
                    onChange={handleInputChange}
                    className="pl-9"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="pl-9"
                    disabled={loading}
                    max={new Date().toUTCString().split("T")[0]}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  You must be at least 18 years old
                </p>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select gender" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading || uploading}>
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
