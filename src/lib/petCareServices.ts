export type PetCareServiceData = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  startingPrice: string;
  heroImage: string;
  duration: string;
  included: string[];
  notIncluded: string[];
  serviceDetails: string[];
  careTips: {
    tip: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

export const petCareServicesData: Record<string, PetCareServiceData> = {
  "pet-sitting": {
    slug: "pet-sitting",
    title: "Pet Sitting",
    subtitle: "Loving care in the comfort of your pet's home",
    description: "Our compassionate pet sitting service ensures your beloved companion receives dedicated attention and care while you're away. We maintain their routine, provide companionship, and give you peace of mind knowing they're safe and happy at home.",
    startingPrice: "৳3,500",
    heroImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&h=600&fit=crop&q=80",
    duration: "4-8 hours",
    included: [
      "Personalized care and attention",
      "Feeding according to your schedule",
      "Fresh water always available",
      "Playtime and exercise",
      "Medication administration if needed",
      "Daily updates with photos",
      "Text and call communication",
      "Emergency vet contact",
      "Light housekeeping (feeding areas)",
      "Mail and package collection",
    ],
    notIncluded: [
      "Overnight stays (see Overnight Care service)",
      "Vet transportation (see Vet Visit Assistance)",
      "Multiple pets additional fees apply",
      "Holiday surcharges may apply",
      "Extended stay preparation",
      "Specialized medical care",
    ],
    serviceDetails: [
      "In-home care in your pet's familiar environment",
      "Maintains your pet's daily routine",
      "Reduces stress and anxiety",
      "Customized care based on your pet's needs",
      "Background-checked, trained caregivers",
      "24/7 emergency support available",
    ],
    careTips: [
      {
        tip: "Meet & Greet",
        description: "We schedule a free meet-and-greet so your pet can get comfortable with their caregiver before your trip.",
      },
      {
        tip: "Detailed Instructions",
        description: "We follow your pet's routine exactly as you specify, from feeding times to favorite toys.",
      },
      {
        tip: "Regular Updates",
        description: "Receive daily photos and updates so you can see how your pet is doing while you're away.",
      },
      {
        tip: "Emergency Protocols",
        description: "We have clear emergency procedures and will contact you immediately if anything arises.",
      },
    ],
    faqs: [
      {
        question: "How long can you provide pet sitting services?",
        answer: "We offer pet sitting for any duration, from a few hours to several weeks. Our caregivers can visit once or multiple times per day based on your pet's needs.",
      },
      {
        question: "Will my pet be okay being alone between visits?",
        answer: "We assess each pet's needs individually. For pets that need constant supervision, we can arrange multiple daily visits or recommend our Overnight Care service.",
      },
      {
        question: "Can you administer medication?",
        answer: "Yes, our caregivers are trained in medication administration, including oral medications, injections, and special dietary requirements.",
      },
      {
        question: "What if my pet has special needs?",
        answer: "We specialize in caring for pets with special needs, medical conditions, or behavioral requirements. Just let us know your pet's specific needs during the consultation.",
      },
      {
        question: "How do I know my pet is being well cared for?",
        answer: "You'll receive daily updates with photos and messages. Our caregivers document each visit, and you can always call or text for updates.",
      },
      {
        question: "What happens in an emergency?",
        answer: "We have 24/7 emergency support. If anything happens, we'll contact you immediately and take your pet to their vet or an emergency clinic if needed, following your instructions.",
      },
    ],
  },
  "dog-walking": {
    slug: "dog-walking",
    title: "Dog Walking",
    subtitle: "Daily adventures and exercise for your furry friend",
    description: "Keep your dog happy, healthy, and well-exercised with our professional dog walking service. We match your dog's energy level and personality, ensuring they get the perfect amount of exercise, socialization, and outdoor time.",
    startingPrice: "৳3,000",
    heroImage: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=600&fit=crop&q=80",
    duration: "30-60 minutes",
    included: [
      "Daily or scheduled walks",
      "Exercise and playtime",
      "Fresh water after walks",
      "Basic training reinforcement",
      "Socialization opportunities",
      "Route variety to keep it interesting",
      "Safety equipment provided",
      "Daily walk reports",
      "Photo updates",
      "Flexible scheduling",
    ],
    notIncluded: [
      "Group walks (available on request)",
      "Extended adventure walks",
      "Dog park visits (available as add-on)",
      "Training sessions (separate service)",
      "Transportation services",
      "Overnight care",
    ],
    serviceDetails: [
      "Individual or small group walks",
      "Energy-matched exercise programs",
      "Safety-first approach",
      "Weather-appropriate care",
      "Senior dog-friendly pace",
      "Puppy socialization support",
    ],
    careTips: [
      {
        tip: "Energy Matching",
        description: "We match walkers to your dog's energy level—high-energy dogs get vigorous walks, while seniors enjoy gentle strolls.",
      },
      {
        tip: "Route Safety",
        description: "All routes are pre-planned for safety, avoiding busy streets and hazards while maximizing enjoyment.",
      },
      {
        tip: "Socialization",
        description: "We help socialize your dog safely with other dogs and people when appropriate.",
      },
      {
        tip: "Consistency",
        description: "Your dog will have the same walker consistently, building trust and familiarity.",
      },
    ],
    faqs: [
      {
        question: "How long are the walks?",
        answer: "Standard walks are 30-60 minutes depending on your dog's needs. We can customize the duration based on age, breed, and energy level.",
      },
      {
        question: "Can you walk multiple dogs at once?",
        answer: "Yes, we can walk up to 2-3 dogs from the same household together, or arrange group walks with compatible dogs if requested.",
      },
      {
        question: "What if my dog is reactive or aggressive?",
        answer: "We have experience with reactive dogs and can provide specialized walks with experienced walkers. Please let us know about your dog's behavior during consultation.",
      },
      {
        question: "Do you walk in all weather conditions?",
        answer: "We walk in most weather conditions but prioritize safety. Extreme weather may result in shorter walks or indoor playtime alternatives.",
      },
      {
        question: "Can you walk puppies?",
        answer: "Yes! We offer puppy-specific walks that are shorter in duration and include basic training reinforcement and socialization.",
      },
      {
        question: "What equipment do you provide?",
        answer: "We provide high-quality leashes and can bring treats if approved. We use your dog's regular harness or collar for comfort.",
      },
    ],
  },
  "pet-grooming": {
    slug: "pet-grooming",
    title: "Pet Grooming",
    subtitle: "Gentle grooming that makes your pet look and feel their best",
    description: "Professional grooming service that keeps your pet clean, comfortable, and healthy. We use gentle techniques and pet-safe products to ensure a stress-free grooming experience for dogs, cats, and other pets.",
    startingPrice: "৳2,500",
    heroImage: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&h=600&fit=crop&q=80",
    duration: "1-3 hours",
    included: [
      "Full bath with pet-safe shampoo",
      "Brushing and de-shedding",
      "Nail trimming",
      "Ear cleaning",
      "Hair trimming or styling",
      "Teeth brushing",
      "Sanitary trim",
      "Coat conditioning treatment",
      "Gentle blow-dry",
      "Final inspection",
    ],
    notIncluded: [
      "Medicated baths (available on request)",
      "Flea and tick treatments",
      "Anal gland expression (veterinary procedure)",
      "Nail grinding (available as add-on)",
      "Specialty styling or breed cuts",
      "De-matting severe cases",
    ],
    serviceDetails: [
      "Stress-free grooming environment",
      "Pet-safe, hypoallergenic products",
      "Experienced groomers who understand pet behavior",
      "Customized grooming based on breed and coat type",
      "Senior pet-friendly services",
      "Anxiety-reduction techniques",
    ],
    careTips: [
      {
        tip: "Regular Grooming",
        description: "Regular grooming every 4-8 weeks keeps your pet's coat healthy and reduces matting and shedding.",
      },
      {
        tip: "Breed-Specific Care",
        description: "We tailor grooming techniques to your pet's breed, coat type, and individual needs.",
      },
      {
        tip: "Comfort First",
        description: "We prioritize your pet's comfort, using gentle techniques and positive reinforcement throughout.",
      },
      {
        tip: "Health Monitoring",
        description: "During grooming, we check for skin issues, lumps, or other health concerns and alert you if needed.",
      },
    ],
    faqs: [
      {
        question: "How often should I groom my pet?",
        answer: "Most pets benefit from grooming every 4-8 weeks, though this varies by breed and coat type. Long-haired breeds may need more frequent grooming.",
      },
      {
        question: "Do you groom cats?",
        answer: "Yes, we provide cat grooming services, though cats may require a different approach and sometimes sedation for anxious cats (with vet approval).",
      },
      {
        question: "What if my pet is anxious about grooming?",
        answer: "We're experienced with anxious pets and use gentle techniques, breaks, and positive reinforcement. Severe anxiety may require a veterinarian consultation first.",
      },
      {
        question: "Do you trim nails?",
        answer: "Yes, nail trimming is included in our grooming service. We're careful to avoid the quick and can provide nail grinding for smoother results.",
      },
      {
        question: "What products do you use?",
        answer: "We use high-quality, pet-safe, hypoallergenic products. If your pet has sensitive skin or allergies, we can use your preferred products.",
      },
      {
        question: "How long does grooming take?",
        answer: "Typically 1-3 hours depending on your pet's size, coat condition, and the services requested. We'll give you an estimated time when you book.",
      },
    ],
  },
  "pet-feeding": {
    slug: "pet-feeding",
    title: "Pet Feeding",
    subtitle: "Regular, reliable feeding on schedule",
    description: "Ensure your pet receives timely, proper nutrition with our reliable pet feeding service. We follow your pet's dietary requirements exactly as you specify, maintaining their feeding routine even when you can't be there.",
    startingPrice: "৳2,000",
    heroImage: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=1200&h=600&fit=crop&q=80",
    duration: "15-30 minutes per visit",
    included: [
      "Scheduled feeding times",
      "Exact portion control",
      "Fresh water replacement",
      "Special dietary requirements followed",
      "Feeding area cleanup",
      "Food storage maintenance",
      "Medication with food if needed",
      "Daily feeding reports",
      "Multiple daily visits available",
      "Flexible scheduling",
    ],
    notIncluded: [
      "Food purchase (we use your pet's food)",
      "Meal preparation (pre-prepared meals)",
      "Extended care beyond feeding",
      "Overnight monitoring",
      "Specialized nutritional consultation",
      "Veterinary dietary advice",
    ],
    serviceDetails: [
      "Reliable, punctual feeding",
      "Strict adherence to dietary instructions",
      "Portion control as specified",
      "Special diet handling (prescription, raw, etc.)",
      "Fresh water at every visit",
      "Clean feeding environment maintained",
    ],
    careTips: [
      {
        tip: "Detailed Instructions",
        description: "We follow your feeding instructions precisely—portion sizes, food types, and any special requirements.",
      },
      {
        tip: "Multiple Visits",
        description: "For pets that need multiple meals per day, we can schedule multiple daily visits to maintain their routine.",
      },
      {
        tip: "Special Diets",
        description: "We're experienced with prescription diets, raw food, and other special dietary requirements.",
      },
      {
        tip: "Medication Support",
        description: "We can administer medications that need to be given with food, following your vet's instructions.",
      },
    ],
    faqs: [
      {
        question: "Do you provide pet food?",
        answer: "No, we use your pet's regular food to maintain consistency and avoid digestive issues. Please ensure food is available for our visits.",
      },
      {
        question: "Can you handle special diets?",
        answer: "Absolutely! We're experienced with prescription diets, raw food, special feeding requirements, and dietary restrictions.",
      },
      {
        question: "How many times per day can you feed my pet?",
        answer: "We can schedule multiple daily visits to accommodate your pet's feeding schedule. Many pets are fed 2-3 times per day.",
      },
      {
        question: "What if my pet has medication with meals?",
        answer: "Yes, we can administer medications that need to be given with food, following your veterinarian's instructions exactly.",
      },
      {
        question: "Do you monitor if my pet is eating?",
        answer: "Yes, we observe and report on your pet's eating habits. If there are concerns about appetite, we'll contact you immediately.",
      },
      {
        question: "Can you prepare raw food or special meals?",
        answer: "Yes, we can prepare and serve raw food or special meal preparations according to your instructions, maintaining proper food safety protocols.",
      },
    ],
  },
  "overnight-care": {
    slug: "overnight-care",
    title: "Overnight Pet Care",
    subtitle: "Peaceful overnight stays for complete peace of mind",
    description: "Give your pet the comfort of having someone nearby throughout the night. Our overnight care service ensures your pet sleeps soundly knowing a caring, responsible caregiver is there if needed.",
    startingPrice: "৳4,500",
    heroImage: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=1200&h=600&fit=crop&q=80",
    duration: "Overnight (8-12 hours)",
    included: [
      "Overnight stay in your home",
      "Evening feeding and care",
      "Morning feeding and care",
      "Late-night check-ins",
      "Early morning care",
      "Companionship throughout stay",
      "Daily activity reports",
      "Photo updates morning and evening",
      "Emergency monitoring",
      "Light housekeeping (pet areas)",
    ],
    notIncluded: [
      "Extended daytime hours (see Pet Sitting)",
      "Multiple consecutive nights may vary",
      "Specialized medical care",
      "Training or behavior modification",
      "Transportation services",
      "Holiday surcharges may apply",
    ],
    serviceDetails: [
      "Overnight companionship for anxious pets",
      "Maintains pet's evening and morning routines",
      "Peace of mind knowing someone is nearby",
      "Senior pets who need nighttime attention",
      "Pets with medical needs requiring monitoring",
      "Puppies or newly adopted pets",
    ],
    careTips: [
      {
        tip: "Comfort & Routine",
        description: "Your pet stays in their familiar home environment, maintaining their normal evening and morning routines.",
      },
      {
        tip: "Nighttime Monitoring",
        description: "Our caregivers are available throughout the night if your pet needs attention, medication, or has an emergency.",
      },
      {
        tip: "Senior Pet Care",
        description: "Perfect for senior pets who may need nighttime attention, bathroom breaks, or medication during the night.",
      },
      {
        tip: "Anxiety Support",
        description: "Pets with separation anxiety benefit from having someone nearby throughout the night for comfort.",
      },
    ],
    faqs: [
      {
        question: "What time does overnight care start and end?",
        answer: "Typically from evening (6-8 PM) to morning (7-9 AM), but we can customize timing to fit your pet's routine.",
      },
      {
        question: "Will the caregiver stay the entire night?",
        answer: "Yes, our caregiver stays in your home overnight, sleeping nearby your pet and available if needed during the night.",
      },
      {
        question: "Can this service accommodate multiple pets?",
        answer: "Yes, we can care for multiple pets during overnight stays. Additional fees may apply for households with many pets.",
      },
      {
        question: "What if my pet needs medication during the night?",
        answer: "Our caregivers can administer medications during overnight stays, following your veterinarian's instructions exactly.",
      },
      {
        question: "Do you provide daytime care with overnight?",
        answer: "We focus on overnight care, but can coordinate with daytime pet sitting services if needed for extended periods.",
      },
      {
        question: "Is this suitable for puppies?",
        answer: "Yes! Overnight care is ideal for puppies who need nighttime bathroom breaks, feeding schedules, or companionship.",
      },
    ],
  },
  "vet-assistance": {
    slug: "vet-assistance",
    title: "Vet Visit Assistance",
    subtitle: "Compassionate support during vet visits",
    description: "When your pet needs medical care, we're here to help with transportation, comfort, and support. Our caregivers provide compassionate assistance during vet visits, ensuring your pet feels safe and supported throughout the process.",
    startingPrice: "৳2,500",
    heroImage: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1200&h=600&fit=crop&q=80",
    duration: "2-4 hours",
    included: [
      "Safe pet transportation",
      "Comfort and reassurance during transport",
      "Accompaniment during vet appointment",
      "Assistance with pet handling",
      "Communication with veterinarian",
      "Post-visit care instructions review",
      "Transportation home",
      "Medication pickup if needed",
      "Update report after visit",
      "Follow-up care coordination",
    ],
    notIncluded: [
      "Veterinary fees (you pay vet directly)",
      "Emergency vet visits (specialized service)",
      "Pet ownership authorization",
      "Medical decision-making",
      "Extended waiting times",
      "Multiple appointment coordination",
    ],
    serviceDetails: [
      "Stress-free transportation",
      "Comfort for anxious pets",
      "Clear communication with veterinarians",
      "Support during procedures",
      "Medication and care instruction understanding",
      "Follow-up care assistance",
    ],
    careTips: [
      {
        tip: "Anxiety Reduction",
        description: "Our caregivers help reduce your pet's anxiety during transport and vet visits with calming techniques and familiar presence.",
      },
      {
        tip: "Clear Communication",
        description: "We communicate clearly with veterinarians and ensure you're kept informed about your pet's condition and treatment.",
      },
      {
        tip: "Medical Documentation",
        description: "We take notes during appointments so you have a clear record of what was discussed and prescribed.",
      },
      {
        tip: "Follow-Up Support",
        description: "We help ensure medication and care instructions are understood and can assist with follow-up care as needed.",
      },
    ],
    faqs: [
      {
        question: "Can you transport my pet to the vet?",
        answer: "Yes, we provide safe, comfortable transportation to and from veterinary appointments using pet-safe vehicles.",
      },
      {
        question: "What if my pet is very anxious about vet visits?",
        answer: "We're experienced with anxious pets and use calming techniques, familiar scents, and comforting presence to help reduce stress.",
      },
      {
        question: "Can you authorize medical treatment?",
        answer: "No, only the pet owner can authorize medical treatment. We can facilitate communication between you and the vet if you're not present.",
      },
      {
        question: "Do you pick up prescriptions?",
        answer: "Yes, we can pick up prescribed medications and ensure you understand administration instructions.",
      },
      {
        question: "What if it's an emergency?",
        answer: "For emergencies, we can transport your pet to an emergency clinic and contact you immediately. We prioritize your pet's safety.",
      },
      {
        question: "Can you help with follow-up care?",
        answer: "Yes, we can assist with post-visit care, medication administration, and follow-up appointments as needed.",
      },
    ],
  },
};
