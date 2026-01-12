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
    price: "Starts from ৳650",
    duration: "Typically 45-90 mins",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    perks: ["Parts guidance provided", "Code-compliant repairs", "Cleanup before we leave"],
    category: "electrical-repairs",
    startFrom: "Starts from ৳650",
    details: [
      {
        title: "Outlet Repairs",
        start: "Starts from ৳650",
        items: [
          { name: "Dead Outlet Repair", price: "৳ 650" },
          { name: "Loose Outlet Replacement", price: "৳ 750" },
          { name: "GFCI Outlet Installation", price: "৳ 950" },
          { name: "USB Outlet Installation", price: "৳ 1100" },
        ],
      },
      {
        title: "Switch Repairs",
        start: "Starts from ৳700",
        items: [
          { name: "Light Switch Replacement", price: "৳ 700" },
          { name: "Dimmer Switch Installation", price: "৳ 850" },
          { name: "Three-Way Switch Repair", price: "৳ 900" },
          { name: "Smart Switch Installation", price: "৳ 1400" },
        ],
      },
    ],
  },
  {
    title: "Breaker Trips & Diagnostics",
    description: "Find and fix overloads, short circuits, nuisance tripping, and buzzing breakers.",
    price: "Starts from ৳850",
    duration: "Typically 60-120 mins",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    perks: ["Thermal and continuity checks", "Load balancing tips", "Safety-first process"],
    category: "electrical-repairs",
    startFrom: "Starts from ৳850",
    details: [
      {
        title: "Circuit Breaker Repairs",
        start: "Starts from ৳850",
        items: [
          { name: "Single Pole Breaker Replacement", price: "৳ 850" },
          { name: "Double Pole Breaker Replacement", price: "৳ 1050" },
          { name: "GFCI Breaker Installation", price: "৳ 1300" },
          { name: "AFCI Breaker Installation", price: "৳ 1450" },
        ],
      },
      {
        title: "Diagnostics & Troubleshooting",
        start: "Starts from ৳950",
        items: [
          { name: "Circuit Overload Diagnosis", price: "৳ 950" },
          { name: "Short Circuit Detection", price: "৳ 1200" },
          { name: "Nuisance Trip Investigation", price: "৳ 1100" },
          { name: "Buzzing Breaker Repair", price: "৳ 900" },
        ],
      },
    ],
  },
  {
    title: "Fixture & Fan Repairs",
    description: "Repair or replace ceiling fans, pendants, chandeliers, and damp-rated fixtures.",
    price: "Starts from ৳700",
    duration: "Typically 45-120 mins",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=400&fit=crop",
    perks: ["Secure mounting", "Balanced fan alignment", "Post-install safety test"],
    category: "lighting-ambience",
    startFrom: "Starts from ৳700",
    details: [
      {
        title: "Ceiling Fan Repairs",
        start: "Starts from ৳700",
        items: [
          { name: "Fan Motor Repair", price: "৳ 700" },
          { name: "Fan Blade Balancing", price: "৳ 600" },
          { name: "Fan Speed Controller Replacement", price: "৳ 850" },
        ],
      },
      {
        title: "Fixture Installation",
        start: "Starts from ৳800",
        items: [
          { name: "Pendant Light Installation", price: "৳ 800" },
          { name: "Chandelier Installation", price: "৳ 1050" },
          { name: "Damp-Rated Fixture Installation", price: "৳ 950" },
        ],
      },
    ],
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
    price: "Starts from ৳1100",
    duration: "Typically 90-180 mins",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    perks: ["Adapter/PoE checks", "Cable continuity test", "Secure mounting"],
    category: "safety-compliance",
    startFrom: "Starts from ৳1100",
    details: [
      {
        title: "Power Supply Services",
        start: "Starts from ৳1100",
        items: [
          { name: "Power Adapter Replacement", price: "৳ 1100" },
          { name: "PoE Injector Installation", price: "৳ 1300" },
        ],
      },
      {
        title: "Installation & Troubleshooting",
        start: "Starts from ৳1200",
        items: [
          { name: "Cable Continuity Check", price: "৳ 1200" },
          { name: "Camera Mounting & Alignment", price: "৳ 1400" },
        ],
      },
    ],
  },
  {
    title: "Switch & Socket Repair/Replacement",
    description: "Fix loose, burnt, or non-responsive switches and sockets with safe replacements.",
    price: "Starts from ৳600",
    duration: "Typically 45-90 mins",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    perks: ["Continuity test", "Tight/replace terminals", "Safety check"],
    category: "electrical-repairs",
    startFrom: "Starts from ৳600",
    details: [
      {
        title: "Socket Repair & Replacement",
        start: "Starts from ৳600",
        items: [
          { name: "Standard Socket Replacement", price: "৳ 600" },
          { name: "Burnt Socket Repair", price: "৳ 750" },
          { name: "Loose Socket Tightening", price: "৳ 550" },
          { name: "Waterproof Socket Installation", price: "৳ 950" },
        ],
      },
      {
        title: "Switch Repair & Replacement",
        start: "Starts from ৳650",
        items: [
          { name: "Standard Switch Replacement", price: "৳ 650" },
          { name: "Non-Responsive Switch Repair", price: "৳ 700" },
          { name: "Burnt Switch Replacement", price: "৳ 800" },
          { name: "Two-Way Switch Installation", price: "৳ 900" },
        ],
      },
    ],
  },
  {
    title: "Light Fitting Install/Repair",
    description: "Install or fix ceiling, wall, and decorative lights with neat finish.",
    price: "Starts from ৳650",
    duration: "Typically 45-120 mins",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=400&fit=crop",
    perks: ["Secure mounting", "Cable dressing", "Functional test"],
    category: "lighting-ambience",
    startFrom: "Starts from ৳650",
    details: [
      {
        title: "Ceiling Light Installation",
        start: "Starts from ৳650",
        items: [
          { name: "Basic Ceiling Light Install", price: "৳ 650" },
          { name: "Flush Mount Light Install", price: "৳ 750" },
          { name: "Recessed Light Installation", price: "৳ 900" },
        ],
      },
      {
        title: "Wall & Decorative Lights",
        start: "Starts from ৳700",
        items: [
          { name: "Wall Sconce Installation", price: "৳ 700" },
          { name: "Picture Light Install", price: "৳ 750" },
          { name: "LED Strip Light Installation", price: "৳ 850" },
        ],
      },
    ],
  },
  {
    title: "Fan Repair & Installation (Ceiling/Exhaust)",
    description: "Balance, rewire, or install ceiling and exhaust fans for smooth, quiet runs.",
    price: "Starts from ৳800",
    duration: "Typically 60-150 mins",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=400&fit=crop",
    perks: ["Secure brackets", "Lubrication & balancing", "Speed test"],
    category: "lighting-ambience",
    startFrom: "Starts from ৳800",
    details: [
      {
        title: "Ceiling Fan Installation",
        start: "Starts from ৳800",
        items: [
          { name: "Standard Ceiling Fan Install", price: "৳ 800" },
          { name: "Heavy-Duty Fan Installation", price: "৳ 1000" },
          { name: "Smart Fan Installation", price: "৳ 1200" },
        ],
      },
      {
        title: "Exhaust Fan Services",
        start: "Starts from ৳850",
        items: [
          { name: "Bathroom Exhaust Fan Install", price: "৳ 850" },
          { name: "Kitchen Exhaust Fan Install", price: "৳ 950" },
          { name: "Exhaust Duct Repair & Cleaning", price: "৳ 900" },
        ],
      },
    ],
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
    price: "Starts from ৳500",
    duration: "Typically 30-60 mins",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    perks: ["Rating verification", "Tight connections", "Test restore"],
    category: "electrical-repairs",
    startFrom: "Starts from ৳500",
    details: [
      {
        title: "Fuse Replacement Services",
        start: "Starts from ৳500",
        items: [
          { name: "Standard Fuse Replacement", price: "৳ 500" },
          { name: "Cartridge Fuse Replacement", price: "৳ 600" },
          { name: "Blade Fuse Replacement", price: "৳ 550" },
          { name: "Time-Delay Fuse Installation", price: "৳ 700" },
        ],
      },
      {
        title: "Fuse Holder & Box Services",
        start: "Starts from ৳650",
        items: [
          { name: "Fuse Holder Repair", price: "৳ 650" },
          { name: "Fuse Box Inspection", price: "৳ 750" },
          { name: "Fuse Box Terminal Tightening", price: "৳ 600" },
          { name: "Circuit Protection Verification", price: "৳ 800" },
        ],
      },
    ],
  },
  {
    title: "Earthing (Grounding) Check & Repair",
    description: "Inspect and improve earthing to reduce shock risk and stabilize voltage.",
    price: "Starts from ৳1400",
    duration: "Typically 90-180 mins",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop",
    perks: ["Earth pit inspection", "Continuity & resistance test", "Bonding check"],
    category: "safety-compliance",
    startFrom: "Starts from ৳1400",
    details: [
      {
        title: "Earthing Inspection & Testing",
        start: "Starts from ৳1400",
        items: [
          { name: "Earth Pit Inspection", price: "৳ 1400" },
          { name: "Resistance Testing", price: "৳ 1600" },
          { name: "Continuity Check", price: "৳ 1300" },
        ],
      },
      {
        title: "Earthing Repair & Installation",
        start: "Starts from ৳1500",
        items: [
          { name: "Earth Pit Improvement", price: "৳ 1500" },
          { name: "Bonding Wire Installation", price: "৳ 1700" },
          { name: "Earth Rod Replacement", price: "৳ 1600" },
        ],
      },
    ],
  },
  {
    title: "Short Circuit Fault Detection",
    description: "Locate and isolate short circuits to safely restore power.",
    price: "Starts from ৳1200",
    duration: "Typically 60-150 mins",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    perks: ["Thermal/visual scan", "Isolation testing", "Safe restore"],
    category: "electrical-repairs",
    startFrom: "Starts from ৳1200",
    details: [
      {
        title: "Circuit Detection Services",
        start: "Starts from ৳1200",
        items: [
          { name: "Short Circuit Locating", price: "৳ 1200" },
          { name: "Thermal Imaging Scan", price: "৳ 1500" },
        ],
      },
      {
        title: "Restoration & Verification",
        start: "Starts from ৳1100",
        items: [
          { name: "Safe Power Restoration", price: "৳ 1100" },
          { name: "Isolation & Load Testing", price: "৳ 1400" },
        ],
      },
    ],
  },
  {
    title: "Power Outage Troubleshooting",
    description: "Diagnose localized outages, identify overloads, and restore supply.",
    price: "Starts from ৳1300",
    duration: "Typically 60-150 mins",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
    perks: ["Load balancing", "Panel checks", "Restore & verify"],
    category: "electrical-repairs",
    startFrom: "Starts from ৳1300",
    details: [
      {
        title: "Outage Diagnosis",
        start: "Starts from ৳1300",
        items: [
          { name: "Localized Outage Detection", price: "৳ 1300" },
          { name: "Load Overload Identification", price: "৳ 1400" },
        ],
      },
      {
        title: "Supply Restoration",
        start: "Starts from ৳1200",
        items: [
          { name: "Panel Check & Reset", price: "৳ 1200" },
          { name: "Power Supply Restoration", price: "৳ 1500" },
        ],
      },
    ],
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
    price: "Starts from ৳1000",
    duration: "Typically 60-150 mins",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop",
    perks: ["Thermostat check", "Earth leakage check", "Secure connections"],
    category: "appliance-repair",
    startFrom: "Starts from ৳1000",
    details: [
      {
        title: "Geyser Inspection & Testing",
        start: "Starts from ৳1000",
        items: [
          { name: "Thermostat Check & Repair", price: "৳ 1000" },
          { name: "Earth Leakage Detection", price: "৳ 1100" },
          { name: "Heating Element Continuity Test", price: "৳ 950" },
        ],
      },
      {
        title: "Geyser Repair & Maintenance",
        start: "Starts from ৳1100",
        items: [
          { name: "Wiring Replacement", price: "৳ 1100" },
          { name: "Safety Cut-off Installation", price: "৳ 1300" },
          { name: "Terminal Connection Tightening", price: "৳ 1050" },
        ],
      },
    ],
  },
  {
    title: "Refrigerator Electrical Fix",
    description: "Diagnose electrical supply issues, relays, and safe wiring for fridges.",
    price: "Starts from ৳1150",
    duration: "Typically 90-180 mins",
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&h=400&fit=crop",
    perks: ["Outlet & plug check", "Relay/fuse check", "Surge guidance"],
    category: "appliance-repair",
    startFrom: "Starts from ৳1150",
    details: [
      {
        title: "Electrical Diagnosis",
        start: "Starts from ৳1150",
        items: [
          { name: "Power Supply Check", price: "৳ 1150" },
          { name: "Relay & Fuse Testing", price: "৳ 1200" },
          { name: "Compressor Electrical Check", price: "৳ 1350" },
        ],
      },
      {
        title: "Wiring & Repair",
        start: "Starts from ৳1250",
        items: [
          { name: "Outlet & Plug Repair", price: "৳ 1250" },
          { name: "Internal Wiring Fix", price: "৳ 1400" },
          { name: "Surge Protection Setup", price: "৳ 1300" },
        ],
      },
    ],
  },
  {
    title: "Washing Machine Electrical Repair",
    description: "Fix power issues, sockets, and wiring faults for top/front loaders.",
    price: "Starts from ৳1100",
    duration: "Typically 90-180 mins",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&h=400&fit=crop",
    perks: ["Outlet & plug check", "Continuity & earth test", "Cable tidy-up"],
    category: "appliance-repair",
    startFrom: "Starts from ৳1100",
    details: [
      {
        title: "Power & Connection Check",
        start: "Starts from ৳1100",
        items: [
          { name: "Outlet & Socket Inspection", price: "৳ 1100" },
          { name: "Earth Continuity Testing", price: "৳ 1150" },
          { name: "Motor Winding Check", price: "৳ 1300" },
        ],
      },
      {
        title: "Wiring & Safety",
        start: "Starts from ৳1200",
        items: [
          { name: "Internal Wiring Repair", price: "৳ 1200" },
          { name: "Cable & Cord Replacement", price: "৳ 1250" },
          { name: "Timer & Switch Repair", price: "৳ 1350" },
        ],
      },
    ],
  },
  {
    title: "Microwave Oven Electrical Service",
    description: "Inspect power input, fuses, and safe connections for microwaves.",
    price: "Starts from ৳950",
    duration: "Typically 60-150 mins",
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&h=400&fit=crop",
    perks: ["Fuse/input check", "Cord & plug check", "Grounding verify"],
    category: "appliance-repair",
    startFrom: "Starts from ৳950",
    details: [
      {
        title: "Power & Safety Check",
        start: "Starts from ৳950",
        items: [
          { name: "Fuse & Input Testing", price: "৳ 950" },
          { name: "Grounding Verification", price: "৳ 1000" },
          { name: "Power Cable Inspection", price: "৳ 900" },
        ],
      },
      {
        title: "Repair & Maintenance",
        start: "Starts from ৳1050",
        items: [
          { name: "Power Cord Replacement", price: "৳ 1050" },
          { name: "High-Voltage Connection Check", price: "৳ 1150" },
        ],
      },
    ],
  },
  {
    title: "Electric Iron & Heater Repair",
    description: "Restore safe power to irons and room heaters; cord and switch checks.",
    price: "Starts from ৳600",
    duration: "Typically 45-120 mins",
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&h=400&fit=crop",
    perks: ["Cord replacement", "Switch test", "Earth continuity"],
    category: "appliance-repair",
    startFrom: "Starts from ৳600",
    details: [
      {
        title: "Iron Repair",
        start: "Starts from ৳600",
        items: [
          { name: "Cord Replacement", price: "৳ 600" },
          { name: "Thermostat Repair", price: "৳ 750" },
        ],
      },
      {
        title: "Heater Repair",
        start: "Starts from ৳700",
        items: [
          { name: "Element Replacement", price: "৳ 700" },
          { name: "Switch & Cord Repair", price: "৳ 800" },
        ],
      },
    ],
  },
  {
    title: "Rice Cooker & Small Appliance Repair",
    description: "Fix power, plugs, and internal wiring for rice cookers and small appliances.",
    price: "Starts from ৳700",
    duration: "Typically 45-120 mins",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=400&fit=crop",
    perks: ["Cord/plug check", "Fuse/thermostat check", "Test run"],
    category: "appliance-repair",
    startFrom: "Starts from ৳700",
    details: [
      {
        title: "Rice Cooker Services",
        start: "Starts from ৳700",
        items: [
          { name: "Thermostat Replacement", price: "৳ 700" },
          { name: "Power Cord Repair", price: "৳ 650" },
        ],
      },
      {
        title: "Small Appliances",
        start: "Starts from ৳650",
        items: [
          { name: "Blender Motor Repair", price: "৳ 750" },
          { name: "Toaster Element Check", price: "৳ 650" },
        ],
      },
    ],
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

