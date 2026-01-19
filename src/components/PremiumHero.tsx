import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PremiumHero = () => {
  const navigate = useNavigate();

  const handlePrimaryClick = () => {
    // Navigate directly to services section - instant and responsive
    const element = document.getElementById("service");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Fallback: navigate to services page if section not found
      navigate("/#service");
    }
  };

  const handleHowItWorks = () => {
    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleViewServices = () => {
    const element = document.getElementById("service");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-20">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-primary/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
            size={16}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span>Trusted by thousands of happy customers</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <span className="block text-foreground [text-shadow:0_2px_12px_rgba(0,0,0,0.1)] dark:[text-shadow:0_2px_12px_rgba(255,255,255,0.15)]">
              Trusted Home Services,
            </span>
            <span className="block mt-2 relative">
              {/* Subtle glow backdrop for depth */}
              <span className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/30 to-accent/40 blur-2xl opacity-60 -z-10 transform translate-y-2"></span>
              {/* Main gradient text with enhanced contrast */}
              <span 
                className="relative inline-block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent"
                style={{
                  filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.25)) drop-shadow(0 4px 16px rgba(0, 0, 0, 0.15))',
                  WebkitFilter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.25)) drop-shadow(0 4px 16px rgba(0, 0, 0, 0.15))',
                }}
              >
                Done Right
              </span>
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Connect with verified professionals for all your home service needs. 
            Quality guaranteed, satisfaction assured.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button
              size="lg"
              onClick={handlePrimaryClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-7 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              Find a Service
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleViewServices}
              className="border-2 border-primary/40 text-primary hover:bg-primary/5 hover:border-primary px-12 py-7 text-lg rounded-xl transition-all duration-300 hover:scale-105"
            >
              View All Services
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={handleHowItWorks}
              className="text-muted-foreground hover:text-primary hover:bg-primary/5 px-8 py-7 text-lg rounded-xl transition-all duration-300"
            >
              How It Works
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-16 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Background-checked professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Transparent pricing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Satisfaction guarantee</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.4; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default PremiumHero;
