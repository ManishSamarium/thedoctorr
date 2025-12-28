import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictDisease } from "../../api/ai.api";
import { downloadReportPdf } from "../../api/report.api";
import SymptomSelector from "../../components/patient/SymptomSelector";
import PredictionResult from "../../components/patient/PredictionResult";
import { useToast } from "../../components/common/Toast";

const ALL_SYMPTOMS = [
  "fever",
  "cough",
  "headache",
  "sore throat",
  "fatigue",
  "vomiting",
  "diarrhea",
  "skin rash",
  "body pain",
  "chills",
];

const PredictDisease = () => {
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState([]);
  const [reportId, setReportId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const { show: showToast } = useToast();

  const handlePredict = async () => {
    if (selected.length === 0) {
      showToast("Please select at least one symptom", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await predictDisease(selected);
      // Backend returns { predictions: [...], reportId }
      setResults(res.data.predictions || []);
      setReportId(res.data.reportId || null);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || err.message || "Prediction failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleDownloadPdf = async () => {
    setPdfLoading(true);

    if (!reportId) {
      alert("Report not available for download. Please generate a prediction first.");
      setPdfLoading(false);
      return;
    }

    const blob = await downloadReportPdf(reportId);

    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "disease-report.pdf");
    document.body.appendChild(link);
    link.click();
    link.remove();

    setPdfLoading(false);
  };

  const handleSendToDoctor = () => {
    if (!reportId || results.length === 0) {
      alert("Please generate a prediction before sending to a doctor.");
      return;
    }
    navigate("/patient/doctors", {
      state: { symptoms: selected, predictions: results, reportId },
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Disease Prediction
      </h2>

      <p className="text-gray-600 mb-6">
        Select symptoms you are experiencing.
      </p>

      <SymptomSelector
        symptoms={ALL_SYMPTOMS}
        selected={selected}
        setSelected={setSelected}
      />

      <button
        onClick={handlePredict}
        disabled={loading}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Predicting..." : "Predict Disease"}
      </button>

      {results.length > 0 && (
        <>
          <PredictionResult results={results} />

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {pdfLoading ? "Generating PDF..." : "Download Report PDF"}
            </button>

            <button
              onClick={handleSendToDoctor}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Send to a Doctor
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PredictDisease;
