import React from "react";
import '../components/Logo.css';

function Logo({titre, imageSrc, imageSVG,action}) {
  
  if( imageSVG === undefined){
    return (
      <div className="logo-container" onClick={action}>
        <img src={imageSrc} alt="Logo" className="logo-img"/>
        
        <span className="logo-text">{titre}</span>
        
      </div>
    );
    

  }else{

   return( <div className="logo-container" onClick={action}>
        
        <div className="logo-img">
          {imageSVG}
        </div>
        
        <span className="logo-text">{titre}</span>
        
      </div>
   )
  }

 
}

export default Logo;
