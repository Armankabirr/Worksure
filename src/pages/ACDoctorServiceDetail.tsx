import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BadgeCheck, Sparkles, CheckCircle2, XCircle, ShieldCheck, Clock, ShoppingCart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { acDoctorServicesConfig } from "@/lib/acDoctorServices";
import NotFound from "./NotFound";
import { useAuth } from "@/context/AuthContext";

const ACDoctorServiceDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { authStatus, openLogin } = useAuth();

  const serviceData = slug ? acDoctorServicesConfig[slug] : null;

  if (!serviceData) {
    return <NotFound />;
  }

  const handleBookNow = () => {
    if (authStatus !== "authenticated") {
      openLogin();
      return;
    }
    navigate(`/search/workers?serviceType=ac-doctor&service=${serviceData.slug}`);
  };

  const handleAddToCart = () => {
    const priceMatch = serviceData.startingPrice.match(/[\d,]+/);
    const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, "")) : 0;

    addToCart({
      serviceType: "ac-doctor",
      serviceName: serviceData.title,
      price: price,
      description: serviceData.description,
      image: serviceData.heroImage,
    });

    toast.success(`${serviceData.title} added to cart!`, {
      description: "You can view and manage your cart items.",
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
    });
  };

  const howItWorks = [
    {
      title: "Choose Your Schedule",
      description: "Select a convenient date and time slot. Same-day bookings available for urgent needs.",
    },
    {
      title: "Technician Assigned",
      description: "We match you with a certified, background-checked AC technician based on your requirements.",
    },
    {
      title: "Service Completed & Verified",
      description: `Our team completes the ${serviceData.title.toLowerCase()}, performs a quality check, and ensures your satisfaction.`,
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-accent/70 via-background to-background">
          <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-float-slow" />
          <div className="absolute right-6 top-24 h-52 w-52 rounded-full bg-primary/10 blur-3xl animate-float-slower" />

          <div className="container mx-auto px-6 py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase">
                  Professional AC Service
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                  {serviceData.title}
                  <span className="block text-primary mt-2">{serviceData.subtitle}</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {serviceData.description}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Starting Price</p>
                    <p className="text-4xl font-bold text-primary">{serviceData.startingPrice}</p>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Duration</p>
                    <p className="text-xl font-semibold text-foreground">{serviceData.duration}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button
                    size="lg"
                    onClick={handleBookNow}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 shadow-lg hover:shadow-xl transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Book AC Doctor
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleAddToCart}
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>

              <div className="relative animate-fade-up" style={{ animationDelay: "120ms" }}>
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/25 via-accent/40 to-primary/15 rounded-3xl blur-3xl opacity-80 animate-float-slower" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/70">
                  <img src={serviceData.heroImage} alt={serviceData.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  <div className="absolute left-4 bottom-4 space-y-2">
                    <div className="rounded-xl bg-background/90 border border-border px-4 py-2 shadow-sm backdrop-blur">
                      <p className="text-xs text-muted-foreground">Professional Service</p>
                      <p className="text-sm font-semibold">Certified & Insured Technicians</p>
                    </div>
                    <div className="rounded-xl bg-primary text-primary-foreground px-4 py-2 shadow-md flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4" />
                      <span className="text-sm font-semibold">Performance tested before we leave</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Overview */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Service Overview</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">What Our {serviceData.title} Includes</h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                Our comprehensive {serviceData.title.toLowerCase()} service covers every aspect with meticulous attention to detail.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {serviceData.coveredAreas.map((area, index) => (
                <Card
                  key={area}
                  className="border-none bg-card shadow-sm animate-fade-up"
                  style={{ animationDelay: `${100 + index * 50}ms` }}
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">{area}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-primary/5 border-primary/20 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Complete {serviceData.title} Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {serviceData.included.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing Breakdown */}
        <section className="bg-card/60 border-y border-border/60">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 animate-fade-up">
                <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Transparent Pricing</p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Pricing Breakdown</h2>
                <p className="text-muted-foreground mt-3">
                  Clear, upfront pricing with no hidden fees. Know exactly what you're paying for.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="border-2 border-primary/20 animate-fade-up" style={{ animationDelay: "100ms" }}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">{serviceData.startingPrice}</CardTitle>
                    <CardDescription>Starting price for {serviceData.title.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Final price depends on AC unit type, complexity, and specific requirements. We provide a detailed quote before starting work.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "150ms" }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      What Affects Price
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {serviceData.pricingFactors.map((factor, index) => (
                        <li key={index} className="text-sm">
                          <p className="font-semibold text-foreground">{factor.factor}</p>
                          <p className="text-muted-foreground">{factor.description}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-primary/5 border-primary/20 animate-fade-up" style={{ animationDelay: "200ms" }}>
                <CardContent className="p-6 flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">No Hidden Fees</p>
                    <p className="text-sm text-muted-foreground">
                      All pricing is transparent and discussed upfront. We provide a detailed quote before any work begins, and you'll never be surprised by unexpected charges.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-up">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Simple Booking Process</h2>
            <p className="text-muted-foreground mt-3">
              Booking your {serviceData.title.toLowerCase()} service is quick and easy. Follow these simple steps to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
        </section>

        {/* What's Included / Not Included */}
        <section className="bg-card/60 border-y border-border/60">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12 animate-fade-up">
                <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Service Details</p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">What's Included & Not Included</h2>
                <p className="text-muted-foreground mt-3">
                  Clear transparency about what our {serviceData.title.toLowerCase()} service covers and what requires additional services.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-green-500/20 bg-green-50/50 dark:bg-green-950/10 animate-fade-up" style={{ animationDelay: "100ms" }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <CheckCircle2 className="h-5 w-5" />
                      Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {serviceData.included.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-red-500/20 bg-red-50/50 dark:bg-red-950/10 animate-fade-up" style={{ animationDelay: "150ms" }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <XCircle className="h-5 w-5" />
                      Not Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {serviceData.notIncluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                          <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Trust & Safety</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Your Peace of Mind Matters</h2>
              <p className="text-muted-foreground mt-3">
                We take your safety and satisfaction seriously. Here's what sets us apart.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "100ms" }}>
                <CardHeader>
                  <ShieldCheck className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Background Checked</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Every AC technician undergoes thorough background checks and verification before joining our team.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "150ms" }}>
                <CardHeader>
                  <Sparkles className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Certified Technicians</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All technicians are certified and trained in AC installation, repair, and maintenance best practices.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "200ms" }}>
                <CardHeader>
                  <BadgeCheck className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Performance Guarantee</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We guarantee 100% satisfaction. If you're not happy, we'll return to fix it at no additional charge.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 bg-primary/5 border-primary/20 animate-fade-up" style={{ animationDelay: "250ms" }}>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Our team is fully insured and bonded. We treat your home with the same care and respect we'd want for our own.
                  Your trust is our most valuable asset, and we work hard to earn and maintain it every single day.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-card/60 border-y border-border/60">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <div className="space-y-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
                  <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Questions & Answers</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground">
                    Have questions about our {serviceData.title.toLowerCase()} service? We're here to help. If you don't find your answer here,
                    feel free to contact us anytime.
                  </p>
                </div>
                <Accordion type="single" collapsible className="w-full animate-fade-up" style={{ animationDelay: "120ms" }}>
                  {serviceData.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index + 1}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-semibold">Ready to Get Started?</p>
              <h3 className="text-2xl md:text-3xl font-bold mt-2">Transform Your AC Experience Today</h3>
              <p className="text-primary-foreground/80 mt-2">
                Book your {serviceData.title.toLowerCase()} service now and experience the difference of professional, reliable AC service.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={handleBookNow}
              >
                Book AC Doctor Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={() => navigate("/ac-doctor")}
              >
                View All Services
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ACDoctorServiceDetail;
