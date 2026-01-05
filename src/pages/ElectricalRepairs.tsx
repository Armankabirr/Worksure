import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { Sparkles, ShieldCheck, Clock, PlugZap } from "lucide-react";

const repairServices = [
  {
    title: "Outlet & Switch Fixes",
    description: "Repair dead outlets, flickering lights, loose switches, and sparking points.",
    price: "From $58",
    duration: "Typically 45-90 mins",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    perks: ["Parts guidance provided", "Code-compliant repairs", "Cleanup before we leave"],
  },
  {
    title: "Breaker Trips & Diagnostics",
    description: "Find and fix overloads, short circuits, nuisance tripping, and buzzing breakers.",
    price: "From $79",
    duration: "Typically 60-120 mins",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    perks: ["Thermal and continuity checks", "Load balancing tips", "Safety-first process"],
  },
  {
    title: "Fixture & Fan Repairs",
    description: "Repair or replace ceiling fans, pendants, chandeliers, and damp-rated fixtures.",
    price: "From $69",
    duration: "Typically 45-120 mins",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=400&fit=crop",
    perks: ["Secure mounting", "Balanced fan alignment", "Post-install safety test"],
  },
  {
    title: "Wiring Faults & Shorts",
    description: "Trace and repair burnt wires, loose neutrals, and hidden junction issues.",
    price: "From $109",
    duration: "Typically 90-180 mins",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop",
    perks: ["Circuit tracing", "Replace degraded cabling", "Detailed status report"],
  },
];

const ElectricalRepairs = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleBookNow = () => {
    navigate("/search/workers?serviceType=electrician&category=repairs");
  };

  const handleAddToCart = (service: (typeof repairServices)[number]) => {
    const priceMatch = service.price.match(/\d+/);
    const price = priceMatch ? parseInt(priceMatch[0]) : 0;

    addToCart({
      serviceType: "electrician",
      serviceName: service.title,
      price,
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

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      <main className="container mx-auto px-6 py-12 space-y-12">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <Badge className="w-fit bg-primary/10 text-primary border-primary/30">Electrical Repairs</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              All Electrical Repairs in One Place
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              See every repair service we offer: fast troubleshooting, safe fixes, and code-compliant workmanship.
              Book instantly or add the exact repair to your cart.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary">
                <ShieldCheck className="h-4 w-4" /> Licensed & insured pros
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-accent/10 text-foreground border border-border/60">
                <Clock className="h-4 w-4" /> Same-day windows
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary">
                <Sparkles className="h-4 w-4" /> Clean finish guaranteed
              </span>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Button size="lg" onClick={handleBookNow}>
                Book a Repair
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/electrician")}>Back to Electrician</Button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-accent/20" />
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&h=900&fit=crop"
              alt="Electrician repairing a circuit"
              className="relative z-10 w-full h-full object-cover"
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Repair Catalog</p>
              <h2 className="text-3xl font-bold text-foreground">Choose the repair you need</h2>
              <p className="text-muted-foreground max-w-2xl mt-2">Clear pricing, what is included, and fast booking.</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleBookNow}>
              <PlugZap className="h-4 w-4" /> Find electricians near you
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repairServices.map((service, index) => (
              <Card key={service.title} className="hover:shadow-lg transition-all duration-200">
                <div className="h-48 relative overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/10" />
                  <span className="absolute top-3 right-3 bg-background/90 text-sm px-3 py-1 rounded-full border border-border/60">
                    {service.price}
                  </span>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> {service.title}
                  </CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /> {service.duration}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {service.perks.map((perk) => (
                      <Badge key={perk} variant="secondary" className="bg-muted text-foreground">
                        {perk}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1" onClick={() => handleAddToCart(service)}>
                      Add to Cart
                    </Button>
                    <Button className="flex-1" variant="outline" onClick={handleBookNow}>
                      Book Now
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Transparent rates; final quote confirmed after onsite diagnosis.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ElectricalRepairs;
