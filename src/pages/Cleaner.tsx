import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import heroImage from "@/assets/hero-workspace.jpg";
import teamImage from "@/assets/cleaning-team.jpg";

const Cleaner = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />

      <main>
        {/* Top Hero image */}
        <section className="w-full">
          <div className="h-64 md:h-96 w-full overflow-hidden">
            <img src={heroImage} alt="Cleaning workspace" className="w-full h-full object-cover" />
          </div>
        </section>

        {/* Company intro */}
        <section className="container mx-auto px-6 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative">
            <img src={teamImage} alt="Cleaning team" className="rounded-2xl shadow-lg w-full object-cover" />
            <div className="absolute left-6 bottom-6 bg-primary/90 text-primary-foreground px-6 py-6 rounded-lg shadow-lg max-w-xs">
              <p className="text-sm uppercase tracking-widest font-semibold">Professional</p>
              <h3 className="text-lg font-bold leading-tight">House Cleaning</h3>
              <p className="mt-2 text-sm">Free Estimate</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground">Know Something About Our Company</h2>
            <p className="text-muted-foreground">
              There's no greater feeling than coming back to work to an empty trash can after stuffing your receptacle
              with the previous day's food, paper, and other refuse. Tasks like trash removal and other janitorial
              services add up and leave your business in a radiant condition. With years of experience, we ensure customer
              satisfaction and attention to detail.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Mission Statement</h4>
                <p className="text-sm text-muted-foreground mt-2">Our mission is to deliver outstanding customer service and quality cleaning while remaining affordable.</p>
              </div>
              <div>
                <h4 className="font-semibold">Why Choose Us</h4>
                <p className="text-sm text-muted-foreground mt-2">Background-checked staff, eco-friendly products, and punctual arrivals.</p>
              </div>
            </div>

            <div className="pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow">
                Request a Free Estimate
              </Button>
            </div>
          </div>
        </section>

        {/* Services grid */}
        <section className="container mx-auto px-6 py-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">All Cleaning Services</p>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mt-2">All Cleaning Services</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Window Cleaning", desc: "Residential and commercial window cleaning for streak-free views." },
              { title: "Vacuuming", desc: "Deep and regular vacuuming to keep carpets fresh and dust-free." },
              { title: "Bathroom Cleaning", desc: "Sanitization and scrubbing of all bathroom surfaces." },
              { title: "Carpet Cleaning", desc: "Steam and dry-cleaning options to remove stains and odors." },
            ].map((s) => (
              <Card key={s.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                  <CardDescription className="text-sm">{s.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Professional teams, reliable scheduling.</p>
                    <Button size="icon" variant="ghost" className="text-primary">→</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="bg-card/60 border-t border-border/60">
          <div className="container mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground">Impressive & Clean Businesses with WorkSure Cleaning</h3>
              <p className="text-muted-foreground mt-4">Our commercial janitorial services keep offices, warehouses, and retail spaces spotless — nothing is left out.</p>
              <div className="mt-6">
                <Button className="bg-primary text-primary-foreground">Call us today: (+880)1316037133 </Button>
              </div>
            </div>
            <div>
              <img src={teamImage} alt="Cleaning team" className="rounded-2xl shadow-lg w-full object-cover" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Cleaner;
