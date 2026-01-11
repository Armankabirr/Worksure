import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { Sparkles, ShieldCheck, Clock, PlugZap, ShoppingCart } from "lucide-react";
import { useMemo, useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const repairServices = [
  {
    title: "Outlet & Switch Fixes",
    description: "Repair dead outlets, flickering lights, loose switches, and sparking points.",
    price: "From $58",
    duration: "Typically 45-90 mins",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    perks: ["Parts guidance provided", "Code-compliant repairs", "Cleanup before we leave"],
    category: "electrical-repairs",
  },
  {
    title: "Breaker Trips & Diagnostics",
    description: "Find and fix overloads, short circuits, nuisance tripping, and buzzing breakers.",
    price: "From $79",
    duration: "Typically 60-120 mins",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    perks: ["Thermal and continuity checks", "Load balancing tips", "Safety-first process"],
    category: "electrical-repairs",
  },
  {
    title: "Fixture & Fan Repairs",
    description: "Repair or replace ceiling fans, pendants, chandeliers, and damp-rated fixtures.",
    price: "From $69",
    duration: "Typically 45-120 mins",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=400&fit=crop",
    perks: ["Secure mounting", "Balanced fan alignment", "Post-install safety test"],
    category: "lighting-ambience",
  },
  {
    title: "Wiring Faults & Shorts",
    description: "Trace and repair burnt wires, loose neutrals, and hidden junction issues.",
    price: "From $109",
    duration: "Typically 90-180 mins",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop",
    perks: ["Circuit tracing", "Replace degraded cabling", "Detailed status report"],
    category: "wiring-panel",
  },
  {
    title: "Printer Service",
    description: "Power issues, cable faults, and safe connection checks for office printers.",
    price: "Starts from ৳966.63",
    duration: "Typically 60-120 mins",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=400&fit=crop",
    perks: ["Power & grounding checks", "Cable/port inspection", "Post-fix test print"],
    category: "smart-surge",
    startFrom: "Starts from ৳966.63",
    details: [
      {
        title: "Printer Service",
        start: "Starts from ৳966.63",
        items: [
          { name: "Cutting change", price: "৳ 966.63" },
          { name: "ink change", price: "৳ 1280.13" },
          { name: "Roller change", price: "৳ 966.63" },
          { name: "Motherboard repair", price: "৳ 1175.63" },
          { name: "Printer software & driver setup", price: "৳ 1175.63" },
        ],
      },
      {
        title: "Printer Check Up",
        start: "Starts from ৳496.38",
        items: [{ name: "Printer Check Up", price: "৳ 496.38" }],
      },
    ],
  },
  {
    title: "Desktop Services",
    description: "Power delivery fixes, surge-safe setups, and cable management for desktops.",
    price: "From $99",
    duration: "Typically 60-150 mins",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
    perks: ["PSU and outlet checks", "Surge/UPS guidance", "Clean cabling"],
    category: "smart-surge",
    startFrom: "Starts from ৳418",
    details: [
      {
        title: "Desktop Software Services",
        start: "Starts from ৳418",
        items: [
          { name: "Operating System & Software Installation", price: "৳ 836" },
          { name: "Data Recovery", price: "৳ 1593.63" },
          { name: "Driver Installation & Application Installation", price: "৳ 836" },
        ],
      },
      {
        title: "Desktop Hardware Related Services",
        start: "Starts from ৳418",
        items: [
          { name: "Motherboard Repair", price: "৳ 1071.13" },
          { name: "HDD or SSD Installation or Replacement", price: "৳ 522.5" },
          { name: "Problem Identification & Full Cleaning", price: "৳ 757.63" },
          { name: "Power Supply Unit Installation or Replacement", price: "৳ 574.75" },
        ],
      },
    ],
  },
  {
    title: "Laptop/Notebook Services",
    description: "Adapter, socket, and grounding checks to keep laptops charging safely.",
    price: "Starts from ৳418",
    duration: "Typically 45-120 mins",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop",
    perks: ["Adapter and port test", "Outlet safety check", "Cable tidy-up"],
    category: "smart-surge",
    startFrom: "Starts from ৳418",
    details: [
      {
        title: "Laptop/Notebook Software Solutions",
        start: "Starts from ৳418",
        items: [
          { name: "Windows / Operating System & Application / Software Installation", price: "৳ 836" },
          { name: "Driver Installation & Application Installation", price: "৳ 836" },
          { name: "BIOS Configuring Updating", price: "৳ 1123.38" },
          { name: "Windows Installation", price: "৳ 574.75" },
          { name: "Software or Application Installation", price: "৳ 574.75" },
          { name: "Data Recovery", price: "৳ 1593.63" },
          { name: "Diagnosis", price: "৳ 418" },
        ],
      },
      {
        title: "Laptop/Notebook Hardware Solutions",
        start: "Starts from ৳418",
        items: [
          { name: "Motherboard Installation", price: "৳ 1071.13" },
          { name: "Motherboard Repair", price: "৳ 1071.13" },
          { name: "HDD or SSD Installation or Replacement", price: "৳ 522.5" },
          { name: "Keyboard Replacement", price: "৳ 653.13" },
          { name: "Display Replacement", price: "৳ 966.63" },
          { name: "Problem Identification & Full Cleaning", price: "৳ 757.63" },
          { name: "Diagnosis", price: "৳ 418" },
        ],
      },
      {
        title: "Laptop/Notebook Software Checkup",
        start: "Starts from ৳653.13",
        items: [
          { name: "Laptop/Notebook Software Checkup", price: "৳ 653.13" },
        ],
      },
      {
        title: "Laptop/Notebook Hardware Checkup",
        start: "Starts from ৳653.13",
        items: [
          { name: "Laptop/Notebook Hardware Checkup", price: "৳ 653.13" },
        ],
      },
    ],
  },
  {
    title: "CCTV Camera Service",
    description: "Diagnose power drops, replace adapters, and tidy low-voltage runs for CCTV.",
    price: "From $119",
    duration: "Typically 90-180 mins",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    perks: ["Adapter/PoE checks", "Cable continuity test", "Secure mounting"],
    category: "safety-compliance",
  },
  {
    title: "Switch & Socket Repair/Replacement",
    description: "Fix loose, burnt, or non-responsive switches and sockets with safe replacements.",
    price: "From $59",
    duration: "Typically 45-90 mins",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    perks: ["Continuity test", "Tight/replace terminals", "Safety check"],
    category: "electrical-repairs",
  },
  {
    title: "Light Fitting Install/Repair",
    description: "Install or fix ceiling, wall, and decorative lights with neat finish.",
    price: "From $69",
    duration: "Typically 45-120 mins",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=400&fit=crop",
    perks: ["Secure mounting", "Cable dressing", "Functional test"],
    category: "lighting-ambience",
  },
  {
    title: "Fan Repair & Installation (Ceiling/Exhaust)",
    description: "Balance, rewire, or install ceiling and exhaust fans for smooth, quiet runs.",
    price: "From $79",
    duration: "Typically 60-150 mins",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=400&fit=crop",
    perks: ["Secure brackets", "Lubrication & balancing", "Speed test"],
    category: "lighting-ambience",
  },
  {
    title: "MCB/RCCB Repair or Replacement",
    description: "Diagnose tripping breakers, replace faulty MCB/RCCB with proper sizing.",
    price: "From $109",
    duration: "Typically 60-150 mins",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
    perks: ["Load check", "Tighten lugs", "Trip test"],
    category: "wiring-panel",
  },
  {
    title: "Wiring Repair (Open & Concealed)",
    description: "Trace and repair damaged open or concealed wiring to restore safe power.",
    price: "From $129",
    duration: "Typically 90-240 mins",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop",
    perks: ["Continuity test", "Replace degraded runs", "Insulation check"],
    category: "wiring-panel",
  },
  {
    title: "Fuse Repair & Replacement",
    description: "Replace blown fuses, check holders, and verify safe circuit protection.",
    price: "From $49",
    duration: "Typically 30-60 mins",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    perks: ["Rating verification", "Tight connections", "Test restore"],
    category: "electrical-repairs",
  },
  {
    title: "Earthing (Grounding) Check & Repair",
    description: "Inspect and improve earthing to reduce shock risk and stabilize voltage.",
    price: "From $139",
    duration: "Typically 90-180 mins",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop",
    perks: ["Earth pit inspection", "Continuity & resistance test", "Bonding check"],
    category: "safety-compliance",
  },
  {
    title: "Short Circuit Fault Detection",
    description: "Locate and isolate short circuits to safely restore power.",
    price: "From $119",
    duration: "Typically 60-150 mins",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    perks: ["Thermal/visual scan", "Isolation testing", "Safe restore"],
    category: "electrical-repairs",
  },
  {
    title: "Power Outage Troubleshooting",
    description: "Diagnose localized outages, identify overloads, and restore supply.",
    price: "From $129",
    duration: "Typically 60-150 mins",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
    perks: ["Load balancing", "Panel checks", "Restore & verify"],
    category: "electrical-repairs",
  },
  {
    title: "Inverter & Home UPS Connection",
    description: "Set up or check inverter/UPS wiring, changeover, and load mapping.",
    price: "From $149",
    duration: "Typically 90-210 mins",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop",
    perks: ["Load mapping", "Changeover test", "Cable gauge check"],
    category: "smart-surge",
  },
  {
    title: "Geyser (Water Heater) Repair",
    description: "Electrical checks for geyser wiring, thermostats, and safety cut-offs.",
    price: "From $99",
    duration: "Typically 60-150 mins",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=600&h=400&fit=crop",
    perks: ["Thermostat check", "Earth leakage check", "Secure connections"],
    category: "appliance-repair",
  },
  {
    title: "Refrigerator Electrical Fix",
    description: "Diagnose electrical supply issues, relays, and safe wiring for fridges.",
    price: "From $129",
    duration: "Typically 90-180 mins",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    perks: ["Outlet & plug check", "Relay/fuse check", "Surge guidance"],
    category: "appliance-repair",
  },
  {
    title: "Washing Machine Electrical Repair",
    description: "Fix power issues, sockets, and wiring faults for top/front loaders.",
    price: "From $119",
    duration: "Typically 90-180 mins",
    image: "https://images.unsplash.com/photo-1581579188871-45ea61f2a0c8?w=600&h=400&fit=crop",
    perks: ["Outlet & plug check", "Continuity & earth test", "Cable tidy-up"],
    category: "appliance-repair",
  },
  {
    title: "Microwave Oven Electrical Service",
    description: "Inspect power input, fuses, and safe connections for microwaves.",
    price: "From $99",
    duration: "Typically 60-150 mins",
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600&h=400&fit=crop",
    perks: ["Fuse/input check", "Cord & plug check", "Grounding verify"],
    category: "appliance-repair",
  },
  {
    title: "Electric Iron & Heater Repair",
    description: "Restore safe power to irons and room heaters; cord and switch checks.",
    price: "From $59",
    duration: "Typically 45-120 mins",
    image: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=600&h=400&fit=crop",
    perks: ["Cord replacement", "Switch test", "Earth continuity"],
    category: "appliance-repair",
  },
  {
    title: "Rice Cooker & Small Appliance Repair",
    description: "Fix power, plugs, and internal wiring for rice cookers and small appliances.",
    price: "From $69",
    duration: "Typically 45-120 mins",
    image: "https://images.unsplash.com/photo-1612874472278-5c1f9d7b4bff?w=600&h=400&fit=crop",
    perks: ["Cord/plug check", "Fuse/thermostat check", "Test run"],
    category: "appliance-repair",
  },
];

const sidebarCategories = [
  { key: "electrical-repairs", label: "Electrical Repairs" },
  { key: "wiring-panel", label: "Wiring & Panel" },
  { key: "lighting-ambience", label: "Lighting & Ambience" },
  { key: "safety-compliance", label: "Safety & Compliance" },
  { key: "smart-surge", label: "Smart Home & Surge" },
  { key: "appliance-repair", label: "Appliance Electrical Repair" },
  { key: "emergency-visits", label: "Emergency Visits" },
];

const quickLinks = [
  "Outlet faults",
  "Breaker trips",
  "Fan not working",
  "Light flicker",
  "Short circuits",
  "Loose neutral",
];

const secondaryGroups = [
  {
    title: "Wiring & Panel",
    key: "wiring-panel",
    items: ["New circuit runs", "Sub-panel setup", "Earthing & bonding"],
  },
  {
    title: "Lighting & Ambience",
    key: "lighting-ambience",
    items: ["LED upgrades", "Outdoor lighting", "Dimmers & scenes"],
  },
  {
    title: "Safety & Compliance",
    key: "safety-compliance",
    items: ["Load tests", "Smoke/CO install", "Compliance reports"],
  },
  {
    title: "Smart & Surge",
    key: "smart-surge",
    items: ["Smart switches", "WiFi relays", "Surge protection"],
  },
  {
    title: "Appliance Electrical Repair",
    key: "appliance-repair",
    items: ["Geyser wiring", "Fridge power fix", "Washer/Microwave checks"],
  },
];

const ElectricalRepairs = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [modalService, setModalService] = useState<(typeof repairServices)[number] | null>(null);
  const [showScheduleView, setShowScheduleView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentService, setCurrentService] = useState<string>("");

  const groupedServices = useMemo(() => {
    return sidebarCategories.map((cat) => ({
      ...cat,
      services: repairServices.filter((svc) => svc.category === cat.key),
    }));
  }, []);

  const handleScrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleBookNow = () => {
    navigate("/search/workers?serviceType=electrician&category=repairs");
  };

  const handleSchedule = (serviceName: string) => {
    setCurrentService(serviceName);
    setShowScheduleView(true);
  };

  const handleConfirmSchedule = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time");
      return;
    }
    // Navigate to worker selection with schedule details
    navigate(`/search/workers?serviceType=electrician&service=${encodeURIComponent(currentService)}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}`);
    setModalService(null);
    setShowScheduleView(false);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleBackToServices = () => {
    setShowScheduleView(false);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handleAddToCart = (service: (typeof repairServices)[number]) => {
    const priceMatch = service.price.match(/\d+/);
    const price = priceMatch ? parseInt(priceMatch[0]) : 0;

    addToCart({
      serviceType: "electrician",
      serviceName: service.title,
      price,
      description: service.description,
      image: service.image,
    });

    toast.success(`${service.title} added to cart!`, {
      description: "You can view and manage your cart items.",
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
    });
  };

  const handleAddCustomToCart = (name: string, priceLabel: string, description?: string) => {
    const priceMatch = priceLabel.match(/\d+\.?\d*/);
    const price = priceMatch ? Math.round(parseFloat(priceMatch[0])) : 0;

    addToCart({
      serviceType: "electrician",
      serviceName: name,
      price,
      description: description || "Desktop service",
      image: modalService?.image,
    });

    toast.success(`${name} added to cart!`, {
      description: "You can view and manage your cart items.",
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-8">
          <aside className="rounded-2xl border border-border/70 bg-card shadow-sm h-fit sticky top-28">
            <div className="px-5 py-4 border-b border-border/70">
              <p className="text-sm font-semibold text-primary">All Services</p>
              <p className="text-xs text-muted-foreground">Browse repair categories</p>
            </div>
            <div className="flex flex-col">
              {sidebarCategories.map((item) => (
                <button
                  key={item.key}
                  className="flex w-full items-center justify-between px-5 py-3 text-left text-sm border-l-2 border-transparent hover:border-primary hover:bg-primary/5 transition-colors"
                  onClick={() => handleScrollTo(item.key)}
                >
                  <span className="text-foreground">{item.label}</span>
                  <span className="text-xs text-muted-foreground">View</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-10">
            <section id="electrical-repairs" className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Electrical Repairs</p>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">Catalog for Electricians</h1>
                  <p className="text-muted-foreground max-w-3xl">
                    Choose from fast fixes to deeper diagnostics. Pricing stays transparent and every job includes a safety check.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary">
                      <ShieldCheck className="h-4 w-4" /> Licensed & insured pros
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-border/60 text-foreground">
                      <Clock className="h-4 w-4" /> Same-day windows
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary">
                      <Sparkles className="h-4 w-4" /> Clean finish guaranteed
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button size="sm" onClick={handleBookNow}>Book a Repair</Button>
                  <Button size="sm" variant="outline" onClick={() => navigate("/electrician")}>Back to Electrician</Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="text-sm font-semibold text-foreground">All repair quick links:</span>
                {quickLinks.map((link) => (
                  <span
                    key={link}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-foreground border border-border/60 text-xs"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary" /> {link}
                  </span>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              {groupedServices.map((group) => (
                <div key={group.key} id={group.key} className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">{group.label}</p>
                      <h3 className="text-2xl font-bold text-foreground">{group.label} Services</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {group.services.length === 0 ? (
                      <p className="text-sm text-muted-foreground col-span-full">Coming soon.</p>
                    ) : (
                      group.services.map((service) => (
                        <Card key={service.title} className="hover:shadow-lg transition-all duration-200 overflow-hidden">
                          <div className="relative h-40 overflow-hidden">
                            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/30" />
                            <span className="absolute top-3 right-3 bg-background/90 text-xs px-3 py-1 rounded-full border border-border/60">
                              {service.price}
                            </span>
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-primary" /> {service.title}
                            </CardTitle>
                            <CardDescription className="text-sm">{service.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3 pt-0 pb-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" /> {service.duration}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {service.perks.map((perk) => (
                                <Badge key={perk} variant="secondary" className="bg-muted text-foreground text-xs">
                                  {perk}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  if (service.details) {
                                    setModalService(service);
                                  } else {
                                    handleBookNow();
                                  }
                                }}
                              >
                                Book Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">More electrical services</p>
                  <h3 className="text-2xl font-bold text-foreground">Explore more categories</h3>
                </div>
                <Button variant="outline" size="sm" onClick={handleBookNow}>
                  <PlugZap className="h-4 w-4 mr-2" /> Find electricians near you
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {secondaryGroups.map((group) => (
                  <Card key={group.title} className="border-border/70">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-foreground">{group.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <Badge key={item} variant="secondary" className="bg-primary/5 text-primary border border-primary/20 text-xs">
                          {item}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={!!modalService} onOpenChange={(open) => {
        if (!open) {
          setModalService(null);
          setShowScheduleView(false);
          setSelectedDate("");
          setSelectedTime("");
        }
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {showScheduleView ? "Select Schedule" : (modalService?.title || "Desktop Services")}
            </DialogTitle>
            <DialogDescription>
              {showScheduleView 
                ? `When would you like ${currentService || "us"} to serve you?`
                : (modalService?.startFrom || "Choose a desktop service")
              }
            </DialogDescription>
          </DialogHeader>

          {!showScheduleView ? (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {modalService?.details?.map((group) => (
              <div key={group.title} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{group.title}</p>
                    <p className="text-xs text-primary">{group.start}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.items.map((item) => (
                    <Card key={item.name} className="border-border/70">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <CardDescription className="text-xs text-primary">{item.price}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-between gap-2 pt-0">
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleSchedule(item.name)}
                        >
                          Schedule
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Date Selection */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Select your prefer date</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 10 }, (_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() + i);
                  const day = date.getDate().toString().padStart(2, "0");
                  const weekday = date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
                  const dateKey = date.toLocaleDateString("en-US");
                  
                  return (
                    <button
                      key={dateKey}
                      onClick={() => setSelectedDate(dateKey)}
                      className={`flex flex-col items-center justify-center min-w-[60px] h-[70px] rounded-xl border-2 transition-all ${
                        selectedDate === dateKey
                          ? "border-primary bg-primary text-primary-foreground shadow-lg"
                          : "border-border hover:border-primary/50 hover:bg-accent"
                      }`}
                    >
                      <span className="text-2xl font-bold">{day}</span>
                      <span className="text-xs font-medium">{weekday}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                Select your prefer time, expert will arrive by your selected time
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  { label: "9 - 10 am", value: "9-10am" },
                  { label: "10 - 11 am", value: "10-11am" },
                  { label: "11 - 12 pm", value: "11-12pm" },
                  { label: "12 - 1 pm", value: "12-1pm" },
                  { label: "1 - 2 pm", value: "1-2pm" },
                  { label: "2 - 3 pm", value: "2-3pm" },
                  { label: "3 - 4 pm", value: "3-4pm" },
                  { label: "4 - 5 pm", value: "4-5pm" },
                  { label: "5 - 6 pm", value: "5-6pm" },
                  { label: "6 - 7 pm", value: "6-7pm" },
                  { label: "7 - 8 pm", value: "7-8pm" },
                  { label: "8 - 9 pm", value: "8-9pm" },
                ].map((slot) => (
                  <button
                    key={slot.value}
                    onClick={() => setSelectedTime(slot.value)}
                    className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                      selectedTime === slot.value
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border hover:border-primary/50 hover:bg-accent text-foreground"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

          <DialogFooter className="flex items-center justify-between gap-3 flex-wrap">
            {showScheduleView ? (
              <>
                <Button variant="outline" onClick={handleBackToServices}>
                  Back to Services
                </Button>
                <Button
                  onClick={handleConfirmSchedule}
                  disabled={!selectedDate || !selectedTime}
                >
                  Select Location
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setModalService(null)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ElectricalRepairs;

