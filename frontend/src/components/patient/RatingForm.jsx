import { useState } from "react";
import { submitRating } from "../../api/rating.api";
import { useToast } from "../common/Toast";

const RatingForm = ({ appointmentId, onSubmitted, appointmentStatus }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const { show: showToast } = useToast();

  // Only allow rating if appointment is accepted
  if (appointmentStatus !== "accepted") {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      showToast("Please select a rating between 1 and 5", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await submitRating(appointmentId, rating, review);
      showToast("Rating submitted successfully!", "success");
      // Notify that ratings changed for the doctor
      try {
        const doctorId = res.data.rating.doctorId;
        window.dispatchEvent(new CustomEvent("rating-updated", { detail: { doctorId } }));
      } catch (e) {
        // ignore
      }
      onSubmitted();
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.message || "Failed to submit rating",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-linear-to-br from-yellow-50 to-orange-50 border border-yellow-200 p-6 rounded-lg mt-6"
    >
      <h4 className="text-lg font-bold text-gray-900 mb-4">Rate This Doctor</h4>

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRating(r)}
              className={`text-3xl transition transform hover:scale-110 ${
                r <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ⭐
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Selected: {rating} star{rating !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Review */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Review (optional)
        </label>
        <textarea
          placeholder="Share your experience with this doctor..."
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Rating"
        )}
      </button>
    </form>
  );
};

export default RatingForm;
