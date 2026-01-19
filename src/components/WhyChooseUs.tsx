import { ShieldCheck, DollarSign, Clock, Headphones, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WhyChooseUs = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Background-Checked Professionals",
      description: "Every professional on our platform undergoes rigorous background verification. Your safety is our priority.",
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-600",
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "No hidden charges, no surprises. See exactly what you'll pay upfront with clear, honest pricing.",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-600",
    },
    {
      icon: Clock,
      title: "Fast & Reliable",
      description: "Book a service in minutes. Our professionals arrive on time and get the job done efficiently.",
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-600",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support. We're here whenever you need us, day or night.",
      color: "from-orange-500/20 to-red-500/20",
      iconColor: "text-orange-600",
    },
    {
      icon: CheckCircle2,
      title: "Satisfaction Guarantee",
      description: "Not happy? We'll make it right. Your satisfaction is guaranteed, or we'll work until you're satisfied.",
      color: "from-teal-500/20 to-green-500/20",
      iconColor: "text-teal-600",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground">
            Why Choose WorkSure?
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We've built our platform with trust, transparency, and your peace of mind at the core.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 hover:shadow-xl bg-card"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <CardContent className="p-8 space-y-4 relative z-10">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 mb-4">
                    <Icon className={`h-8 w-8 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
