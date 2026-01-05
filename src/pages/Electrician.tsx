import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BadgeCheck, Bolt, Home, ShieldCheck, Sparkles, Zap, ShoppingCart } from "lucide-react";
import heroImage from "@/assets/electrician.jpg";
import teamImage from "@/assets/cleaning-team.jpg";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const Electrician = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleBookNow = () => {
    navigate("/search/workers?serviceType=electrician");
  };

  const handleAddToCart = (service: typeof services[0]) => {
    // Extract numeric price from "From $58" format
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
      title: "Choose Your Time",
      description: "Pick a convenient time slot — same day and emergency bookings available.",
    },
    {
      title: "Book Schedule",
      description: "Tell us your issue and we match the best electrician for your job.",
    },
    {
      title: "Our Team Arrives",
      description: "Certified pros arrive with the right tools, clean up, and verify safety.",
    },
  ];

  const services = [
    {
      icon: Bolt,
      title: "Electrical Repairs",
      description: "Troubleshooting, outlet fixes, breaker trips, and small faults.",
      price: "From $58",
      cta: "Book Now",
      bgColor: "from-orange-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
      navigateTo: "/electrician/electrical-repairs",
    },
    {
      icon: Home,
      title: "Home Wiring",
      description: "New room wiring, extensions, and safe cable management.",
      price: "From $229",
      cta: "Book Now",
      bgColor: "from-blue-500 to-blue-600",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop",
      navigateTo: "/electrician/electrical-repairs",
      scrollToSection: "wiring-panel",
    },
    {
      icon: ShieldCheck,
      title: "Panel Upgrades",
      description: "Distribution board upgrades and load balancing for safety.",
      price: "From $499",
      cta: "Book Now",
      bgColor: "from-red-500 to-red-600",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    },
    {
      icon: Sparkles,
      title: "Lighting Installations",
      description: "Indoor, outdoor, and smart lighting with neat finishing.",
      price: "From $79",
      cta: "Book Now",
      bgColor: "from-yellow-500 to-yellow-600",
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop",
    },
    {
      icon: BadgeCheck,
      title: "Safety Inspections",
      description: "Full electrical health check with clear recommendations.",
      price: "From $159",
      cta: "Book Now",
      bgColor: "from-green-500 to-green-600",
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
    },
    {
      icon: Zap,
      title: "Smart Home Setup",
      description: "Smart switches, sensors, and surge protection configured right.",
      price: "From $199",
      cta: "Book Now",
      bgColor: "from-purple-500 to-purple-600",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop",
    },
  ];

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
                Next Home Maintenance Services
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
                  onClick={handleBookNow}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 shadow-lg hover:shadow-xl transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Book an Electrician
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  View Pricing
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 md:gap-6 text-sm text-muted-foreground">
                <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "140ms" }}>
                  <CardHeader className="pb-2">
                    <p className="text-xs font-semibold text-primary">Certified Team</p>
                    <CardTitle className="text-3xl">64+</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-muted-foreground">Licensed electricians, verified and insured.</CardContent>
                </Card>
                <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "200ms" }}>
                  <CardHeader className="pb-2">
                    <p className="text-xs font-semibold text-primary">Jobs Completed</p>
                    <CardTitle className="text-3xl">2,649+</CardTitle>
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

        <section className="container mx-auto px-6 py-10">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Our Services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Professional Electrical Services</h2>
            <p className="text-muted-foreground mt-3">
              From repairs to complex installations, we offer comprehensive, audited services tailored for your home and
              office.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.title}
                  className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 animate-fade-up overflow-hidden cursor-pointer"
                  style={{ animationDelay: `${100 + index * 70}ms` }}
                  onClick={() => service.navigateTo && navigate(service.navigateTo)}
                >
                  {/* Service Image Background */}
                  <div className="h-40 relative overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} opacity-30`} />
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-semibold text-foreground">{service.price}</span>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-full px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(service);
                        }}
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>

                    {service.navigateTo && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(service.navigateTo as string);
                          // Scroll to specified section after navigation
                          setTimeout(() => {
                            const sectionId = "scrollToSection" in service ? (service.scrollToSection as string) : "electrical-repairs";
                            const element = document.getElementById(sectionId);
                            if (element) {
                              element.scrollIntoView({ behavior: "smooth", block: "start" });
                            }
                          }, 100);
                        }}
                      >
                        View Services
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center pt-8 animate-fade-up" style={{ animationDelay: "520ms" }}>
            <Button className="rounded-full" variant="outline">
              View All Services
            </Button>
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
              <Button variant="secondary" className="rounded-full px-6">
                View Service
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
                electrical work in every room of your home.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-3xl font-bold">10+</p>
                  <p>Years of combined electrician experience.</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">2.5K+</p>
                  <p>Electrical jobs completed safely and on time.</p>
                </div>
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="mt-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
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
              <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Contact Us Now
              </Button>
              <Button variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Book an Electrician
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Electrician;


