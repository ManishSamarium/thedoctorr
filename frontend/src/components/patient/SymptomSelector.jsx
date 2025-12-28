const SymptomSelector = ({ symptoms, selected, setSelected }) => {
  const toggleSymptom = (symptom) => {
    if (selected.includes(symptom)) {
      setSelected(selected.filter((s) => s !== symptom));
    } else {
      setSelected([...selected, symptom]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {symptoms.map((symptom) => (
        <button
          key={symptom}
          onClick={() => toggleSymptom(symptom)}
          className={`border px-3 py-2 rounded text-sm ${
            selected.includes(symptom)
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          {symptom}
        </button>
      ))}
    </div>
  );
};

export default SymptomSelector;
