export type ElectricianServiceData = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  startingPrice: string;
  heroImage: string;
  duration: string;
  included: string[];
  notIncluded: string[];
  coveredAreas: string[];
  pricingFactors: {
    factor: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

export const electricianServicesData: Record<string, ElectricianServiceData> = {
  "electrical-repair": {
    slug: "electrical-repair",
    title: "Electrical Repair",
    subtitle: "Fast, safe fixes for all electrical issues",
    description: "Professional electrical repair services for troubleshooting, outlet fixes, breaker trips, and small faults. Our licensed electricians diagnose and fix issues quickly and safely.",
    startingPrice: "৳580",
    heroImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=600&fit=crop&q=80",
    duration: "45-90 mins",
    included: [
      "Troubleshooting and diagnosis",
      "Outlet and switch repairs",
      "Breaker trip resolution",
      "Circuit fault detection",
      "Safety testing and verification",
      "Clean work area guarantee",
      "Code-compliant repairs",
      "Post-repair inspection",
    ],
    notIncluded: [
      "Major rewiring projects",
      "Panel upgrades",
      "New circuit installation",
      "Appliance repairs",
      "Emergency after-hours service (available separately)",
      "Material costs (quoted separately)",
    ],
    coveredAreas: [
      "Outlets and switches",
      "Circuit breakers",
      "Light fixtures",
      "Electrical panels",
      "Wiring connections",
      "Grounding systems",
    ],
    pricingFactors: [
      {
        factor: "Issue Complexity",
        description: "Simple fixes vs. complex diagnostics affect pricing",
      },
      {
        factor: "Parts Required",
        description: "Replacement parts are priced separately",
      },
      {
        factor: "Time Required",
        description: "More complex issues take longer to resolve",
      },
      {
        factor: "Emergency Service",
        description: "After-hours or urgent calls may have additional fees",
      },
    ],
    faqs: [
      {
        question: "How quickly can you fix electrical issues?",
        answer: "Most common repairs take 45-90 minutes. We offer same-day service for urgent issues and can schedule appointments within 24 hours.",
      },
      {
        question: "Are your electricians licensed and insured?",
        answer: "Yes, all our electricians are fully licensed, insured, and background-checked. We maintain proper certifications and insurance coverage.",
      },
      {
        question: "Do you provide emergency electrical service?",
        answer: "Yes, we offer 24/7 emergency support for urgent electrical issues that can't wait, such as burning smells, sparks, or major outages.",
      },
      {
        question: "What if the repair requires parts?",
        answer: "We'll diagnose the issue first and provide a quote that includes parts if needed. You'll approve the cost before we proceed with any repairs.",
      },
      {
        question: "Will you clean up after the repair?",
        answer: "Absolutely! We clean up all work areas and ensure everything is left neat and safe before we leave.",
      },
      {
        question: "Do you offer warranties on repairs?",
        answer: "Yes, all our repairs come with a warranty. We guarantee our work and will return to fix any issues related to our service at no additional charge.",
      },
    ],
  },
  "wiring-installation": {
    slug: "wiring-installation",
    title: "Wiring & Installation",
    subtitle: "Safe, professional wiring for your home",
    description: "Expert wiring and installation services for new rooms, extensions, and safe cable management. We ensure all work meets electrical codes and safety standards.",
    startingPrice: "৳2,290",
    heroImage: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=600&fit=crop&q=80",
    duration: "2-4 hours",
    included: [
      "New room wiring",
      "Circuit extensions",
      "Safe cable management",
      "Code-compliant installation",
      "Panel connections",
      "Safety testing",
      "Clean installation",
      "Post-installation inspection",
    ],
    notIncluded: [
      "Major panel upgrades",
      "Service upgrades",
      "Permit fees",
      "Wall patching and painting",
      "Conduit installation (quoted separately)",
      "Smart home integration (available as add-on)",
    ],
    coveredAreas: [
      "New circuits",
      "Room extensions",
      "Outdoor wiring",
      "Panel connections",
      "Grounding systems",
      "Cable routing",
    ],
    pricingFactors: [
      {
        factor: "Project Scope",
        description: "Number of circuits and outlets affects pricing",
      },
      {
        factor: "Access Difficulty",
        description: "Hard-to-reach areas may require more time",
      },
      {
        factor: "Materials Required",
        description: "Wire gauge, conduit, and fixtures are priced separately",
      },
      {
        factor: "Permits",
        description: "Some projects require permits with associated fees",
      },
    ],
    faqs: [
      {
        question: "Do I need permits for new wiring?",
        answer: "It depends on your local regulations. We'll advise you on permit requirements and can help with the application process if needed.",
      },
      {
        question: "How long does wiring installation take?",
        answer: "Most wiring projects take 2-4 hours, but larger projects may take longer. We'll provide a timeline estimate during consultation.",
      },
      {
        question: "Will you need to cut into my walls?",
        answer: "We'll discuss the approach with you first. Some installations can be done with minimal wall cutting, while others may require more extensive work.",
      },
      {
        question: "Can you wire for smart home devices?",
        answer: "Yes! We can install wiring that supports smart switches, outlets, and other smart home devices. This can be included in the installation.",
      },
      {
        question: "What about wall patching after installation?",
        answer: "We focus on electrical work. Wall patching and painting are typically handled separately, though we can recommend contractors if needed.",
      },
      {
        question: "Do you guarantee code compliance?",
        answer: "Absolutely. All our work meets or exceeds local electrical codes. We'll ensure everything passes inspection if required.",
      },
    ],
  },
  "lighting-installation": {
    slug: "lighting-installation",
    title: "Lighting Installation",
    subtitle: "Beautiful, functional lighting for every space",
    description: "Professional lighting installation for indoor, outdoor, and smart lighting systems. We ensure neat finishing and proper electrical connections for all fixture types.",
    startingPrice: "৳790",
    heroImage: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&h=600&fit=crop&q=80",
    duration: "1-3 hours",
    included: [
      "Fixture installation",
      "Wiring connections",
      "Switch installation",
      "Dimmer setup",
      "Safety testing",
      "Clean installation",
      "Functional testing",
      "Neat finishing",
    ],
    notIncluded: [
      "Fixture purchase",
      "Wall patching",
      "Ceiling repairs",
      "Smart home hub setup",
      "Design consultation",
      "Outdoor transformer installation (quoted separately)",
    ],
    coveredAreas: [
      "Ceiling lights",
      "Wall sconces",
      "Outdoor lighting",
      "Track lighting",
      "Chandeliers",
      "Recessed lighting",
    ],
    pricingFactors: [
      {
        factor: "Fixture Type",
        description: "Complex fixtures like chandeliers take more time",
      },
      {
        factor: "Number of Fixtures",
        description: "Multiple fixtures increase installation time",
      },
      {
        factor: "Access Difficulty",
        description: "High ceilings or tight spaces may cost more",
      },
      {
        factor: "Smart Features",
        description: "Smart switches and dimmers add to the cost",
      },
    ],
    faqs: [
      {
        question: "Do you provide the light fixtures?",
        answer: "You can purchase fixtures yourself or we can help source them. We'll install whatever fixtures you choose.",
      },
      {
        question: "Can you install outdoor lighting?",
        answer: "Yes! We install outdoor lighting including security lights, landscape lighting, and decorative fixtures with proper weatherproofing.",
      },
      {
        question: "How long does lighting installation take?",
        answer: "Most single fixture installations take 1-2 hours. Multiple fixtures or complex setups may take 3-4 hours.",
      },
      {
        question: "Do you install smart lighting?",
        answer: "Yes, we install smart switches, dimmers, and fixtures. We can also help set up smart home integration if needed.",
      },
      {
        question: "Will you test the lights before leaving?",
        answer: "Absolutely! We test all installations to ensure everything works properly and safely before we leave.",
      },
      {
        question: "What if I want to change fixtures later?",
        answer: "We can easily swap out fixtures later. The wiring we install will support future changes and upgrades.",
      },
    ],
  },
  "switch-socket-repair": {
    slug: "switch-socket-repair",
    title: "Switch & Socket Repair",
    subtitle: "Fix loose, burnt, or non-responsive switches and sockets",
    description: "Professional repair and replacement services for switches and sockets. We fix loose connections, burnt terminals, and non-responsive switches with safe, code-compliant solutions.",
    startingPrice: "৳600",
    heroImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=600&fit=crop&q=80",
    duration: "30-60 mins",
    included: [
      "Switch repair and replacement",
      "Socket repair and replacement",
      "Continuity testing",
      "Terminal tightening",
      "Safety checks",
      "Code-compliant repairs",
      "Clean work area",
      "Functional testing",
    ],
    notIncluded: [
      "Major rewiring",
      "Panel upgrades",
      "GFCI installation (available as upgrade)",
      "USB outlet installation (available as upgrade)",
      "Smart switch installation (available as upgrade)",
      "Multiple outlet replacement (quoted per unit)",
    ],
    coveredAreas: [
      "Standard switches",
      "Dimmer switches",
      "Standard outlets",
      "GFCI outlets",
      "USB outlets",
      "Switch-socket combinations",
    ],
    pricingFactors: [
      {
        factor: "Number of Units",
        description: "Multiple switches or sockets are priced per unit",
      },
      {
        factor: "Upgrade Type",
        description: "GFCI, USB, or smart switches cost more than standard",
      },
      {
        factor: "Wiring Condition",
        description: "Damaged wiring may require additional repair",
      },
      {
        factor: "Access Difficulty",
        description: "Hard-to-reach locations may take more time",
      },
    ],
    faqs: [
      {
        question: "How quickly can you fix a broken switch or socket?",
        answer: "Most repairs take 30-60 minutes. We can often fix issues on the same day you call.",
      },
      {
        question: "Can you upgrade to GFCI outlets?",
        answer: "Yes! We can upgrade standard outlets to GFCI (Ground Fault Circuit Interrupter) outlets for added safety, especially in kitchens and bathrooms.",
      },
      {
        question: "Do you install USB outlets?",
        answer: "Absolutely! USB outlets are great for charging devices. We can replace standard outlets with USB-equipped ones.",
      },
      {
        question: "What causes switches and sockets to fail?",
        answer: "Common causes include loose connections, worn terminals, overloaded circuits, or age. We'll diagnose the specific issue.",
      },
      {
        question: "Will you test everything after repair?",
        answer: "Yes, we test all repairs to ensure they work safely and correctly before we leave.",
      },
      {
        question: "Can you install smart switches?",
        answer: "Yes! We install smart switches that can be controlled via smartphone apps or voice assistants. This is available as an upgrade.",
      },
    ],
  },
  "electrical-safety-inspection": {
    slug: "electrical-safety-inspection",
    title: "Electrical Safety Inspection",
    subtitle: "Comprehensive safety checks and compliance testing",
    description: "Professional electrical safety inspections including earthing checks, load testing, and compliance verification. Ensure your electrical system is safe and up to code.",
    startingPrice: "৳1,390",
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop&q=80",
    duration: "2-3 hours",
    included: [
      "Complete system inspection",
      "Earthing and grounding checks",
      "Load testing",
      "Panel inspection",
      "Outlet and switch testing",
      "Safety compliance report",
      "Recommendations for improvements",
      "Code compliance verification",
    ],
    notIncluded: [
      "Repairs (quoted separately)",
      "Upgrades (quoted separately)",
      "Permit applications",
      "Re-inspection fees",
      "Emergency repairs",
      "Detailed written reports (available as add-on)",
    ],
    coveredAreas: [
      "Electrical panels",
      "Wiring systems",
      "Outlets and switches",
      "Grounding systems",
      "Circuit breakers",
      "Safety devices",
    ],
    pricingFactors: [
      {
        factor: "Property Size",
        description: "Larger properties require more inspection time",
      },
      {
        factor: "System Complexity",
        description: "Complex electrical systems take longer to inspect",
      },
      {
        factor: "Report Detail",
        description: "Detailed written reports are available as an add-on",
      },
      {
        factor: "Follow-up Services",
        description: "Repairs and upgrades are priced separately",
      },
    ],
    faqs: [
      {
        question: "How often should I have an electrical safety inspection?",
        answer: "We recommend inspections every 3-5 years for homes, or when buying/selling a property. Older homes may need more frequent inspections.",
      },
      {
        question: "What does the inspection cover?",
        answer: "We inspect panels, wiring, outlets, switches, grounding, and safety devices. We check for code compliance and potential hazards.",
      },
      {
        question: "Will you provide a written report?",
        answer: "Yes, we provide a detailed safety compliance report with findings and recommendations. Detailed written reports are available as an add-on.",
      },
      {
        question: "What if you find safety issues?",
        answer: "We'll explain any issues found and provide quotes for necessary repairs. We prioritize safety and will advise on urgent vs. non-urgent fixes.",
      },
      {
        question: "Is this required for insurance?",
        answer: "Some insurance companies require electrical inspections. We can provide documentation that meets most insurance requirements.",
      },
      {
        question: "How long does an inspection take?",
        answer: "Most home inspections take 2-3 hours depending on property size and system complexity. We'll provide a time estimate beforehand.",
      },
    ],
  },
};
