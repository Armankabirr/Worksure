import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import heroImage from "@/assets/ac-doctor.jpg";
import teamImage from "@/assets/team-illustration.jpg";

import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";

const ACDoctor = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [certifiedCount, setCertifiedCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let count = 0;
          const certInterval = setInterval(() => {
            count++;
            setCertifiedCount(Math.min(count, 42));
            if (count >= 42) clearInterval(certInterval);
          }, 30);
          let jobCount = 0;
          const jobInterval = setInterval(() => {
            jobCount += 30;
            setJobsCount(Math.min(jobCount, 1870));
            if (jobCount >= 1870) clearInterval(jobInterval);
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

  const handleBookNow = () => {
    navigate("/search/workers?serviceType=ac-doctor");
  };

  const services = [
    {
      title: "AC Cleaning & Maintenance",
      description: "Deep cleaning, filter change, and performance check for all AC brands.",
      price: "From ৳1200",
      image: "https://images.pexels.com/photos/3768913/pexels-photo-3768913.jpeg?auto=compress&w=400&h=300&fit=crop", // Worker cleaning AC
      navigateTo: "/acdoctor/cleaning-maintenance",
    },
    {
      title: "AC Installation",
      description: "Expert installation for split, window, and cassette ACs. Includes site inspection.",
      price: "From ৳2500",
      image: "https://images.pexels.com/photos/6186121/pexels-photo-6186121.jpeg?auto=compress&w=400&h=300&fit=crop", // Worker installing AC
      navigateTo: "/acdoctor/installation",
    },
    {
      title: "AC Repair",
      description: "Quick diagnosis and repair for cooling, noise, or electrical issues.",
      price: "From ৳1800",
      image: "https://images.pexels.com/photos/3768912/pexels-photo-3768912.jpeg?auto=compress&w=400&h=300&fit=crop", // Worker repairing AC
      navigateTo: "/acdoctor/repair",
    },
    {
      title: "Gas Refilling",
      description: "Safe refrigerant top-up for all AC types, with leak check included.",
      price: "From ৳2200",
      image: "https://images.pexels.com/photos/6186130/pexels-photo-6186130.jpeg?auto=compress&w=400&h=300&fit=crop", // Worker refilling AC gas
      navigateTo: "/acdoctor/gas-refilling",
    },
    {
      title: "Annual Maintenance Contract",
      description: "Year-round priority service, regular checkups, and discounts on repairs.",
      price: "From ৳5000",
      image: "https://images.pexels.com/photos/6186131/pexels-photo-6186131.jpeg?auto=compress&w=400&h=300&fit=crop", // Worker with AC tools
      navigateTo: "/acdoctor/amc",
    },
  ];

  const howItWorks = [
    {
      title: "Book Your Service",
      description: "Choose your AC issue and preferred time. Same-day and scheduled slots available.",
    },
    {
      title: "Technician Arrives",
      description: "Certified AC pros arrive on time, inspect, and explain the process.",
    },
    {
      title: "Enjoy Cool Comfort",
      description: "We clean up, test your AC, and ensure you’re satisfied before leaving.",
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
                Next AC Service Solutions
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Your Trusted AC Doctor
                <span className="block text-primary">Cool, Clean, and Reliable</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                24/7 AC cleaning, repair, and installation — certified, background-checked professionals for your comfort.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  size="lg"
                  onClick={handleBookNow}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 shadow-lg hover:shadow-xl transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Book an AC Doctor
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/acdoctor/cleaning-maintenance")}
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
                  <CardContent className="pt-0 text-muted-foreground">AC specialists, verified and insured.</CardContent>
                </Card>
                <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "200ms" }}>
                  <CardHeader className="pb-2">
                    <p className="text-xs font-semibold text-primary">Jobs Completed</p>
                    <CardTitle className="text-3xl">{jobsCount.toLocaleString()}+</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-muted-foreground">Hundreds of homes cooled efficiently.</CardContent>
                </Card>
              </div>
            </div>
            <div className="relative animate-fade-up" style={{ animationDelay: "120ms" }}>
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/25 via-accent/40 to-primary/15 rounded-3xl blur-3xl opacity-80 animate-float-slower" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/70">
                <img src={heroImage} alt="Professional AC technician at work" className="w-full h-full object-cover" />
                <div className="absolute left-4 bottom-4 space-y-2">
                  <div className="rounded-xl bg-background/90 border border-border px-4 py-2 shadow-sm backdrop-blur">
                    <p className="text-xs text-muted-foreground">Fast Response</p>
                    <p className="text-sm font-semibold">Same-day & emergency available</p>
                  </div>
                  <div className="rounded-xl bg-primary text-primary-foreground px-4 py-2 shadow-md flex items-center gap-2">
                    <span className="text-sm font-semibold">Performance tested before we leave</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-10">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Our Services</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Professional AC Services</h2>
            <p className="text-muted-foreground mt-3">
              From deep cleaning to complex repairs, we offer comprehensive, audited services for every AC need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={service.title}
                className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 animate-fade-up overflow-hidden cursor-pointer"
                style={{ animationDelay: `${100 + index * 70}ms` }}
                onClick={() => service.navigateTo && navigate(service.navigateTo)}
              >
                <div className="h-40 relative overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 opacity-20" />
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-semibold text-foreground">{service.price}</span>
                  </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart functionality
                        const priceMatch = service.price.match(/\d+/);
                        const price = priceMatch ? parseInt(priceMatch[0]) : 0;
                        addToCart({
                          serviceType: "ac-doctor",
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
                      }}
                    >
                      Book Now
                    </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center pt-8 animate-fade-up" style={{ animationDelay: "520ms" }}>
            <Button className="rounded-full" variant="outline" onClick={() => navigate("/acdoctor/cleaning-maintenance")}>View All Services</Button>
          </div>
        </section>

        <section className="bg-card/60 border-y border-border/60">
          <div className="container mx-auto px-6 py-16">
            <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">How To Get Our Service</h2>
              <p className="text-muted-foreground mt-3">
                Simple steps to book trusted AC technicians. We handle the details so you get quick, clean, and cool comfort.
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
              <Button className="rounded-full px-6 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => navigate("/acdoctor/cleaning-maintenance")}>View Service</Button>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
              <p className="text-xs uppercase tracking-[0.25em] font-semibold">Why Choose Us</p>
              <h2 className="text-3xl md:text-4xl font-bold">Trusted Service With Affordable Price</h2>
              <p className="text-primary-foreground/80">
                We combine certified expertise, transparent pricing, and friendly support to deliver worry-free AC service for every home and office.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-3xl font-bold">8+</p>
                  <p>Years of combined AC experience.</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">1.8K+</p>
                  <p>AC jobs completed efficiently and on time.</p>
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
                  <CardTitle>Cool Comfort For Your Home</CardTitle>
                  <CardDescription className="text-primary/80">
                    From regular cleaning to emergency repairs, we ensure every AC is running at peak performance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 pt-0">
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">What&apos;s Included</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Certified AC technicians</li>
                      <li>Clear, upfront quotes</li>
                      <li>Clean work area guarantee</li>
                    </ul>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      size="lg"
                      onClick={handleBookNow}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-10 shadow-lg hover:shadow-xl transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      Book an AC Doctor
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("/acdoctor/cleaning-maintenance")}
                      className="border-2 border-orange-600 text-orange-700 hover:bg-orange-600 hover:text-white"
                    >
                      View Pricing
                    </Button>
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
                If you have any more questions about our AC Doctor service, feel free to contact us anytime. We&apos;re here to help.
              </p>
            </div>
            <div className="w-full animate-fade-up" style={{ animationDelay: "120ms" }}>
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>What types of AC issues do you handle?</CardTitle>
                </CardHeader>
                <CardContent>
                  We handle everything from cooling problems, water leakage, and noise to full installation and gas refilling.
                </CardContent>
              </Card>
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Do you provide emergency AC service?</CardTitle>
                </CardHeader>
                <CardContent>
                  Yes, we offer 24/7 emergency support for urgent AC issues that can&apos;t wait, such as breakdowns during heatwaves.
                </CardContent>
              </Card>
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Are your technicians certified and insured?</CardTitle>
                </CardHeader>
                <CardContent>
                  All of our AC technicians are fully certified, insured, and background-checked for your peace of mind.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>How does pricing work?</CardTitle>
                </CardHeader>
                <CardContent>
                  We provide transparent, upfront quotes before work begins. For complex issues, we perform an on-site inspection and then share a clear breakdown of costs.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-card/60 border-t border-border/60">
          <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
                <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Our AC Team</p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet Our Expert AC Technicians</h2>
                <p className="text-muted-foreground">
                  Our team is made up of friendly professionals who treat your home like their own. We double-check every connection, run performance tests, and clean up before we leave.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">Background Checked</p>
                    <p className="text-muted-foreground">Every technician passes strict background and safety checks.</p>
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
                  alt="AC team"
                  className="relative rounded-3xl shadow-2xl w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-semibold">AC Doctor Services</p>
              <h3 className="text-2xl md:text-3xl font-bold">Ready to Get Started?</h3>
              <p className="text-primary-foreground/80 mt-2">Contact us today for professional AC services.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={() => navigate("/")}>Contact Us Now</Button>
              <Button variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={handleBookNow}>Book an AC Doctor</Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default ACDoctor;
