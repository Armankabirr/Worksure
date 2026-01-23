import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, MapPin, Phone, Mail, Star, CheckCircle2, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { useCart } from "@/hooks/useCart";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface WorkerProfile {
     id: string;
     email: string;
     phone: string;
     full_name: string;
     gender: string;
     role: string;
     date_of_birth: string;
     profile_picture: string;
     created_at: string;
     last_login_at: string | null;
     status: string;
     worker_profiles: {
          display_name: string;
          bio: string;
          years_experience: number;
          avg_rating: string;
          total_reviews: number;
          verification: string;
          documents_count: number;
          created_at: string;
          updated_at: string;
     };
     worker_services: Array<{
          id: string;
          base_price: string;
          price_unit: string;
          skills: {
               skills: string[];
          };
          created_at: string;
          service_categories: {
               id: number;
               name: string;
               slug: string;
               description: string;
          };
     }>;
     availabilities: Array<{
          id: string;
          available_from: string;
          available_to: string;
          weekend: string[];
     }>;
     addresses: Array<{
          id: string;
          street: string;
          city: string;
          district: string;
          postal_code: string;
          lat: number;
          lon: number;
     }>;
     reviews_reviews_worker_idTousers: Array<any>;
}

// Beautiful Date Picker Component
const DatePickerComponent = ({ selectedDate, onDateChange, minDate, maxDate }: any) => {
     const [currentMonth, setCurrentMonth] = useState(new Date());
     const [showCalendar, setShowCalendar] = useState(false);

     const monthStart = startOfMonth(currentMonth);
     const monthEnd = endOfMonth(currentMonth);
     const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
     const emptyDays = getDay(monthStart);

     // Parse min/max dates properly to avoid timezone issues
     const [minYear, minMonth, minDay] = minDate.split("-").map(Number);
     const minDateObj = new Date(minYear, minMonth - 1, minDay);
     
     const [maxYear, maxMonth, maxDay] = maxDate.split("-").map(Number);
     const maxDateObj = new Date(maxYear, maxMonth - 1, maxDay);

     const handleDateSelect = (day: number) => {
          const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          // Use local date formatting to avoid timezone issues
          const year = selected.getFullYear();
          const month = String(selected.getMonth() + 1).padStart(2, "0");
          const dayStr = String(selected.getDate()).padStart(2, "0");
          const dateString = `${year}-${month}-${dayStr}`;
          onDateChange(dateString);
          setShowCalendar(false);
     };

     const isPastDate = (day: number) => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          // Set time to start of day for proper comparison
          date.setHours(0, 0, 0, 0);
          const minDateCopy = new Date(minDateObj);
          minDateCopy.setHours(0, 0, 0, 0);
          return date < minDateCopy;
     };

     const isFutureDate = (day: number) => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          // Set time to start of day for proper comparison
          date.setHours(0, 0, 0, 0);
          const maxDateCopy = new Date(maxDateObj);
          maxDateCopy.setHours(0, 0, 0, 0);
          return date > maxDateCopy;
     };

     const isSelected = (day: number) => {
          if (!selectedDate) return false;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          // Use local date formatting to avoid timezone issues
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const dayStr = String(date.getDate()).padStart(2, "0");
          const dateString = `${year}-${month}-${dayStr}`;
          return dateString === selectedDate;
     };

     return (
          <div className="space-y-2 relative">
               <Label className="font-semibold text-gray-700 flex items-center">
                    <Calendar className="w-5 h-5 inline-block mr-2 text-blue-600" />
                    Select Date
               </Label>
               <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-blue-400 transition-colors text-left font-medium text-gray-700"
               >
                    {selectedDate ? format(new Date(selectedDate), "MMM dd, yyyy") : "Select a date"}
               </button>
               {showCalendar && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-blue-300 rounded-lg shadow-lg p-4 z-50 w-full">
                         <div className="flex justify-between items-center mb-4">
                              <h3 className="font-semibold text-gray-800">{format(currentMonth, "MMMM yyyy")}</h3>
                              <div className="flex gap-1">
                                   <button
                                        onClick={() => setCurrentMonth(addDays(currentMonth, -7))}
                                        className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
                                   >
                                        <ChevronLeft className="w-4 h-4 text-blue-600" />
                                   </button>
                                   <button
                                        onClick={() => setCurrentMonth(addDays(currentMonth, 7))}
                                        className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
                                   >
                                        <ChevronRight className="w-4 h-4 text-blue-600" />
                                   </button>
                              </div>
                         </div>
                         <div className="grid grid-cols-7 gap-2 mb-2">
                              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                   <div key={day} className="text-center text-xs font-semibold text-gray-600 h-8 flex items-center justify-center">
                                        {day}
                                   </div>
                              ))}
                         </div>
                         <div className="grid grid-cols-7 gap-2">
                              {Array.from({ length: emptyDays }).map((_, i) => (
                                   <div key={`empty-${i}`} className="h-8"></div>
                              ))}
                              {daysInMonth.map((date, i) => {
                                   const day = date.getDate();
                                   const past = isPastDate(day);
                                   const future = isFutureDate(day);
                                   const selected = isSelected(day);

                                   return (
                                        <button
                                             key={day}
                                             onClick={() => !past && !future && handleDateSelect(day)}
                                             disabled={past || future}
                                             className={`h-8 rounded-lg font-medium text-sm transition-colors ${
                                                  selected
                                                       ? "bg-blue-600 text-white"
                                                       : past || future
                                                       ? "text-gray-300 cursor-not-allowed"
                                                       : "text-gray-700 hover:bg-blue-100"
                                             }`}
                                        >
                                             {day}
                                        </button>
                                   );
                              })}
                         </div>
                    </div>
               )}
               <p className="text-xs text-gray-500">Select from today up to 15 days</p>
          </div>
     );
};

