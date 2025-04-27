import { Component } from "react";
import withNavigation from "../withNavigation";
import { Circles } from 'react-loader-spinner';
import "./LoginForm.css";

class LoginForm extends Component {
  state = {
    username: "",
    password: "",
    role: "doctor",
    showSubmitError: false,
    errorMsg: "",
    loading: false,
  };

  onChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  onChangeRole = (role) => {
    this.setState({ role });
  };

  onSubmitSuccess = () => {
    const { navigate } = this.props;
    const { role } = this.state;

    if (role === "doctor") {
      navigate("/doctorhome", { replace: true });
    } else {
      navigate("/patienthome", { replace: true });
    }
  };

  onSubmitFailure = (errorMsg) => {
    this.setState({ showSubmitError: true, errorMsg, loading: false });
  };

 

  submitForm = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, showSubmitError: false, errorMsg: "" });

    const { username, password } = this.state;
    const userDetails = { username, password };
    const BASE_URL = process.env.REACT_APP_API_URL;
    console.log(BASE_URL);
    const url = `${BASE_URL}/login/login`;
    console.log(url);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("role", data.user.role);
        this.setState({ loading: false });
        this.onSubmitSuccess();
      } else {
        this.onSubmitFailure(data.error_msg || "Invalid credentials");
      }
    } catch (error) {
      this.onSubmitFailure("Login failed. Please try again.");
    }
  };

  render() {
    const { username, password, role, showSubmitError, errorMsg, loading } = this.state;

    return (
      <div className="login-main-container">
        <div className="left-section">
          <img src="https://res.cloudinary.com/dioemxcqp/image/upload/v1742869648/img-logo_eyl5lq.png" alt="img-logo" className="logo-image" />
          <div className="left-content">
            <h1 className="heading-login">Your health, our mission</h1>
            <img
              src="https://res.cloudinary.com/dioemxcqp/image/upload/v1742866821/Screenshot_2025-03-24_at_21.39.02_e3cdnl.png"
              className="login-img"
              alt="website login"
            />
            <h1 className="heading-login">Addressing every need</h1>
          </div>
        </div>

        <div className="right-section">
          <form className="form-container" onSubmit={this.submitForm}>
            <img
              src="https://res.cloudinary.com/dioemxcqp/image/upload/c_crop,w_500,h_200/v1742868762/Logo_xyxf2p.jpg"
              className="login-website-logo-desktop-img"
              alt="website logo"
            />

            <div className="role-tabs">
              <button
                type="button"
                className={`role-tab ${role === "doctor" ? "active" : ""}`}
                onClick={() => this.onChangeRole("doctor")}
              >
                Doctor Login
              </button>
              <button
                type="button"
                className={`role-tab ${role === "patient" ? "active" : ""}`}
                onClick={() => this.onChangeRole("patient")}
              >
                Patient Login
              </button>
            </div>

            <div className="input-container">
              <label className="input-label" htmlFor="username">USERNAME</label>
              <input
                type="text"
                id="username"
                className="input-field"
                value={username}
                onChange={this.onChangeUsername}
                placeholder="Username"
                required
              />
            </div>

            <div className="input-container">
              <label className="input-label" htmlFor="password">PASSWORD</label>
              <input
                type="password"
                id="password"
                className="input-field"
                value={password}
                onChange={this.onChangePassword}
                placeholder="Password"
                required
              />
            </div>
            {loading ? (
  <div className="loader-wrapper">
    <Circles
      height="60"
      width="60"
      color="#4fa94d"
      ariaLabel="circles-loading"
      visible={true}
    />
  </div>
) : (
  <button type="submit" className="login-button">
    Login as {role}
  </button>
)}

            {showSubmitError && (
              <div className="error-message">
                <span style={{ color: 'red', fontSize: '14px' }}>
                  * {errorMsg || "Invalid credentials"}
                </span>
              </div>
            )}

            <div className="login-links">
              <p>
                Don’t have an account?{" "}
                <span
                  className="link-text"
                  onClick={() => {
                    const { navigate } = this.props;
                    navigate(role === "doctor" ? "/signup/doctor" : "/signup/patient");
                  }}
                >
                  Sign Up
                </span>
              </p>
              <p className="link-text" onClick={() => this.props.navigate("/forgotpassword")}>
                Forgot Password
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withNavigation(LoginForm);
