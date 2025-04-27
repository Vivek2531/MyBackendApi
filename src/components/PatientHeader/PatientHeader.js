
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./PatientHeader.css";

const PatientHeader = () => {
  const navigate = useNavigate(); 

  const onClickLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/login", { replace: true }); 
  };
  
  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-mobile-logo-container">
          <img
            className="website-logo"
            src="https://res.cloudinary.com/dioemxcqp/image/upload/c_crop,w_500,h_200/v1742868762/Logo_xyxf2p.jpg"
            alt="website logo"
          />
          <button
            type="button"
            className="nav-mobile-btn"
            onClick={onClickLogout}
          >
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
              alt="nav logout"
              className="nav-bar-img"
            />
          </button>
        </div>
        <div className="nav-bar-large-container">
        <Link to="/patienthome" className="nav-link">
          <img
            className="website-logo"
            src="https://res.cloudinary.com/dioemxcqp/image/upload/c_crop,w_500,h_200/v1742868762/Logo_xyxf2p.jpg"
            alt="website logo"
          />
          </Link>
          <div className="nav-right-section">
          <ul className="nav-menu">
            <li className="nav-menu-item">
              <Link to="/patient/medicalrecords" className="nav-link">
                Medical Records
              </Link>
            </li>
          </ul>
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
          </div>
        </div>
      </div>
      <div className="nav-menu-mobile">
        <ul className="nav-menu-list-mobile">
          <li className="nav-menu-item-mobile">
            <Link to="/healthrecords" className="nav-link">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-cart-icon.png"
                alt="nav cart"
                className="nav-bar-img"
              />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default PatientHeader
