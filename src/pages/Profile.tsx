import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    navigate("/user/login");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-10">
      <Card className="w-full max-w-md p-6 shadow-lg border border-border bg-card">
        <h1 className="text-2xl font-semibold mb-4 text-foreground text-center">
          User Profile
        </h1>
        <div className="space-y-2 text-sm text-foreground">
          <p>
            <span className="font-medium">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {user.phone}
          </p>
          <p>
            <span className="font-medium">Role:</span> {user.role}
          </p>
        </div>

        <Button
          onClick={handleLogout}
          className="w-full mt-6 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          Logout
        </Button>
      </Card>
    </div>
  );
};

export default Profile;


