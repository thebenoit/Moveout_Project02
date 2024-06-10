import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MoveoutLogo from "./Logo.js";
import { Button } from "./Button.js";
import "../components/navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);
  const imageSrc = "/Image_Logos/moveoutLogo2.svg";
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link className="main-Logo-container" to="/">
            <MoveoutLogo
              titre={"Moveout"}
              imageSrc={imageSrc}
              action={closeMobileMenu}
            />
          </Link>

          <div className="menu-icon" onClick={handleClick}>
            <i className={click ? "fa-solid fa-xmark" : "fas fa-bars"} />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link
                to="/demenagement"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                <i class="fa-solid fa-truck-fast"></i>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/login"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                <i class="fa-regular fa-user"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/about-us"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                About us
              </Link>
            </li>
          </ul>
          {/*button && <Button buttonStyles="btn--outline"> Sign Up</Button>*/}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
