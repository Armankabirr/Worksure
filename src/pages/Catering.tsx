import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BadgeCheck, Sparkles, Home, ShieldCheck, Zap, ShoppingCart } from "lucide-react";
import heroImage from "@/assets/chefs.jpg";
import teamImage from "@/assets/team-illustration.jpg";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Catering = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { authStatus, openLogin } = useAuth();

  const [yearsExp, setYearsExp] = useState(0);
  const [eventsServed, setEventsServed] = useState(0);

  const statsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          let y = 0;
          let e = 0;

          const yInterval = setInterval(() => {
            y++;
            setYearsExp(Math.min(y, 15));
            if (y >= 15) clearInterval(yInterval);
          }, 40);

          const eInterval = setInterval(() => {
            e += 100;
            setEventsServed(Math.min(e, 5000));
            if (e >= 5000) clearInterval(eInterval);
          }, 10);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const cateringServices = [
    {
      icon: Sparkles,
      title: "Wedding Catering",
      description: "Elegant menus for your special day.",
      price: "From ৳1500",
      image: heroImage,
    },
    {
      icon: Home,
      title: "Corporate Events",
      description: "Professional catering for business events.",
      price: "From ৳1200",
      image: teamImage,
    },
    {
      icon: ShieldCheck,
      title: "Buffet Services",
      description: "Perfect for large groups.",
      price: "From ৳1000",
      image: heroImage,
    },
    {
      icon: Zap,
      title: "Dessert Catering",
      description: "Sweet endings for any event.",
      price: "From ৳800",
      image: teamImage,
    },
  ];

  const handleAddToCart = (service: (typeof cateringServices)[0]) => {
    const price = parseInt(service.price.replace(/\D/g, ""), 10);

    addToCart({
      serviceType: "catering",
      serviceName: service.title,
      price,
      description: service.description,
      image: service.image,
    });

    toast.success(`${service.title} added to cart`, {
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
    });
  };

  const handleBookCatering = () => {
    // Require login before sending users to booking/search flow
    if (authStatus !== "authenticated") {
      openLogin();
      return;
    }
    navigate("/search/workers?serviceType=catering");
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />

      <main className="overflow-hidden">
        {/* HERO */}
        <section className="container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold">
              Delicious Catering
              <span className="block text-primary">For Every Occasion</span>
            </h1>
            <p className="text-muted-foreground">
              Fresh, flavorful meals prepared by expert chefs.
            </p>

            <div className="flex gap-4">
              <Button onClick={handleBookCatering}>
                Book Catering
              </Button>
              <Button variant="outline" onClick={() => document.getElementById('catering-services')?.scrollIntoView({ behavior: 'smooth' })}>
                View Menu
              </Button>
            </div>

            <div ref={statsRef} className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>{yearsExp}+</CardTitle>
                </CardHeader>
                <CardContent>Years Experience</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{eventsServed.toLocaleString()}+</CardTitle>
                </CardHeader>
                <CardContent>Events Served</CardContent>
              </Card>
            </div>
          </div>

          <img
            src={heroImage}
            alt="Catering"
            className="rounded-3xl shadow-xl"
          />
        </section>

        {/* SERVICES */}
        <section id="catering-services" className="container mx-auto px-6 py-16">
          <h2 className="text-4xl font-bold text-center mb-12">
            Our Catering Services
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {cateringServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.title}
                  className="hover:shadow-lg"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-40 w-full object-cover"
                  />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      {service.title}
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                                      <p className="text-2xl font-bold text-primary mt-2">{service.price}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button onClick={handleBookCatering} className="flex-1">
                        Book
                      </Button>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(service);
                        }}
                        variant="outline" 
                        size="icon"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* MENU */}
        <section className="container mx-auto px-6 py-16">
          <h2 className="text-4xl font-bold mb-6">Sample Menu</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="mains">
              <AccordionTrigger>Main Courses</AccordionTrigger>
              <AccordionContent>
                Grilled salmon, beef tenderloin, vegetarian lasagna
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA */}
        <section className="py-16 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Book Your Catering?
          </h2>
          <Button size="lg">Get a Quote</Button>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Catering;
