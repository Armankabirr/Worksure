import { useState, useEffect } from "react";
import AddressSearch from "../components/AddressSearch";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { BeatLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  Search as SearchIcon, 
  MapPin, 
  Star, 
  Phone, 
  MessageSquare, 
  BookImageIcon, 
  BookAIcon,
  Heart,
  PawPrint,
  UtensilsCrossed
} from "lucide-react";

function PanTo({ lat, lon }) {
     const map = useMap();
     if (!lat || !lon) return null;
     map.setView([parseFloat(lat), parseFloat(lon)], 15, { animate: true });
     return null;
}

// Service Configuration System
const serviceConfig = {
  electrician: {
    serviceType: "electrician",
    label: "Electrician",
    heading: "Find Trusted Electricians Near You",
    subheading: "Professional electrical services at your doorstep",
    ctaText: "Search Electricians",
    icon: SearchIcon,
    uiVariant: "default",
  },
  cleaner: {
    serviceType: "cleaner",
    label: "Cleaner",
    heading: "Search Professional Cleaners",
    subheading: "Spotless cleaning services for your space",
    ctaText: "Search Cleaners",
    icon: SearchIcon,
    uiVariant: "default",
  },
  "ac-doctor": {
    serviceType: "ac-doctor",
    label: "AC Doctor",
    heading: "Book AC Technicians",
    subheading: "Expert AC services when you need them",
    ctaText: "Search AC Doctors",
    icon: SearchIcon,
    uiVariant: "default",
  },
  "pet-care": {
    serviceType: "pet-care",
    label: "Pet Care",
    heading: "Find Loving Care for Your Pet",
    subheading: "Because Your Pet Deserves Gentle, Trusted Care",
    ctaText: "Find a Pet Caregiver",
    icon: Heart,
    uiVariant: "pet-care",
  },
  "pet-caring": {
    serviceType: "pet-caring",
    label: "Pet Care",
    heading: "Find Loving Care for Your Pet",
    subheading: "Because Your Pet Deserves Gentle, Trusted Care",
    ctaText: "Find a Pet Caregiver",
    icon: Heart,
    uiVariant: "pet-care",
  },
};

