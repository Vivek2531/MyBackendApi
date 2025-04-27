// import './HealthRecordCard.css';
// import { useNavigate } from 'react-router-dom';

// const HealthRecordCard = ({ patient, onDelete }) => {
//   const navigate = useNavigate();

//   const handleEdit = () => {
//     navigate(`/healthrecords/edit/${patient.id}`); // Navigate to edit form
//   };

//   return (
//     <div className="health-card">
//       <p><strong>Name:</strong> {patient.name}</p>
//       <p><strong>Age:</strong> {patient.age}</p>
//       <p><strong>Gender:</strong> {patient.gender}</p>
//       <p><strong>Blood:</strong> {patient.blood}</p>
//       <p><strong>Illness:</strong> {patient.illness}</p>

//       <div className="card-actions">
//         <button className="edit-btn" onClick={handleEdit}>Edit</button>
//         <button className="delete-btn" onClick={() => onDelete(patient.id)}>Delete</button>
//       </div>
//     </div>
//   );
// };

// export default HealthRecordCard;




import './HealthRecordCard.css';
import { useNavigate } from 'react-router-dom';

const HealthRecordCard = ({ patient, onDelete }) => {
  const navigate = useNavigate();
  const handleEdit = () => {
      navigate(`/healthrecords/edit/${patient.recordId}`); // Navigate to edit form
    };

  return (
    <div className="health-card">
      <p><strong>Name:</strong> {patient.patientName}</p>
      <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
      <p><strong>Treatment:</strong> {patient.treatment}</p>
      <p><strong>Prescription:</strong> {patient.prescription}</p>
      <p><strong>Date:</strong> {new Date(patient.dateCreated).toLocaleDateString()}</p>

      <div className="card-actions">
        <button className="edit-btn" onClick={handleEdit}>Edit</button>
        <button className="delete-btn" onClick={() => onDelete(patient.recordId)}>Delete</button>
      </div>
    </div>
  );
};

export default HealthRecordCard;

