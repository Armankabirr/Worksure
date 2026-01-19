import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Form submitted:", values);
      
      setSubmitSuccess(true);
      form.reset();
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });

      // Reset success state after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactOptions = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email anytime",
      value: "support@worksure.com",
      href: "mailto:support@worksure.com",
      gradient: "from-blue-500/10 to-blue-600/20",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-500/10",
    },
    {
      icon: Phone,
      title: "Phone",
      description: "Call us during business hours",
      value: "+8801316037133",
      href: "tel:+8801316037133",
      gradient: "from-green-500/10 to-green-600/20",
      iconColor: "text-green-600",
      iconBg: "bg-green-500/10",
    },
    {
      icon: MapPin,
      title: "Office Location",
      description: "Visit us at our headquarters",
      value: "House:8i, Road: 01, Block: D, Bashundhara R/A, Dhaka-1229",
      href: "#",
      gradient: "from-purple-500/10 to-purple-600/20",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        {/* Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
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
          <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block text-foreground">
                We're Here to Help
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have a question? Need support? We'd love to hear from you. 
              Reach out and we'll respond as soon as possible.
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

      {/* Contact Options */}
      <section className="relative py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {contactOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <Card
                    key={index}
                    className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    <CardContent className="relative p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${option.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-8 w-8 ${option.iconColor}`} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {option.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                          <a
                            href={option.href}
                            className="block mt-3 text-primary font-semibold hover:underline transition-colors"
                          >
                            {option.value}
                          </a>
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

      {/* Contact Form */}
      <section className="relative py-20 bg-gradient-to-b from-background to-primary/5 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-border/50 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                {submitSuccess ? (
                  <div className="text-center space-y-6 py-8">
                    <div className="flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-muted-foreground">
                        Thank you for reaching out. We'll get back to you as soon as possible.
                      </p>
                    </div>
                    <Button
                      onClick={() => setSubmitSuccess(false)}
                      variant="outline"
                      className="mt-4"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-8 space-y-2">
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        Send Us a Message
                      </h2>
                      <p className="text-muted-foreground">
                        Fill out the form below and we'll respond promptly
                      </p>
                    </div>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your name"
                                  className="h-12 rounded-lg border-2 focus:border-primary transition-colors"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your.email@example.com"
                                  className="h-12 rounded-lg border-2 focus:border-primary transition-colors"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-semibold">Message</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us how we can help you..."
                                  className="min-h-[160px] rounded-lg border-2 focus:border-primary transition-colors resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-12 text-base font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                          size="lg"
                        >
                          {isSubmitting ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-5 w-5" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
