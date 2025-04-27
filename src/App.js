import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import LoginForm from "./components/LoginForm/LoginForm";
import Home from "./components/Home/Home";
import DoctorSignupForm from './components/DoctorSignupForm/DoctorSignupForm';
import PatientSignupForm from './components/PatientSignupForm/PatientSignupForm';
import ForgotPasswordForm from './components/ForgotPasswordForm/ForgotPasswordForm';
import HealthRecord from "./components/HealthRecord/HealthRecord";
import PatientHomePage from "./components/PatientHomePage/PatientHomePage";
import PatientMedicalRecords from "./components/PatientMedicalRecords/PatientMedicalRecords";
import AddHealthRecord from "./components/AddHealthRecord/AddHealthRecord";
import EditHealthRecord from "./components/EditHealthRecord/EditHealthRecord";
import PatientMedicalRecordDetails from "./components/PatientMedicalRecordDetails/PatientMedicalRecordDetails";
import NotFound from "./components/NotFound/NotFound";

import "./App.css";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/doctorhome" element={<Home />} />
      <Route path="/signup/doctor" element={<DoctorSignupForm />} />
      <Route path="/signup/patient" element={<PatientSignupForm />} />
      <Route path="/forgotpassword" element={<ForgotPasswordForm />} />
      <Route path="/doctor/healthrecords" element={<HealthRecord />} />
      <Route path="/patienthome" element={<PatientHomePage />} />
      <Route path="/patient/medicalrecords" element={<PatientMedicalRecords />} />
      <Route path="/healthrecords/add" element={<AddHealthRecord />} />
      <Route path="/healthrecords/edit/:recordId" element={<EditHealthRecord />} />
      <Route path="/patient/medicalrecord/:id" element={<PatientMedicalRecordDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;
