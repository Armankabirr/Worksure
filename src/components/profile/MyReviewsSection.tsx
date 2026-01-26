import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Star, Loader2, UserCircle, Calendar, Package, Briefcase } from "lucide-react";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { UserReviewsData, UserReviewItem } from "@/types/profile";

interface MyReviewsSectionProps {
  userId?: string;
}

const MyReviewsSection = ({ userId }: MyReviewsSectionProps) => {
  const axiosPublic = useAxiosPublic();
  const [reviewsData, setReviewsData] = useState<UserReviewsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosPublic.get(`/userRoutes/reviews/${userId}`);
        if (response.data.success) {
          setReviewsData(response.data.data);
        } else {
          setError("Failed to load reviews");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId, axiosPublic]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-2 text-gray-600">Loading your reviews...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-orange-500 hover:text-orange-600 underline text-sm"
        >
          Try again
        </button>
      </Card>
    );
  }

  if (!reviewsData || reviewsData.reviews.length === 0) {
    return (
      <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-8 text-center">
        <Star className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-foreground mb-1">My Reviews</h2>
        <p className="text-sm text-muted-foreground">
          Your reviews for hired services will appear here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center">
            <Star className="h-6 w-6 mr-2 text-orange-500" />
            My Reviews
          </h2>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Package className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {reviewsData.total_reviews}
            </p>
            <p className="text-xs text-gray-600 mt-1">Total Reviews Given</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Briefcase className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {reviewsData.reviews.length}
            </p>
            <p className="text-xs text-gray-600 mt-1">Showing on this page</p>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewsData.reviews.map((review: UserReviewItem) => (
          <Card
            key={review.id}
            className="bg-white border-slate-200 shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Worker Avatar */}
              <div className="flex-shrink-0">
                {review.worker.profile_picture ? (
                  <img
                    src={review.worker.profile_picture}
                    alt={review.worker.name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-orange-200"
                  />
                ) : (
                  <UserCircle className="h-14 w-14 text-gray-400" />
                )}
              </div>

              {/* Review Content */}
              <div className="flex-1 min-w-0">
                {/* Header with Worker Info */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">
                      {review.worker.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600">
                        {review.worker.display_name}
                      </span>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">
                          {review.worker.avg_rating} avg rating
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(review.created_at)}
                  </div>
                </div>

                {/* Your Rating */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Your Rating:
                  </span>
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500">
                    {review.rating}/5
                  </span>
                </div>

                {/* Review Comment */}
                <p className="text-gray-700 leading-relaxed mb-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {review.comment}
                </p>

                {/* Order Details */}
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500">Service:</span>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {review.order_details.description}
                    </span>
                    <span className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(review.order_details.status)}`}>
                      {review.order_details.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      • Service Date: {formatDate(review.order_details.service_date)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Order ID: {review.order_id}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Info */}
      {reviewsData.pagination.total_pages > 1 && (
        <Card className="bg-white border-slate-200 shadow-sm rounded-xl p-4">
          <p className="text-sm text-gray-600 text-center">
            Page {reviewsData.pagination.current_page} of{" "}
            {reviewsData.pagination.total_pages} • Showing{" "}
            {reviewsData.reviews.length} of{" "}
            {reviewsData.pagination.total_count} reviews
          </p>
        </Card>
      )}
    </div>
  );
};

export default MyReviewsSection;

