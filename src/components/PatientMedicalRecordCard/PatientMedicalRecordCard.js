// import { useNavigate } from 'react-router-dom';
// import './PatientMedicalRecordCard.css';

// const PatientMedicalRecordCard = ({ records }) => {
//   const navigate = useNavigate();

//   // Handle case where records is not loaded or not an array
//   if (!Array.isArray(records) || records.length === 0) {
//     return <p className="no-records-message">There are no medical records for you.</p>;
//   }

//   return (
//     <>
//       {records.map((record, index) => (
//         <div
//           key={index}
//           className="patient-health-card"
//           onClick={() => navigate(`/patient/medicalrecord/${record.recordId}`)}
//         >
//           <p><strong>Name:</strong> {record.patientName}</p>
//           <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
//           <p><strong>Treatment:</strong> {record.treatment}</p>
//           <p><strong>Prescription:</strong> {record.prescription}</p>
//           <p><strong>Date:</strong> {new Date(record.dateCreated).toLocaleDateString()}</p>
//         </div>
//       ))}
//     </>
//   );
// };

// export default PatientMedicalRecordCard;

import './PatientMedicalRecordCard.css';

const PatientMedicalRecordCard = ({ records }) => {
  // Handle case where records is not loaded or not an array
  if (!Array.isArray(records) || records.length === 0) {
    return <p className="no-records-message">There are no medical records for you.</p>;
  }

  return (
    <>
      {records.map((record, index) => (
        <div key={index} className="patient-health-card">
          <p><strong>Name:</strong> {record.patientName}</p>
          <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
          <p><strong>Treatment:</strong> {record.treatment}</p>
          <p><strong>Prescription:</strong> {record.prescription}</p>
          <p><strong>Date:</strong> {new Date(record.dateCreated).toLocaleDateString()}</p>
        </div>
      ))}
    </>
  );
};

export default PatientMedicalRecordCard;

