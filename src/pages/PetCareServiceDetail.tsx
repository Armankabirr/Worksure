import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Heart, ShieldCheck, Clock, CheckCircle2, Sparkles, PawPrint } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { petCareServicesData } from "@/lib/petCareServices";
import NotFound from "./NotFound";
import { useState, useEffect, useRef } from "react";

const PetCareServiceDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const serviceData = slug ? petCareServicesData[slug] : null;

  if (!serviceData) {
    return <NotFound />;
  }

  const handleBookNow = () => {
    navigate(`/search/workers?serviceType=pet-caring&service=${serviceData.slug}`);
  };

  const handleAddToCart = () => {
    const priceMatch = serviceData.startingPrice.match(/\d+/);
    const price = priceMatch ? parseInt(priceMatch[0].replace(/,/g, "")) : 0;

    addToCart({
      serviceType: "pet-caring",
      serviceName: serviceData.title,
      price: price,
      description: serviceData.description,
      image: serviceData.heroImage,
    });

    toast.success(`${serviceData.title} added to cart!`, {
      description: "Your pet's care is just one step away.",
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
    });
  };

  const howItWorks = [
    {
      title: "Choose Your Schedule",
      description: "Select a convenient date and time. We work around your schedule to provide the best care for your pet.",
    },
    {
      title: "Meet Your Caregiver",
      description: "We arrange a free meet-and-greet so your pet can get comfortable with their caregiver before service begins.",
    },
    {
      title: "Peaceful Care Experience",
      description: `Your pet receives loving ${serviceData.title.toLowerCase()}, with daily updates and photos so you stay connected.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50/30 to-amber-50 pt-20">
      <Header />
      <main className="overflow-hidden">
        {/* Hero Section */}
        <section ref={heroRef} className="relative overflow-hidden">
          {/* Soft gradient backgrounds */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute top-40 right-20 w-80 h-80 bg-orange-200/40 rounded-full blur-3xl animate-float-slower" />
          </div>

          <div className="container mx-auto px-6 py-16 lg:py-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-pink-100 to-orange-100 px-6 py-3 border border-pink-200/50">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <span className="text-sm font-semibold text-pink-700 tracking-wide">Loving Pet Care</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-gray-900">{serviceData.title}</span>
                  <span className="block bg-gradient-to-r from-pink-500 via-orange-500 to-amber-500 bg-clip-text text-transparent mt-2">
                    {serviceData.subtitle}
                  </span>
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                  {serviceData.description}
                </p>
                <div className="flex items-center gap-6 pt-2">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Starting Price</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                      {serviceData.startingPrice}
                    </p>
                  </div>
                  <div className="h-12 w-px bg-gradient-to-b from-transparent via-pink-200 to-transparent" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Duration</p>
                    <p className="text-xl font-semibold text-gray-900">{serviceData.duration}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button
                    size="lg"
                    onClick={handleBookNow}
                    className="rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Book Pet Care
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleAddToCart}
                    className="rounded-full border-2 border-pink-300 text-pink-700 hover:bg-pink-50 px-10 py-6 text-lg font-semibold"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>

              <div className={`relative transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="absolute -inset-6 bg-gradient-to-tr from-pink-200/50 via-orange-200/50 to-amber-200/50 rounded-[3rem] blur-2xl animate-float-slower" />
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                  <img 
                    src={serviceData.heroImage} 
                    alt={serviceData.title}
                    className="w-full h-full object-cover aspect-[4/3]"
                  />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="rounded-2xl bg-white/90 backdrop-blur-sm border border-pink-200 px-6 py-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500">
                          <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">100% Verified</p>
                          <p className="text-sm font-bold text-gray-900">Background-Checked Caregivers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 mb-4">
                <Sparkles className="h-4 w-4 text-pink-600" />
                <span className="text-xs font-semibold text-pink-700 uppercase tracking-wider">What's Included</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Everything Your Pet Needs
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We provide comprehensive care tailored to your pet's unique needs and preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {serviceData.included.map((item, index) => (
                <Card
                  key={index}
                  className="border-none bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-soft hover:shadow-lg transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${100 + index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-pink-100 to-orange-100 flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-5 w-5 text-pink-600" />
                    </div>
                    <p className="text-gray-700 leading-relaxed flex-1">{item}</p>
                  </div>
                </Card>
              ))}
            </div>

            {serviceData.notIncluded && serviceData.notIncluded.length > 0 && (
              <Card className="border-none bg-amber-50/50 backdrop-blur-sm rounded-3xl p-8 shadow-soft animate-fade-up" style={{ animationDelay: "400ms" }}>
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Clock className="h-6 w-6 text-amber-600" />
                    Not Included (Available as Add-Ons)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {serviceData.notIncluded.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="text-amber-600 mt-1">•</span>
                        <p className="text-gray-600 text-sm leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Service Details */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 animate-fade-up">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 mb-4">
                  <PawPrint className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Service Details</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Why Choose This Service
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviceData.serviceDetails.map((detail, index) => (
                  <Card
                    key={index}
                    className="border-none bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-soft hover:shadow-xl transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${150 + index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 flex-shrink-0">
                        <Heart className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-gray-700 leading-relaxed text-base flex-1 pt-1">{detail}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Care Tips */}
        {serviceData.careTips && serviceData.careTips.length > 0 && (
          <section className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12 animate-fade-up">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 mb-4">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Care Tips</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  How We Care for Your Pet
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviceData.careTips.map((tip, index) => (
                  <Card
                    key={index}
                    className="border-none bg-gradient-to-br from-pink-50 to-orange-50 rounded-3xl p-6 shadow-soft hover:shadow-xl transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${200 + index * 100}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-bold text-gray-900">{tip.tip}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 leading-relaxed text-base">
                        {tip.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="bg-gradient-to-br from-gray-50 to-white py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12 animate-fade-up">
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 mb-4">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Simple Process</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  How It Works
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {howItWorks.map((step, index) => (
                  <div
                    key={step.title}
                    className="relative animate-fade-up"
                    style={{ animationDelay: `${250 + index * 150}ms` }}
                  >
                    {index < howItWorks.length - 1 && (
                      <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-pink-200 via-orange-200 to-amber-200 z-0" style={{ width: 'calc(100% - 4rem)' }} />
                    )}

                    <Card className="relative z-10 border-none bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-soft hover:shadow-xl transition-all duration-300 text-center h-full">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-100 to-orange-100 mb-6">
                        <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                          {index + 1}
                        </span>
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-3">{step.title}</CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed text-base">
                        {step.description}
                      </CardDescription>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 mb-4">
                <Heart className="h-4 w-4 text-pink-600" />
                <span className="text-xs font-semibold text-pink-700 uppercase tracking-wider">Questions?</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Have more questions? We're here to help you feel confident about your pet's care.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {serviceData.faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-none bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <AccordionTrigger className="text-lg font-semibold text-gray-900 hover:no-underline pr-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pt-2 pr-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-pink-500 via-orange-500 to-amber-500 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Give Your Pet the Best Care?
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Book {serviceData.title} today and give your pet the loving care they deserve.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  onClick={handleBookNow}
                  className="rounded-full bg-white text-pink-600 hover:bg-gray-50 px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Book Pet Care Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/pet-caring")}
                  className="rounded-full border-2 border-white text-white hover:bg-white/10 px-10 py-6 text-lg font-semibold backdrop-blur-sm"
                >
                  View All Services
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PetCareServiceDetail;
