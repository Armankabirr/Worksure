import { useState, useEffect } from "react";
import AddressSearch from "../components/AddressSearch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { BeatLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search as SearchIcon, MapPin, Star, Sparkles, ArrowRight } from "lucide-react";
import { cleaningServicesData } from "@/lib/cleaningServices";
import { acDoctorServicesConfig } from "@/lib/acDoctorServices";

// Service type configuration with dynamic copy and subcategories
const serviceConfig: Record<string, {
  label: string;
  heading: string;
  subheading: string;
  ctaText: string;
  getSubcategories: () => Array<{ value: string; label: string }>;
}> = {
  electrician: {
    label: "Electrician",
    heading: "Find Trusted Electricians Near You",
    subheading: "Select your electrical service need and location to find certified professionals",
    ctaText: "Find Electricians",
    getSubcategories: () => [
      { value: "home-wiring", label: "Home Wiring" },
      { value: "refrigerator-repair", label: "Refrigerator Repair" },
      { value: "appliance-repair", label: "Appliance Repair" },
      { value: "ac-electrical", label: "AC Electrical" },
      { value: "distribution-board", label: "Distribution Board" },
      { value: "backup-power", label: "Backup Power" },
      { value: "cctv", label: "CCTV" },
      { value: "smart-home", label: "Smart Home" },
      { value: "inspection", label: "Inspection" },
    ],
  },
  cleaner: {
    label: "Cleaner",
    heading: "Book a Professional Cleaner",
    subheading: "Choose your cleaning service and location to find experienced professionals",
    ctaText: "Search Cleaners",
    getSubcategories: () => {
      return Object.values(cleaningServicesData).map((service) => ({
        value: service.slug,
        label: service.title,
      }));
    },
  },
  "ac-doctor": {
    label: "AC Doctor",
    heading: "Search AC Technicians in Your Area",
    subheading: "Select your AC service need and location to find certified technicians",
    ctaText: "Find AC Technicians",
    getSubcategories: () => {
      return Object.values(acDoctorServicesConfig).map((service) => ({
        value: service.slug,
        label: service.title,
      }));
    },
  },
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get("serviceType") || "";
  const initialService = searchParams.get("service") || "";

  // Restore state from sessionStorage
  const getStoredState = () => {
    try {
      const stored = sessionStorage.getItem(`search-state-${serviceType}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const storedState = getStoredState();

  const [selected, setSelected] = useState<any>(storedState?.selected || null);
  const [subCategory, setSubCategory] = useState(storedState?.subCategory || initialService);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>(storedState?.results || []);
  const navigate = useNavigate();

  const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY || '';
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  // Redirect if no serviceType provided
  useEffect(() => {
    if (!serviceType || !serviceConfig[serviceType]) {
      navigate("/");
    }
  }, [serviceType, navigate]);

  const config = serviceConfig[serviceType];
  const subCategories = config?.getSubcategories() || [];

  // Set initial subcategory from URL param if provided
  useEffect(() => {
    if (initialService && subCategories.some((cat) => cat.value === initialService)) {
      setSubCategory(initialService);
    }
  }, [initialService, subCategories]);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    if (serviceType) {
      const stateToSave = {
        selected,
        subCategory,
        results,
      };
      sessionStorage.setItem(`search-state-${serviceType}`, JSON.stringify(stateToSave));
    }
  }, [selected, subCategory, results, serviceType]);

  function handleSelectPlace(place: any) {
    setSelected(place);
    setError(null);
  }

  async function handleSearch() {
    if (!selected || !subCategory) {
      setError("Please select location and service type");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        lat: selected.lat,
        lon: selected.lon,
        categorySlug: subCategory,
        radiusMeters: "5000", // 5km radius
      });

      const response = await fetch(
        `${API_BASE_URL}/workerRoutes/workers/search?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      
      
      const data = await response.json();
      console.log(data);
      setResults(data.workers || data || []);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to fetch services. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Don't render if no valid serviceType
  if (!serviceType || !config) {
    return null;
  }

  const selectedSubcategoryLabel = subCategories.find((cat) => cat.value === subCategory)?.label || "";

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-up" style={{ animationDelay: "80ms" }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase mb-6">
              {config.label} Services
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-4">
              {config.heading}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {config.subheading}
            </p>
          </div>

          {/* Search Card - Premium Design */}
          <div className="bg-card rounded-3xl shadow-2xl border border-border/50 p-8 md:p-12 mb-12 animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="space-y-6">
              {/* Subcategory Selector */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Select Service
                </label>
                <Select value={subCategory} onValueChange={setSubCategory}>
                  <SelectTrigger className="h-14 text-base bg-background border-2 border-border hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Choose a service..." />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories.map((sub) => (
                      <SelectItem key={sub.value} value={sub.value} className="text-base py-3">
                        {sub.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Input */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Location
                </label>
                <div className="relative">
                  <AddressSearch
                    onSelect={handleSelectPlace}
                    apiKey={LOCATIONIQ_KEY}
                    provider={LOCATIONIQ_KEY ? 'locationiq' : 'nominatim'}
                    placeholder="Enter your address or area..."
                  />
                </div>
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                disabled={loading || !selected || !subCategory}
                size="lg"
                className="w-full h-14 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
              >
                {loading ? (
                  <BeatLoader color="#ffffff" size={8} />
                ) : (
                  <>
                    {config.ctaText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-destructive/10 border-l-4 border-destructive rounded-lg animate-in slide-in-from-top-2">
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          {results.length > 0 && (
            <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Available {selectedSubcategoryLabel} Workers
                  </h2>
                  <p className="text-muted-foreground">
                    Found {results.length} {results.length === 1 ? 'professional' : 'professionals'} near you
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((worker) => (
                  <div
                    key={worker.user_id}
                    className="group bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-border/50 hover:border-primary/30 cursor-pointer"
                    onClick={() => navigate(`/worker/${worker.user_id}`)}
                  >
                    {/* Card Header with Profile Picture */}
                    <div className="h-56 relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                      {worker.profile_picture ? (
                        <img
                          src={worker.profile_picture}
                          alt={worker.display_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary text-4xl font-bold">
                              {worker.display_name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      {/* Name */}
                      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">
                        {worker.display_name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-foreground">{worker.avg_rating || '0.0'}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({worker.review_count || 0} {worker.review_count === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>

                      {/* Base Price */}
                      <div className="mb-4 pb-4 border-b border-border">
                        <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                        <p className="text-2xl font-bold text-primary">
                          ৳{worker.base_price || 'N/A'}
                        </p>
                      </div>

                      {/* Distance */}
                      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{(worker.distance_m / 1000).toFixed(2)} km away</span>
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full font-semibold rounded-xl"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/worker/${worker.user_id}`);
                        }}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && results.length === 0 && selected && subCategory && (
            <div className="mt-16 text-center animate-fade-up" style={{ animationDelay: "200ms" }}>
              <div className="bg-card rounded-2xl p-12 border-2 border-dashed border-border max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Workers Found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or location
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelected(null);
                    setSubCategory("");
                    setResults([]);
                  }}
                >
                  Clear Search
                </Button>
              </div>
            </div>
          )}

          {/* Empty State - No Search Yet */}
          {!selected && !subCategory && results.length === 0 && (
            <div className="text-center py-16 animate-fade-up" style={{ animationDelay: "240ms" }}>
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <p className="text-lg text-muted-foreground">
                  Select a service and location above to find professionals near you
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Search;
