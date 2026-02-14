import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Layers, Tag, DollarSign, Clock, Plus, X, Loader2, ArrowRight, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CATEGORIES = [
  { value: "electrician", label: "Electrician" },
  { value: "ac-doctor", label: "AC Doctor" },
  { value: "cleaner", label: "Cleaning Service" },
  { value: "pet-care", label: "Pet Care" },
  { value: "catering", label: "Catering" },
  { value: "babysitter", label: "Babysitter" },
];

const SUB_CATEGORIES: Record<string, string[]> = {
  electrician: ["Wiring", "Repair", "Installation", "Maintenance", "Emergency Service"],
  "ac-doctor": ["AC Repair", "AC Installation", "AC Servicing", "AC Maintenance"],
  cleaner: ["House Cleaning", "Deep Cleaning", "Office Cleaning", "Move-in/Move-out"],
  "pet-care": ["Dog Walking", "Pet Sitting", "Pet Grooming", "Pet Training"],
  catering: ["Party Catering", "Corporate Events", "Wedding Catering", "Home Catering"],
  babysitter: ["Infant Care", "Toddler Care", "After School Care", "Weekend Care"],
};

const PRICE_UNITS = [
  { value: "hour", label: "Per Hour" },
  { value: "day", label: "Per Day" },
  { value: "job", label: "Per Job" },
  { value: "square_foot", label: "Per Square Foot" },
];

export default function WorkerRegisterStep5() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    sub_category: "",
    base_price: "",
    price_unit: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([]);

  useEffect(() => {
    const step4Data = localStorage.getItem("worker_registration_step4");
    if (!step4Data) {
      toast({
        title: "Previous steps incomplete",
        description: "Please complete the previous steps first",
        variant: "destructive",
      });
      navigate("/worker/register/step4");
    }
  }, [navigate, toast]);

  useEffect(() => {
    if (formData.category) {
      setAvailableSubCategories(SUB_CATEGORIES[formData.category] || []);
      setFormData((prev) => ({ ...prev, sub_category: "" }));
    }
  }, [formData.category]);

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sub_category: value }));
  };

  const handlePriceUnitChange = (value: string) => {
    setFormData((prev) => ({ ...prev, price_unit: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (!trimmedSkill) {
      toast({
        title: "Empty skill",
        description: "Please enter a skill name",
        variant: "destructive",
      });
      return;
    }

    if (skills.includes(trimmedSkill)) {
      toast({
        title: "Duplicate skill",
        description: "This skill has already been added",
        variant: "destructive",
      });
      return;
    }

    if (skills.length >= 10) {
      toast({
        title: "Maximum skills reached",
        description: "You can add up to 10 skills",
        variant: "destructive",
      });
      return;
    }

    setSkills((prev) => [...prev, trimmedSkill]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const validateForm = () => {
    if (!formData.category) {
      toast({
        title: "Missing category",
        description: "Please select a service category",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.sub_category) {
      toast({
        title: "Missing sub-category",
        description: "Please select a sub-category",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.base_price) {
      toast({
        title: "Missing price",
        description: "Please enter your base price",
        variant: "destructive",
      });
      return false;
    }

    const price = parseFloat(formData.base_price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.price_unit) {
      toast({
        title: "Missing price unit",
        description: "Please select a pricing unit",
        variant: "destructive",
      });
      return false;
    }

    if (skills.length === 0) {
      toast({
        title: "No skills added",
        description: "Please add at least one skill",
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
      localStorage.setItem("worker_registration_step5", JSON.stringify({
        category: formData.category,
        sub_category: formData.sub_category,
        base_price: parseFloat(formData.base_price),
        price_unit: formData.price_unit,
        skills: skills,
      }));

      toast({
        title: "Progress saved",
        description: "Moving to document verification",
      });

      navigate("/worker/register/step6");
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
            <CardTitle className="text-2xl font-bold text-center">Service Details</CardTitle>
            <CardDescription className="text-center">
              Step 5 of 6: Set up your service offerings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Service Category *</Label>
                <div className="relative">
                  <Layers className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub_category">Sub-Category *</Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                  <Select 
                    value={formData.sub_category} 
                    onValueChange={handleSubCategoryChange}
                    disabled={!formData.category}
                  >
                    <SelectTrigger className="pl-9">
                      <SelectValue placeholder="Select a sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubCategories.map((subCat) => (
                        <SelectItem key={subCat} value={subCat}>
                          {subCat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base_price">Base Price *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="base_price"
                      name="base_price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.base_price}
                      onChange={handleInputChange}
                      className="pl-9"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_unit">Price Unit *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                    <Select value={formData.price_unit} onValueChange={handlePriceUnitChange}>
                      <SelectTrigger className="pl-9">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRICE_UNITS.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills *</Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a skill (press Enter)"
                    disabled={loading || skills.length >= 10}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSkill}
                    disabled={loading || skills.length >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {skills.length} / 10 skills added (minimum 1)
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
