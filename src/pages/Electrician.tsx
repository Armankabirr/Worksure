import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BadgeCheck, Bolt, Home, ShieldCheck, Zap, Eye } from "lucide-react";
import heroImage from "@/assets/electrician.jpg";
import teamImage from "@/assets/security-tech.jpg";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { electricianServicesData } from "@/lib/electricianServices";

type ServiceType = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  price: string;
  cta: string;
  bgColor: string;
  image: string;
  slug: string;
  included: string[];
};

const Electrician = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [certifiedCount, setCertifiedCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          // Animate Certified Team (64+)
          let count = 0;
          const certInterval = setInterval(() => {
            count++;
            setCertifiedCount(Math.min(count, 64));
            if (count >= 64) clearInterval(certInterval);
          }, 30);

          // Animate Jobs Completed (2649+)
          let jobCount = 0;
          const jobInterval = setInterval(() => {
            jobCount += 40;
            setJobsCount(Math.min(jobCount, 2649));
            if (jobCount >= 2649) clearInterval(jobInterval);
          }, 30);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleBookNow = (serviceSlug?: string) => {
    const query = serviceSlug 
      ? `/search/workers?serviceType=electrician&service=${serviceSlug}`
      : "/search/workers?serviceType=electrician";
    navigate(query);
  };

  const handleBookNowClick = () => handleBookNow();

  const handleAddToCart = (service: typeof services[0]) => {
    // Extract numeric price from "From ৳580" format
    const priceMatch = service.price.match(/\d+/);
    const price = priceMatch ? parseInt(priceMatch[0]) : 0;

    addToCart({
      serviceType: "electrician",
      serviceName: service.title,
      price: price,
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

  const howItWorks = [
    {
      title: "Choose Your Service",
      description: "Select from repairs, installations, wiring, lighting, or safety inspections.",
    },
    {
      title: "Book Schedule",
      description: "Pick a convenient time slot — same day and flexible scheduling available.",
    },
    {
      title: "Our Team Arrives",
      description: "Licensed electricians arrive with proper tools, fix issues safely, and verify everything works before leaving.",
    },
  ];

  const services: ServiceType[] = [
    {
      icon: Bolt,
      title: "Electrical Repair",
      description: "Troubleshooting, outlet fixes, breaker trips, and small faults.",
      price: "From ৳580",
      cta: "Book Now",
      bgColor: "from-orange-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&q=80",
      slug: "electrical-repair",
      included: [
        "Troubleshooting and diagnosis",
        "Outlet and switch repairs",
        "Breaker trip resolution",
        "Safety testing and verification",
        "Code-compliant repairs",
        "Clean work area guarantee",
      ],
    },
    {
      icon: Home,
      title: "Wiring & Installation",
      description: "New room wiring, extensions, and safe cable management.",
      price: "From ৳2,290",
      cta: "Book Now",
      bgColor: "from-blue-500 to-blue-600",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop&q=80",
      slug: "wiring-installation",
      included: [
        "New room wiring",
        "Circuit extensions",
        "Safe cable management",
        "Code-compliant installation",
        "Panel connections",
        "Safety testing",
      ],
    },
    {
      icon: Zap,
      title: "Lighting Installation",
      description: "Indoor, outdoor, and smart lighting with neat finishing.",
      price: "From ৳790",
      cta: "Book Now",
      bgColor: "from-yellow-500 to-yellow-600",
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop&q=80",
      slug: "lighting-installation",
      included: [
        "Fixture installation",
        "Wiring connections",
        "Switch installation",
        "Dimmer setup",
        "Safety testing",
        "Neat finishing",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Switch & Socket Repair",
      description: "Fix loose, burnt, or non-responsive switches and sockets.",
      price: "From ৳600",
      cta: "Book Now",
      bgColor: "from-red-500 to-red-600",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&q=80",
      slug: "switch-socket-repair",
      included: [
        "Switch repair and replacement",
        "Socket repair and replacement",
        "Continuity testing",
        "Terminal tightening",
        "Safety checks",
        "Functional testing",
      ],
    },
    {
      icon: BadgeCheck,
      title: "Electrical Safety Inspection",
      description: "Comprehensive safety checks, earthing verification, and compliance testing.",
      price: "From ৳1,390",
      cta: "Book Now",
      bgColor: "from-green-500 to-green-600",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80",
      slug: "electrical-safety-inspection",
      included: [
        "Complete system inspection",
        "Earthing and grounding checks",
        "Load testing",
        "Panel inspection",
        "Safety compliance report",
        "Code compliance verification",
      ],
    },
  ];

  const handleQuickView = (service: ServiceType, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedService(service);
    setQuickViewOpen(true);
  };

  const guarantees = [
    {
      title: "High Professionalism",
      description: "Licensed, insured, and background-checked electricians only.",
    },
    {
      title: "Fast & Clean Work",
      description: "Quick arrivals, precise fixes, and spotless cleanup before we leave.",
    },
    {
      title: "Up-to-Date Technology",
      description: "Modern tools, smart home know-how, and transparent reports.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      <main className="overflow-hidden">
        <section className="relative bg-gradient-to-b from-accent/70 via-background to-background">
          <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-float-slow" />
          <div className="absolute right-6 top-24 h-52 w-52 rounded-full bg-primary/10 blur-3xl animate-float-slower" />

          <div className="container mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase">
                Professional Electrical Services
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Your Trusted Electrician
                <span className="block text-primary">Safe, Fast, and Affordable</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                24/7 service for repairs, installs, and maintenance — using certified, background-checked professionals
                to keep your power safe.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  size="lg"
                  onClick={handleBookNowClick}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 shadow-lg hover:shadow-xl transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Book an Electrician
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/electrician/pricing")}
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  View Pricing
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-6 text-sm text-muted-foreground" ref={statsRef}>
                <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "140ms" }}>
                  <CardHeader className="pb-2">
                    <p className="text-xs font-semibold text-primary">Certified Team</p>
                    <CardTitle className="text-3xl">{certifiedCount}+</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-muted-foreground">Licensed electricians, verified and insured.</CardContent>
                </Card>
                <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "200ms" }}>
                  <CardHeader className="pb-2">
                    <p className="text-xs font-semibold text-primary">Jobs Completed</p>
                    <CardTitle className="text-3xl">{jobsCount.toLocaleString()}+</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-muted-foreground">Thousands of homes powered safely.</CardContent>
                </Card>
              </div>
            </div>

            <div className="relative animate-fade-up" style={{ animationDelay: "120ms" }}>
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/25 via-accent/40 to-primary/15 rounded-3xl blur-3xl opacity-80 animate-float-slower" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/70">
                <img src={heroImage} alt="Professional electrician at work" className="w-full h-full object-cover" />
                <div className="absolute left-4 bottom-4 space-y-2">
                  <div className="rounded-xl bg-background/90 border border-border px-4 py-2 shadow-sm backdrop-blur">
                    <p className="text-xs text-muted-foreground">Fast Response</p>
                    <p className="text-sm font-semibold">Same-day & emergency available</p>
                  </div>
                  <div className="rounded-xl bg-primary text-primary-foreground px-4 py-2 shadow-md flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4" />
                    <span className="text-sm font-semibold">Safety tested before we leave</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services-section" className="container mx-auto px-6 py-10">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Our Services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Professional Electrical Services</h2>
            <p className="text-muted-foreground mt-3">
              From repairs to complex installations, we offer comprehensive, reliable services tailored for your home and
              office.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.title}
                  className="group flex flex-col h-full border-2 border-border/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/30 animate-fade-up bg-card"
                  style={{ animationDelay: `${100 + index * 70}ms` }}
                  onClick={() => navigate(`/electrician/${service.slug}`)}
                >
                  {/* Service Image Background - Fixed Height */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                    
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm">
                      <Button
                        variant="default"
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 animate-in fade-in-0 zoom-in-95"
                        onClick={(e) => handleQuickView(service, e)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Quick View
                      </Button>
                    </div>
                  </div>

                  {/* Content Section - Flex Grow */}
                  <div className="flex flex-col flex-grow p-5">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-xl font-bold text-foreground leading-tight mb-2">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {service.description}
                      </CardDescription>
                    </CardHeader>

                    {/* Price Section */}
                    <div className="mt-auto pt-4 pb-3">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary">{service.price}</span>
                      </div>

                      {/* Button - Always at Bottom */}
                      <Button
                        variant="default"
                        size="default"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/electrician/${service.slug}`);
                        }}
                      >
                        View Full Details
                      </Button>
                      
                      {/* Mobile Quick View Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground md:hidden"
                        onClick={(e) => handleQuickView(service, e)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Quick View
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="bg-card/60 border-y border-border/60">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">How To Get Our Service</h2>
              <p className="text-muted-foreground mt-3">
                Simple steps to book trusted electricians. We handle the details so you get quick, safe, and clean work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {howItWorks.map((step, index) => (
                <Card
                  key={step.title}
                  className="relative overflow-hidden animate-fade-up"
                  style={{ animationDelay: `${100 + index * 80}ms` }}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                  <CardHeader className="pb-3">
                    <p className="text-xs font-semibold text-primary/80">Step 0{index + 1}</p>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center pt-10 animate-fade-up" style={{ animationDelay: "260ms" }}>
              <Button 
                className="rounded-full px-6 bg-orange-500 hover:bg-orange-600 text-white" 
                onClick={() => navigate("/electrician/electrical-repair")}
              >
                View Service Details
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
              <p className="text-xs uppercase tracking-[0.25em] font-semibold">Why Choose Us</p>
              <h2 className="text-3xl md:text-4xl font-bold">Trusted Service With Affordable Price</h2>
              <p className="text-primary-foreground/80">
                We combine certified expertise, transparent pricing, and friendly support to deliver worry-free
                electrical work for every room of your home and office.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-3xl font-bold">10+</p>
                  <p>Years of combined electrician experience.</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">2.6K+</p>
                  <p>Electrical jobs completed safely and on time.</p>
                </div>
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="mt-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={handleBookNowClick}
              >
                Get Started
              </Button>
            </div>

            <div className="relative animate-fade-up" style={{ animationDelay: "140ms" }}>
              <div className="absolute -inset-4 bg-primary-foreground/10 rounded-3xl blur-2xl" />
              <Card className="relative bg-primary-foreground text-primary rounded-3xl overflow-hidden border-none shadow-2xl">
                <CardHeader>
                  <CardTitle>Safe Power For Your Home</CardTitle>
                  <CardDescription className="text-primary/80">
                    From small troubleshooting to full upgrades, we ensure every cable, outlet, and switch is safe and
                    reliable.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 pt-0">
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">What&apos;s Included</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Licensed electricians</li>
                      <li>Clear, upfront quotes</li>
                      <li>Clean work area guarantee</li>
                    </ul>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">Popular Jobs</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Fan &amp; light installation</li>
                      <li>Socket &amp; switch repair</li>
                      <li>Panel upgrades</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Questions &amp; Answers</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                If you have any more questions about our electrician service, feel free to contact us anytime. We&apos;re
                here to help.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full animate-fade-up" style={{ animationDelay: "120ms" }}>
              <AccordionItem value="item-1">
                <AccordionTrigger>What types of electrical issues do you handle?</AccordionTrigger>
                <AccordionContent>
                  We handle everything from tripping breakers, power loss, and faulty outlets to full rewiring, panel
                  upgrades, and lighting design.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Do you provide emergency electrician service?</AccordionTrigger>
                <AccordionContent>
                  Yes, we offer 24/7 emergency support for urgent electrical issues that can&apos;t wait, such as burning
                  smells, sparks, or major outages.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Are your electricians licensed and insured?</AccordionTrigger>
                <AccordionContent>
                  All of our electricians are fully licensed, insured, and background-checked to ensure your safety and
                  peace of mind.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How does pricing work?</AccordionTrigger>
                <AccordionContent>
                  We provide transparent, upfront quotes before work begins. For complex issues, we perform an on-site
                  inspection and then share a clear breakdown of costs.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <section className="bg-card/60 border-t border-border/60">
          <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
                <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Our Electricians</p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet Our Expert Electrician Team</h2>
                <p className="text-muted-foreground">
                  Our team is made up of friendly professionals who treat your home like their own. We double-check every
                  connection, run safety tests, and clean up before we leave.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">Background Checked</p>
                    <p className="text-muted-foreground">Every electrician passes strict background and safety checks.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">On-Time Guarantee</p>
                    <p className="text-muted-foreground">We respect your schedule and keep you updated at every step.</p>
                  </div>
                </div>
              </div>
              <div className="relative animate-fade-up" style={{ animationDelay: "140ms" }}>
                <div className="absolute -inset-3 bg-primary/10 rounded-3xl blur-2xl" />
                <img
                  src={teamImage}
                  alt="Electrician team"
                  className="relative rounded-3xl shadow-2xl w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-semibold">Electrician Services</p>
              <h3 className="text-2xl md:text-3xl font-bold">Ready to Get Started?</h3>
              <p className="text-primary-foreground/80 mt-2">Contact us today for professional electrical services.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={() => navigate("/")}>
                Contact Us Now
              </Button>
              <Button variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={handleBookNowClick}>
                Book an Electrician
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Quick View Modal */}
      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 gap-0">
          {selectedService && (
            <>
              {/* Modal Image Section */}
              <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${selectedService.bgColor} opacity-20`} />
              </div>

              {/* Modal Content Section */}
              <div className="p-6 md:p-8 space-y-6">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground">
                    {selectedService.title}
                  </DialogTitle>
                  <DialogDescription className="text-base text-muted-foreground">
                    {selectedService.description}
                  </DialogDescription>
                </DialogHeader>

                {/* Price Section */}
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Starting Price</p>
                    <p className="text-3xl font-bold text-primary">{selectedService.price}</p>
                  </div>
                </div>

                {/* Included Items */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">What&apos;s Included</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedService.included.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    size="lg"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => {
                      setQuickViewOpen(false);
                      handleBookNow(selectedService.slug);
                    }}
                  >
                    Book Electrician
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold py-6 rounded-xl"
                    onClick={() => {
                      setQuickViewOpen(false);
                      navigate(`/electrician/${selectedService.slug}`);
                    }}
                  >
                    View Full Details
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Electrician;
