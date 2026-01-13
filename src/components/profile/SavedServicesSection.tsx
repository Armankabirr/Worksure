import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

const SavedServicesSection = () => {
  return (
    <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-8 text-center">
      <Heart className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
      <h2 className="text-lg font-bold text-foreground mb-1">Saved Services</h2>
      <p className="text-sm text-muted-foreground">Your saved services will appear here.</p>
    </Card>
  );
};

export default SavedServicesSection;
