import { Sparkles, Shield, Zap, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SpecialHighlight = () => {
  const highlights = [
    {
      icon: Sparkles,
      title: "One Platform, Many Services",
      description: "From electrical work to pet care, everything you need is right here. No need to juggle multiple apps or websites.",
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-600",
    },
    {
      icon: Shield,
      title: "Consistent Quality",
      description: "Every professional meets our strict quality standards. Experience the same level of excellence across all services.",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-600",
    },
    {
      icon: Zap,
      title: "Smart Matching",
      description: "Our intelligent system matches you with the perfect professional based on your needs, location, and preferences.",
      color: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-600",
    },
    {
      icon: Heart,
      title: "Emotional Care",
      description: "We understand that your home and loved ones deserve more than just service—they deserve care and attention.",
      color: "from-pink-500/20 to-rose-500/20",
      iconColor: "text-pink-600",
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground">
            What Makes Us Different
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We're not just another service platform. We're your trusted partner in making your home life easier.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl bg-card"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${highlight.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <CardContent className="p-8 space-y-4 relative z-10">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 mb-4">
                    <Icon className={`h-8 w-8 ${highlight.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {highlight.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-xl text-muted-foreground mb-6">
            Ready to experience the difference?
          </p>
        </div>
      </div>
    </section>
  );
};

export default SpecialHighlight;
