import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
     Flag,
     Upload,
     X,
     Loader2,
     AlertCircle,
     FileText
} from "lucide-react";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// Category to Sub-Category Mapping
const COMPLAINT_CATEGORIES = {
     "Service Quality": [
          "Poor service quality",
          "Incomplete work",
          "Late arrival / No show",
          "Work not as described",
          "Property damage"
     ],
     "Payment & Billing": [
          "Overcharged",
          "Incorrect invoice",
          "Refund not received",
          "Extra charges added",
          "Payment deducted but failed"
     ],
     "Worker Conduct": [
          "Rude or unprofessional behavior",
          "Safety violation",
          "Harassment or abuse",
          "Fake credentials",
          "Policy violation"
     ],
     "Booking Issue": [
          "Worker cancelled last minute",
          "Booking not confirmed",
          "Wrong service assigned",
          "Rescheduled without notice",
          "Duplicate booking"
     ],
     "Platform / Technical": [
          "App crash",
          "Payment gateway error",
          "Incorrect booking status",
          "Notification not received",
          "Profile or data issue"
     ],
     "Fraud & Trust": [
          "Fake worker",
          "Identity mismatch",
          "Scam attempt",
          "Unauthorized payment",
          "Suspicious activity"
     ],
     "Policy & Compliance": [
          "Terms of service violation",
          "Privacy concern",
          "Data misuse",
          "Legal or compliance issue"
     ],
     "Other": [
          "General feedback",
          "Not listed above"
     ]
};

export interface ComplaintDialogProps {
     open: boolean;
     onOpenChange: (open: boolean) => void;
     orderId: string;
     orderDescription?: string;
     otherPartyId?: string; // Worker ID for clients, Client ID for workers
     otherPartyName?: string; // Worker name for clients, Client name for workers
     paymentId?: string; // Optional payment ID
     onSuccess?: () => void;
}

