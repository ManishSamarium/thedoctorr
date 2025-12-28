const PredictionResult = ({ results }) => {
  return (
    <div className="mt-6 bg-white p-5 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">
        Prediction Result
      </h3>

      {results.map((res, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center mb-2"
        >
          <span className="font-medium">
            {res.disease}
          </span>
          <span className="text-blue-600 font-bold">
            {res.probability}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default PredictionResult;
