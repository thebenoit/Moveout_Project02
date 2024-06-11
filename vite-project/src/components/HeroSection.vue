import React from "react";
import { Button } from "./Button";
import "../components/HeroSection.css";
import { useNavigate } from 'react-router-dom';

function HeroSection() {

  const navigate = useNavigate();

  const handleSubmitButton = () =>{

  navigate('/Appartments')
  console.log("oui c'est passé")
  }



  return (
    <div className="hero-container">
      <video src="./videos/mtlStreet.mp4" autoPlay loop muted />
      <h1> Tu cherches un Appartement Abordable?</h1>
      <p>Appuie sur le bouton ci-dessous</p>
      <div className="hero-btns">
        <Button
          typeButton={"btn"}
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
          onClick={handleSubmitButton}
          path={"/Appartments"}
        >
          Trouver Un Appartement!
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
