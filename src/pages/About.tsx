import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShieldCheck, 
  DollarSign, 
  Heart, 
  Award, 
  Briefcase, 
  Users, 
  Smile, 
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  CheckCircle2
} from "lucide-react";

const About = () => {
  const navigate = useNavigate();
  const [jobsCompleted, setJobsCompleted] = useState(0);
  const [professionalsOnboarded, setProfessionalsOnboarded] = useState(0);
  const [happyCustomers, setHappyCustomers] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          // Animate Jobs Completed (15,000+)
          let jobsCount = 0;
          const jobsInterval = setInterval(() => {
            jobsCount += 150;
            setJobsCompleted(Math.min(jobsCount, 15000));
            if (jobsCount >= 15000) clearInterval(jobsInterval);
          }, 15);

          // Animate Professionals Onboarded (500+)
          let profCount = 0;
          const profInterval = setInterval(() => {
            profCount += 5;
            setProfessionalsOnboarded(Math.min(profCount, 500));
            if (profCount >= 500) clearInterval(profInterval);
          }, 20);

          // Animate Happy Customers (12,000+)
          let customersCount = 0;
          const customersInterval = setInterval(() => {
            customersCount += 120;
            setHappyCustomers(Math.min(customersCount, 12000));
            if (customersCount >= 12000) clearInterval(customersInterval);
          }, 15);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const coreValues = [
    {
      icon: ShieldCheck,
      title: "Verified Professionals",
      description: "Every professional on our platform undergoes rigorous background checks and verification processes to ensure safety and quality.",
      gradient: "from-blue-500/10 to-blue-600/20",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-500/10"
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "No hidden fees or surprises. Get upfront pricing before booking, so you know exactly what you're paying for.",
      gradient: "from-green-500/10 to-green-600/20",
      iconColor: "text-green-600",
      iconBg: "bg-green-500/10"
    },
    {
      icon: Heart,
      title: "Customer-First Mindset",
      description: "Your satisfaction is our priority. We're committed to making every interaction smooth, transparent, and delightful.",
      gradient: "from-pink-500/10 to-pink-600/20",
      iconColor: "text-pink-600",
      iconBg: "bg-pink-500/10"
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "We maintain the highest standards. Every service is backed by our quality guarantee and customer support.",
      gradient: "from-purple-500/10 to-purple-600/20",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-500/10"
    }
  ];

  const stats = [
    {
      icon: Briefcase,
      value: jobsCompleted.toLocaleString(),
      suffix: "+",
      label: "Jobs Completed",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      value: professionalsOnboarded.toLocaleString(),
      suffix: "+",
      label: "Professionals Onboarded",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Smile,
      value: happyCustomers.toLocaleString(),
      suffix: "+",
      label: "Happy Customers",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        {/* Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
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
          <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Trusted by thousands across the nation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="block text-foreground [text-shadow:0_2px_12px_rgba(0,0,0,0.1)] dark:[text-shadow:0_2px_12px_rgba(255,255,255,0.15)]">
                Built on Trust.
              </span>
              <span className="block mt-2 relative">
                <span className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/30 to-accent/40 blur-2xl opacity-60 -z-10 transform translate-y-2"></span>
                <span 
                  className="relative inline-block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent"
                  style={{
                    filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.25)) drop-shadow(0 4px 16px rgba(0, 0, 0, 0.15))',
                    WebkitFilter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.25)) drop-shadow(0 4px 16px rgba(0, 0, 0, 0.15))',
                  }}
                >
                  Powered by Professionals.
                </span>
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              WorkSure connects you with verified, skilled professionals who deliver excellence. 
              We're on a mission to make quality home services accessible, transparent, and trustworthy for everyone.
            </p>
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

      {/* Story / Mission Section */}
      <section className="relative py-24 bg-gradient-to-b from-background to-primary/5 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
                <Target className="h-4 w-4" />
                <span>Our Story</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Why WorkSure Exists
              </h2>
            </div>

            {/* Story Content */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Visual Element */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50"></div>
                <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Zap className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-primary/20 rounded-full mb-2"></div>
                        <div className="h-2 bg-primary/10 rounded-full w-3/4"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-accent/20 rounded-full mb-2 w-5/6"></div>
                        <div className="h-2 bg-accent/10 rounded-full w-2/3"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-primary/20 rounded-full mb-2 w-4/5"></div>
                        <div className="h-2 bg-primary/10 rounded-full w-3/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-6">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Finding reliable, skilled professionals for home services shouldn't be a challenge. Yet, for years, 
                  homeowners struggled with uncertainty—unverified providers, hidden costs, and inconsistent quality.
                </p>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  WorkSure was born to solve this. We've built a platform that bridges the gap between homeowners 
                  seeking quality services and skilled professionals ready to deliver excellence. Every interaction 
                  on our platform is designed to build trust, ensure transparency, and exceed expectations.
                </p>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  We're different because we don't just connect you with service providers—we verify, we guarantee, 
                  and we support. Your peace of mind is our commitment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Trust Points */}
      <section className="relative py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            {/* Section Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
                <Award className="h-4 w-4" />
                <span>What We Stand For</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Our Core Values
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The principles that guide every decision we make and every service we deliver
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {coreValues.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card 
                    key={index}
                    className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    <CardContent className="relative p-8">
                      <div className="flex items-start gap-6">
                        <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${value.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-8 w-8 ${value.iconColor}`} />
                        </div>
                        <div className="flex-1 space-y-3">
                          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {value.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Social Proof */}
      <section 
        ref={statsRef}
        className="relative py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/2 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
                <Sparkles className="h-4 w-4" />
                <span>By The Numbers</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Trust Built Through Results
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Real impact, real results, real trust
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Card className="relative h-full border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                      <CardContent className="p-8 text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:scale-110 transition-transform duration-300">
                          <Icon className={`h-8 w-8 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                        </div>
                        <div className="space-y-2">
                          <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {stat.value}{stat.suffix}
                          </div>
                          <div className="text-lg font-semibold text-muted-foreground">
                            {stat.label}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Discover verified professionals and quality services that match your needs. 
              Your next trusted service provider is just a click away.
            </p>
            <Button
              size="lg"
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  const element = document.getElementById("service");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }, 100);
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-7 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              Explore Services
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
