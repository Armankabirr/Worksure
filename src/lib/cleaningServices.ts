export type CleaningServiceData = {
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

export const cleaningServicesData: Record<string, CleaningServiceData> = {
  "deep-cleaning": {
    slug: "deep-cleaning",
    title: "Deep Cleaning",
    subtitle: "Transform your space with our comprehensive deep cleaning service",
    description: "Our professional deep cleaning service ensures every corner of your home or office receives thorough attention. We use eco-friendly products and proven techniques to deliver spotless results that exceed expectations.",
    startingPrice: "৳1,200",
    heroImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=600&fit=crop&q=80",
    duration: "4-6 hours",
    included: [
      "Complete room-by-room deep cleaning",
      "Kitchen deep clean (appliances, cabinets, countertops)",
      "Bathroom sanitization (tiles, fixtures, mirrors)",
      "Baseboards and window sills cleaning",
      "Inside appliances cleaning (oven, refrigerator, microwave)",
      "Dusting all surfaces including ceiling fans and light fixtures",
      "Floor vacuuming and mopping",
      "Eco-friendly cleaning products",
      "Post-cleaning inspection and quality check",
    ],
    notIncluded: [
      "Exterior window cleaning (available as add-on)",
      "Carpet steam cleaning (separate service)",
      "Upholstery cleaning (separate service)",
      "Deep carpet stain removal",
      "Wall washing or painting",
      "Organization or decluttering services",
    ],
    coveredAreas: [
      "Living room and common areas",
      "Bedrooms (all surfaces and fixtures)",
      "Kitchen (appliances, cabinets, countertops)",
      "Bathrooms (tiles, fixtures, mirrors, grout)",
      "Dining area",
      "Hallways and entryways",
      "Baseboards and trim",
      "Light fixtures and ceiling fans",
      "Window sills and frames",
      "Inside appliances",
    ],
    pricingFactors: [
      {
        factor: "Property Size",
        description: "Larger homes require more time and supplies",
      },
      {
        factor: "Number of Rooms",
        description: "Each additional room adds to the service time",
      },
      {
        factor: "Condition of Space",
        description: "Heavily soiled areas may require extra attention",
      },
      {
        factor: "Additional Services",
        description: "Add-ons like inside oven cleaning or refrigerator deep clean",
      },
    ],
    faqs: [
      {
        question: "How long does a deep cleaning service take?",
        answer: "A standard deep cleaning service typically takes 4-6 hours, depending on the size of your property and the number of rooms. Our team will provide an estimated timeline during the initial consultation.",
      },
      {
        question: "What cleaning products do you use?",
        answer: "We use eco-friendly, non-toxic cleaning products that are safe for your family, pets, and the environment. All products are professional-grade and effective at removing dirt, grime, and bacteria.",
      },
      {
        question: "Do I need to be present during the cleaning?",
        answer: "No, you don't need to be present. However, we recommend being available for the initial walkthrough to discuss specific areas of focus. You can also provide access instructions if you won't be home.",
      },
      {
        question: "What should I do to prepare for deep cleaning?",
        answer: "Please remove any personal items, valuables, or breakables from surfaces. Clear countertops and tables of small items. Our team will handle the rest, including moving furniture (within reason) to clean underneath.",
      },
      {
        question: "Is deep cleaning suitable for move-in/move-out?",
        answer: "Yes! Our deep cleaning service is perfect for move-in/move-out situations. We also offer a specialized move-in/move-out cleaning service with additional features like carpet cleaning and detailed inspection reports.",
      },
      {
        question: "What if I'm not satisfied with the cleaning?",
        answer: "We guarantee 100% satisfaction. If you're not happy with any aspect of our service, contact us within 24 hours and we'll return to address your concerns at no additional charge.",
      },
    ],
  },
  "move-in-out": {
    slug: "move-in-out",
    title: "Move-In/Move-Out Cleaning",
    subtitle: "Perfect for new beginnings or end-of-lease requirements",
    description: "Comprehensive cleaning service designed for moving situations. We ensure your space is spotless whether you're moving in or moving out, meeting all lease requirements and exceeding expectations.",
    startingPrice: "৳1,800",
    heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop&q=80",
    duration: "5-7 hours",
    included: [
      "Full interior deep cleaning",
      "Cabinets and closets cleaned inside and out",
      "All appliances cleaned inside and out",
      "Windows and window frames",
      "Carpet cleaning included",
      "Baseboards and trim cleaning",
      "Light fixtures and ceiling fans",
      "Move-out inspection report",
      "Eco-friendly cleaning products",
    ],
    notIncluded: [
      "Exterior window cleaning (available as add-on)",
      "Wall painting or repairs",
      "Carpet replacement",
      "Appliance repairs",
      "Heavy furniture moving",
      "Organization services",
    ],
    coveredAreas: [
      "All rooms and common areas",
      "Kitchen (complete deep clean)",
      "Bathrooms (full sanitization)",
      "Bedrooms and closets",
      "Living and dining areas",
      "Windows and frames",
      "Baseboards throughout",
      "Light fixtures",
      "Inside all appliances",
    ],
    pricingFactors: [
      {
        factor: "Property Size",
        description: "Larger properties require more time and resources",
      },
      {
        factor: "Number of Rooms",
        description: "Each room adds to the total service time",
      },
      {
        factor: "Condition Assessment",
        description: "Heavily soiled spaces may need extra attention",
      },
      {
        factor: "Additional Services",
        description: "Carpet cleaning, window cleaning, or other add-ons",
      },
    ],
    faqs: [
      {
        question: "How long does move-in/move-out cleaning take?",
        answer: "Typically 5-7 hours depending on property size and condition. We'll provide an accurate estimate during consultation.",
      },
      {
        question: "Will this meet my lease requirements?",
        answer: "Yes, our service is designed to meet standard lease cleaning requirements. We can also provide a detailed inspection report for your landlord.",
      },
      {
        question: "Do you clean inside appliances?",
        answer: "Yes, we clean inside all appliances including refrigerator, oven, microwave, and dishwasher as part of the service.",
      },
      {
        question: "Can I schedule this before I move out?",
        answer: "Absolutely! We recommend scheduling 1-2 days before your move-out date to ensure everything is ready for inspection.",
      },
      {
        question: "What if the landlord isn't satisfied?",
        answer: "We guarantee our work. If your landlord has concerns, contact us within 48 hours and we'll return to address any issues at no additional charge.",
      },
      {
        question: "Do you provide a cleaning receipt?",
        answer: "Yes, we provide a detailed receipt and inspection report that you can submit to your landlord or property manager.",
      },
    ],
  },
  "office-cleaning": {
    slug: "office-cleaning",
    title: "Office Cleaning",
    subtitle: "Professional cleaning for commercial spaces and offices",
    description: "Keep your workplace spotless and professional with our comprehensive office cleaning service. We understand the importance of a clean, healthy work environment and deliver consistent, reliable results.",
    startingPrice: "৳1,500",
    heroImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop&q=80",
    duration: "2-4 hours",
    included: [
      "Desk and workstation cleaning",
      "Restroom sanitization",
      "Kitchen and break room cleaning",
      "Floor vacuuming and mopping",
      "Trash removal and recycling",
      "Surface dusting",
      "Window cleaning (interior)",
      "Flexible scheduling options",
      "Eco-friendly products",
    ],
    notIncluded: [
      "Exterior window cleaning",
      "Carpet steam cleaning",
      "Deep upholstery cleaning",
      "Equipment maintenance",
      "After-hours emergency cleaning",
      "Specialized sanitization (available as add-on)",
    ],
    coveredAreas: [
      "Workstations and desks",
      "Common areas and lobbies",
      "Restrooms",
      "Kitchen and break rooms",
      "Conference rooms",
      "Reception areas",
      "Hallways",
      "Storage areas",
    ],
    pricingFactors: [
      {
        factor: "Office Size",
        description: "Square footage determines base pricing",
      },
      {
        factor: "Number of Workstations",
        description: "More workstations require additional cleaning time",
      },
      {
        factor: "Frequency",
        description: "Regular maintenance vs. one-time deep clean",
      },
      {
        factor: "Special Requirements",
        description: "Medical facilities, labs, or specialized cleaning needs",
      },
    ],
    faqs: [
      {
        question: "Can you work around our business hours?",
        answer: "Yes, we offer flexible scheduling including evenings and weekends to minimize disruption to your business operations.",
      },
      {
        question: "Do you provide regular maintenance cleaning?",
        answer: "Absolutely! We offer weekly, bi-weekly, and monthly cleaning schedules tailored to your office needs.",
      },
      {
        question: "Are your products safe for office equipment?",
        answer: "Yes, we use safe, non-abrasive cleaning products that won't damage computers, electronics, or office furniture.",
      },
      {
        question: "What about confidential documents?",
        answer: "We respect your privacy and confidentiality. Our team is trained to handle sensitive materials appropriately and never touches or moves documents without permission.",
      },
      {
        question: "Do you clean restrooms and kitchens?",
        answer: "Yes, restroom and kitchen cleaning are included in our standard office cleaning service.",
      },
      {
        question: "Can we get a custom cleaning schedule?",
        answer: "Yes, we work with you to create a custom cleaning schedule that fits your business needs and budget.",
      },
    ],
  },
  "regular-cleaning": {
    slug: "regular-cleaning",
    title: "Regular Maintenance Cleaning",
    subtitle: "Keep your space consistently spotless",
    description: "Maintain a clean, healthy environment with our regular maintenance cleaning service. Perfect for busy households and offices that need consistent, reliable cleaning on a weekly or bi-weekly basis.",
    startingPrice: "৳800",
    heroImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=600&fit=crop&q=80",
    duration: "2-3 hours",
    included: [
      "Regular vacuuming and mopping",
      "Bathroom and kitchen cleaning",
      "Dusting all surfaces",
      "Trash removal",
      "Surface sanitization",
      "Mirror and glass cleaning",
      "Consistent schedule",
      "Same cleaner assigned",
      "Eco-friendly products",
    ],
    notIncluded: [
      "Deep cleaning tasks",
      "Inside appliance cleaning",
      "Window cleaning",
      "Carpet steam cleaning",
      "Organization services",
      "Heavy-duty scrubbing",
    ],
    coveredAreas: [
      "Living areas",
      "Bedrooms",
      "Kitchen surfaces",
      "Bathrooms",
      "Common areas",
      "Floors",
      "Surfaces and fixtures",
    ],
    pricingFactors: [
      {
        factor: "Property Size",
        description: "Larger spaces require more time",
      },
      {
        factor: "Frequency",
        description: "Weekly vs. bi-weekly affects pricing",
      },
      {
        factor: "Number of Rooms",
        description: "More rooms mean more cleaning time",
      },
      {
        factor: "Special Requests",
        description: "Additional tasks beyond standard maintenance",
      },
    ],
    faqs: [
      {
        question: "How often can I schedule regular cleaning?",
        answer: "We offer weekly, bi-weekly, or monthly cleaning schedules. You can choose the frequency that works best for your needs.",
      },
      {
        question: "Will I have the same cleaner each time?",
        answer: "Yes, we assign a consistent cleaner to your account so you can build a relationship and they can learn your preferences.",
      },
      {
        question: "What's the difference between regular and deep cleaning?",
        answer: "Regular cleaning focuses on maintenance tasks like vacuuming, mopping, and surface cleaning. Deep cleaning includes detailed tasks like inside appliances, baseboards, and thorough sanitization.",
      },
      {
        question: "Can I skip a scheduled cleaning?",
        answer: "Yes, you can reschedule or skip cleanings with 24-hour notice. We're flexible with your schedule.",
      },
      {
        question: "What if I need extra cleaning one week?",
        answer: "You can always request additional services or upgrade to a deep clean for that visit. Just let us know in advance.",
      },
      {
        question: "Do you bring your own supplies?",
        answer: "Yes, we bring all necessary cleaning supplies and equipment. You don't need to provide anything.",
      },
    ],
  },
  "carpet-upholstery": {
    slug: "carpet-upholstery",
    title: "Carpet & Upholstery Cleaning",
    subtitle: "Professional steam and dry cleaning for fabrics",
    description: "Restore your carpets, sofas, and upholstery to like-new condition with our professional steam and dry cleaning service. We use advanced techniques to remove stains, odors, and allergens.",
    startingPrice: "৳950",
    heroImage: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1200&h=600&fit=crop&q=80",
    duration: "2-4 hours",
    included: [
      "Professional steam cleaning",
      "Stain removal treatment",
      "Deodorizing and sanitizing",
      "Fabric protection application",
      "Furniture moving and replacement",
      "Quick-dry service available",
      "Pre-treatment of stains",
      "Deep extraction cleaning",
    ],
    notIncluded: [
      "Carpet replacement",
      "Major repairs",
      "Pet damage repair",
      "Odor removal from subfloor",
      "Furniture disassembly",
      "Same-day service (available with notice)",
    ],
    coveredAreas: [
      "Carpets and rugs",
      "Sofas and couches",
      "Chairs and ottomans",
      "Curtains and drapes",
      "Mattresses",
      "Upholstered headboards",
    ],
    pricingFactors: [
      {
        factor: "Square Footage",
        description: "Carpet area determines base price",
      },
      {
        factor: "Number of Pieces",
        description: "Each upholstery piece adds to cost",
      },
      {
        factor: "Stain Severity",
        description: "Heavy stains may require extra treatment",
      },
      {
        factor: "Fabric Type",
        description: "Delicate fabrics may need specialized care",
      },
    ],
    faqs: [
      {
        question: "How long does it take for carpets to dry?",
        answer: "Typically 4-6 hours with our quick-dry service. We use professional equipment to minimize drying time.",
      },
      {
        question: "Will you move furniture?",
        answer: "Yes, we'll move furniture to clean underneath and replace it after cleaning. Heavy items may require additional assistance.",
      },
      {
        question: "Can you remove pet stains and odors?",
        answer: "Yes, we use specialized treatments for pet stains and odors. However, severe cases may require multiple treatments.",
      },
      {
        question: "Is steam cleaning safe for all fabrics?",
        answer: "We assess each fabric type and use appropriate cleaning methods. Delicate fabrics may require dry cleaning instead.",
      },
      {
        question: "How often should I clean my carpets?",
        answer: "We recommend professional cleaning every 6-12 months, or more frequently in high-traffic areas or homes with pets.",
      },
      {
        question: "Do you offer fabric protection?",
        answer: "Yes, we can apply fabric protection treatment to help prevent future stains and extend the life of your upholstery.",
      },
    ],
  },
  "window-cleaning": {
    slug: "window-cleaning",
    title: "Window Cleaning",
    subtitle: "Crystal-clear windows for homes and businesses",
    description: "Professional window cleaning service for both interior and exterior windows. We deliver streak-free, spotless results that let natural light shine through beautifully.",
    startingPrice: "৳650",
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop&q=80",
    duration: "1-3 hours",
    included: [
      "Inside and outside window cleaning",
      "Window frames and sills",
      "Streak-free finish guarantee",
      "Screen cleaning included",
      "Hard-to-reach windows",
      "Eco-friendly cleaning solutions",
      "Tracks and sills cleaning",
      "Mirror cleaning",
    ],
    notIncluded: [
      "Window repairs",
      "Screen replacement",
      "Storm window cleaning",
      "Skylight cleaning (available as add-on)",
      "Pressure washing",
      "Gutter cleaning",
    ],
    coveredAreas: [
      "All windows",
      "Window frames",
      "Window sills and tracks",
      "Screens",
      "Mirrors",
      "Glass doors",
    ],
    pricingFactors: [
      {
        factor: "Number of Windows",
        description: "More windows increase total cost",
      },
      {
        factor: "Window Size",
        description: "Large or specialty windows cost more",
      },
      {
        factor: "Access Difficulty",
        description: "High or hard-to-reach windows may cost extra",
      },
      {
        factor: "Interior and Exterior",
        description: "Both sides cleaned as standard",
      },
    ],
    faqs: [
      {
        question: "Do you clean both inside and outside?",
        answer: "Yes, our standard service includes cleaning both interior and exterior windows for a complete, streak-free finish.",
      },
      {
        question: "How do you reach high windows?",
        answer: "We use professional equipment including extension poles and ladders. For very high windows, we may use specialized equipment.",
      },
      {
        question: "Will you clean window screens?",
        answer: "Yes, we remove, clean, and replace window screens as part of our standard service.",
      },
      {
        question: "What about window tracks and sills?",
        answer: "Yes, we clean window tracks, sills, and frames to ensure a complete cleaning job.",
      },
      {
        question: "Can you clean skylights?",
        answer: "Yes, skylight cleaning is available as an add-on service. Please mention this when booking.",
      },
      {
        question: "How often should windows be cleaned?",
        answer: "We recommend professional cleaning every 3-6 months, or more frequently for commercial properties or homes in dusty areas.",
      },
    ],
  },
};
