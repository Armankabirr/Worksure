import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImage from "@/assets/electrician.jpg";
import teamImage from "@/assets/cleaning-team.jpg";

const Electrician = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Best Home Electrician Service</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            Your Trusted Electrician
            <span className="block text-primary">Safe, Fast, and Affordable</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            24/7 service for repairs, installs, and maintenance — using only certified, background-checked
            professionals for your home and office.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 shadow-lg hover:shadow-xl">
              Book an Electrician
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              View Pricing
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">32+ Years Experience</p>
              <p>Licensed and insured electricians you can trust.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">2,649+ Jobs Completed</p>
              <p>Thousands of homes powered safely.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-accent/30 to-primary/10 rounded-3xl blur-3xl opacity-70" />
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/70">
            <img src={heroImage} alt="Professional electrician at work" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

        {/* How It Works */}
        <section className="bg-card/40 border-y border-border/60">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">How To Get Our Service</h2>
            <p className="text-muted-foreground mt-3">
              Simple steps to book trusted electricians. We handle the details so you get quick, safe, and clean work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Choose Your Time",
                description: "Pick a convenient time slot — same day and emergency bookings available.",
              },
              {
                title: "Book Schedule",
                description: "Tell us your issue and our team assigns the best electrician for the job.",
              },
              {
                title: "Our Team Arrives",
                description: "Your electrician arrives on time, fully equipped, and ready to work safely.",
              },
            ].map((step, index) => (
              <Card key={step.title} className="relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                <CardHeader className="pb-3">
                  <p className="text-xs font-semibold text-primary/80">Step 0{index + 1}</p>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        </section>

        {/* Electrician Services */}
        <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Electric &amp; Plumbing</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Complete Electrical Services</h2>
          <p className="text-muted-foreground mt-3">
            From quick fixes to full rewiring, we cover every type of residential and small commercial electrical work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { title: "Wiring &amp; Rewiring", description: "Safe installation and replacement of home wiring systems." },
            { title: "Electrical Panels", description: "Upgrade or repair distribution boards and breakers." },
            { title: "Lighting Installations", description: "Indoor, outdoor, and smart lighting solutions." },
          ].map((service) => (
            <Card key={service.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Appliance Repair", description: "Fix short circuits, power issues, and faulty sockets." },
            { title: "Emergency Service", description: "24/7 rapid response for urgent electrical problems." },
            { title: "Safety Inspection", description: "Full electrical health check with clear recommendations." },
          ].map((service) => (
            <Card key={service.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.25em] font-semibold">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-bold">Trusted Service With Affordable Price</h2>
            <p className="text-primary-foreground/80">
              We combine certified expertise, transparent pricing, and friendly support to deliver worry-free electrical
              work in every room of your home.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-3xl font-bold">32+</p>
                <p>Years of combined electrician experience.</p>
              </div>
              <div>
                <p className="text-3xl font-bold">2,649+</p>
                <p>Electrical jobs completed safely and on time.</p>
              </div>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="mt-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Get Started
            </Button>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-primary-foreground/10 rounded-3xl blur-2xl" />
            <Card className="relative bg-primary-foreground text-primary rounded-3xl overflow-hidden border-none shadow-2xl">
              <CardHeader>
                <CardTitle>Safe Power For Your Home</CardTitle>
                <CardDescription className="text-primary/80">
                  From small troubleshooting to full upgrades, we ensure every cable, outlet, and switch is safe and
                  reliable.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 pt-0">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">What&apos;s Included</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Licensed electricians</li>
                    <li>Clear, upfront quotes</li>
                    <li>Clean work area guarantee</li>
                  </ul>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Popular Jobs</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Fan &amp; light installation</li>
                    <li>Socket &amp; switch repair</li>
                    <li>Panel upgrades</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Questions &amp; Answers</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              If you have any more questions about our electrician service, feel free to contact us anytime. We&apos;re
              here to help.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What types of electrical issues do you handle?</AccordionTrigger>
              <AccordionContent>
                We handle everything from tripping breakers, power loss, and faulty outlets to full rewiring, panel
                upgrades, and lighting design.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Do you provide emergency electrician service?</AccordionTrigger>
              <AccordionContent>
                Yes, we offer 24/7 emergency support for urgent electrical issues that can&apos;t wait, such as burning
                smells, sparks, or major outages.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Are your electricians licensed and insured?</AccordionTrigger>
              <AccordionContent>
                All of our electricians are fully licensed, insured, and background-checked to ensure your safety and
                peace of mind.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How does pricing work?</AccordionTrigger>
              <AccordionContent>
                We provide transparent, upfront quotes before work begins. For complex issues, we perform an on-site
                inspection and then share a clear breakdown of costs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        </section>

        {/* Team Section */}
        <section className="bg-card/40 border-t border-border/60">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Our Electricians</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet Our Expert Electrician Team</h2>
              <p className="text-muted-foreground">
                Our team is made up of friendly professionals who treat your home like their own. We double-check every
                connection, run safety tests, and clean up before we leave.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground">Background Checked</p>
                  <p className="text-muted-foreground">Every electrician passes strict background and safety checks.</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">On-Time Guarantee</p>
                  <p className="text-muted-foreground">We respect your schedule and keep you updated at every step.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 bg-primary/10 rounded-3xl blur-2xl" />
              <img
                src={teamImage}
                alt="Electrician team"
                className="relative rounded-3xl shadow-2xl w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
};

export default Electrician;