// Beautiful Time Picker Component
const TimePickerComponent = ({ selectedTime, onTimeChange, selectedDate, today, minTime, getCurrentTime }: any) => {
     const [showTimePicker, setShowTimePicker] = useState(false);
     const [hour, setHour] = useState(selectedTime ? parseInt(selectedTime.split(":")[0]) : 9);
     const [minute, setMinute] = useState(selectedTime ? parseInt(selectedTime.split(":")[1]) : 0);

     const handleTimeSelect = (h: number, m: number) => {
          // Validate that the time is not in the past for today
          if (selectedDate === today) {
               const currentTimeObj = new Date(`2000-01-01T${minTime}`);
               const selectedTimeObj = new Date(`2000-01-01T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
               if (selectedTimeObj < currentTimeObj) {
                    toast.error("Cannot select a time in the past");
                    return;
               }
          }

          const timeString = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
          onTimeChange(timeString);
          setShowTimePicker(false);
     };

     useEffect(() => {
          if (selectedTime) {
               const [h, m] = selectedTime.split(":").map(Number);
               setHour(h);
               setMinute(m);
          }
     }, [selectedTime]);

     const hours = Array.from({ length: 24 }, (_, i) => i);
     const minutes = Array.from({ length: 60 }, (_, i) => i);

     // Check if a time is valid (not in the past for today)
     const isTimeValid = (h: number, m: number) => {
          if (selectedDate !== today) return true;
          const currentTimeObj = new Date(`2000-01-01T${minTime}`);
          const selectedTimeObj = new Date(`2000-01-01T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
          return selectedTimeObj >= currentTimeObj;
     };

     // Check if hour is valid
     const isHourValid = (h: number) => {
          if (selectedDate !== today) return true;
          const minHour = parseInt(minTime.split(":")[0]);
          return h > minHour || (h === minHour && minute >= parseInt(minTime.split(":")[1]));
     };

     // Check if minute is valid for current hour
     const isMinuteValid = (m: number) => {
          if (selectedDate !== today) return true;
          const minHour = parseInt(minTime.split(":")[0]);
          const minMinute = parseInt(minTime.split(":")[1]);
          
          if (hour > minHour) return true;
          if (hour === minHour) return m >= minMinute;
          return false;
     };

     return (
          <div className="space-y-2 relative">
               <Label className="font-semibold text-gray-700 flex items-center">
                    <Clock className="w-5 h-5 inline-block mr-2 text-indigo-600" />
                    Select Time
               </Label>
               <button
                    onClick={() => setShowTimePicker(!showTimePicker)}
                    disabled={!selectedDate}
                    className={`w-full px-4 py-2.5 border rounded-lg transition-colors font-medium text-left ${
                         !selectedDate
                              ? "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                              : "border-indigo-300 bg-white hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 text-gray-700"
                    }`}
               >
                    {selectedTime || "Select a time"}
               </button>
               {showTimePicker && selectedDate && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-indigo-300 rounded-lg shadow-lg p-4 z-50 w-full">
                         <div className="flex justify-between items-center mb-3">
                              <h3 className="font-semibold text-gray-800">Select Time</h3>
                              <button
                                   onClick={() => setShowTimePicker(false)}
                                   className="text-gray-500 hover:text-gray-700"
                              >
                                   ✕
                              </button>
                         </div>
                         <div className="flex gap-4 justify-center items-center">
                              {/* Hour Picker */}
                              <div className="flex flex-col items-center">
                                   <p className="text-xs text-gray-600 mb-2">Hour</p>
                                   <div className="border border-indigo-300 rounded-lg overflow-hidden flex flex-col h-32">
                                        <div className="overflow-y-auto flex flex-col">
                                             {hours.map((h) => {
                                                  const isValid = isHourValid(h);
                                                  return (
                                                       <button
                                                            key={h}
                                                            onClick={() => setHour(h)}
                                                            disabled={!isValid}
                                                            className={`px-3 py-2 text-sm font-medium transition-colors ${
                                                                 hour === h
                                                                      ? "bg-indigo-600 text-white"
                                                                      : !isValid
                                                                      ? "text-gray-300 cursor-not-allowed"
                                                                      : "text-gray-700 hover:bg-indigo-100"
                                                            }`}
                                                       >
                                                            {String(h).padStart(2, "0")}
                                                       </button>
                                                  );
                                             })}
                                        </div>
                                   </div>
                              </div>
                              <div className="text-2xl font-bold text-gray-400">:</div>
                              {/* Minute Picker */}
                              <div className="flex flex-col items-center">
                                   <p className="text-xs text-gray-600 mb-2">Minute</p>
                                   <div className="border border-indigo-300 rounded-lg overflow-hidden flex flex-col h-32">
                                        <div className="overflow-y-auto flex flex-col">
                                             {minutes.map((m) => {
                                                  const isValid = isMinuteValid(m);
                                                  return (
                                                       <button
                                                            key={m}
                                                            onClick={() => setMinute(m)}
                                                            disabled={!isValid}
                                                            className={`px-3 py-2 text-sm font-medium transition-colors ${
                                                                 minute === m
                                                                      ? "bg-indigo-600 text-white"
                                                                      : !isValid
                                                                      ? "text-gray-300 cursor-not-allowed"
                                                                      : "text-gray-700 hover:bg-indigo-100"
                                                            }`}
                                                       >
                                                            {String(m).padStart(2, "0")}
                                                       </button>
                                                  );
                                             })}
                                        </div>
                                   </div>
                              </div>
                         </div>
                         <div className="flex gap-2 mt-4">
                              <button
                                   onClick={() => setShowTimePicker(false)}
                                   className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                              >
                                   Cancel
                              </button>
                              <button
                                   onClick={() => handleTimeSelect(hour, minute)}
                                   disabled={!isTimeValid(hour, minute)}
                                   className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                                        isTimeValid(hour, minute)
                                             ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                             : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                   }`}
                              >
                                   Confirm
                              </button>
                         </div>
                    </div>
               )}
               <p className="text-xs text-gray-500">
                    {!selectedDate ? "Select a date first" : selectedDate === today ? `From ${getCurrentTime()} onwards` : "Any time available"}
               </p>
          </div>
     );
};

const WorkerDetail = () => {
     const { id } = useParams<{ id: string }>();
     const navigate = useNavigate();
     const { addToCart } = useCart();
     const axiosPublic = useAxiosPublic();
     const { user } = useAuth();
     const [worker, setWorker] = useState<WorkerProfile | null>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [selectedDate, setSelectedDate] = useState("");
     const [selectedTime, setSelectedTime] = useState("");
     const [description, setDescription] = useState("");
     const [selectedAddress, setSelectedAddress] = useState("");
     const [showHireDialog, setShowHireDialog] = useState(false);
     const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
     const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
     const [availabilityStatus, setAvailabilityStatus] = useState<{ available: boolean; message: string } | null>(null);


     useEffect(() => {
          const fetchWorkerDetails = async () => {
               if (!id) {
                    setError("Worker ID not found");
                    setLoading(false);
                    return;
               }

               try {
                    setLoading(true);
                    const response = await axiosPublic.get(`/workerRoutes/getWorkerDetails/${id}`);
                    setWorker(response.data.data || response.data);
               } catch (err) {
                    console.error("Error fetching worker:", err);
                    setError(err instanceof Error ? err.message : "Failed to load worker details");
               } finally {
                    setLoading(false);
               }
          };

          fetchWorkerDetails();
     }, [id, axiosPublic]);

     const handleHire = async () => {
          if (!selectedDate || !selectedTime) {
               toast.error("Please select both date and time");
               return;
          }

          if (!description.trim()) {
               toast.error("Please describe your problem");
               return;
          }

          if (!selectedAddress.trim()) {
               toast.error("Please enter your address");
               return;
          }

          if (!worker || !user) {
               toast.error("User information not found");
               return;
          }

          // Combine date and time
          const dateTime = new Date(`${selectedDate}T${selectedTime}`);

          // Validate that booking time is not in the past
          if (dateTime < new Date()) {
               toast.error("Cannot book in the past. Please select a future date and time.");
               return;
          }

          setIsSubmittingOrder(true);
          try {
               const mergedDateTime = `${selectedDate}T${selectedTime}`;
               const orderData = {
                    client_email: user.email,
                    worker_id: worker.id,
                    selected_time: mergedDateTime,
                    address: selectedAddress.trim(),
                    description: description.trim(),
                    total_amount: worker.worker_services[0]?.base_price || "0",
               };

               console.log(orderData);
               

               const response = await axiosPublic.post("/orderRoutes/createOrder", orderData);

               if (response.status === 200 || response.status === 201) {
                    toast.success("Order created successfully!", {
                         description: "Your order has been placed and sent to the worker.",
                    });
                    setShowHireDialog(false)
               }
          } catch (err) {
               console.error("Error creating order:", err);
               toast.error(err instanceof Error ? err.message : "Failed to create order. Please try again.");
          } finally {
               setIsSubmittingOrder(false);
          }
     };

     const handleCheckAvailability = async () => {
          if (!selectedDate || !selectedTime) {
               toast.error("Please select both date and time");
               return;
          }

          if (!worker) {
               toast.error("Worker information not found");
               return;
          }

          setIsCheckingAvailability(true);
          try {
               const mergedDateTime = `${selectedDate}T${selectedTime}`;
               const response = await axiosPublic.post("/userRoutes/checkWorkerAvailability", {
                    workerId: worker.id,
                    selectedTime: mergedDateTime,
               });

               const data = response.data;
               setAvailabilityStatus({
                    available: data.available,
                    message: data.message,
               });

               if (data.available) {
                    toast.success(data.message);
               } else {
                    toast.error(data.message);
               }
          } catch (err) {
               console.error("Error checking availability:", err);
               toast.error("Failed to check availability. Please try again.");
               setAvailabilityStatus(null);
          } finally {
               setIsCheckingAvailability(false);
          }
     };

     if (loading) {
          return (
               <div className="min-h-screen flex flex-col">
                    <Header />
                    <div className="flex-1 flex items-center justify-center">
                         <div className="text-center">
                              <BeatLoader color="#3b82f6" size={12} />
                              <p className="mt-4 text-gray-600">Loading worker details...</p>
                         </div>
                    </div>
                    <Footer />
               </div>
          );
     }

     if (error || !worker) {
          return (
               <div className="min-h-screen flex flex-col">
                    <Header />
                    <div className="flex-1 flex items-center justify-center p-6">
                         <Card className="max-w-md w-full border-red-200 bg-red-50">
                              <CardHeader>
                                   <div className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                        <CardTitle className="text-red-800">Error Loading Worker</CardTitle>
                                   </div>
                              </CardHeader>
                              <CardContent>
                                   <p className="text-red-700 mb-4">{error || "Worker not found"}</p>
                                   <Button onClick={() => navigate("/search/workers")} className="w-full">
                                        Back to Search
                                   </Button>
                              </CardContent>
                         </Card>
                    </div>
                    <Footer />
               </div>
          );
     }

     console.log(worker);
     

     const primaryService = worker.worker_services[0];
     const primaryAddress = worker.addresses[0];
     const availability = worker.availabilities[0];

     const fromTimeUTC = new Date(availability?.available_from).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "UTC"
     });

     const toTimeUTC = new Date(availability?.available_to).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "UTC"
     });

     // Get min date (today) - use local date formatting to avoid timezone issues
     const now = new Date();
     const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

     // Get max date (15 days from today) - use local date formatting
     const maxDateObj = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
     const maxDate = `${maxDateObj.getFullYear()}-${String(maxDateObj.getMonth() + 1).padStart(2, "0")}-${String(maxDateObj.getDate()).padStart(2, "0")}`;

     // Get current time in HH:MM format
     const getCurrentTime = () => {
          const now = new Date();
          const hours = String(now.getHours()).padStart(2, "0");
          const minutes = String(now.getMinutes()).padStart(2, "0");
          return `${hours}:${minutes}`;
     };

     // Calculate minimum allowed time based on selected date
     const getMinTime = () => {
          if (selectedDate === today) {
               return getCurrentTime();
          }
          return "00:00";
     };

     return (
          <div className="min-h-screen flex flex-col">
               <Header />

               <main className="flex-1 py-8 px-4 md:px-8 pt-28">
                    <div className="max-w-6xl mx-auto">
                         {/* Back Button */}
                         <button
                              onClick={() => navigate(-1)}
                              className="text-blue-600 hover:text-blue-800 font-semibold mb-6 flex items-center gap-2"
                         >
                              ← Back
                         </button>

                         {/* Main Content Grid */}
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* Left Column - Worker Info */}
                              <div className="lg:col-span-2 space-y-6">
                                   {/* Header Card */}
                                   <Card className="overflow-hidden">
                                        <div className="h-40 relative overflow-hidden">
                                             {worker.profile_picture ? (
                                                  <img
                                                       src={worker.profile_picture}
                                                       alt={worker.full_name}
                                                       className="w-48 h-48 object-center mx-auto pt-3"
                                                  />
                                             ) : (
                                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-orange-400">
                                                       <span className="text-white text-6xl font-bold">{worker.full_name.charAt(0)}</span>
                                                  </div>
                                             )}
                                        </div>

                                        <CardContent className="p-6">
                                             {/* Name and Title */}
                                             <div className="mb-4">
                                                  <h1 className="text-4xl font-bold text-gray-900 mb-1">
                                                       {worker.worker_profiles.display_name}
                                                  </h1>
                                                  <p className="text-gray-600 text-lg">{primaryService?.service_categories.name}</p>
                                             </div>

                                             {/* Verification Badge */}
                                             {worker.worker_profiles.verification === "verified" && (
                                                  <div className="flex items-center gap-2 mb-4">
                                                       <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                       <span className="text-green-700 font-semibold">Verified Professional</span>
                                                  </div>
                                             )}

                                             {/* Rating and Reviews */}
                                             <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                                                  <div className="flex items-center gap-2">
                                                       <div className="flex items-center gap-1">
                                                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                                            <span className="font-bold text-xl text-gray-900">
                                                                 {worker.worker_profiles.avg_rating}
                                                            </span>
                                                       </div>
                                                       <span className="text-gray-600">
                                                            ({worker.worker_profiles.total_reviews} reviews)
                                                       </span>
                                                  </div>
                                             </div>

                                             {/* Experience and Documents */}
                                             <div className="grid grid-cols-2 gap-4 mb-4">
                                                  <div className="bg-blue-50 p-4 rounded-lg">
                                                       <p className="text-gray-600 text-sm">Experience</p>
                                                       <p className="text-2xl font-bold text-blue-600">
                                                            {worker.worker_profiles.years_experience}+ years
                                                       </p>
                                                  </div>
                                             </div>

                                             {/* Bio */}
                                             <p className="text-gray-700 leading-relaxed">{worker.worker_profiles.bio}</p>
                                        </CardContent>
                                   </Card>

                                   {/* Details Tabs */}
                                   <Tabs defaultValue="services" className="w-full">
                                        <TabsList className="grid w-full grid-cols-3">
                                             <TabsTrigger value="services">Services</TabsTrigger>
                                             <TabsTrigger value="availability">Availability</TabsTrigger>
                                             <TabsTrigger value="location">Location</TabsTrigger>
                                        </TabsList>

                                        {/* Services Tab */}
                                        <TabsContent value="services" className="space-y-4">
                                             {primaryService && (
                                                  <Card>
                                                       <CardHeader>
                                                            <CardTitle>{primaryService.service_categories.name}</CardTitle>
                                                            <CardDescription>
                                                                 {primaryService.service_categories.description}
                                                            </CardDescription>
                                                       </CardHeader>
                                                       <CardContent className="space-y-4">
                                                            {/* Price */}
                                                            <div className="flex items-baseline gap-2">
                                                                 <span className="text-3xl font-bold text-blue-600">
                                                                      ৳{primaryService.base_price}
                                                                 </span>
                                                                 <span className="text-gray-600">per {primaryService.price_unit}</span>
                                                            </div>

                                                            {/* Skills */}
                                                            <div>
                                                                 <h4 className="font-semibold text-gray-900 mb-3">Skills & Expertise</h4>
                                                                 <div className="flex flex-wrap gap-2">
                                                                      {primaryService.skills.map((skill, idx) => (
                                                                           <Badge key={idx} variant="secondary">
                                                                                {skill}
                                                                           </Badge>
                                                                      ))}
                                                                 </div>
                                                            </div>
                                                       </CardContent>
                                                  </Card>
                                             )}
                                        </TabsContent>

                                        {/* Availability Tab */}
                                        <TabsContent value="availability" className="space-y-4">
                                             {availability ? (
                                                  <Card>
                                                       <CardHeader>
                                                            <CardTitle>Working Hours</CardTitle>
                                                       </CardHeader>
                                                       <CardContent className="space-y-4">
                                                            <div className="flex items-center gap-2">
                                                                 <Clock className="w-5 h-5 text-blue-600" />
                                                                 <div>
                                                                      <p className="text-sm text-gray-600">Available from</p>
                                                                      <p className="font-semibold text-gray-900">
                                                                           {fromTimeUTC} to{" "}
                                                                           {toTimeUTC}
                                                                      </p>
                                                                 </div>
                                                            </div>

                                                            {availability.weekend.length > 0 && (
                                                                 <div className="pt-4 border-t border-gray-200">
                                                                      <p className="text-sm text-gray-600 mb-2">Offday</p>
                                                                      <div className="flex flex-wrap gap-2">
                                                                           {availability.weekend.map((day, idx) => (
                                                                                <Badge key={idx} variant="outline">
                                                                                     {day}
                                                                                </Badge>
                                                                           ))}
                                                                      </div>
                                                                 </div>
                                                            )}
                                                       </CardContent>
                                                  </Card>
                                             ) : (
                                                  <Card>
                                                       <CardContent className="pt-6">
                                                            <p className="text-gray-600">No availability information available</p>
                                                       </CardContent>
                                                  </Card>
                                             )}
                                        </TabsContent>

                                        {/* Location Tab */}
                                        <TabsContent value="location" className="space-y-4">
                                             {primaryAddress ? (
                                                  <Card>
                                                       <CardHeader>
                                                            <CardTitle>Service Area</CardTitle>
                                                       </CardHeader>
                                                       <CardContent className="space-y-4">
                                                            <div className="flex gap-3">
                                                                 <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                                                                 <div>
                                                                      <p className="font-semibold text-gray-900">{primaryAddress.street}</p>
                                                                      <p className="text-gray-600">
                                                                           {primaryAddress.city}, {primaryAddress.district} - {primaryAddress.postal_code}
                                                                      </p>
                                                                 </div>
                                                            </div>
                                                       </CardContent>
                                                  </Card>
                                             ) : (
                                                  <Card>
                                                       <CardContent className="pt-6">
                                                            <p className="text-gray-600">No location information available</p>
                                                       </CardContent>
                                                  </Card>
                                             )}
                                        </TabsContent>
                                   </Tabs>
                              </div>

                              {/* Right Column - Hire Card */}
                              <div>
                                   <Card className="sticky top-8">
                                        <CardHeader>
                                             <CardTitle>Book This Worker</CardTitle>
                                             <CardDescription>
                                                  Select your preferred date and time
                                             </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                             {/* Price Display */}
                                             <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                                  <p className="text-sm text-gray-600 mb-1">Base Price</p>
                                                  <p className="text-3xl font-bold text-blue-600">
                                                       ৳{primaryService?.base_price}
                                                  </p>
                                                  <p className="text-xs text-gray-600 mt-1">
                                                       per {primaryService?.price_unit}
                                                  </p>
                                             </div>

                                             {/* Contact Info */}
                                             <div className="space-y-2 pb-4 border-b border-gray-200">
                                                  <div className="flex items-center gap-3">
                                                       <Phone className="w-4 h-4 text-gray-600" />
                                                       <span className="text-sm text-gray-700">{worker.phone}</span>
                                                  </div>
                                                  <div className="flex items-center gap-3">
                                                       <Mail className="w-4 h-4 text-gray-600" />
                                                       <span className="text-sm text-gray-700 truncate">{worker.email}</span>
                                                  </div>
                                             </div>

                                             {/* Hire Dialog */}
                                             <Dialog open={showHireDialog} onOpenChange={setShowHireDialog}>
                                                  <DialogTrigger asChild>
                                                       <Button className="w-full text-lg font-semibold py-6">
                                                            Hire Now
                                                       </Button>
                                                  </DialogTrigger>
                                                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                                       <DialogHeader>
                                                            <DialogTitle>Schedule Your Booking</DialogTitle>
                                                       </DialogHeader>

                                                       <div className="space-y-4 py-4">
                                                            {/* Date and Time Selection */}
                                                            <div className="grid grid-cols-2 gap-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 shadow-md">
                                                                 {/* Date Selection - Calendar Picker */}
                                                                 <DatePickerComponent 
                                                                      selectedDate={selectedDate} 
                                                                      onDateChange={setSelectedDate}
                                                                      minDate={today}
                                                                      maxDate={maxDate}
                                                                 />

                                                                 {/* Time Selection - Time Picker */}
                                                                 <TimePickerComponent 
                                                                      selectedTime={selectedTime}
                                                                      onTimeChange={setSelectedTime}
                                                                      selectedDate={selectedDate}
                                                                      today={today}
                                                                      minTime={getMinTime()}
                                                                      getCurrentTime={getCurrentTime}
                                                                 />
                                                            </div>

                                                            {/* Check Availability Button */}
                                                            {selectedDate && selectedTime && (
                                                                 <div className="flex gap-2">
                                                                      <Button
                                                                           onClick={handleCheckAvailability}
                                                                           disabled={isCheckingAvailability}
                                                                           className="flex-1 bg-blue-600 hover:bg-blue-700"
                                                                      >
                                                                           {isCheckingAvailability ? (
                                                                                <>
                                                                                     <BeatLoader color="#ffffff" size={4} />
                                                                                     <span className="ml-2">Checking...</span>
                                                                                </>
                                                                           ) : (
                                                                                "Check Availability"
                                                                           )}
                                                                      </Button>
                                                                 </div>
                                                            )}

                                                            {/* Availability Status */}
                                                            {availabilityStatus && (
                                                                 <div
                                                                      className={`p-3 rounded-lg border ${
                                                                           availabilityStatus.available
                                                                                ? "bg-green-50 border-green-200"
                                                                                : "bg-red-50 border-red-200"
                                                                      }`}
                                                                 >
                                                                      <p
                                                                           className={`text-sm font-medium ${
                                                                                availabilityStatus.available ? "text-green-700" : "text-red-700"
                                                                           }`}
                                                                      >
                                                                           {availabilityStatus.available ? "✓" : "✗"} {availabilityStatus.message}
                                                                      </p>
                                                                 </div>
                                                            )}

                                                            {/* Address Input */}
                                                            <div className="space-y-2">
                                                                 <Label htmlFor="service-address" className="font-semibold">
                                                                      <MapPin className="w-4 h-4 inline-block mr-2" />
                                                                      Service Address
                                                                 </Label>
                                                                 <Input
                                                                      id="service-address"
                                                                      type="text"
                                                                      placeholder="Enter your full address where the service is needed"
                                                                      value={selectedAddress}
                                                                      onChange={(e) => setSelectedAddress(e.target.value)}
                                                                      className="w-full"
                                                                 />
                                                            </div>

                                                            {/* Problem Description */}
                                                            <div className="space-y-2">
                                                                 <Label htmlFor="problem-description" className="font-semibold">
                                                                      Describe Your Problem
                                                                 </Label>
                                                                 <Textarea
                                                                      id="problem-description"
                                                                      placeholder="Please describe the issue or service you need in detail..."
                                                                      value={description}
                                                                      onChange={(e) => setDescription(e.target.value)}
                                                                      className="w-full min-h-32 resize-none"
                                                                 />
                                                                 <p className="text-xs text-gray-500">
                                                                      {description.length}/500 characters
                                                                 </p>
                                                            </div>

                                                            {/* Selected Summary */}
                                                            {selectedDate && selectedTime && (
                                                                 <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                                                      <p className="text-sm text-gray-600">
                                                                           <span className="font-semibold text-green-700">Booking Summary:</span>
                                                                      </p>
                                                                      <p className="text-sm text-gray-700 mt-1">
                                                                           📅 {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
                                                                      </p>
                                                                      <p className="text-sm text-gray-700">🕐 {selectedTime}</p>
                                                                 </div>
                                                            )}

                                                            {/* Action Buttons */}
                                                            <div className="flex gap-3 pt-4">
                                                                 <Button
                                                                      variant="outline"
                                                                      className="flex-1"
                                                                      onClick={() => setShowHireDialog(false)}
                                                                      disabled={isSubmittingOrder}
                                                                 >
                                                                      Cancel
                                                                 </Button>
                                                                 <Button
                                                                      className="flex-1"
                                                                      disabled={!selectedDate || !selectedTime || !description.trim() || !selectedAddress.trim() || isSubmittingOrder}
                                                                      onClick={handleHire}
                                                                 >
                                                                      {isSubmittingOrder ? (
                                                                           <>
                                                                                <BeatLoader color="#ffffff" size={5} />
                                                                                <span className="ml-2">Booking...</span>
                                                                           </>
                                                                      ) : (
                                                                           "Confirm Booking"
                                                                      )}
                                                                 </Button>
                                                            </div>
                                                       </div>
                                                  </DialogContent>
                                             </Dialog>
                                        </CardContent>
                                   </Card>
                              </div>
                         </div>
                    </div>
               </main>

               <Footer />
          </div>
     );
};

export default WorkerDetail;
