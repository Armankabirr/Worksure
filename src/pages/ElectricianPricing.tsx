import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { electricianServicesData } from "@/lib/electricianServices";
import { useAuth } from "@/context/AuthContext";

const ElectricianPricing = () => {
  const navigate = useNavigate();
  const { authStatus, openLogin } = useAuth();

  const services = Object.values(electricianServicesData);

  const handleBookElectrician = (slug?: string) => {
    if (authStatus !== "authenticated") {
      openLogin();
      return;
    }
    const path = slug
      ? `/search/workers?serviceType=electrician&service=${slug}`
      : "/search/workers?serviceType=electrician";
    navigate(path);
  };

  const handleViewDetails = (slug: string) => {
    navigate(`/electrician/${slug}`);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-accent/70 via-background to-background">
          <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-float-slow" />
          <div className="absolute right-6 top-24 h-52 w-52 rounded-full bg-primary/10 blur-3xl animate-float-slower" />

          <div className="container mx-auto px-6 py-16 lg:py-24">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase">
                Transparent Pricing
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Electrician Service Pricing
                <span className="block text-primary mt-2">No Hidden Costs, Clear & Fair</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transparent pricing for all our electrical services. Starting prices shown below. Final quote depends on project scope, complexity, and specific requirements.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={service.slug}
                className="group flex flex-col h-full border-2 border-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/30 animate-fade-up bg-card"
                style={{ animationDelay: `${100 + index * 70}ms` }}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col flex-grow space-y-4">
                  {/* Price */}
                  <div className="pb-4 border-b border-border">
                    <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                    <p className="text-3xl font-bold text-primary">{service.startingPrice}</p>
                    <p className="text-xs text-muted-foreground mt-1">Duration: {service.duration}</p>
                  </div>

                  {/* Included Items */}
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-foreground mb-3">What's Included:</p>
                    <ul className="space-y-2">
                      {service.included.slice(0, 4).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {service.included.length > 4 && (
                        <li className="text-xs text-muted-foreground italic">
                          + {service.included.length - 4} more items
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-2 pt-4">
                    <Button
                      variant="default"
                      size="default"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={() => handleViewDetails(service.slug)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="default"
                      className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold py-6 rounded-xl"
                      onClick={() => handleBookElectrician(service.slug)}
                    >
                      Book Electrician
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing Notes Section */}
        <section className="bg-card/60 border-y border-border/60">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 animate-fade-up">
                <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Pricing Information</p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">What Affects Pricing?</h2>
                <p className="text-muted-foreground mt-3">
                  Our pricing is transparent and based on several factors. We provide detailed quotes before any work begins.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "100ms" }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Project Scope
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      The size and complexity of your electrical project determines the base pricing. More extensive work requires more time and materials.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "150ms" }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Materials & Parts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Replacement parts, fixtures, and materials are priced separately. We'll provide a detailed breakdown before starting work.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "200ms" }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Access Difficulty
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Hard-to-reach areas or complex installations may require additional time and specialized equipment, affecting the final cost.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "250ms" }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Emergency Service
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      After-hours or urgent emergency calls may have additional fees. Regular scheduled appointments offer the best value.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-primary/5 border-primary/20 animate-fade-up" style={{ animationDelay: "300ms" }}>
                <CardContent className="p-6 flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">No Hidden Fees</p>
                    <p className="text-sm text-muted-foreground">
                      All pricing is transparent and discussed upfront. We provide detailed quotes before starting any work, and you'll never be surprised by unexpected charges. Final pricing is confirmed before we begin.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Trust & Quality</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Why Choose Our Electrical Services?</h2>
              <p className="text-muted-foreground mt-3">
                We combine professional expertise with transparent pricing to deliver exceptional value.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "100ms" }}>
                <CardHeader>
                  <ShieldCheck className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Licensed Electricians</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Every electrician undergoes thorough background checks and maintains proper licensing and insurance.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "150ms" }}>
                <CardHeader>
                  <Sparkles className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Code Compliant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All work meets or exceeds local electrical codes and safety standards for your peace of mind.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none bg-card shadow-sm animate-fade-up" style={{ animationDelay: "200ms" }}>
                <CardHeader>
                  <BadgeCheck className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Satisfaction Guarantee</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We guarantee 100% satisfaction. If you're not happy, we'll return to fix it at no additional charge.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] font-semibold">Need Help Choosing?</p>
              <h3 className="text-2xl md:text-3xl font-bold mt-2">Not Sure Which Service You Need?</h3>
              <p className="text-primary-foreground/80 mt-2">
                Our team is here to help you choose the right electrical service for your needs.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={() => navigate("/electrician")}
              >
                View All Services
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                onClick={() => handleBookElectrician()}
              >
                Book Electrician
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ElectricianPricing;
