import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Save, User, Star } from "lucide-react";
import { ProfileFormData } from "@/types/workerDashboard";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileForm: ProfileFormData;
  setProfileForm: (form: ProfileFormData) => void;
  userEmail: string;
  onSave: () => void;
}

export const EditProfileDialog = ({
  open,
  onOpenChange,
  profileForm,
  setProfileForm,
  userEmail,
  onSave,
}: EditProfileDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-500 flex items-center">
            <Edit className="h-6 w-6 mr-2" />
            Update Profile Information
          </DialogTitle>
          <DialogDescription>
            Update your personal and professional details. Email cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center border-b pb-2">
              <User className="h-5 w-5 mr-2 text-orange-500" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Read-only)</Label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nid">NID Number * (10, 13, or 17 digits)</Label>
                <Input
                  id="nid"
                  value={profileForm.nidNumber}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, nidNumber: e.target.value })
                  }
                  placeholder="Enter valid NID number"
                  maxLength={17}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={profileForm.dateOfBirth}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, dateOfBirth: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={profileForm.address}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, address: e.target.value })
                }
                placeholder="Enter your full address"
                rows={2}
              />
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center border-b pb-2">
              <Star className="h-5 w-5 mr-2 text-orange-500" />
              Professional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="speciality">Work Speciality *</Label>
                <Select
                  value={profileForm.speciality}
                  onValueChange={(value) =>
                    setProfileForm({ ...profileForm, speciality: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select speciality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electrician">Electrician</SelectItem>
                    <SelectItem value="Plumber">Plumber</SelectItem>
                    <SelectItem value="Carpenter">Carpenter</SelectItem>
                    <SelectItem value="AC Technician">AC Technician</SelectItem>
                    <SelectItem value="Painter">Painter</SelectItem>
                    <SelectItem value="Mechanic">Mechanic</SelectItem>
                    <SelectItem value="Cleaner">Cleaner</SelectItem>
                    <SelectItem value="Gardener">Gardener</SelectItem>
                    <SelectItem value="Security Guard">Security Guard</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Work Experience</Label>
                <Select
                  value={profileForm.experience}
                  onValueChange={(value) =>
                    setProfileForm({ ...profileForm, experience: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
                    <SelectItem value="1-2 years">1-2 years</SelectItem>
                    <SelectItem value="3-5 years">3-5 years</SelectItem>
                    <SelectItem value="6-10 years">6-10 years</SelectItem>
                    <SelectItem value="More than 10 years">More than 10 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certification">Certification</Label>
              <Select
                value={profileForm.certification}
                onValueChange={(value) =>
                  setProfileForm({ ...profileForm, certification: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select certification status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Certified">Certified</SelectItem>
                  <SelectItem value="Trade License">Trade License</SelectItem>
                  <SelectItem value="Government Approved">Government Approved</SelectItem>
                  <SelectItem value="Self-trained">Self-trained</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceAreas">Service Areas</Label>
              <Textarea
                id="serviceAreas"
                value={profileForm.serviceAreas}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, serviceAreas: e.target.value })
                }
                placeholder="e.g., Dhaka, Chittagong, Sylhet"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (৳)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={profileForm.hourlyRate}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, hourlyRate: e.target.value })
                  }
                  placeholder="500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={profileForm.availability}
                  onValueChange={(value) =>
                    setProfileForm({ ...profileForm, availability: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time (Mon-Sat)">Full-time (Mon-Sat)</SelectItem>
                    <SelectItem value="Part-time (Weekdays)">Part-time (Weekdays)</SelectItem>
                    <SelectItem value="Part-time (Weekends)">Part-time (Weekends)</SelectItem>
                    <SelectItem value="Flexible Hours">Flexible Hours</SelectItem>
                    <SelectItem value="Evening Only">Evening Only</SelectItem>
                    <SelectItem value="Morning Only">Morning Only</SelectItem>
                    <SelectItem value="On-Demand">On-Demand</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
