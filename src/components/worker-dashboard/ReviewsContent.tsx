import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Star, Loader2, UserCircle, Calendar, Package } from "lucide-react";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { WorkerReviewsData, WorkerReviewItem } from "@/types/workerDashboard";

interface ReviewsContentProps {
  workerId: string;
}

export const ReviewsContent = ({ workerId }: ReviewsContentProps) => {
  const axiosPublic = useAxiosPublic();
  const [reviewsData, setReviewsData] = useState<WorkerReviewsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workerId) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosPublic.get(`/workerRoutes/reviews/${workerId}`);
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
  }, [workerId, axiosPublic]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-gray-600">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="p-8 text-center max-w-md">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-orange-500 hover:text-orange-600 underline"
          >
            Try again
          </button>
        </Card>
      </div>
    );
  }

  if (!reviewsData) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="p-8 text-center">
          <p className="text-gray-500">No review data available</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Star className="h-6 w-6 mr-2 text-orange-500" />
          My Reviews
        </h2>
      </div>

      {/* Summary Card */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-l-orange-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {parseFloat(reviewsData.avg_rating).toFixed(1)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Average Rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Package className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {reviewsData.total_reviews}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Reviews</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              {renderStars(Math.round(parseFloat(reviewsData.avg_rating)))}
            </div>
            <p className="text-sm text-gray-600 mt-3">Overall Performance</p>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          All Reviews ({reviewsData.reviews.length})
        </h3>

        {reviewsData.reviews.length === 0 ? (
          <Card className="p-12 text-center">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">
              No reviews yet
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Complete some work to start receiving reviews
            </p>
          </Card>
        ) : (
          reviewsData.reviews.map((review: WorkerReviewItem) => (
            <Card
              key={review.id}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Reviewer Avatar */}
                <div className="flex-shrink-0">
                  {review.reviewer.profile_picture ? (
                    <img
                      src={review.reviewer.profile_picture}
                      alt={review.reviewer.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <UserCircle className="h-12 w-12 text-gray-400" />
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {review.reviewer.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(review.created_at)}
                    </div>
                  </div>

                  {/* Service Description */}
                  {review.service_description && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                        Service: {review.service_description}
                      </span>
                    </div>
                  )}

                  {/* Review Comment */}
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Order ID */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Order ID: {review.order_id}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination Info */}
      {reviewsData.pagination.total_pages > 1 && (
        <div className="flex items-center justify-center mt-6">
          <Card className="p-4">
            <p className="text-sm text-gray-600">
              Page {reviewsData.pagination.current_page} of{" "}
              {reviewsData.pagination.total_pages} • Showing{" "}
              {reviewsData.reviews.length} of{" "}
              {reviewsData.pagination.total_count} reviews
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReviewsContent;
