const DoctorCard = ({ doctor, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Section */}
      <div className="w-full h-48 bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
        {doctor.profileImage ? (
          <img
            src={`http://localhost:5000/${doctor.profileImage}`}
            alt={`Dr. ${doctor.name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl">👨‍⚕️</span>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900">Dr. {doctor.name}</h3>

        <p className="text-sm font-medium text-blue-600 mt-1">
          {doctor.category}
        </p>

        <div className="text-sm text-gray-600 mt-2">
          <span className="font-medium">{doctor.experience}</span> years
          experience
        </div>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < Math.round(doctor.averageRating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {(doctor.averageRating || 0).toFixed(1)}
          </span>
          <span className="text-sm text-gray-500">
            ({doctor.ratingCount || 0} reviews)
          </span>
        </div>

        {/* Bio Preview */}
        {doctor.bio && (
          <p className="text-sm text-gray-600 mt-4 line-clamp-2 flex-1">
            {doctor.bio}
          </p>
        )}

        {/* Action Button */}
        <button
          onClick={() => onSelect(doctor)}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          📋 Consult
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