const subCategories = {
  electrician: [
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
  cleaner: [
    { value: "home-cleaning", label: "Home Cleaning" },
    { value: "deep-cleaning", label: "Deep Cleaning" },
    { value: "office-cleaning", label: "Office Cleaning" },
    { value: "move-cleaning", label: "Move Cleaning" },
    { value: "sofa-carpet", label: "Sofa & Carpet" },
    { value: "window-cleaning", label: "Window Cleaning" },
  ],
  "ac-doctor": [
    { value: "ac-cleaning", label: "AC Cleaning" },
    { value: "ac-repair", label: "AC Repair" },
    { value: "ac-installation", label: "AC Installation" },
    { value: "gas-refilling", label: "Gas Refilling" },
    { value: "amc", label: "Annual Maintenance" },
  ],
  "pet-care": [
    { value: "pet-sitting", label: "Pet Sitting" },
    { value: "pet-feeding", label: "Pet Feeding" },
    { value: "pet-walking", label: "Pet Walking" },
    { value: "pet-grooming", label: "Pet Grooming" },
    { value: "overnight-care", label: "Overnight Care" },
    { value: "vet-assistance", label: "Vet Visit Assistance" },
  ],
  "pet-caring": [
    { value: "pet-sitting", label: "Pet Sitting" },
    { value: "pet-feeding", label: "Pet Feeding" },
    { value: "pet-walking", label: "Pet Walking" },
    { value: "pet-grooming", label: "Pet Grooming" },
    { value: "overnight-care", label: "Overnight Care" },
    { value: "vet-assistance", label: "Vet Visit Assistance" },
  ],
};

const Search = () => {
  const [selected, setSelected] = useState(null);
  const [subCategory, setSubCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY || '';
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  
  // Get serviceType from URL query param - REQUIRED
  const params = new URLSearchParams(window.location.search);
  const serviceTypeParam = params.get("serviceType") || "";
  
  // Normalize pet-care variants
  const serviceType = serviceTypeParam === "pet-caring" ? "pet-care" : serviceTypeParam;
  
  // Get service config or fallback
  const config = serviceConfig[serviceType] || {
    serviceType: serviceType || "unknown",
    label: "Service",
    heading: "Find Service Providers",
    subheading: "Search for professionals near you",
    ctaText: "Search",
    icon: SearchIcon,
    uiVariant: "default",
  };

  const isPetCare = config.uiVariant === "pet-care";
  const IconComponent = config.icon;

  // Get subcategories for current service type
  const availableSubCategories = subCategories[serviceType] || subCategories["pet-care"] || [];

  // Validate serviceType exists
  useEffect(() => {
    if (!serviceTypeParam) {
      setError("Service type is required. Please navigate from a service page.");
    } else {
      setError(null);
    }
  }, [serviceTypeParam]);

  // Get service parameter if provided
  const serviceParam = params.get("service");
  useEffect(() => {
    if (serviceParam && availableSubCategories.some(sub => sub.value === serviceParam)) {
      setSubCategory(serviceParam);
    }
  }, [serviceParam, availableSubCategories]);

  function handleSelectPlace(place) {
    setSelected(place);
  }

  async function handleSearch() {
    if (!selected || !serviceType || !subCategory) {
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
        radiusMeters: 5000, // 5km radius
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
      setResults(data.data || data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to fetch services. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // UI Variant Classes
  const containerClass = isPetCare
    ? "min-h-screen bg-gradient-to-br from-pink-50 via-orange-50/30 to-amber-50 pt-20"
    : "min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-20";

  const cardClass = isPetCare
    ? "bg-white/90 backdrop-blur-sm rounded-3xl shadow-soft p-8 md:p-10 mb-10 border border-pink-100"
    : "bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-10";

  const headingClass = isPetCare
    ? "text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-3"
    : "text-3xl md:text-4xl font-bold text-gray-900 mb-2";

  const subheadingClass = isPetCare
    ? "text-lg text-gray-700 leading-relaxed mb-8"
    : "text-lg text-gray-600 mb-8";

  const labelClass = isPetCare
    ? "text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"
    : "text-sm font-semibold text-gray-700 mb-3";

  const selectClass = isPetCare
    ? "h-[61px] text-base rounded-2xl border-2 border-pink-200 focus:border-pink-400"
    : "h-[61px] text-base";

  const buttonClass = isPetCare
    ? "w-full h-[61px] font-semibold text-lg rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
    : "w-full h-[61px] font-semibold text-lg rounded transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100";

  const errorClass = isPetCare
    ? "mt-4 p-4 bg-pink-50 border-l-4 border-pink-500 rounded-2xl"
    : "mt-4 p-4 bg-red-50 border-l-4 border-red-600 rounded";

  const noResultsClass = isPetCare
    ? "mt-20 text-center"
    : "mt-20 text-center";

  const noResultsCardClass = isPetCare
    ? "bg-gradient-to-br from-pink-50 to-orange-50 rounded-3xl p-12 border-2 border-dashed border-pink-300"
    : "bg-blue-50 rounded-xl p-12 border-2 border-dashed border-blue-300";

  const noResultsIconClass = isPetCare
    ? "w-16 h-16 text-pink-400 mx-auto mb-4"
    : "w-16 h-16 text-blue-400 mx-auto mb-4";

  return (
    <div className={containerClass}>
      <Header />
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className={`text-center mb-10 ${isPetCare ? "animate-fade-up" : ""}`}>
            <h1 className={headingClass}>{config.heading}</h1>
            <p className={subheadingClass}>{config.subheading}</p>
          </div>

          {/* Search Card */}
          <div className={cardClass}>
            {/* Sub Category Select */}
            <div className="flex w-full gap-4 flex-col md:flex-row justify-center items-end mb-6">
              <div className="flex flex-col w-full">
                <label className={labelClass}>
                  {isPetCare && <PawPrint className="h-4 w-4 text-pink-500" />}
                  {isPetCare ? "Choose Care Type" : "Service Type"}
                </label>
                <Select 
                  value={subCategory} 
                  onValueChange={setSubCategory}
                  disabled={!serviceType || !availableSubCategories.length}
                  required
                >
                  <SelectTrigger className={selectClass}>
                    <SelectValue 
                      placeholder={
                        serviceType 
                          ? isPetCare 
                            ? "Select a care service for your pet..." 
                            : "Choose a service type..."
                          : "Service type required"
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubCategories.map((sub) => (
                      <SelectItem key={sub.value} value={sub.value}>
                        {sub.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location and Search Button */}
            <div className="flex w-full gap-4 flex-col md:flex-row justify-center items-end">
              {/* Address Search */}
              <div className="flex flex-col w-full md:flex-1">
                <label className={labelClass}>
                  {isPetCare && <MapPin className="h-4 w-4 text-orange-500" />}
                  Location
                </label>
                <AddressSearch
                  onSelect={handleSelectPlace}
                  apiKey={LOCATIONIQ_KEY}
                  provider={LOCATIONIQ_KEY ? 'locationiq' : 'nominatim'}
                  placeholder={isPetCare ? "Where does your pet need care?" : "Search location..."}
                />
              </div>

              {/* Search Button */}
              <div className={isPetCare ? "w-full md:w-auto" : ""}>
                <Button
                  onClick={handleSearch}
                  disabled={loading || !selected || !serviceType || !subCategory}
                  className={buttonClass}
                >
                  {loading ? (
                    <BeatLoader color={isPetCare ? "#ffffff" : "#ffffff"} size={8} />
                  ) : (
                    <>
                      <IconComponent size={20} />
                      {config.ctaText}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={errorClass}>
                <p className={`text-sm font-semibold ${isPetCare ? "text-pink-700" : "text-red-600"}`}>
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Results Grid */}
          {results.length > 0 && (
            <div className="mt-40">
              <h2 className={`text-3xl font-bold mb-8 pt-5 ${isPetCare ? "text-gray-900" : "text-gray-900"}`}>
                Available{" "}
                {subCategory
                  ? availableSubCategories.find(s => s.value === subCategory)?.label
                  : config.label}{" "}
                {isPetCare ? "Caregivers" : "Workers"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((worker) => (
                  <div
                    key={worker.user_id}
                    className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border ${
                      isPetCare
                        ? "border-pink-100 rounded-2xl"
                        : "border-gray-100"
                    }`}
                  >
                    {/* Card Header with Profile Picture */}
                    <div className="h-48 relative overflow-hidden">
                      {worker.profile_picture && (
                        <img 
                          src={worker.profile_picture} 
                          alt={worker.display_name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {!worker.profile_picture && (
                        <div
                          className={`w-full h-full flex items-center justify-center ${
                            isPetCare
                              ? "bg-gradient-to-br from-pink-400 to-orange-400"
                              : "bg-gradient-to-br from-blue-400 to-orange-400"
                          }`}
                        >
                          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">
                              {worker.display_name.charAt(0)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      {/* Name */}
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {worker.display_name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className={`w-4 h-4 fill-yellow-400 text-yellow-400`} />
                          <span className="font-bold text-gray-900">{worker.avg_rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({worker.review_count || 0} reviews)
                        </span>
                      </div>

                      {/* Base Price */}
                      <div className="mb-2 pb-2 border-b border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">
                          Base Price{" "}
                          <span
                            className={`text-xl pl-2 font-bold ${
                              isPetCare
                                ? "bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent"
                                : "text-blue-600"
                            }`}
                          >
                            ৳{worker.base_price}
                          </span>
                        </p>
                      </div>

                      {/* Distance */}
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                        <MapPin
                          className={`w-4 h-4 ${
                            isPetCare ? "text-pink-500" : "text-orange-500"
                          }`}
                        />
                        <span>{(worker.distance_m / 1000).toFixed(2)} km away</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          onClick={() => navigate(`/worker/${worker.user_id}`)}
                          className={`flex-1 font-semibold ${
                            isPetCare
                              ? "rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
                              : ""
                          }`}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!loading && results.length === 0 && selected && serviceType && (
            <div className={noResultsClass}>
              <div className={noResultsCardClass}>
                <IconComponent className={noResultsIconClass} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {isPetCare ? "No Pet Caregivers Found" : "No Workers Found"}
                </h3>
                <p className="text-gray-600">
                  {isPetCare
                    ? "Try adjusting your search criteria or location to find loving care for your pet"
                    : "Try adjusting your search criteria or location"}
                </p>
              </div>
            </div>
          )}

          {/* Missing Service Type Error */}
          {!serviceTypeParam && (
            <div className="mt-20 text-center">
              <div className="bg-red-50 rounded-xl p-12 border-2 border-dashed border-red-300">
                <SearchIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Service Type Required
                </h3>
                <p className="text-gray-600 mb-4">
                  Please navigate from a service page to search for providers.
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="mt-4"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Search;
