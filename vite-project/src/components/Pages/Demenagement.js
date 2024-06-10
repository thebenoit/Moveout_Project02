import React from "react";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import "../../App.css"
import Cards from "../Card";
import MovingLogo from "../Logo";
import "../Logo.css";
import { Link } from "react-router-dom";
import "../navbar.css";
import { Button } from "../Button";

function Demenagement() {
  const imageSvg = (
    <FontAwesomeIcon icon={faTruckFast} style={{ color: "#ffffff" }} />
  );
  const imageSrc =
    "https://fontawesome.com/icons/truck-fast?f=classic&s=solid&pc=%23ffffff";
  /*"/Image_Logos/Xmark Classic Solid Icon _ Font Awesome_files";*/
  return (
    <div className="demenagement">
      <MovingLogo titre={"Moveout"} imageSVG={imageSvg} />

      <Button
        typeButton={"btn"}
        buttonStyle="btn--outline"
        buttonSize="btn--large"
      >
        Je veux déménager
      </Button>
    </div>
  );
}

export default Demenagement;
