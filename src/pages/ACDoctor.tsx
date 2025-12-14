import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import heroImage from "@/assets/ac-doctor.jpg";
import teamImage from "@/assets/team-illustration.jpg";
import mahfuzImage from "@/assets/AC MR.png";

const ACDoctor = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />

      <main>
        {/* Hero */}
        <section className="container mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.25em] text-primary font-semibold">Welcome to</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              AC Doctor
              <span className="block text-primary">Your Trusted Air Conditioning Care Partner</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              We keep your cooling systems healthy and efficient. From cleaning and maintenance to quick repairs,
              our expert team ensures your AC runs smoothly year-round.
            </p>

            <div className="flex gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow-lg">Book Now</Button>
              <Button size="lg" variant="outline" className="border-primary text-primary">View Plans</Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-primary/20 via-accent/30 to-primary/10 rounded-3xl blur-3xl opacity-60" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/60">
              <img src={heroImage} alt="AC technician" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Pricing / Plans */}
        <section className="container mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Transparent Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Transparent Pricing for You</h2>
            <p className="text-muted-foreground mt-3">Start saving time today and choose your best plan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              title: 'AC Service',
              price: '3000',
              features: ['Cleaning', 'Maintenance', 'Performance Check']
            }, {
              title: 'AC Installation',
              price: '2500',
              features: ['AC Fitting', 'Guaranteed Service', 'Outdoor Fitting']
            }, {
              title: 'AC Repair',
              price: '4000',
              features: ['AC Repairing', 'Performance Check', 'Energy Efficiency']
            }].map((plan) => (
              <Card key={plan.title} className="relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                <CardHeader className="pb-3 text-center">
                  <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-extrabold text-foreground">{plan.price}</p>
                  <div className="py-4 text-sm text-muted-foreground">
                    {plan.features.map((f) => (<p key={f}>{f}</p>))}
                  </div>
                  <Button className="bg-primary text-primary-foreground">Book Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team carousel / section */}
        <section className="container mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h3 className="text-2xl font-bold">We Have Expert Team</h3>
            <p className="text-muted-foreground mt-2">Meet our expert technicians who keep your AC systems efficient.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
v            {[
              { name: 'Arman Kabir', role: 'AC Technician', image: teamImage },
              { name: 'Mahfuzur Rahman', role: 'AC Cleaner', image: mahfuzImage },
              { name: 'Tanvir Tomal', role: 'AC Service', image: teamImage },
            ].map((m) => (
              <Card key={m.name} className="text-center">
                <div className="h-48 bg-muted rounded-t-lg overflow-hidden">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <CardContent>
                  <p className="font-semibold text-foreground">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-3xl font-bold">Keep Your AC Running Smoothly</h3>
              <p className="text-primary-foreground/90 mt-4">Schedule a checkup, request maintenance, or get emergency repairs from certified technicians.</p>
              <div className="mt-6">
                <Button className="bg-primary-foreground text-primary">Contact Us</Button>
              </div>
            </div>
            <div>
              <img src={teamImage} alt="AC team" className="rounded-2xl shadow-lg w-full object-cover" />
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ACDoctor;