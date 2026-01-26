import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/babysitter.png";
import pregnantImage from "@/assets/team-illustration.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Activity,
  Baby,
  CalendarClock,
  CheckCircle2,
  Clock,
  Clock3,
  GraduationCap,
  HandHeart,
  Heart,
  Home,
  Moon,
  MoonStar,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Users,
} from "lucide-react";

const popularServices = [
  { 
    title: "Hourly babysitting", 
    desc: "Flexible hourly rates for short-term care needs.", 
    image: "src/assets/baby-images/baby-1.jpg",
    icon: Clock,
    benefits: ["Flexible scheduling", "Affordable rates"],
    color: "from-orange-400"
  },
  { 
    title: "Full day care", 
    desc: "Complete daylong supervision and activities.", 
    image: "src/assets/baby-images/baby-2.png",
    icon: Sun,
    benefits: ["Full supervision", "Meal planning"],
    color: "from-yellow-400"
  },
  { 
    title: "Night care", 
    desc: "Experienced overnight caregivers for peace of mind.", 
    image: "src/assets/baby-images/baby-3.webp",
    icon: Moon,
    benefits: ["24/7 monitoring", "Safe environment"],
    color: "from-indigo-400"
  },
  { 
    title: "Newborn care", 
    desc: "Specialized care for newborns and infants.", 
    image: "src/assets/baby-images/baby-4.jfif",
    icon: Baby,
    benefits: ["Professional training", "Gentle care"],
    color: "from-pink-400"
  },
  { 
    title: "Playing & Activities", 
    desc: "Engaging games, crafts, and educational activities.", 
    image: "src/assets/baby-images/baby-5.jfif",
    icon: Play,
    benefits: ["Creative play", "Learning fun"],
    color: "from-green-400"
  },
  { 
    title: "Homework help", 
    desc: "Tutoring and educational support for school assignments.", 
    image: "src/assets/baby-images/baby-6.webp",
    icon: GraduationCap,
    benefits: ["Expert tutoring", "Academic growth"],
    color: "from-blue-400"
  },
];

