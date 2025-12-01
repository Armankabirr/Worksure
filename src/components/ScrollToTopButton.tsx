import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(offset > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out ${
        isVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Button
        type="button"
        size="icon"
        variant="default"
        onClick={scrollToTop}
        className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:shadow-xl hover:scale-105"
        aria-label="Scroll back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default ScrollToTopButton;


