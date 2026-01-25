import { Link } from "react-router-dom";
import {
  Home,
  ClipboardList,
  History,
  User,
  Star,
  Gift,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import worksureLogo from "@/assets/Logo.png";

interface WorkerSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarMinimized: boolean;
  setSidebarMinimized: (minimized: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const WorkerSidebar = ({
  activeTab,
  setActiveTab,
  sidebarMinimized,
  setSidebarMinimized,
  mobileMenuOpen,
  setMobileMenuOpen,
}: WorkerSidebarProps) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: ClipboardList },
    { id: "service-request", label: "Service Request", icon: ClipboardList },
    { id: "service-history", label: "Service History", icon: History },
    { id: "account", label: "Account", icon: User },
    { id: "reviews", label: "Reviews", icon: Star },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-40 bg-orange-500 text-white flex flex-col transition-all duration-300 ${
        sidebarMinimized ? "w-20" : "w-64"
      } ${mobileMenuOpen ? "w-64" : "-translate-x-full md:translate-x-0"}`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className={`flex items-center ${sidebarMinimized ? "hidden" : ""}`}>
          <img
            src={worksureLogo}
            alt="WorkSure"
            className="w-12 h-12 flex-shrink-0 object-contain"
          />
          <h1 className="ml-3 text-xl font-bold">WorkSure</h1>
        </div>
        {!sidebarMinimized && (
          <button
            onClick={() => setSidebarMinimized(true)}
            className="hidden md:block p-1 hover:bg-orange-600 rounded transition-colors"
            title="Minimize sidebar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      {sidebarMinimized && (
        <button
          onClick={() => setSidebarMinimized(false)}
          className="hidden md:flex justify-center p-2 hover:bg-orange-600 rounded transition-colors mx-2 mb-2"
          title="Expand sidebar"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id
                ? "bg-orange-700 text-white"
                : "text-white hover:bg-orange-600"
            }`}
            title={sidebarMinimized ? item.label : ""}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!sidebarMinimized && <span className="ml-3">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Home & Features Buttons */}
      <div className="p-4 space-y-2">
        <Link
          to="/"
          className="w-full flex items-center px-4 py-3 rounded-lg transition-colors text-white hover:bg-orange-600"
          title={sidebarMinimized ? "Home" : ""}
        >
          <Home className="h-5 w-5 flex-shrink-0" />
          {!sidebarMinimized && <span className="ml-3">Home</span>}
        </Link>

        <button
          onClick={() => handleNavClick("features")}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
            activeTab === "features"
              ? "bg-orange-700 text-white"
              : "text-white hover:bg-orange-600"
          }`}
          title={sidebarMinimized ? "Features" : ""}
        >
          <div className="flex items-center">
            <Gift className="h-5 w-5 flex-shrink-0" />
            {!sidebarMinimized && <span className="ml-3">Features</span>}
          </div>
          {!sidebarMinimized && (
            <span className="px-2 py-0.5 bg-orange-700 text-xs rounded">NEW</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default WorkerSidebar;