export const ComplaintDialog = ({
     open,
     onOpenChange,
     orderId,
     orderDescription,
     otherPartyId,
     otherPartyName,
     paymentId,
     onSuccess
}: ComplaintDialogProps) => {
     const axiosPublic = useAxiosPublic();
     const [category, setCategory] = useState("");
     const [subCategory, setSubCategory] = useState("");
     const [description, setDescription] = useState("");
     const [priority, setPriority] = useState("medium");
     const [attachments, setAttachments] = useState<File[]>([]);
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [errors, setErrors] = useState<{
          category?: string;
          subCategory?: string;
          description?: string;
     }>({});
     const [user, setLocalUser] = useState<any>(null);


     useEffect(() => {
          try {
               const storedUser = localStorage.getItem("user");
               if (storedUser) {
                    setLocalUser(JSON.parse(storedUser));
               } else {
                    setLocalUser(null);
               }
          } catch (error) {
               console.error("Error parsing user from localStorage:", error);
               setLocalUser(null);
          }
     }, []);

     // Validation
     const validateForm = () => {
          const newErrors: {
               category?: string;
               subCategory?: string;
               description?: string
          } = {};

          if (!category) {
               newErrors.category = "Please select a category";
          }
          if (!subCategory) {
               newErrors.subCategory = "Please select a sub-category";
          }
          if (!description.trim()) {
               newErrors.description = "Please describe the issue";
          } else if (description.trim().length < 50) {
               newErrors.description = "Description must be at least 50 characters";
          } else if (description.trim().length > 1000) {
               newErrors.description = "Description must not exceed 1000 characters";
          }

          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
     };

     // Handle category change
     const handleCategoryChange = (value: string) => {
          setCategory(value);
          setSubCategory(""); // Reset sub-category when category changes
          setErrors(prev => ({ ...prev, category: undefined }));
     };

     // Handle file upload
     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const files = Array.from(e.target.files || []);

          // Validate file count
          if (attachments.length + files.length > 3) {
               toast.error("Maximum 3 files allowed");
               return;
          }

          // Validate file size (5MB per file)
          const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
          if (invalidFiles.length > 0) {
               toast.error("Each file must be under 5MB");
               return;
          }

          setAttachments(prev => [...prev, ...files]);
     };

     // Remove attachment
     const removeAttachment = (index: number) => {
          setAttachments(prev => prev.filter((_, i) => i !== index));
     };

     const handleSubmit = async () => {
          if (!validateForm()) {
               return;
          }

          if (!user) {
               toast.error("Please log in to submit a complaint");
               return;
          }

          setIsSubmitting(true);
          try {
               // If there are attachments, use FormData, otherwise use JSON
               if (attachments.length > 0) {
                    const formData = new FormData();

                    // Required fields matching database schema
                    formData.append("raised_by_user_id", user.id);
                    formData.append("raised_by_role", user.role);
                    formData.append("booking_id", orderId);
                    formData.append("category", category);
                    formData.append("description", description.trim());

                    // Optional fields
                    if (otherPartyId) {
                         formData.append("against_user_id", otherPartyId);
                    }

                    if (subCategory) {
                         formData.append("sub_category", subCategory);
                    }

                    if (paymentId) {
                         formData.append("payment_id", paymentId);
                    }

                    formData.append("priority", priority);

                    // Add attachments
                    attachments.forEach((file) => {
                         formData.append("attachments", file);
                    });

                    // Debug: Log FormData contents
                    console.log("Sending FormData with attachments:");
                    for (let [key, value] of formData.entries()) {
                         console.log(key, value);
                    }

                    const response = await axiosPublic.post("/userRoutes/createComplaint", formData);
                    if (response.status === 201) {
                         toast.success("Complaint submitted successfully!");
                         onSuccess?.();
                         handleClose();
                    }
               } else {
                    // Send as JSON when no attachments
                    const complaintData = {
                         raised_by_user_id: user.id,
                         raised_by_role: user.role,
                         booking_id: orderId,
                         category: category,
                         description: description.trim(),
                         priority: priority,
                         ...(otherPartyId && { against_user_id: otherPartyId }),
                         ...(subCategory && { sub_category: subCategory }),
                         ...(paymentId && { payment_id: paymentId }),
                    };

                    console.log("Sending JSON complaint data:", complaintData);

                    const response = await axiosPublic.post("/userRoutes/createComplaint", complaintData);
                    if (response.status === 201) {
                         toast.success("Complaint submitted successfully!");
                         onSuccess?.();
                         handleClose();
                    }
               }
          } catch (error: any) {
               console.error("Error submitting complaint:", error);
               toast.error(error.response?.data?.message || "Failed to submit complaint. Please try again.");
          } finally {
               setIsSubmitting(false);
          }
     };

     const handleClose = () => {
          setCategory("");
          setSubCategory("");
          setDescription("");
          setPriority("medium");
          setAttachments([]);
          setErrors({});
          onOpenChange(false);
     };

     // Check if form is valid
     const isFormValid = category && subCategory && description.trim().length >= 50 && description.trim().length <= 1000;

     return (
          <Dialog open={open} onOpenChange={handleClose}>
               <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                         <DialogTitle className="flex items-center gap-2 text-lg">
                              <Flag className="h-5 w-5 text-gray-700" />
                              Raise a Complaint
                         </DialogTitle>
                         <p className="text-sm text-muted-foreground mt-1">
                              Tell us what went wrong. Our team will review your issue.
                         </p>
                    </DialogHeader>

                    <div className="space-y-5 py-4">
                         {/* Related Booking Info (Read-Only) */}
                         <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                              <h4 className="text-xs font-semibold text-slate-600 mb-3">RELATED BOOKING</h4>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                   <div>
                                        <p className="text-xs text-slate-500">Booking ID</p>
                                        <p className="font-medium text-slate-900">{orderId.slice(0, 13)}...</p>
                                   </div>
                                   {orderDescription && (
                                        <div>
                                             <p className="text-xs text-slate-500">Service</p>
                                             <p className="font-medium text-slate-900">{orderDescription}</p>
                                        </div>
                                   )}
                                   {otherPartyName && (
                                        <div className="col-span-2">
                                             <p className="text-xs text-slate-500">Other Party</p>
                                             <p className="font-medium text-slate-900">{otherPartyName}</p>
                                        </div>
                                   )}
                              </div>
                         </div>

                         {/* Category Selection */}
                         <div className="space-y-2">
                              <Label htmlFor="category" className="text-sm font-medium text-slate-700">
                                   Complaint Category <span className="text-red-500">*</span>
                              </Label>
                              <Select value={category} onValueChange={handleCategoryChange}>
                                   <SelectTrigger
                                        id="category"
                                        className={`w-full ${errors.category ? 'border-red-500' : ''}`}
                                   >
                                        <SelectValue placeholder="Select a category" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        {Object.keys(COMPLAINT_CATEGORIES).map((cat) => (
                                             <SelectItem key={cat} value={cat}>
                                                  {cat}
                                             </SelectItem>
                                        ))}
                                   </SelectContent>
                              </Select>
                              {errors.category && (
                                   <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.category}
                                   </p>
                              )}
                         </div>

                         {/* Sub-Category Selection */}
                         <div className="space-y-2">
                              <Label htmlFor="subCategory" className="text-sm font-medium text-slate-700">
                                   Complaint Sub-Category <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                   value={subCategory}
                                   onValueChange={(value) => {
                                        setSubCategory(value);
                                        setErrors(prev => ({ ...prev, subCategory: undefined }));
                                   }}
                                   disabled={!category}
                              >
                                   <SelectTrigger
                                        id="subCategory"
                                        className={`w-full ${errors.subCategory ? 'border-red-500' : ''}`}
                                   >
                                        <SelectValue placeholder={category ? "Select a sub-category" : "First select a category"} />
                                   </SelectTrigger>
                                   <SelectContent>
                                        {category && COMPLAINT_CATEGORIES[category as keyof typeof COMPLAINT_CATEGORIES]?.map((subCat) => (
                                             <SelectItem key={subCat} value={subCat}>
                                                  {subCat}
                                             </SelectItem>
                                        ))}
                                   </SelectContent>
                              </Select>
                              {errors.subCategory && (
                                   <p className="text-xs text-red-500 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.subCategory}
                                   </p>
                              )}
                         </div>

                         {/* Priority */}
                         <div className="space-y-2">
                              <Label htmlFor="priority" className="text-sm font-medium text-slate-700">
                                   Priority
                              </Label>
                              <Select value={priority} onValueChange={setPriority}>
                                   <SelectTrigger id="priority" className="w-full">
                                        <SelectValue placeholder="Select priority" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                   </SelectContent>
                              </Select>
                              <p className="text-xs text-slate-500">
                                   How urgent is this complaint?
                              </p>
                         </div>

                         {/* Description */}
                         <div className="space-y-2">
                              <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                                   Complaint Description <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                   id="description"
                                   placeholder="Please describe the issue in detail…"
                                   value={description}
                                   onChange={(e) => {
                                        setDescription(e.target.value);
                                        setErrors(prev => ({ ...prev, description: undefined }));
                                   }}
                                   className={`min-h-32 resize-none ${errors.description ? 'border-red-500' : ''}`}
                                   maxLength={1000}
                              />
                              <div className="flex justify-between items-center">
                                   <div>
                                        {errors.description && (
                                             <p className="text-xs text-red-500 flex items-center gap-1">
                                                  <AlertCircle className="h-3 w-3" />
                                                  {errors.description}
                                             </p>
                                        )}
                                   </div>
                                   <p className={`text-xs ${description.length < 50 ? 'text-red-500' :
                                        description.length > 1000 ? 'text-red-500' :
                                             'text-slate-500'
                                        }`}>
                                        {description.length}/1000 characters (min: 50)
                                   </p>
                              </div>
                         </div>

                         {/* Attachments */}
                         <div className="space-y-2">
                              <Label htmlFor="attachments" className="text-sm font-medium text-slate-700">
                                   Attachments (Optional)
                              </Label>
                              <div className="space-y-3">
                                   {/* File Input */}
                                   {attachments.length < 3 && (
                                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-slate-400 transition-colors">
                                             <label
                                                  htmlFor="attachments"
                                                  className="flex flex-col items-center justify-center cursor-pointer"
                                             >
                                                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                                  <span className="text-sm text-slate-600 font-medium">
                                                       Click to upload
                                                  </span>
                                                  <span className="text-xs text-slate-500 mt-1">
                                                       Images or PDF (Max 3 files, 5MB each)
                                                  </span>
                                             </label>
                                             <input
                                                  id="attachments"
                                                  type="file"
                                                  accept="image/*,.pdf"
                                                  multiple
                                                  onChange={handleFileChange}
                                                  className="hidden"
                                                  disabled={isSubmitting}
                                             />
                                        </div>
                                   )}

                                   {/* File List */}
                                   {attachments.length > 0 && (
                                        <div className="space-y-2">
                                             {attachments.map((file, index) => (
                                                  <div
                                                       key={index}
                                                       className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-200"
                                                  >
                                                       <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <FileText className="h-4 w-4 text-slate-500 flex-shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                 <p className="text-sm font-medium text-slate-900 truncate">
                                                                      {file.name}
                                                                 </p>
                                                                 <p className="text-xs text-slate-500">
                                                                      {(file.size / 1024).toFixed(1)} KB
                                                                 </p>
                                                            </div>
                                                       </div>
                                                       <button
                                                            type="button"
                                                            onClick={() => removeAttachment(index)}
                                                            className="ml-2 p-1 hover:bg-slate-200 rounded transition-colors"
                                                            disabled={isSubmitting}
                                                       >
                                                            <X className="h-4 w-4 text-slate-600" />
                                                       </button>
                                                  </div>
                                             ))}
                                        </div>
                                   )}
                              </div>
                              <p className="text-xs text-slate-500">
                                   Upload photos or documents if available
                              </p>
                         </div>

                         {/* Note */}
                         <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <p className="text-xs text-blue-800">
                                   <strong>Note:</strong> Your complaint will be reviewed by our support team within 24-48 hours.
                              </p>
                         </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                         <Button
                              variant="outline"
                              className="flex-1"
                              onClick={handleClose}
                              disabled={isSubmitting}
                         >
                              Cancel
                         </Button>
                         <Button
                              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                              onClick={handleSubmit}
                              disabled={!isFormValid || isSubmitting}
                         >
                              {isSubmitting ? (
                                   <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Submitting...
                                   </>
                              ) : (
                                   "Submit Complaint"
                              )}
                         </Button>
                    </div>
               </DialogContent>
          </Dialog>
     );
};

export default ComplaintDialog;
