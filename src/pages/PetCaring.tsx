import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import petTop from "@/assets/Pet caring top.png";
import petBottom from "@/assets/Pet caring botom.png";

const PetCaring = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />

      <main>
        {/* Hero */}
        <section className="container mx-auto px-6 py-12">
          <div className="relative rounded-3xl overflow-hidden bg-amber-50 p-8 md:p-12 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">Where Your Pet Feels at Home!</h1>
                <p className="mt-4 text-muted-foreground max-w-xl">Loving & reliable pet care tailored to your furry friend. Trusted caregivers, tailored services, and 24/7 support.</p>
                <div className="mt-6 flex gap-4">
                  <Button className="bg-primary text-primary-foreground">Call Us Now</Button>
                  <Button variant="outline" className="border-primary">All services</Button>
                </div>

                <div className="mt-6 flex gap-4 text-sm text-muted-foreground">
                  <div className="bg-white rounded-xl px-4 py-3 shadow">Trusted Pet Care<br/><span className="block font-semibold text-foreground">Certified caregivers</span></div>
                  <div className="bg-white rounded-xl px-4 py-3 shadow">Tailored Services<br/><span className="block font-semibold text-foreground">Custom care plans</span></div>
                </div>
              </div>

              <div className="hidden md:block">
                <img src={petTop} alt="Pet hero" className="w-full h-72 object-cover rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="container mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-3xl font-bold">Transparent Pricing for You</h2>
            <p className="text-muted-foreground mt-2">Start saving time today and choose your best plan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Dog Walking', price: '3000', items: ['Playing','Outdoor','Feeding'] },
              { title: 'Pet Sitting', price: '3500', items: ['Feeding','Security','Indoor'] },
              { title: 'Grooming & Hygiene', price: '2000', items: ['Waste Cleaning','Organizing','Caring'] },
            ].map(p=> (
              <Card key={p.title} className="text-center hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold mt-2 mb-4">{p.price}</p>
                  <div className="text-sm text-muted-foreground space-y-1 mb-4">{p.items.map(i=> <div key={i}>{i}</div>)}</div>
                  <Button className="bg-primary text-primary-foreground">Book Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features + testimonials */}
        <section className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold">Try our services and see for yourself</h3>
            <p className="text-muted-foreground mt-4">Our team is experienced, trained, and passionate about pets. We offer vet visits, medication reminders, boarding and much more.</p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 shadow">
                <h4 className="font-semibold">Pet Sitting</h4>
                <p className="text-sm text-muted-foreground mt-2">Experienced sitters to keep your pet comfortable at home.</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow">
                <h4 className="font-semibold">Dog Walking</h4>
                <p className="text-sm text-muted-foreground mt-2">Daily walks to keep your dog active and happy.</p>
              </div>
            </div>

          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img src={petBottom} alt="Pet testimonial" className="w-full h-full object-cover" />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default PetCaring;
