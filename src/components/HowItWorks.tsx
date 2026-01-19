import { Search, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Choose a Service",
      description: "Browse our wide range of professional services. From electricians to cleaners, find exactly what you need.",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-600",
    },
    {
      number: "02",
      icon: Calendar,
      title: "Book a Professional",
      description: "Select a verified professional, choose your preferred time slot, and confirm your booking in seconds.",
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-600",
    },
    {
      number: "03",
      icon: CheckCircle2,
      title: "Relax — Job Done Right",
      description: "Sit back and relax while our professionals handle everything. Quality guaranteed, satisfaction assured.",
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-600",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Getting the help you need is simple. Three easy steps to professional service.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            return (
              <div key={index} className="relative">
                {/* Connector Arrow (Desktop) */}
                {!isLast && (
                  <div className="hidden md:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0" style={{ width: "calc(100% - 4rem)" }}>
                    <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 h-6 w-6 text-primary bg-background rounded-full p-1" />
                  </div>
                )}

                <Card className="group relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl bg-card h-full">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                  <CardContent className="p-8 space-y-6 relative z-10 text-center">
                    {/* Step Number */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 group-hover:bg-primary/20 border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300 mb-4">
                      <span className="text-3xl font-bold text-primary">{step.number}</span>
                    </div>

                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-background group-hover:bg-primary/10 transition-colors duration-300">
                      <Icon className={`h-8 w-8 ${step.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