const sitterProfiles = [
  { name: "Paula Cooper", city: "Seattle, USA", rating: 5.0, reviews: 20, price: 200, avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { name: "Naomi Cooper", city: "San Jose, USA", rating: 5.0, reviews: 21, price: 250, avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
  { name: "Sherif Hammond", city: "Los Angeles, USA", rating: 4.9, reviews: 18, price: 230, avatar: "https://randomuser.me/api/portraits/men/76.jpg" },
];

const testimonials = [
  {
    name: "Walter Anderson",
    quote: "Excellent care and peace of mind. The babysitters were professional, kind, and my children adored them.",
    highlight: "Excellent care and peace of mind",
    date: "May 7, 2023",
  },
  {
    name: "Susan Tonks",
    quote: "Trustworthy and reliable service. They built strong bonds with my kids and kept the house tidy, too.",
    highlight: "Trustworthy and reliable service",
    date: "April 8, 2023",
  },
  {
    name: "John Davis",
    quote: "I felt like family. Finding the right care was simple, and my kids were so happy after each visit.",
    highlight: "I felt like family",
    date: "May 12, 2023",
  },
];

const Babysitter = () => {
  const navigate = useNavigate();
  const { authStatus, openLogin } = useAuth();

  const handleBookNow = () => {
    if (authStatus !== "authenticated") {
      openLogin();
      return;
    }
    navigate("/search/workers?serviceType=babysitter");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/70 via-white to-purple-50/40 flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden pt-24 md:pt-28 pb-14 md:pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 via-white to-purple-100/50" />
          <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-purple-200/30 blur-3xl" />
          <div className="container relative grid items-center gap-10 px-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/80 text-foreground shadow-sm">Trusted by 10,000+ families</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-orange-500" />
                  Safe & Reliable
                </div>
              </div>
              <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">Babysitter Services</h1>
              <p className="max-w-xl text-base text-muted-foreground md:text-lg">
                Babysitters to serve your every need. Regular and reliable child care. Our trusted babysitters ensure your child is entertained, supervised, and nurtured.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-white/60">
                  <Star className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="font-semibold text-foreground">4.9/5 rating</div>
                    <p className="text-sm text-muted-foreground">From parents across the city</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-white/60">
                  <Heart className="h-5 w-5 text-fuchsia-500" />
                  <div>
                    <div className="font-semibold text-foreground">Warm caregivers</div>
                    <p className="text-sm text-muted-foreground">Responsive, playful, and patient</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button 
                  className="bg-orange-500 text-white shadow-md hover:bg-orange-600"
                  onClick={() => window.open('https://youtu.be/020g-0hhCAU?si=U6qq1PHNTcH9QWPb', '_blank')}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch video
                </Button>
                <Button variant="outline" className="border-orange-300 bg-white/70 text-orange-600 hover:bg-orange-50">
                  Learn more
                </Button>
              </div>
            </div>
            <div className="relative flex justify-center md:justify-end">
              <div className="relative rounded-[32px] bg-white/80 p-4 shadow-xl ring-1 ring-white/60">
                <div className="absolute left-6 top-6 h-16 w-16 rounded-full bg-orange-200/60 blur-2xl" />
                <div className="absolute right-6 bottom-6 h-16 w-16 rounded-full bg-purple-200/60 blur-2xl" />
                <img src={heroImage} alt="Babysitter with child" className="relative h-96 w-full max-w-lg rounded-3xl object-cover shadow-lg" />
                <div className="absolute -bottom-6 left-1/2 flex w-[85%] -translate-x-1/2 items-center justify-between rounded-2xl bg-white/95 px-4 py-3 shadow-md">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-orange-500" />
                    Engaging activities
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock3 className="h-4 w-4 text-fuchsia-500" />
                    On-time arrival
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container px-6 pb-16">
          <div className="grid items-center gap-10 rounded-[28px] bg-white/80 p-8 shadow-lg ring-1 ring-orange-100 md:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-4">
              <Badge className="bg-orange-50 text-orange-700">Before & After Pregnancy</Badge>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">Assistance Before & After Pregnancy</h2>
              <p className="text-muted-foreground">
                Your one-stop solution for all babysitting needs, offering both prenatal and postnatal programs. We understand your journey and are ready to provide all the support you need to feel secure and supported.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {["Prenatal guidance", "Postnatal support", "Nutrition planning", "Emotional well-being"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-secondary">
                    <CheckCircle2 className="h-4 w-4 text-orange-500" />
                    {item}
                  </div>
                ))}
              </div>
              <Button className="bg-orange-500 text-white shadow-md hover:bg-orange-600" onClick={handleBookNow}>Schedule</Button>
            </div>
            <div className="relative flex justify-center md:justify-end">
              <div className="relative inline-flex items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-br from-orange-50 to-fuchsia-50 shadow-lg ring-1 ring-white/60">
                <iframe 
                  width="100%"
                  height="320"
                  src="https://www.youtube.com/embed/gscjA46is7I?autoplay=1&mute=1&loop=1&playlist=gscjA46is7I"
                  title="Pregnancy Assistance Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="relative rounded-[24px] max-w-md"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container px-6 pb-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-orange-600">Popular Services</p>
              <h3 className="text-2xl font-bold text-foreground">Choose the perfect care for your family</h3>
            </div>
            <Button variant="ghost" className="text-sm text-orange-600 hover:bg-orange-50">See more</Button>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} className="border border-orange-100/70 bg-white/90 shadow-md transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl overflow-hidden group flex flex-col">
                  {/* Image Container with Overlay */}
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent opacity-60 group-hover:opacity-50 transition-opacity duration-300`} />
                    
                    {/* Icon Badge */}
                    <div className={`absolute top-4 right-4 bg-gradient-to-br ${service.color} to-white/20 p-3 rounded-full shadow-lg backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Quick Benefits Chips */}
                    <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {service.benefits.map((benefit, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded-full bg-white/90 text-foreground font-medium shadow-sm">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-foreground group-hover:text-orange-600 transition-colors duration-300">{service.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground leading-relaxed">{service.desc}</CardDescription>
                  </CardHeader>

                  {/* Footer with Button */}
                  <CardContent className="mt-auto">
                    <Button 
                      size="sm" 
                      onClick={handleBookNow}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium"
                    >
                      Schedule Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="container px-6 pb-16">
          <div className="flex flex-wrap items-center gap-3 pb-4 text-sm text-muted-foreground">
            <Badge className="bg-orange-50 text-orange-700">Tutoring & Education</Badge>
            <Badge className="bg-purple-50 text-purple-700">Activity Planning</Badge>
          </div>
          <h3 className="text-2xl font-bold text-foreground">Best Baby Sitters</h3>
          <p className="text-muted-foreground">Experienced and trained caregivers ready to assist your family.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {sitterProfiles.map((sitter) => (
              <Card key={sitter.name} className="border border-orange-100/80 bg-white/90 shadow-sm">
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <img src={sitter.avatar} alt={sitter.name} className="h-12 w-12 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{sitter.name}</div>
                      <p className="text-xs text-muted-foreground">{sitter.city}</p>
                    </div>
                    <Heart className="h-4 w-4 text-orange-400" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-orange-500" />
                    {sitter.rating} ({sitter.reviews} reviews)
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-orange-50/60 px-3 py-2">
                    <div className="text-sm text-secondary">
                      <div className="font-semibold text-foreground">${sitter.price}</div>
                      <p className="text-xs text-muted-foreground">per hour</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={handleBookNow}
                      className="bg-orange-500 text-white shadow-sm hover:bg-orange-600"
                    >
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-white/80 py-14">
          <div className="container px-6">
            <p className="text-sm font-semibold text-orange-600">Testimonial</p>
            <h3 className="text-2xl font-bold text-foreground">What They Say About Our Service</h3>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.name} className="border border-orange-100/80 bg-white/90 shadow-sm">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base font-semibold text-foreground">{t.name}</CardTitle>
                        <div className="flex items-center gap-1 text-orange-500">
                          <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                          5.0
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{t.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm font-semibold text-secondary">{t.highlight}</p>
                    <p className="text-sm text-muted-foreground">{t.quote}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Babysitter;
