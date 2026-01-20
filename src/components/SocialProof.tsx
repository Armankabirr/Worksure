import { useEffect, useRef, useState } from "react";
import { Users, Briefcase, Heart, Star } from "lucide-react";

const SocialProof = () => {
  const [professionals, setProfessionals] = useState(0);
  const [jobsCompleted, setJobsCompleted] = useState(0);
  const [happyCustomers, setHappyCustomers] = useState(0);
  const [rating, setRating] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          // Animate professionals count
          let profCount = 0;
          const profInterval = setInterval(() => {
            profCount += 5;
            setProfessionals(Math.min(profCount, 500));
            if (profCount >= 500) clearInterval(profInterval);
          }, 20);

          // Animate jobs completed
          let jobsCount = 0;
          const jobsInterval = setInterval(() => {
            jobsCount += 25;
            setJobsCompleted(Math.min(jobsCount, 10000));
            if (jobsCount >= 10000) clearInterval(jobsInterval);
          }, 15);

          // Animate happy customers
          let customersCount = 0;
          const customersInterval = setInterval(() => {
            customersCount += 10;
            setHappyCustomers(Math.min(customersCount, 8500));
            if (customersCount >= 8500) clearInterval(customersInterval);
          }, 15);

          // Animate rating
          let ratingCount = 0;
          const ratingInterval = setInterval(() => {
            ratingCount += 0.1;
            setRating(Math.min(ratingCount, 4.9));
            if (ratingCount >= 4.9) clearInterval(ratingInterval);
          }, 20);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: Users,
      value: professionals,
      suffix: "+",
      label: "Professionals Onboarded",
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-600",
    },
    {
      icon: Briefcase,
      value: jobsCompleted,
      suffix: "+",
      label: "Jobs Completed",
      color: "from-green-500/20 to-emerald-500/20",
      iconColor: "text-green-600",
    },
    {
      icon: Heart,
      value: happyCustomers,
      suffix: "+",
      label: "Happy Customers",
      color: "from-pink-500/20 to-rose-500/20",
      iconColor: "text-pink-600",
    },
    {
      icon: Star,
      value: rating,
      suffix: "/5",
      label: "Average Rating",
      color: "from-yellow-500/20 to-orange-500/20",
      iconColor: "text-yellow-600",
      isDecimal: true,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-primary/5 via-background to-primary/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: "30px 30px",
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center space-y-4 p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-all duration-500 hover:shadow-xl group"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                  <Icon className={`h-8 w-8 ${stat.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                </div>

                {/* Value */}
                <div className="space-y-1">
                  <div className="text-5xl md:text-6xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {stat.isDecimal ? stat.value.toFixed(1) : stat.value.toLocaleString()}
                    <span className="text-3xl text-primary">{stat.suffix}</span>
                  </div>
                  <p className="text-muted-foreground text-lg font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
