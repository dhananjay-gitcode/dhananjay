import React,{useState} from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';

export const Navbar = () => {
  const [activeLink, setActiveLink] = useState("products");
  const [loggedIn, setLoggedIn] = useState(false);
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Shopify
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/ProductList">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/CustomerList">
                Customers
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/OrderList">
                Orders
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Collection">
                Collections
              </Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
