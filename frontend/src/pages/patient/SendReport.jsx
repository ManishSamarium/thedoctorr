import { useLocation } from "react-router-dom";
import ReportUploader from "../../components/patient/ReportUploader";

const SendReport = () => {
  const { state } = useLocation();

  if (!state) {
    return <div className="p-6">Invalid request</div>;
  }

  const { doctor, symptoms, predictions, reportId } = state || {};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ReportUploader
        doctor={doctor}
        symptoms={symptoms}
        predictions={predictions}
        reportId={reportId}
      />
    </div>
  );
};

export default SendReport;
