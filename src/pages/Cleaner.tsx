
import { useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import heroImage from "@/assets/hero-workspace.jpg";
import teamImage from "@/assets/cleaning-team.jpg";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const stats = [
	{ label: "Homes Cleaned", value: 1200 },
	{ label: "Offices Serviced", value: 350 },
	{ label: "Years Experience", value: 8 },
	{ label: "Happy Clients", value: 980 },
];

const cleaningServices = [
	{
		title: "Deep Cleaning",
		desc: "Thorough cleaning for every corner of your home or office.",
		image: heroImage,
		color: "bg-green-100",
	},
	{
		title: "Move-In/Move-Out",
		desc: "Perfect for new beginnings or end-of-lease requirements.",
		image: teamImage,
		color: "bg-blue-100",
	},
	{
		title: "Carpet & Upholstery",
		desc: "Steam and dry cleaning for carpets, sofas, and more.",
		image: heroImage,
		color: "bg-yellow-100",
	},
	{
		title: "Window Cleaning",
		desc: "Crystal-clear windows for homes and businesses.",
		image: teamImage,
		color: "bg-cyan-100",
	},
];

const faqs = [
	{
		q: "What types of cleaning do you offer?",
		a: "We offer deep cleaning, regular maintenance, move-in/move-out, carpet, upholstery, and window cleaning services.",
	},
	{
		q: "Are your cleaners background checked?",
		a: "Yes, all our staff are background-checked and trained for your peace of mind.",
	},
	{
		q: "Do you use eco-friendly products?",
		a: "Absolutely! We prioritize safe, eco-friendly cleaning products whenever possible.",
	},
	{
		q: "How do I book a cleaning?",
		a: "You can book online, call us, or use the 'Book Now' button below for instant scheduling.",
	},
];

const Cleaner = () => {
	const navigate = useNavigate();
	const statsRefs = useRef<(HTMLSpanElement | null)[]>([]);

	// Animate stats
	useEffect(() => {
		stats.forEach((stat, i) => {
			const el = statsRefs.current[i];
			if (!el) return;
			let start = 0;
			const end = stat.value;
			const duration = 1200;
			const step = Math.ceil(end / (duration / 16));
			let current = start;
			const animate = () => {
				current += step;
				if (current > end) current = end;
				el.textContent = current.toString();
				if (current < end) requestAnimationFrame(animate);
			};
			animate();
		});
	}, []);

	const handleBookNow = () => {
		navigate("/userlogin");
	};

	return (
		<div className="min-h-screen bg-background pt-20">
			<Header />
			<main>
				{/* Hero Section */}
				<section className="w-full relative">
					<img src={heroImage} alt="Cleaning workspace" className="w-full h-80 md:h-[28rem] object-cover rounded-b-3xl shadow-lg" />
					<div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent rounded-b-3xl" />
					<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 w-full px-4">
						<h1 className="text-4xl md:text-5xl font-bold text-foreground drop-shadow-lg">Professional Cleaning Services</h1>
						<p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">Spotless spaces, happy faces. We make your home and office shine with care and precision.</p>
						<div className="mt-8 flex flex-wrap justify-center gap-6">
							{stats.map((stat, i) => (
								<div key={stat.label} className="bg-white/80 rounded-xl px-6 py-4 shadow flex flex-col items-center min-w-[120px]">
									<span ref={el => (statsRefs.current[i] = el)} className="text-2xl md:text-3xl font-bold text-primary" />
									<span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{stat.label}</span>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Services Section */}
				<section className="container mx-auto px-6 py-16">
					<div className="text-center max-w-2xl mx-auto mb-10">
						<p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">All Cleaning Services</p>
						<h3 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Our Cleaning Solutions</h3>
						<p className="text-muted-foreground mt-2">From deep cleans to regular maintenance, we cover every need for homes and businesses.</p>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
						{cleaningServices.map((s) => (
							<Card key={s.title} className={`hover:shadow-lg transition-shadow ${s.color}`}>
								<CardHeader>
									<img src={s.image} alt={s.title} className="w-full h-24 object-cover rounded-lg mb-2" />
									<CardTitle className="text-lg">{s.title}</CardTitle>
									<CardDescription className="text-sm">{s.desc}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between">
										<p className="text-sm text-muted-foreground">Professional teams, reliable scheduling.</p>
										<Button size="icon" variant="ghost" className="text-primary" onClick={handleBookNow}>→</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				{/* FAQ Section */}
				<section className="container mx-auto px-6 py-16">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
						<div className="space-y-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
							<p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Questions & Answers</p>
							<h2 className="text-3xl md:text-4xl font-bold text-foreground">Frequently Asked Questions</h2>
							<p className="text-muted-foreground">If you have any more questions about our cleaning service, feel free to contact us anytime. We're here to help.</p>
						</div>
						<Accordion type="single" collapsible className="w-full animate-fade-up" style={{ animationDelay: "120ms" }}>
							{faqs.map((faq, idx) => (
								<AccordionItem value={`item-${idx + 1}`} key={faq.q}>
									<AccordionTrigger>{faq.q}</AccordionTrigger>
									<AccordionContent>{faq.a}</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</section>

				{/* Team Section */}
				<section className="bg-card/60 border-t border-border/60">
					<div className="container mx-auto px-6 py-16">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
							<div className="space-y-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
								<p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Our Cleaners</p>
								<h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet Our Expert Cleaning Team</h2>
								<p className="text-muted-foreground">Our team is made up of friendly professionals who treat your space like their own. We double-check every detail and clean up before we leave.</p>
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<p className="font-semibold text-foreground">Background Checked</p>
										<p className="text-muted-foreground">Every cleaner passes strict background and safety checks.</p>
									</div>
									<div>
										<p className="font-semibold text-foreground">On-Time Guarantee</p>
										<p className="text-muted-foreground">We respect your schedule and keep you updated at every step.</p>
									</div>
								</div>
							</div>
							<div className="relative animate-fade-up" style={{ animationDelay: "140ms" }}>
								<div className="absolute -inset-3 bg-primary/10 rounded-3xl blur-2xl" />
								<img src={teamImage} alt="Cleaning team" className="relative rounded-3xl shadow-2xl w-full h-full object-cover" />
							</div>
						</div>
					</div>
				</section>

				{/* Call to Action Section */}
				<section className="bg-primary text-primary-foreground">
					<div className="container mx-auto px-6 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
						<div>
							<p className="text-xs uppercase tracking-[0.25em] font-semibold">Cleaning Services</p>
							<h3 className="text-2xl md:text-3xl font-bold">Ready for a Spotless Space?</h3>
							<p className="text-primary-foreground/80 mt-2">Contact us today for professional cleaning services.</p>
						</div>
						<div className="flex gap-3">
							<Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={() => navigate("/")}>Contact Us Now</Button>
							<Button variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={handleBookNow}>Book a Cleaner</Button>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default Cleaner;

