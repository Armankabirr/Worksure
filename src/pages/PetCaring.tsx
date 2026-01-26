import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Heart, 
  ShieldCheck, 
  Award, 
  Clock, 
  Users, 
  Sparkles, 
  PawPrint,
  Dog,
  Cat,
  Bird,
  Stethoscope,
  Moon,
  UtensilsCrossed
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type ServiceType = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  price: string;
  image: string;
  slug: string;
  color: string;
};

const PetCaring = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { authStatus, openLogin } = useAuth();
  const [happyPetsCount, setHappyPetsCount] = useState(0);
  const [trustedCaregiversCount, setTrustedCaregiversCount] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          // Animate Happy Pets (1250+)
          let count = 0;
          const petInterval = setInterval(() => {
            count += 50;
            setHappyPetsCount(Math.min(count, 1250));
            if (count >= 1250) clearInterval(petInterval);
          }, 25);

          // Animate Trusted Caregivers (85+)
          let caregiverCount = 0;
          const caregiverInterval = setInterval(() => {
            caregiverCount++;
            setTrustedCaregiversCount(Math.min(caregiverCount, 85));
            if (caregiverCount >= 85) clearInterval(caregiverInterval);
          }, 35);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleBookPetCare = (serviceSlug?: string) => {
    const query = serviceSlug
      ? `/search/workers?serviceType=pet-caring&service=${serviceSlug}`
      : "/search/workers?serviceType=pet-caring";

    if (authStatus !== "authenticated") {
      openLogin();
      return;
    }

    navigate(query);
  };

  const handleViewDetails = (slug: string) => {
    navigate(`/pet-care/${slug}`);
  };

  const handleBookService = (slug: string) => {
    if (authStatus !== "authenticated") {
      openLogin();
      return;
    }
    navigate(`/search/workers?serviceType=pet-caring&service=${slug}`);
  };

  const handleAddToCart = (service: ServiceType) => {
    const priceMatch = service.price.match(/\d+/);
    const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, "")) : 0;

    addToCart({
      serviceType: "pet-caring",
      serviceName: service.title,
      price: price,
      description: service.description,
      image: service.image,
    });

    toast.success(`${service.title} added to cart!`, {
      description: "Your pet's care is just one step away.",
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
    });
  };

  const services: ServiceType[] = [
    {
      icon: Heart,
      title: "Pet Sitting",
      description: "Loving care in the comfort of your pet's home. We'll keep them happy, safe, and stress-free while you're away.",
      price: "From ৳3,500",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&q=80",
      slug: "pet-sitting",
      color: "from-pink-400 to-rose-400",
    },
    {
      icon: PawPrint,
      title: "Dog Walking",
      description: "Daily adventures and exercise for your furry friend. We match your dog's energy and personality perfectly.",
      price: "From ৳3,000",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop&q=80",
      slug: "dog-walking",
      color: "from-orange-300 to-amber-300",
    },
    {
      icon: Sparkles,
      title: "Pet Grooming",
      description: "Gentle grooming that makes your pet look and feel their absolute best. Professional care with a gentle touch.",
      price: "From ৳2,500",
      image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=600&fit=crop&q=80",
      slug: "pet-grooming",
      color: "from-purple-300 to-pink-300",
    },
    {
      icon: UtensilsCrossed,
      title: "Pet Feeding",
      description: "Regular, reliable feeding on schedule. We follow your pet's dietary needs exactly as you specify.",
      price: "From ৳2,000",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&h=600&fit=crop&q=80",
      slug: "pet-feeding",
      color: "from-amber-300 to-yellow-300",
    },
    {
      icon: Moon,
      title: "Overnight Pet Care",
      description: "Peaceful overnight stays. Your pet sleeps soundly knowing someone caring is nearby throughout the night.",
      price: "From ৳4,500",
      image: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&h=600&fit=crop&q=80",
      slug: "overnight-care",
      color: "from-indigo-300 to-blue-300",
    },
    {
      icon: Stethoscope,
      title: "Vet Visit Assistance",
      description: "Compassionate support during vet visits. We help transport and comfort your pet when they need medical care.",
      price: "From ৳2,500",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop&q=80",
      slug: "vet-assistance",
      color: "from-teal-300 to-cyan-300",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Choose Care Type",
      description: "Select the perfect care service for your pet's unique needs and personality.",
      icon: Heart,
      color: "bg-pink-100 text-pink-600",
    },
    {
      step: "02",
      title: "Meet Your Caregiver",
      description: "We match you with a verified, animal-loving caregiver who fits your pet perfectly.",
      icon: Users,
      color: "bg-orange-100 text-orange-600",
    },
    {
      step: "03",
      title: "Relax — Your Pet is Safe",
      description: "Enjoy peace of mind knowing your beloved companion is in caring, capable hands.",
      icon: ShieldCheck,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  const trustFeatures = [
    {
      icon: ShieldCheck,
      title: "Background-Checked Caregivers",
      description: "Every caregiver undergoes thorough background checks, criminal record verification, and reference validation. Your pet's safety is our highest priority.",
      color: "text-blue-500",
    },
    {
      icon: Award,
      title: "Animal Handling Training",
      description: "Our team receives specialized training in pet behavior, first aid, and emergency protocols. We understand animals deeply and respond with expertise.",
      color: "text-pink-500",
    },
    {
      icon: Clock,
      title: "Emergency Protocols",
      description: "24/7 support and clear emergency procedures. If anything happens, we know exactly what to do and who to call—including your vet.",
      color: "text-amber-500",
    },
    {
      icon: Sparkles,
      title: "Hygiene & Safety Standards",
      description: "Strict cleanliness protocols, health certifications, and pet-friendly environments. We maintain the highest standards of care and cleanliness.",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50/30 to-amber-50 pt-20">
      <Header />
      
      <main className="overflow-hidden">
        {/* Hero Section - Emotional Entry */}
        <section className="relative overflow-hidden">
          {/* Soft gradient backgrounds */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute top-40 right-20 w-80 h-80 bg-orange-200/40 rounded-full blur-3xl animate-float-slower" />
            <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl animate-float-slow" />
          </div>

          <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
                <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-pink-100 to-orange-100 px-6 py-3 border border-pink-200/50">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <span className="text-sm font-semibold text-pink-700 tracking-wide">Loving Pet Care Services</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="text-gray-900">Loving Care for Your Pets,</span>
                  <span className="block bg-gradient-to-r from-pink-500 via-orange-500 to-amber-500 bg-clip-text text-transparent mt-2">
                    Like Family
                  </span>
                </h1>

                <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
                  Because your pet deserves the very best care. Our compassionate, trained caregivers treat your furry, feathered, or scaled family members with the same love and attention you would.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Button
                    size="lg"
                    onClick={() => handleBookPetCare()}
                    className="rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Book Pet Care
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      const servicesSection = document.getElementById("services-section");
                      servicesSection?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="rounded-full border-2 border-pink-300 text-pink-700 hover:bg-pink-50 px-10 py-6 text-lg font-semibold"
                  >
                    View Services
                  </Button>
                </div>

                {/* Trust Stats */}
                <div className="grid grid-cols-2 gap-6 pt-8" ref={statsRef}>
                  <Card className="border-none bg-white/80 backdrop-blur-sm shadow-soft rounded-3xl animate-fade-up" style={{ animationDelay: "200ms" }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-pink-100">
                          <PawPrint className="h-6 w-6 text-pink-600" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Happy Pets</p>
                          <CardTitle className="text-4xl font-bold text-gray-900 mt-1">{happyPetsCount.toLocaleString()}+</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600">Pets cared for with love and compassion</p>
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-white/80 backdrop-blur-sm shadow-soft rounded-3xl animate-fade-up" style={{ animationDelay: "300ms" }}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-orange-100">
                          <Users className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trusted Caregivers</p>
                          <CardTitle className="text-4xl font-bold text-gray-900 mt-1">{trustedCaregiversCount}+</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600">Background-checked, trained professionals</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right Hero Image */}
              <div className="relative animate-fade-up" style={{ animationDelay: "150ms" }}>
                <div className="absolute -inset-6 bg-gradient-to-tr from-pink-200/50 via-orange-200/50 to-amber-200/50 rounded-[3rem] blur-2xl animate-float-slower" />
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                  <div className="grid grid-cols-2 gap-3 p-3 bg-white">
                    <div className="relative h-64 rounded-3xl overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=800&fit=crop&q=80" 
                        alt="Happy dog with caregiver" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1551717743-49959800b1f6?w=600&h=800&fit=crop&q=80";
                        }}
                      />
                    </div>
                    <div className="relative h-64 rounded-3xl overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=800&fit=crop&q=80" 
                        alt="Cute cat being cared for" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=800&fit=crop&q=80";
                        }}
                      />
                    </div>
                    <div className="relative h-64 rounded-3xl overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&h=800&fit=crop&q=80" 
                        alt="Pet care professional" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=800&fit=crop&q=80";
                        }}
                      />
                    </div>
                    <div className="relative h-64 rounded-3xl overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1583336663277-620dc1996580?w=600&h=800&fit=crop&q=80" 
                        alt="Happy pets together" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=800&fit=crop&q=80";
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border-2 border-pink-200 animate-float-slow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500">
                      <ShieldCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Safety First</p>
                      <p className="text-sm font-bold text-gray-900">100% Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section - Card Based, Fancy */}
        <section id="services-section" className="container mx-auto px-6 py-20">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-pink-500" />
              <span className="text-xs font-semibold text-pink-700 uppercase tracking-wider">Our Care Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">
              Complete Care for Your Beloved Pets
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              From daily walks to overnight stays, we offer compassionate, professional care that keeps your pets happy, healthy, and safe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.title}
                  className="group border-none bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-up shadow-soft"
                  style={{ animationDelay: `${150 + index * 100}ms` }}
                  onClick={() => handleViewDetails(service.slug)}
                >
                  {/* Service Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        // Pet-safe fallback: default pet care image
                        e.currentTarget.src = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&q=80";
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-4 right-4 p-3 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-gray-800" />
                    </div>
                  </div>

                  {/* Content */}
                  <CardHeader className="pb-4 pt-6">
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                        {service.price}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        className="flex-1 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(service.slug);
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full border-2 border-pink-300 text-pink-700 hover:bg-pink-50 font-semibold py-6 px-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookPetCare(service.slug);
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Trust & Safety Section - Critical */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 mb-4">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Trust & Safety</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">
                Your Pet's Safety is Our Highest Priority
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We go above and beyond to ensure every pet receives care from trustworthy, qualified professionals. Your peace of mind matters to us.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trustFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="border-none bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-soft hover:shadow-xl transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${200 + index * 100}ms` }}
                  >
                    <div className="flex items-start gap-5">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color.replace('text-', 'bg-')}/10`}>
                        <Icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</CardTitle>
                        <CardDescription className="text-gray-600 leading-relaxed text-base">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works - Simple & Calm */}
        <section className="container mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 mb-4">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Three simple steps to connect your pet with loving, professional care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="relative animate-fade-up"
                  style={{ animationDelay: `${250 + index * 150}ms` }}
                >
                  {/* Connector Line (hidden on mobile) */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-pink-200 via-orange-200 to-amber-200 z-0" style={{ width: 'calc(100% - 4rem)' }} />
                  )}

                  <Card className="relative z-10 border-none bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-soft hover:shadow-xl transition-all duration-300 text-center h-full">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.color} mb-6 mx-auto`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="text-6xl font-bold text-gray-200 mb-4">{step.step}</div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-3">{step.title}</CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed text-base">
                      {step.description}
                    </CardDescription>
                  </Card>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-12 animate-fade-up" style={{ animationDelay: "650ms" }}>
            <Button
              size="lg"
              onClick={() => handleBookPetCare()}
              className="rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Button>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gradient-to-br from-gray-50 to-white py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="space-y-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
                <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 mb-4">
                  <Heart className="h-4 w-4 text-pink-600" />
                  <span className="text-xs font-semibold text-pink-700 uppercase tracking-wider">Questions?</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We're here to help. If you have any other questions about our pet care services, please don't hesitate to reach out.
                </p>
              </div>

              <Accordion type="single" collapsible className="w-full animate-fade-up" style={{ animationDelay: "200ms" }}>
                <AccordionItem value="item-1" className="border-none bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-4 shadow-soft">
                  <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline">
                    Are your caregivers background checked?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pt-2">
                    Absolutely. Every caregiver undergoes comprehensive background checks, criminal record verification, and reference validation before joining our team. Your pet's safety is non-negotiable.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-none bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-4 shadow-soft">
                  <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline">
                    What if my pet has special needs or medical requirements?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pt-2">
                    We specialize in caring for pets with special needs. Our caregivers are trained in medication administration, dietary restrictions, and handling pets with various medical conditions. We work closely with you and your vet to ensure continuity of care.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-none bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-4 shadow-soft">
                  <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline">
                    How do you handle emergencies?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pt-2">
                    Every caregiver has access to our 24/7 emergency support line. We have clear protocols for medical emergencies, natural disasters, and other urgent situations. We'll contact you immediately and coordinate with your vet if needed.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-none bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-soft">
                  <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline">
                    Can I meet my caregiver before booking?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pt-2">
                    Yes! We highly encourage a meet-and-greet session so your pet can get comfortable with their caregiver. This helps ensure a perfect match and gives you peace of mind before leaving your pet in their care.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-pink-500 via-orange-500 to-amber-500 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Give Your Pet the Best Care?
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Join thousands of pet parents who trust us with their furry, feathered, and scaled family members.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={() => handleBookPetCare()}
                  className="rounded-full bg-white text-pink-600 hover:bg-gray-50 px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Book Pet Care Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const servicesSection = document.getElementById("services-section");
                    servicesSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="rounded-full border-2 border-white text-white hover:bg-white/10 px-10 py-6 text-lg font-semibold backdrop-blur-sm"
                >
                  Explore Services
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PetCaring;
