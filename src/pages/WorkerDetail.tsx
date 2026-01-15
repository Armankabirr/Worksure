import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
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
import { AlertCircle, MapPin, Phone, Mail, Star, CheckCircle2, Calendar, Clock } from "lucide-react";
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
     is_active: boolean;
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

          setIsSubmittingOrder(true);
          try {
               const orderData = {
                    client_email: user.email,
                    worker_id: worker.id,
                    selected_time: dateTime.toISOString(),
                    address: selectedAddress.trim(),
                    description: description.trim(),
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

     // Get min date (today)
     const today = new Date().toISOString().split("T")[0];

     // Get max date (30 days from today)
     const maxDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

     return (
          <div className="min-h-screen flex flex-col">
               <Header />

               <main className="flex-1 py-8 px-4 md:px-8">
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
                                                  <DialogContent className="max-w-md">
                                                       <DialogHeader>
                                                            <DialogTitle>Schedule Your Booking</DialogTitle>
                                                       </DialogHeader>

                                                       <div className="space-y-4 py-4">
                                                            {/* Date Selection */}
                                                            <div className="space-y-2">
                                                                 <Label htmlFor="booking-date" className="font-semibold">
                                                                      <Calendar className="w-4 h-4 inline-block mr-2" />
                                                                      Select Date
                                                                 </Label>
                                                                 <Input
                                                                      id="booking-date"
                                                                      type="date"
                                                                      value={selectedDate}
                                                                      onChange={(e) => setSelectedDate(e.target.value)}
                                                                      min={today}
                                                                      max={maxDate}
                                                                      className="w-full"
                                                                 />
                                                            </div>

                                                            {/* Time Selection */}
                                                            <div className="space-y-2">
                                                                 <Label htmlFor="booking-time" className="font-semibold">
                                                                      <Clock className="w-4 h-4 inline-block mr-2" />
                                                                      Select Time
                                                                 </Label>
                                                                 <Input
                                                                      id="booking-time"
                                                                      type="time"
                                                                      value={selectedTime}
                                                                      onChange={(e) => setSelectedTime(e.target.value)}
                                                                      className="w-full"
                                                                 />
                                                            </div>

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
