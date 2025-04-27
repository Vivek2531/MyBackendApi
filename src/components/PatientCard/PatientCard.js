
import './PatientCard.css';

const PatientCard = ({ patient }) => {
  return (
    <div className="patient-card">
      <p><strong>Name:</strong> {patient.patientName}</p>
      <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
      <p><strong>Treatment:</strong> {patient.treatment}</p>
      <p><strong>Prescription:</strong> {patient.prescription}</p>
      <p><strong>Date:</strong> {new Date(patient.dateCreated).toLocaleDateString()}</p>
    </div>
  );
};

export default PatientCard;