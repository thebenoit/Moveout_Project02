import React from 'react'
import {Button} from '../Button'
import {useState} from "react"



function Login() {

    const [email, setEmail] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [tel, setTel] = useState('');
    const [errorNom, setNomError] = useState('');
    const [errorPrenom, setPrenomError] = useState('');
    const [errorTel, setErrorTel] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    
   
   /*const axiosFetchData = async(processing) => {

    await axiosFetchData.post('',options)
    .then(res => res.json())
   }*/
   
   
   
   
   
    // Fonction de validation générique
    const validateField = (value, setError) => {
        if (!value) {
        setError(<p className='required'>*L'emplacement est vide, veuillez insérer une valeur s'il vous plaît</p>);
        return false; // Retourne false si le champ est vide
        } else {
        setError("");
        return true; // Retourne true si le champ est valide
        }
        };



    const handleSubmit = (e) =>{
        e.preventDefault()

        
        // Appeler la fonction de validation pour chaque champ
        const nomIsValid = validateField(nom, setNomError);
        const prenomIsValid = validateField(prenom, setPrenomError);
        const emailIsValid = validateField(email, setErrorEmail);
        const telIsValid = validateField(tel, setErrorTel);



    }
  return (
    <>
        <h1>Login</h1>

        <form className="contactForm">
            <label>Nom</label>
            <input type='text' id="nom" name="nom" value={nom} onChange={(e) => setNom(e.target.value)}></input>
            {errorNom}
            
            <label>Prénom</label>
            <input type='text' id="prenom" name="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)}></input>
            {errorPrenom}

            <label>Tél:</label>
            <input type='telephone' id="telephone" name="telephone" value={tel} onChange={(e) => setTel(e.target.value)}></input>
            {errorTel}

            <label>email:</label>
            <input type='email' id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            {errorEmail}

            <button type="submit" onClick={handleSubmit}>Submit</button>



        </form>
      
    </>
  )
}

export default Login
