import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, CheckCircle, Loader2, X, Briefcase, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DOCUMENT_TYPES = [
  { value: "nid", label: "National ID (NID)" },
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
  { value: "trade_license", label: "Trade License" },
  { value: "certificate", label: "Professional Certificate" },
];

interface UploadedDocument {
  type: string;
  url: string;
  preview: string;
}

export default function WorkerRegisterStep6() {
  const navigate = useNavigate();
  const { updateProfileWithDetails } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState("");
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  useEffect(() => {
    const step5Data = localStorage.getItem("worker_registration_step5");
    if (!step5Data) {
      toast({
        title: "Previous steps incomplete",
        description: "Please complete the previous steps first",
        variant: "destructive",
      });
      navigate("/worker/register/step5");
    }
  }, [navigate, toast]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    if (!documentType) {
      toast({
        title: "No document type selected",
        description: "Please select a document type first",
        variant: "destructive",
      });
      return;
    }

    if (documents.length >= 5) {
      toast({
        title: "Maximum documents reached",
        description: "You can upload up to 5 documents",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `worker-documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments((prev) => [
          ...prev,
          {
            type: documentType,
            url: data.publicUrl,
            preview: reader.result as string,
          },
        ]);
        setDocumentType("");
      };
      reader.readAsDataURL(file);

      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectDocument = () => {
    if (!documentType) {
      toast({
        title: "No document type selected",
        description: "Please select a document type first",
        variant: "destructive",
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (documents.length === 0) {
      toast({
        title: "No documents uploaded",
        description: "Please upload at least one verification document",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Retrieve all stored data from previous steps
      const step3DataStr = localStorage.getItem("worker_registration_step3");
      const step4DataStr = localStorage.getItem("worker_registration_step4");
      const step5DataStr = localStorage.getItem("worker_registration_step5");

      if (!step3DataStr || !step4DataStr || !step5DataStr) {
        throw new Error("Missing registration data");
      }

      const step3Data = JSON.parse(step3DataStr);
      const step4Data = JSON.parse(step4DataStr);
      const step5Data = JSON.parse(step5DataStr);

      // Combine all data including documents
      const completeWorkerData = {
        ...step3Data,
        ...step4Data,
        ...step5Data,
        documents: documents,
        role: "worker",
      };

      // Update user profile with all worker data
      const { error } = await updateProfileWithDetails(completeWorkerData);

      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Clear all registration data from localStorage
      localStorage.removeItem("worker_registration_email");
      localStorage.removeItem("worker_registration_type");
      localStorage.removeItem("worker_registration_step3");
      localStorage.removeItem("worker_registration_step4");
      localStorage.removeItem("worker_registration_step5");

      toast({
        title: "Registration complete!",
        description: "Welcome to Worksure! Your worker profile has been created.",
      });

      // Navigate to worker dashboard or home
      navigate("/worker/dashboard", { replace: true });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during registration",
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
            <CardTitle className="text-2xl font-bold text-center">Document Verification</CardTitle>
            <CardDescription className="text-center">
              Step 6 of 6: Upload verification documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document_type">Document Type *</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((doc) => (
                        <SelectItem key={doc.value} value={doc.value}>
                          {doc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSelectDocument}
                disabled={uploading || !documentType || documents.length >= 5}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
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

              <p className="text-xs text-muted-foreground text-center">
                Upload clear photos of your documents (max 10MB, up to 5 documents)
              </p>

              {documents.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Documents ({documents.length}/5)</Label>
                  <div className="grid gap-2">
                    {documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
                      >
                        <div className="w-12 h-12 bg-background rounded flex items-center justify-center overflow-hidden">
                          <img 
                            src={doc.preview} 
                            alt={`Document ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {DOCUMENT_TYPES.find((d) => d.value === doc.type)?.label}
                          </p>
                          <p className="text-xs text-muted-foreground">Uploaded</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDocument(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Important:</strong> Upload clear, legible photos of your verification documents. These will be reviewed before your account is activated.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={loading || uploading || documents.length === 0}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing Registration...
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
