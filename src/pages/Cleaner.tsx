import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BadgeCheck, Sparkles, Home, ShieldCheck, Droplet, Wind, ShoppingCart, Eye } from "lucide-react";
import heroImage from "@/assets/hero-workspace.jpg";
import teamImage from "@/assets/cleaning-team.jpg";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";

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

const Cleaner = () => {
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
          // Animate Certified Team (58+)
          let count = 0;
          const certInterval = setInterval(() => {
            count++;
            setCertifiedCount(Math.min(count, 58));
            if (count >= 58) clearInterval(certInterval);
          }, 30);

          // Animate Jobs Completed (1890+)
          let jobCount = 0;
          const jobInterval = setInterval(() => {
            jobCount += 30;
            setJobsCount(Math.min(jobCount, 1890));
            if (jobCount >= 1890) clearInterval(jobInterval);
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
      ? `/search/workers?serviceType=cleaner&service=${serviceSlug}`
      : "/search/workers?serviceType=cleaner";
    navigate(query);
  };

  const handleAddToCart = (service: typeof services[0]) => {
    // Extract numeric price from "From ৳580" format
    const priceMatch = service.price.match(/\d+/);
    const price = priceMatch ? parseInt(priceMatch[0]) : 0;

    addToCart({
      serviceType: "cleaner",
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
      description: "Select from deep cleaning, regular maintenance, move-in/out, or specialized cleaning needs.",
    },
    {
      title: "Book Schedule",
      description: "Pick a convenient time slot — same day and flexible scheduling available.",
    },
    {
      title: "Our Team Arrives",
      description: "Professional cleaners arrive with eco-friendly supplies, clean thoroughly, and leave your space spotless.",
    },
  ];

  const services: ServiceType[] = [
    {
      icon: Sparkles,
		title: "Deep Cleaning",
      description: "Thorough cleaning for every corner of your home or office with attention to detail.",
      price: "From ৳1,200",
      cta: "Book Now",
      bgColor: "from-green-500 to-green-600",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&q=80",
      slug: "deep-cleaning",
      included: [
        "Complete room-by-room deep cleaning",
        "Kitchen and bathroom sanitization",
        "Baseboards and window sills",
        "Inside appliances cleaning",
        "Eco-friendly cleaning products",
        "Post-cleaning inspection",
      ],
    },
    {
      icon: Home,
      title: "Move-In/Move-Out Cleaning",
      description: "Perfect for new beginnings or end-of-lease requirements with comprehensive service.",
      price: "From ৳1,800",
      cta: "Book Now",
      bgColor: "from-blue-500 to-blue-600",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop&q=80",
      slug: "move-in-out",
      included: [
        "Full interior deep cleaning",
        "Cabinets and closets cleaned",
        "All appliances cleaned inside and out",
        "Windows and window frames",
        "Carpet cleaning included",
        "Move-out inspection report",
      ],
    },
    {
      icon: Droplet,
      title: "Carpet & Upholstery Cleaning",
      description: "Steam and dry cleaning for carpets, sofas, curtains, and fabric furniture.",
      price: "From ৳950",
      cta: "Book Now",
      bgColor: "from-yellow-500 to-yellow-600",
      image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400&h=300&fit=crop&q=80",
      slug: "carpet-upholstery",
      included: [
        "Professional steam cleaning",
        "Stain removal treatment",
        "Deodorizing and sanitizing",
        "Fabric protection application",
        "Furniture moving and replacement",
        "Quick-dry service available",
      ],
    },
    {
      icon: Wind,
		title: "Window Cleaning",
      description: "Crystal-clear windows for homes and businesses, inside and out.",
      price: "From ৳650",
      cta: "Book Now",
      bgColor: "from-cyan-500 to-cyan-600",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&q=80",
      slug: "window-cleaning",
      included: [
        "Inside and outside window cleaning",
        "Window frames and sills",
        "Streak-free finish guarantee",
        "Screen cleaning included",
        "Hard-to-reach windows",
        "Eco-friendly cleaning solutions",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Office Cleaning",
      description: "Regular maintenance and deep cleaning for commercial spaces and offices.",
      price: "From ৳1,500",
      cta: "Book Now",
      bgColor: "from-purple-500 to-purple-600",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&q=80",
      slug: "office-cleaning",
      included: [
        "Desk and workstation cleaning",
        "Restroom sanitization",
        "Kitchen and break room cleaning",
        "Floor vacuuming and mopping",
        "Trash removal and recycling",
        "Flexible scheduling options",
      ],
    },
    {
      icon: BadgeCheck,
      title: "Regular Maintenance Cleaning",
      description: "Weekly or bi-weekly cleaning services to keep your space consistently spotless.",
      price: "From ৳800",
      cta: "Book Now",
      bgColor: "from-orange-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop&q=80",
      slug: "regular-cleaning",
      included: [
        "Regular vacuuming and mopping",
        "Bathroom and kitchen cleaning",
        "Dusting all surfaces",
        "Trash removal",
        "Consistent schedule",
        "Same cleaner assigned",
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
      description: "Trained, insured, and background-checked cleaners only.",
    },
    {
      title: "Eco-Friendly Products",
      description: "Safe, non-toxic cleaning supplies that protect your family and environment.",
    },
    {
      title: "Satisfaction Guaranteed",
      description: "We ensure spotless results and address any concerns immediately.",
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
                Professional Cleaning Services
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Your Trusted Cleaning Team
                <span className="block text-primary">Spotless, Reliable, and Affordable</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                24/7 service for deep cleaning, regular maintenance, and specialized cleaning — using certified, background-checked professionals
                to keep your space pristine.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  size="lg"
                  onClick={handleBookNow}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 shadow-lg hover:shadow-xl transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Book a Cleaner
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleBookNow}
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
                  <CardContent className="pt-0 text-muted-foreground">Trained cleaners, verified and insured.</CardContent>
                </Card>
                <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "200ms" }}>
                  <CardHeader className="pb-2">
                    <p className="text-xs font-semibold text-primary">Jobs Completed</p>
                    <CardTitle className="text-3xl">{jobsCount.toLocaleString()}+</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-muted-foreground">Thousands of spaces cleaned perfectly.</CardContent>
                </Card>
              </div>
            </div>

            <div className="relative animate-fade-up" style={{ animationDelay: "120ms" }}>
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/25 via-accent/40 to-primary/15 rounded-3xl blur-3xl opacity-80 animate-float-slower" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/70">
                <img src={heroImage} alt="Professional cleaning team at work" className="w-full h-full object-cover" />
                <div className="absolute left-4 bottom-4 space-y-2">
                  <div className="rounded-xl bg-background/90 border border-border px-4 py-2 shadow-sm backdrop-blur">
                    <p className="text-xs text-muted-foreground">Flexible Scheduling</p>
                    <p className="text-sm font-semibold">Same-day & regular maintenance available</p>
                  </div>
                  <div className="rounded-xl bg-primary text-primary-foreground px-4 py-2 shadow-md flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4" />
                    <span className="text-sm font-semibold">Eco-friendly products guaranteed</span>
                  </div>
                </div>
								</div>
						</div>
					</div>
				</section>

        <section className="container mx-auto px-6 py-10">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Our Services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Professional Cleaning Services</h2>
            <p className="text-muted-foreground mt-3">
              From deep cleaning to regular maintenance, we offer comprehensive, reliable services tailored for your home and
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
                  onClick={() => navigate(`/cleaner/${service.slug}`)}
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
                          navigate(`/cleaner/${service.slug}`);
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

          <div className="flex justify-center pt-8 animate-fade-up" style={{ animationDelay: "520ms" }}>
            <Button className="rounded-full" variant="outline" onClick={handleBookNow}>
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
                Simple steps to book trusted cleaners. We handle the details so you get quick, thorough, and spotless work.
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
              <Button className="rounded-full px-6 bg-green-500 hover:bg-green-600 text-white" onClick={handleBookNow}>
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
                We combine certified expertise, eco-friendly products, and friendly support to deliver worry-free
                cleaning work for every space in your home and office.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-3xl font-bold">8+</p>
                  <p>Years of combined cleaning experience.</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">1.9K+</p>
                  <p>Cleaning jobs completed safely and on time.</p>
                </div>
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="mt-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={handleBookNow}
              >
                Get Started
              </Button>
            </div>

            <div className="relative animate-fade-up" style={{ animationDelay: "140ms" }}>
              <div className="absolute -inset-4 bg-primary-foreground/10 rounded-3xl blur-2xl" />
              <Card className="relative bg-primary-foreground text-primary rounded-3xl overflow-hidden border-none shadow-2xl">
                <CardHeader>
                  <CardTitle>Spotless Spaces For Your Home</CardTitle>
                  <CardDescription className="text-primary/80">
                    From regular maintenance to deep cleaning, we ensure every corner, surface, and space is clean and
                    sanitized.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 pt-0">
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">What&apos;s Included</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Trained cleaners</li>
                      <li>Eco-friendly supplies</li>
                      <li>Satisfaction guarantee</li>
                    </ul>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">Popular Services</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Deep cleaning</li>
                      <li>Move-in/out cleaning</li>
                      <li>Regular maintenance</li>
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
                If you have any more questions about our cleaning service, feel free to contact us anytime. We&apos;re
                here to help.
              </p>
						</div>
						<Accordion type="single" collapsible className="w-full animate-fade-up" style={{ animationDelay: "120ms" }}>
              <AccordionItem value="item-1">
                <AccordionTrigger>What types of cleaning do you offer?</AccordionTrigger>
                <AccordionContent>
                  We offer deep cleaning, regular maintenance, move-in/move-out, carpet and upholstery cleaning, window cleaning, and office cleaning services.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Are your cleaners background checked?</AccordionTrigger>
                <AccordionContent>
                  Yes, all of our cleaners are fully background-checked, trained, and insured to ensure your safety and
                  peace of mind.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Do you use eco-friendly products?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! We prioritize safe, eco-friendly cleaning products that protect your family, pets, and the environment.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How does pricing work?</AccordionTrigger>
                <AccordionContent>
                  We provide transparent, upfront quotes before work begins. Pricing depends on the size of your space, type of cleaning, and frequency of service.
                </AccordionContent>
								</AccordionItem>
						</Accordion>
					</div>
				</section>

				<section className="bg-card/60 border-t border-border/60">
					<div className="container mx-auto px-6 py-16">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
							<div className="space-y-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
								<p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Our Cleaners</p>
								<h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet Our Expert Cleaning Team</h2>
                <p className="text-muted-foreground">
                  Our team is made up of friendly professionals who treat your space like their own. We double-check every
                  detail, use quality supplies, and ensure spotless results before we leave.
                </p>
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<p className="font-semibold text-foreground">Background Checked</p>
										<p className="text-muted-foreground">Every cleaner passes strict background and safety checks.</p>
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
                  alt="Cleaning team"
                  className="relative rounded-3xl shadow-2xl w-full h-full object-cover"
                />
							</div>
						</div>
					</div>
				</section>

				<section className="bg-primary text-primary-foreground">
					<div className="container mx-auto px-6 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
						<div>
							<p className="text-xs uppercase tracking-[0.25em] font-semibold">Cleaning Services</p>
              <h3 className="text-2xl md:text-3xl font-bold">Ready to Get Started?</h3>
							<p className="text-primary-foreground/80 mt-2">Contact us today for professional cleaning services.</p>
						</div>
						<div className="flex gap-3">
              <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={() => navigate("/")}>
                Contact Us Now
              </Button>
              <Button variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={handleBookNow}>
                Book a Cleaner
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
                    Book Cleaner
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold py-6 rounded-xl"
                    onClick={() => {
                      setQuickViewOpen(false);
                      navigate(`/cleaner/${selectedService.slug}`);
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

export default Cleaner;
