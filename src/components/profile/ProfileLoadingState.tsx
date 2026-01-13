import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ProfileLoadingStateProps {
  message?: string;
}

const ProfileLoadingState = ({ message = "Loading profile..." }: ProfileLoadingStateProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 pt-24">
        <Card className="w-full max-w-md p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
          <p className="text-muted-foreground">{message}</p>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileLoadingState;
