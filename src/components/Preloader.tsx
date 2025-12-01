import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PreloaderProps {
  isLoading?: boolean;
  onComplete?: () => void;
}

const Preloader = ({ isLoading = true, onComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // Simulate loading progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(progressInterval);
    } else {
      // Animate progress to 100% when loading completes
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            // Start exit animation
            setIsExiting(true);
            // Hide after animation completes
            setTimeout(() => {
              setIsVisible(false);
              onComplete?.();
            }, 700);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      return () => clearInterval(progressInterval);
    }
  }, [isLoading, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-all duration-700 ease-in-out",
        isExiting && "opacity-0 scale-95 translate-y-4 pointer-events-none"
      )}
    >
      {/* Animated Logo/Text */}
      <div className={cn(
        "relative mb-8 transition-all duration-700 ease-in-out",
        isExiting && "opacity-0 scale-90"
      )}>
        <div className={cn(
          "text-4xl md:text-5xl font-bold text-primary transition-all duration-700",
          !isExiting && "animate-pulse"
        )}>
          WorkSure
        </div>
        <div className={cn(
          "absolute -inset-4 bg-primary/20 rounded-full blur-2xl transition-all duration-700",
          !isExiting && "animate-ping opacity-75",
          isExiting && "opacity-0 scale-75"
        )}></div>
      </div>

      {/* Animated Dots */}
      <div className={cn(
        "flex gap-2 mt-4 transition-all duration-700 ease-in-out",
        isExiting && "opacity-0 scale-75 translate-y-2"
      )}>
        <div className={cn(
          "w-2 h-2 bg-primary rounded-full transition-all duration-700",
          !isExiting && "animate-bounce"
        )} style={{ animationDelay: "0s" }}></div>
        <div className={cn(
          "w-2 h-2 bg-primary rounded-full transition-all duration-700",
          !isExiting && "animate-bounce"
        )} style={{ animationDelay: "0.2s" }}></div>
        <div className={cn(
          "w-2 h-2 bg-primary rounded-full transition-all duration-700",
          !isExiting && "animate-bounce"
        )} style={{ animationDelay: "0.4s" }}></div>
      </div>
    </div>
  );
};

export default Preloader;

