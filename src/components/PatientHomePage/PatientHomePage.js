import { Component } from 'react';
import { Circles } from 'react-loader-spinner';
import PatientHeader from '../PatientHeader/PatientHeader';
import './PatientHomePage.css';

class PatientHomePage extends Component {
  state = {
    patient: null,
    showModal: false,
    editedPatient: {},
    loading: true,
  };

  componentDidMount() {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.error("Missing userId or token in localStorage");
      return;
    }

    const BASE_URL = process.env.REACT_APP_API_URL;

    fetch(`${BASE_URL}/api/Patient/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Unauthorized or invalid response');
        }
        return res.json();
      })
      .then((data) => {
        this.setState({ patient: data, loading: false });
      })
      .catch((err) => {
        console.error("Error fetching patient:", err);
        this.setState({ loading: false });
      });
  }

  toggleModal = () => {
    const { patient } = this.state;
    this.setState({
      showModal: true,
      editedPatient: { ...patient },
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      editedPatient: { ...prevState.editedPatient, [name]: value },
    }));
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { editedPatient } = this.state;
    const token = localStorage.getItem("token");

    const updatedPatient = {
      id: editedPatient.id,
      username: editedPatient.username,
      role: "patient",
      password: editedPatient.password || null,
      dateOfBirth: editedPatient.dateOfBirth,
      gender: editedPatient.gender,
      email: editedPatient.email,
      phoneNumber: editedPatient.phoneNumber,
      address: editedPatient.address,
    };

    try {
      const BASE_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${BASE_URL}/api/Patient/${editedPatient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedPatient),
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({ patient: data.patient, showModal: false });
      } else {
        console.error('Failed to update patient');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  render() {
    const { patient, showModal, editedPatient, loading } = this.state;

    if (loading) {
      return (
        <div className="loader-container">
          <Circles height="60" width="60" color="#3b82f6" ariaLabel="loading" />
        </div>
      );
    }

    if (!patient) {
      return <div className="error">Failed to load patient data.</div>;
    }

    return (
      <>
        <PatientHeader />
        <div className="patient-home">
          <div className="patient-home-container">
            <h1 className="patient-home-heading">Welcome {patient.username}!</h1>
            <button className="edit-profile-btn" onClick={this.toggleModal}>
              Edit Profile
            </button>
          </div>

          <div className="patient-home-grid">
            <div className="patient-home-card">
              <p><strong>Username:</strong> {patient.username}</p>
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>Gender:</strong> {patient.gender}</p>
              <p><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
              <p><strong>Phone Number:</strong> {patient.phoneNumber}</p>
              <p><strong>Address:</strong> {patient.address}</p>
            </div>
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Edit Profile</h2>
                <form onSubmit={this.handleSubmit}>
                  <input name="username" value={editedPatient.username} onChange={this.handleChange} placeholder="Username" required />
                  <input name="email" value={editedPatient.email} onChange={this.handleChange} placeholder="Email" type="email" required />
                  <input name="password" value={editedPatient.password} onChange={this.handleChange} placeholder="Password" type="password" required />
                  <input name="phoneNumber" value={editedPatient.phoneNumber} onChange={this.handleChange} placeholder="Phone Number" />
                  <input name="address" value={editedPatient.address} onChange={this.handleChange} placeholder="Address" />
                  <select name="gender" value={editedPatient.gender} onChange={this.handleChange}>
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                  <input name="dateOfBirth" value={editedPatient.dateOfBirth?.substring(0, 10)} onChange={this.handleChange} type="date" />

                  <div className="modal-actions">
                    <button type="submit" className="submit-button">Save</button>
                    <button type="button" className="cancel-button" onClick={() => this.setState({ showModal: false })}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default PatientHomePage;
