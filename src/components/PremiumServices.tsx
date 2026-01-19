import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Sparkles, Wind, Heart, UtensilsCrossed, Baby } from "lucide-react";

const PremiumServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Zap,
      title: "Electrician",
      description: "Certified electricians for all your electrical needs. Safe, reliable, and professional service.",
      image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop&q=80",
      path: "/electrician",
      color: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-600",
    },
    {
      icon: Sparkles,
      title: "Cleaner",
      description: "Professional cleaning services that leave your space spotless. Deep cleaning, regular maintenance, and more.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&q=80",
      path: "/cleaner",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-600",
    },
    {
      icon: Wind,
      title: "AC Doctor",
      description: "Expert AC repair and maintenance. Keep your space cool and comfortable year-round.",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&q=80",
      path: "/ac-doctor",
      color: "from-teal-500/20 to-green-500/20",
      iconColor: "text-teal-600",
    },
    {
      icon: Heart,
      title: "Pet Care",
      description: "Loving care for your furry friends. Professional pet care services you can trust.",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&q=80",
      path: "/pet-caring",
      color: "from-pink-500/20 to-rose-500/20",
      iconColor: "text-pink-600",
    },
    {
      icon: UtensilsCrossed,
      title: "Catering",
      description: "Delicious meals for your events. Professional catering services for any occasion.",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop&q=80",
      path: "/catering",
      color: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-600",
    },
    {
      icon: Baby,
      title: "Babysitter",
      description: "Trusted and experienced babysitters. Background-checked professionals ensuring your peace of mind.",
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop&q=80",
      path: "/babysitter",
      color: "from-purple-500/20 to-indigo-500/20",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <section id="service" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground">
            Our Premium Services
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            One platform, many services. Everything you need for your home, all in one place.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl cursor-pointer bg-card"
                onClick={() => navigate(service.path)}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent z-10"></div>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-card/90 backdrop-blur-sm rounded-xl p-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`h-6 w-6 ${service.iconColor}`} />
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4 relative z-10">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <Button
                    variant="ghost"
                    className="w-full justify-between group/btn text-primary hover:text-primary-foreground hover:bg-primary p-0 h-auto font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(service.path);
                    }}
                  >
                    <span>Explore Service</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PremiumServices;
