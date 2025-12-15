import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import heroImage from "@/assets/babysitter.jpg";
import pregnantImage from "@/assets/team-illustration.jpg"; // Illustration for pregnancy/assistance visual

const Babysitter = () => {
  return (
    <div className="min-h-screen bg-background pt-20 flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-b from-orange-100/80 to-white pb-12 pt-10 md:pt-20 relative overflow-hidden">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Babysitter Services</h1>
              <p className="text-muted-foreground max-w-lg">
                At <span className="font-semibold text-primary">WorkSure</span> Babysitting, we provide loving, reliable, and responsible care for your little ones. Our trusted babysitters ensure a safe, fun, and nurturing environment—giving you peace of mind while you're away.
              </p>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Watch Video</Button>
            </div>
            <div className="flex justify-center md:justify-end relative">
              <img src={heroImage} alt="Babysitter with child" className="w-80 max-w-full rounded-2xl shadow-xl" />
            </div>
          </div>
        </section>

        {/* Assistance Section */}
        <section className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center md:justify-start">
            <img src={pregnantImage} alt="Pregnancy Assistance" className="w-56 max-w-full" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Assistance Before & After Pregnancy</h2>
            <p className="text-muted-foreground mb-4">
              We provide compassionate care and support for mothers during and after pregnancy. From parental guidance to postnatal assistance, our trained caregivers help with daily needs, baby care, nutrition, and emotional well-being—ensuring comfort and peace of mind for both mother and child.
            </p>
          </div>
        </section>

        {/* Popular Services */}
        <section className="container mx-auto px-6 py-8">
          <h3 className="text-lg font-semibold mb-4">Popular services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Babysitting", desc: "Quick booking at your home" },
              { title: "Full-Time Nanny", desc: "Ideal for working families" },
              { title: "Newborn and Infant Care", desc: "Covering feeding, swaddling etc." },
              { title: "Childhood Education", desc: "Early childhood development" },
            ].map((s) => (
              <Card key={s.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">{s.title}</CardTitle>
                  <CardDescription className="text-sm">{s.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="sm" className="bg-primary text-primary-foreground w-full">Schedule</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Best Babysitters */}
        <section className="container mx-auto px-6 py-8">
          <h3 className="text-lg font-semibold mb-4">Best baby sitters</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { name: "Bessie Cooper", distance: "0.2 km away", price: 3500, reviews: 10, rating: 5.0, avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
              { name: "Bessie Cooper", distance: "0.2 km away", price: 3500, reviews: 10, rating: 5.0, avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
              { name: "Darrell Steward", distance: "0.3 km away", price: 3500, reviews: 10, rating: 5.0, avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 bg-card rounded-lg px-4 py-2 shadow-sm">
                <img src={s.avatar} alt={s.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div className="font-medium text-foreground">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.distance}</div>
                </div>
                <div className="ml-4 text-primary font-semibold">৳ {s.price}</div>
                <div className="ml-2 text-xs text-muted-foreground">per hour</div>
                <div className="ml-4 text-yellow-500">★ {s.rating}</div>
                <div className="ml-2 text-xs text-muted-foreground">{s.reviews} reviews</div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-6">
            <h3 className="text-lg font-semibold mb-6">What They Say About Our Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Walter Anderson", rating: 4.5, date: "March 15, 2023", text: "I was nervous leaving my toddler for the first time, but the babysitter was so gentle, patient, and professional. Highly recommend!", highlight: "Excellent care and peace of mind!" },
                { name: "Susan Torres", rating: 4.5, date: "April 5, 2023", text: "The babysitting team always arrives on time, keeps the kids engaged with fun activities, and ensures everything is safe and clean. I really appreciate their dedication.", highlight: "Trustworthy and reliable service." },
                { name: "John Davis", rating: 4.5, date: "May 2, 2023", text: "Our babysitter treated our kids with so much love and respect. It’s not easy to find someone who genuinely cares—we’re so glad we did!", highlight: "Felt like family." },
              ].map((t, i) => (
                <Card key={i} className="bg-white">
                  <CardHeader>
                    <CardTitle className="text-base">{t.name}</CardTitle>
                    <div className="flex items-center gap-2 text-yellow-500 text-sm font-semibold">★ {t.rating}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-primary text-xs mb-2">“{t.highlight}”</div>
                    <div className="text-muted-foreground text-sm mb-2">{t.text}</div>
                    <div className="text-xs text-muted-foreground">{t.date}</div>
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
