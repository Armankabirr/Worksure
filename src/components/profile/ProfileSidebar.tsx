import { Button } from "@/components/ui/button";
import { 
  Settings, 
  LogOut, 
  Heart, 
  Briefcase, 
  Star 
} from "lucide-react";
import { ActiveMenuType } from "@/types/profile";

interface ProfileSidebarProps {
  activeMenu: ActiveMenuType;
  setActiveMenu: (menu: ActiveMenuType) => void;
  onLogout: () => void;
}

const ProfileSidebar = ({ activeMenu, setActiveMenu, onLogout }: ProfileSidebarProps) => {
  return (
    <aside className="md:col-span-1">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 border-b border-slate-200">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            Manage
          </h2>
        </div>

        <nav className="p-3 space-y-1">
          <button
            onClick={() => setActiveMenu("my-profile")}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
              activeMenu === "my-profile"
                ? "bg-primary text-white shadow-md hover:bg-primary/90"
                : "text-foreground hover:bg-slate-100 hover:shadow-sm"
            }`}
          >
            <Settings className="h-4 w-4" />
            My Profile
          </button>
        </nav>

        <div className="px-4 py-3 border-t border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wide mb-2 text-muted-foreground">My Orders</h3>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveMenu("my-hirings")}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                activeMenu === "my-hirings"
                  ? "bg-primary text-white shadow-md hover:bg-primary/90"
                  : "text-foreground hover:bg-slate-100 hover:shadow-sm"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              My Hirings
            </button>
            <button
              onClick={() => setActiveMenu("my-reviews")}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                activeMenu === "my-reviews"
                  ? "bg-primary text-white shadow-md hover:bg-primary/90"
                  : "text-foreground hover:bg-slate-100 hover:shadow-sm"
              }`}
            >
              <Star className="h-4 w-4" />
              My Reviews
            </button>
            <button
              onClick={() => setActiveMenu("saved-services")}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                activeMenu === "saved-services"
                  ? "bg-primary text-white shadow-md hover:bg-primary/90"
                  : "text-foreground hover:bg-slate-100 hover:shadow-sm"
              }`}
            >
              <Heart className="h-4 w-4" />
              Saved Services
            </button>
          </nav>
        </div>

        <div className="p-3 border-t border-slate-200">
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-xs font-medium transition-all duration-200"
          >
            <LogOut className="h-3 w-3 mr-1.5" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
