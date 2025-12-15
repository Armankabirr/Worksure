import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImage from "@/assets/chefs.jpg"; // Placeholder, replace with catering image
import teamImage from "@/assets/team-illustration.jpg"; // Catering team illustration

const Catering = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Best Catering Service</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Delicious Catering
              <span className="block text-primary">For Every Occasion</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              From corporate events to weddings, our professional catering services deliver fresh, flavorful meals
              prepared by expert chefs using the finest ingredients.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 shadow-lg hover:shadow-xl">
                Book Catering
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                View Menu
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">15+ Years Experience</p>
                <p>Licensed caterers with culinary expertise.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">5,000+ Events Served</p>
                <p>Happy customers and memorable experiences.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Catering setup"
              className="rounded-2xl shadow-2xl w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Our Catering Services</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Comprehensive Catering Solutions</h2>
              <p className="text-muted-foreground mt-4">
                We offer a wide range of catering services to suit any event, from intimate gatherings to large celebrations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Wedding Catering",
                  desc: "Elegant menus for your special day, from intimate ceremonies to grand receptions.",
                  features: ["Custom menus", "Wedding cake", "Bar service", "Staff coordination"]
                },
                {
                  title: "Corporate Events",
                  desc: "Professional catering for meetings, conferences, and company parties.",
                  features: ["Business lunch", "Coffee breaks", "Team building", "Dietary accommodations"]
                },
                {
                  title: "Private Parties",
                  desc: "Fun and delicious catering for birthdays, anniversaries, and celebrations.",
                  features: ["Themed menus", "Kids options", "Dessert tables", "Entertainment setup"]
                },
                {
                  title: "Buffet Services",
                  desc: "Abundant, varied selections perfect for large groups and casual events.",
                  features: ["Hot & cold items", "Vegetarian options", "Self-serve stations", "Flexible portions"]
                },
                {
                  title: "Breakfast & Brunch",
                  desc: "Start your day right with our fresh, delicious morning offerings.",
                  features: ["Continental breakfast", "Hot breakfast", "Beverage service", "Quick setup"]
                },
                {
                  title: "Dessert Catering",
                  desc: "Sweet endings to make your event unforgettable.",
                  features: ["Cake cutting", "Dessert bars", "Custom pastries", "Sugar-free options"]
                }
              ].map((service) => (
                <Card key={service.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Preview */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Sample Menu Options</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="appetizers">
                    <AccordionTrigger>Appetizers & Starters</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Bruschetta with tomato and basil</li>
                        <li>• Stuffed mushrooms</li>
                        <li>• Shrimp cocktail</li>
                        <li>• Mini quiches</li>
                        <li>• Vegetable platter with dips</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="mains">
                    <AccordionTrigger>Main Courses</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Grilled salmon with lemon herb sauce</li>
                        <li>• Beef tenderloin with red wine reduction</li>
                        <li>• Chicken marsala</li>
                        <li>• Vegetarian lasagna</li>
                        <li>• Pasta primavera</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="desserts">
                    <AccordionTrigger>Desserts</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Chocolate mousse cake</li>
                        <li>• Tiramisu</li>
                        <li>• Fruit tart</li>
                        <li>• Cheesecake assortment</li>
                        <li>• Cookies and brownies</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <div className="relative">
                <img
                  src={teamImage}
                  alt="Catering display"
                  className="rounded-2xl shadow-lg w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Our Catering?</h2>
              <p className="text-muted-foreground">
                We pride ourselves on quality, reliability, and attention to detail.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Fresh Ingredients", desc: "We use only the freshest, highest quality ingredients in all our dishes." },
                { title: "Experienced Chefs", desc: "Our culinary team has years of experience creating memorable meals." },
                { title: "Customizable Menus", desc: "Work with us to create a menu that perfectly fits your event and preferences." },
                { title: "Professional Service", desc: "From setup to cleanup, we handle everything with professionalism and care." }
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Book Your Catering?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your catering needs and get a personalized quote for your event.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Get a Quote
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8">
                Call Us: (+880)1316037133
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Catering;