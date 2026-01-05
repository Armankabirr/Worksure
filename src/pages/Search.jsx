import { useState } from "react";
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
import { Search as SearchIcon, MapPin, Star, Phone, MessageSquare, BookImageIcon, BookAIcon } from "lucide-react";

function PanTo({ lat, lon }) {
     const map = useMap();
     if (!lat || !lon) return null;
     map.setView([parseFloat(lat), parseFloat(lon)], 15, { animate: true });
     return null;
}

const Search = () => {

     const [selected, setSelected] = useState(null);
     const [serviceType, setServiceType] = useState("");
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     const [results, setResults] = useState([]);
     const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY || '';
     const navigate = useNavigate();
     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
     const params = new URLSearchParams(window.location.search);
     const initialServiceType = params.get("serviceType") || "";
     
     // Set initial service type from URL param
     useState(() => {
          if (initialServiceType) {
               setServiceType(initialServiceType);
          }
     });

     console.log(serviceType);

     const services = [
          { value: "electrician", label: "Electrician" },
          { value: "cleaning", label: "Cleaner" },
          { value: "acdoctor", label: "AC Doctor" },
          { value: "catering", label: "Catering" },
          { value: "babysitter", label: "Babysitter" },
          { value: "petcaring", label: "Pet Caring" },
     ];

     function handleSelectPlace(place) {
          setSelected(place);
     }

     async function handleSearch() {
          if (!selected || !serviceType) {
               setError("Please select both location and service type");
               return;
          }

          setLoading(true);
          setError(null);

          try {
               const queryParams = new URLSearchParams({
                    lat: selected.lat,
                    lon: selected.lon,
                    categorySlug: serviceType,
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
               console.log(data);
               setResults(data.data || data || []);
          } catch (err) {
               console.error('Search error:', err);
               setError(err.message || 'Failed to fetch services. Please try again.');
          } finally {
               setLoading(false);
          }
     }

     return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-20">
               <Header />
               <div className="container mx-auto px-6 py-12">
                    <div className="max-w-4xl mx-auto">

                         {/* Search Card */}
                         <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-10">
                              <div className="flex w-full gap-4 flex-col md:flex-row justify-center items-end">
                                   {/* Service Type Select */}
                                   <div className="flex flex-col w-full">
                                        <label className="text-sm font-semibold text-gray-700 mb-3">
                                             Service Type
                                        </label>
                                        <Select value={serviceType} onValueChange={setServiceType}>
                                             <SelectTrigger className="h-[61px] text-base">
                                                  <SelectValue placeholder="Choose a service..." />
                                             </SelectTrigger>
                                             <SelectContent>
                                                  {services.map((service) => (
                                                       <SelectItem key={service.value} value={service.value}>
                                                            {service.label}
                                                       </SelectItem>
                                                  ))}
                                             </SelectContent>
                                        </Select>
                                   </div>

                                   {/* Address Search */}
                                   <div className="flex flex-col w-full">
                                        <label className="text-sm font-semibold text-gray-700 mb-3">
                                             Location
                                        </label>
                                        <AddressSearch
                                             onSelect={handleSelectPlace}
                                             apiKey={LOCATIONIQ_KEY}
                                             provider={LOCATIONIQ_KEY ? 'locationiq' : 'nominatim'}
                                             placeholder="Search location..."
                                        />
                                   </div>

                                   {/* Search Button */}
                                   <div>
                                        <Button
                                             onClick={handleSearch}
                                             disabled={loading}
                                             className="w-full h-[61px] bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white font-semibold text-lg rounded transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        >
                                             {loading ? (
                                                  <BeatLoader color="#ffffff" size={8} />
                                             ) : (
                                                  <>
                                                       <SearchIcon size={20} />
                                                       Search
                                                  </>
                                             )}
                                        </Button>
                                   </div>
                              </div>

                              {/* Error Message */}
                              {error && (
                                   <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-600 rounded">
                                        <p className="text-sm text-red-600 font-semibold">{error}</p>
                                   </div>
                              )}

                              {/* Selected Info */}
                              {/* {selected && serviceType && (
                                   <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                                        <p className="text-sm text-gray-600 mb-2">
                                             <span className="font-semibold text-gray-900">Service:</span> {services.find(s => s.value === serviceType)?.label}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                             <span className="font-semibold text-gray-900">Location:</span> {selected.display_name}
                                        </p>
                                   </div>
                              )} */}
                         </div>

                         {/* Results Grid */}
                         {results.length > 0 && (
                              <div className="mt-40">
                                   <h2 className="text-3xl font-bold text-gray-900 mb-8 pt-5">
                                        Available {services.find(s => s.value === serviceType)?.label}s
                                   </h2>
                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {results.map((worker) => (
                                             <div key={worker.user_id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                                                  {/* Card Header with Profile Picture */}
                                                  <div className="h-48 bg-gradient-to-br from-blue-500 to-orange-500 relative overflow-hidden">
                                                       {worker.profile_picture && (
                                                            <img 
                                                                 src={worker.profile_picture} 
                                                                 alt={worker.display_name}
                                                                 className="w-full h-full"
                                                            />
                                                       )}
                                                       {!worker.profile_picture && (
                                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-orange-400">
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
                                                                 <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                 <span className="font-bold text-gray-900">{worker.avg_rating}</span>
                                                            </div>
                                                            <span className="text-sm text-gray-500">({worker.review_count || 0} reviews)</span>
                                                       </div>

                                                       {/* Base Price */}
                                                       <div className="mb-2 pb-2 border-b border-gray-200">
                                                            <p className="text-sm text-gray-600 mb-1">Base Price <span className="text-xl pl-2 font-bold text-blue-600"> 
                                                                 ৳{worker.base_price}
                                                            </span></p>
                                                       </div>

                                                       {/* Distance */}
                                                       <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                                                            <MapPin className="w-4 h-4 text-orange-500" />
                                                            <span>{(worker.distance_m / 1000).toFixed(2)} km away</span>
                                                       </div>

                                                       {/* Action Buttons */}
                                                       <div className="flex gap-3">
                                                            <Button
                                                                 onClick={() => navigate(`/worker/${worker.user_id}`)}
                                                                 className="flex-1 font-semibold"
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
                              <div className="mt-20 text-center">
                                   <div className="bg-blue-50 rounded-xl p-12 border-2 border-dashed border-blue-300">
                                        <SearchIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Workers found</h3>
                                        <p className="text-gray-600">Try adjusting your search criteria or location</p>
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