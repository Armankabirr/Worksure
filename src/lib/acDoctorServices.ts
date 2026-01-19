export type ACDoctorServiceData = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
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

export const acDoctorServicesConfig: Record<string, ACDoctorServiceData> = {
  "ac-installation": {
    slug: "ac-installation",
    title: "AC Installation",
    subtitle: "Expert installation for all AC types",
    description: "Professional AC installation service for split, window, and cassette units. Our certified technicians ensure proper installation with site inspection, correct sizing, and optimal placement for maximum efficiency and performance.",
    shortDescription: "Expert installation for split, window, and cassette ACs. Includes site inspection.",
    startingPrice: "৳2,500",
    heroImage: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&h=600&fit=crop&q=80",
    duration: "3-5 hours",
    included: [
      "Site inspection and assessment",
      "Proper AC unit sizing consultation",
      "Installation of indoor and outdoor units",
      "Refrigerant line installation",
      "Electrical connection and safety checks",
      "Drainage system setup",
      "Performance testing and calibration",
      "Clean work area guarantee",
      "Warranty on installation work",
    ],
    notIncluded: [
      "AC unit purchase (we can recommend suppliers)",
      "Wall modifications or construction",
      "Electrical panel upgrades",
      "Permit fees (if required)",
      "Extended warranty on AC unit",
      "Annual maintenance (available separately)",
    ],
    coveredAreas: [
      "Indoor unit installation",
      "Outdoor unit placement",
      "Refrigerant piping",
      "Electrical connections",
      "Drainage system",
      "Wall mounting",
      "Performance testing",
    ],
    pricingFactors: [
      {
        factor: "AC Unit Type",
        description: "Split, window, or cassette units have different installation complexities",
      },
      {
        factor: "Installation Location",
        description: "Accessibility and wall type affect installation time and cost",
      },
      {
        factor: "Electrical Requirements",
        description: "May need additional electrical work or panel upgrades",
      },
      {
        factor: "Distance Between Units",
        description: "Longer refrigerant lines require more materials and time",
      },
    ],
    faqs: [
      {
        question: "How long does AC installation take?",
        answer: "Typically 3-5 hours depending on the AC type, location complexity, and any additional electrical work required. We'll provide an accurate timeline during the site inspection.",
      },
      {
        question: "Do you provide the AC unit?",
        answer: "We can recommend trusted suppliers and help you choose the right unit size. You can purchase through us or separately - we'll install it either way.",
      },
      {
        question: "What size AC do I need?",
        answer: "We perform a site inspection to determine the optimal AC size based on room dimensions, insulation, windows, and usage patterns. Proper sizing ensures efficiency and comfort.",
      },
      {
        question: "Do you handle permits?",
        answer: "We'll inform you if permits are required and can guide you through the process. Permit fees are separate and vary by location.",
      },
      {
        question: "What warranty do you provide?",
        answer: "We provide a 1-year warranty on our installation work. This covers any issues related to installation, not the AC unit itself.",
      },
      {
        question: "Can you install any brand of AC?",
        answer: "Yes, we're certified to install all major AC brands including Daikin, LG, Samsung, Carrier, and others.",
      },
    ],
  },
  "ac-repair": {
    slug: "ac-repair",
    title: "AC Repair",
    subtitle: "Quick diagnosis and reliable repairs",
    description: "Expert AC repair service for cooling issues, strange noises, electrical problems, and performance concerns. Our certified technicians diagnose issues quickly and provide transparent, upfront pricing before any work begins.",
    shortDescription: "Quick diagnosis and repair for cooling, noise, or electrical issues.",
    startingPrice: "৳1,800",
    heroImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&h=600&fit=crop&q=80",
    duration: "1-3 hours",
    included: [
      "Comprehensive AC diagnosis",
      "Repair of identified issues",
      "Replacement of faulty parts (parts cost separate)",
      "Performance testing after repair",
      "Cleaning of accessible components",
      "Safety checks and verification",
      "Transparent pricing before work",
      "30-day warranty on repairs",
      "Clean work area guarantee",
    ],
    notIncluded: [
      "AC unit replacement",
      "Major component replacements (compressor, etc.)",
      "Refrigerant refill (separate service)",
      "Annual maintenance contract",
      "Emergency after-hours service (available at premium)",
      "Warranty on replaced parts (covered by manufacturer)",
    ],
    coveredAreas: [
      "Cooling system repairs",
      "Electrical issue resolution",
      "Noise and vibration fixes",
      "Water leakage repairs",
      "Thermostat and control repairs",
      "Fan and motor repairs",
      "Filter and coil cleaning",
    ],
    pricingFactors: [
      {
        factor: "Issue Complexity",
        description: "Simple fixes vs. complex component replacements",
      },
      {
        factor: "Parts Required",
        description: "Cost of replacement parts varies by brand and type",
      },
      {
        factor: "AC Unit Age",
        description: "Older units may require more extensive repairs",
      },
      {
        factor: "Access Difficulty",
        description: "Hard-to-reach units may require additional time",
      },
    ],
    faqs: [
      {
        question: "How quickly can you diagnose the problem?",
        answer: "Most issues can be diagnosed within 30-60 minutes. We'll explain the problem and provide a transparent quote before starting any repairs.",
      },
      {
        question: "Do you charge for diagnosis?",
        answer: "Diagnosis fee is included if you proceed with the repair. If you choose not to repair, a minimal diagnostic fee applies.",
      },
      {
        question: "What if the repair doesn't fix the issue?",
        answer: "We provide a 30-day warranty on our repair work. If the same issue recurs, we'll return to fix it at no additional labor charge.",
      },
      {
        question: "Can you repair all AC brands?",
        answer: "Yes, we're experienced with all major brands. However, some specialized parts may need to be ordered, which could extend repair time.",
      },
      {
        question: "Do you offer emergency repair service?",
        answer: "Yes, we offer 24/7 emergency service for urgent AC breakdowns, especially during extreme weather. Emergency service includes a premium fee.",
      },
      {
        question: "What if my AC needs replacement instead of repair?",
        answer: "We'll provide an honest assessment. If repair isn't cost-effective, we'll recommend replacement and can help with installation.",
      },
    ],
  },
  "ac-gas-refill": {
    slug: "ac-gas-refill",
    title: "AC Gas Refill",
    subtitle: "Safe refrigerant top-up with leak detection",
    description: "Professional AC gas refill service for all AC types. We safely refill refrigerant, check for leaks, and ensure optimal cooling performance. All work is performed by certified technicians using proper safety protocols.",
    shortDescription: "Safe refrigerant top-up for all AC types, with leak check included.",
    startingPrice: "৳2,200",
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop&q=80",
    duration: "1-2 hours",
    included: [
      "Refrigerant level check",
      "Leak detection and testing",
      "Safe gas refill to optimal level",
      "Performance testing after refill",
      "System pressure verification",
      "Basic cleaning of accessible components",
      "Safety compliance check",
      "Warranty on refill work",
      "Clean work area guarantee",
    ],
    notIncluded: [
      "Leak repair (if leak is found, repair is separate)",
      "Major component replacement",
      "AC unit replacement",
      "Annual maintenance contract",
      "Multiple refills within short period (indicates leak)",
      "Emergency after-hours service",
    ],
    coveredAreas: [
      "Refrigerant system",
      "Leak detection",
      "Pressure testing",
      "Performance verification",
      "Safety checks",
    ],
    pricingFactors: [
      {
        factor: "AC Unit Size",
        description: "Larger units require more refrigerant",
      },
      {
        factor: "Refrigerant Type",
        description: "Different refrigerant types have different costs",
      },
      {
        factor: "Leak Detection",
        description: "If leaks are found, repair costs are additional",
      },
      {
        factor: "Unit Accessibility",
        description: "Hard-to-reach units may require additional time",
      },
    ],
    faqs: [
      {
        question: "How do I know if my AC needs gas refill?",
        answer: "Signs include reduced cooling, longer time to reach desired temperature, ice formation on coils, or higher electricity bills. We can check the refrigerant level during inspection.",
      },
      {
        question: "Is refrigerant refill safe?",
        answer: "Yes, when performed by certified technicians using proper equipment and safety protocols. We follow all safety regulations and use certified refrigerants.",
      },
      {
        question: "What if you find a leak?",
        answer: "We'll identify the leak location and provide a quote for repair. It's important to fix leaks before refilling to prevent repeated issues.",
      },
      {
        question: "How often should AC gas be refilled?",
        answer: "A properly functioning AC shouldn't need regular refills. If you need refills frequently, there's likely a leak that needs repair.",
      },
      {
        question: "What type of refrigerant do you use?",
        answer: "We use the refrigerant type specified by your AC manufacturer. Common types include R410A, R22, and R32. We'll verify the correct type for your unit.",
      },
      {
        question: "Do you provide warranty on gas refill?",
        answer: "Yes, we provide a warranty on our refill work. If the refrigerant level drops significantly within 30 days, we'll investigate and address any issues.",
      },
    ],
  },
  "ac-servicing": {
    slug: "ac-servicing",
    title: "AC Servicing",
    subtitle: "Comprehensive maintenance for peak performance",
    description: "Professional AC servicing to keep your unit running efficiently. Includes deep cleaning, filter replacement, performance checks, and preventive maintenance. Regular servicing extends AC life and reduces energy costs.",
    shortDescription: "Deep cleaning, filter change, and performance check for all AC brands.",
    startingPrice: "৳1,200",
    heroImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=600&fit=crop&q=80",
    duration: "2-3 hours",
    included: [
      "Complete AC unit cleaning",
      "Filter cleaning or replacement",
      "Coil cleaning (indoor and outdoor)",
      "Drainage system cleaning",
      "Performance and efficiency check",
      "Refrigerant level check",
      "Electrical connection inspection",
      "Thermostat calibration",
      "Safety checks and testing",
      "Post-service performance report",
    ],
    notIncluded: [
      "Major component repairs",
      "Refrigerant refill (if needed, separate service)",
      "AC unit replacement",
      "Wall or structural modifications",
      "Annual maintenance contract (available separately)",
      "Emergency repairs",
    ],
    coveredAreas: [
      "Indoor unit cleaning",
      "Outdoor unit cleaning",
      "Filter maintenance",
      "Coil cleaning",
      "Drainage system",
      "Performance testing",
      "Safety inspection",
    ],
    pricingFactors: [
      {
        factor: "AC Unit Type",
        description: "Split, window, or cassette units have different servicing requirements",
      },
      {
        factor: "Unit Condition",
        description: "Heavily soiled units require more cleaning time",
      },
      {
        factor: "Number of Units",
        description: "Multiple units are serviced at discounted rates",
      },
      {
        factor: "Service Frequency",
        description: "Regular servicing vs. one-time deep service",
      },
    ],
    faqs: [
      {
        question: "How often should I service my AC?",
        answer: "We recommend servicing every 6-12 months, or more frequently if you use it heavily or live in a dusty environment. Regular servicing prevents major issues.",
      },
      {
        question: "What's included in AC servicing?",
        answer: "Complete cleaning of indoor and outdoor units, filter maintenance, coil cleaning, drainage check, performance testing, and safety inspection.",
      },
      {
        question: "Will servicing improve cooling?",
        answer: "Yes, regular servicing removes dirt and debris that reduce efficiency. You should notice improved cooling and lower electricity bills after servicing.",
      },
      {
        question: "Do you replace filters during servicing?",
        answer: "We clean reusable filters and replace disposable ones. Filter replacement cost is included in the service price for standard filters.",
      },
      {
        question: "Can I service my AC myself?",
        answer: "Basic cleaning can be done, but professional servicing includes specialized equipment, refrigerant checks, and safety inspections that require certification.",
      },
      {
        question: "What if you find issues during servicing?",
        answer: "We'll identify any problems and provide a transparent quote for repairs. You can choose to proceed immediately or schedule repairs separately.",
      },
    ],
  },
  "ac-uninstallation": {
    slug: "ac-uninstallation",
    title: "AC Uninstallation",
    subtitle: "Safe removal and proper disposal",
    description: "Professional AC uninstallation service for safe removal of your unit. We handle disconnection, removal, and proper disposal or storage. Perfect for renovations, replacements, or moving.",
    shortDescription: "Safe removal and proper disposal of AC units.",
    startingPrice: "৳1,500",
    heroImage: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&h=600&fit=crop&q=80",
    duration: "2-4 hours",
    included: [
      "Safe refrigerant recovery",
      "Electrical disconnection",
      "Removal of indoor and outdoor units",
      "Removal of mounting brackets",
      "Removal of refrigerant lines",
      "Wall patching (basic)",
      "Clean work area",
      "Proper disposal or storage",
      "Safety compliance",
    ],
    notIncluded: [
      "Wall repair or painting (major)",
      "Electrical panel modifications",
      "AC unit transportation (if moving)",
      "Reinstallation at new location (separate service)",
      "Permit fees (if required)",
      "Disposal fees for old units",
    ],
    coveredAreas: [
      "Indoor unit removal",
      "Outdoor unit removal",
      "Refrigerant line removal",
      "Mounting bracket removal",
      "Electrical disconnection",
      "Basic wall patching",
    ],
    pricingFactors: [
      {
        factor: "AC Unit Type",
        description: "Split units require more work than window units",
      },
      {
        factor: "Installation Complexity",
        description: "Complex installations take longer to remove",
      },
      {
        factor: "Wall Repair Needs",
        description: "Extensive wall repair may cost extra",
      },
      {
        factor: "Refrigerant Recovery",
        description: "Proper refrigerant recovery is required by law",
      },
    ],
    faqs: [
      {
        question: "How long does uninstallation take?",
        answer: "Typically 2-4 hours depending on AC type and installation complexity. We'll provide an accurate estimate during inspection.",
      },
      {
        question: "What happens to the refrigerant?",
        answer: "We safely recover all refrigerant following environmental regulations. It's properly disposed of or recycled by certified facilities.",
      },
      {
        question: "Will you repair the wall after removal?",
        answer: "We provide basic wall patching. Extensive repair or painting is available as an additional service.",
      },
      {
        question: "Can you store my AC for later reinstallation?",
        answer: "Yes, we can safely store your unit if you plan to reinstall it later. Storage fees may apply for extended periods.",
      },
      {
        question: "Do you dispose of old AC units?",
        answer: "Yes, we can arrange proper disposal of old units. Disposal fees may apply depending on unit size and type.",
      },
      {
        question: "What if I want to reinstall the AC later?",
        answer: "We can reinstall your AC at a new location. Reinstallation is a separate service with its own pricing.",
      },
    ],
  },
  "ac-inspection-diagnosis": {
    slug: "ac-inspection-diagnosis",
    title: "AC Inspection & Diagnosis",
    subtitle: "Comprehensive health check for your AC",
    description: "Thorough AC inspection and diagnosis service to identify issues, assess performance, and provide recommendations. Perfect for troubleshooting problems, pre-purchase inspections, or regular health checks.",
    shortDescription: "Comprehensive inspection and diagnosis to identify AC issues and performance.",
    startingPrice: "৳800",
    heroImage: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=600&fit=crop&q=80",
    duration: "1-2 hours",
    included: [
      "Complete visual inspection",
      "Performance testing",
      "Refrigerant level check",
      "Electrical system check",
      "Thermostat and controls testing",
      "Airflow and cooling efficiency test",
      "Noise and vibration assessment",
      "Detailed inspection report",
      "Recommendations and next steps",
      "Transparent cost estimates for any repairs",
    ],
    notIncluded: [
      "Repairs (quoted separately)",
      "Parts replacement",
      "Refrigerant refill",
      "Cleaning services",
      "Warranty on recommendations",
      "Follow-up visits",
    ],
    coveredAreas: [
      "Indoor unit inspection",
      "Outdoor unit inspection",
      "Refrigerant system",
      "Electrical components",
      "Performance metrics",
      "Safety compliance",
    ],
    pricingFactors: [
      {
        factor: "AC Unit Type",
        description: "Different unit types have varying inspection complexity",
      },
      {
        factor: "Number of Units",
        description: "Multiple units inspected at discounted rates",
      },
      {
        factor: "Inspection Depth",
        description: "Basic vs. comprehensive inspection",
      },
      {
        factor: "Access Difficulty",
        description: "Hard-to-reach units may require additional time",
      },
    ],
    faqs: [
      {
        question: "When should I get an AC inspection?",
        answer: "Get an inspection if you notice reduced cooling, strange noises, high bills, or before purchasing a property. Regular inspections every 6-12 months are also recommended.",
      },
      {
        question: "What will the inspection report include?",
        answer: "The report includes current condition, performance metrics, identified issues, safety concerns, and recommendations with cost estimates for any needed repairs.",
      },
      {
        question: "Do I have to proceed with repairs after inspection?",
        answer: "No, the inspection is independent. You'll receive a detailed report and can decide whether to proceed with recommended repairs.",
      },
      {
        question: "How accurate are the cost estimates?",
        answer: "We provide accurate estimates based on standard repair costs. Final pricing may vary slightly based on parts availability and actual work required.",
      },
      {
        question: "Can you inspect ACs before I buy a property?",
        answer: "Yes, we offer pre-purchase AC inspections to help you understand the condition and any potential issues before buying.",
      },
      {
        question: "What if no issues are found?",
        answer: "Great! You'll receive a clean bill of health and recommendations for maintaining optimal performance. The inspection fee still applies.",
      },
    ],
  },
};
