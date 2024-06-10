import React from 'react'
import '../components/Button.css'
import {Link} from 'react-router-dom'

const STYLES = ['btn--primary', 'btn--outline'];

const SIZES = ['btn--medium', 'btn--large']

export const Button = ({
    typeButton,
    path,
    children, 
    type, 
    onClick, 
    buttonStyle,
    buttonSize}) =>{
        const checkButtonStyle = STYLES.includes(buttonStyle)
         ? buttonStyle 
         : STYLES[0];

         const checkButtonSizes = SIZES.includes(buttonSize) 
         ? buttonSize 
         : SIZES[0];

         return (

            <Link to={path} className='btn-mobile'>
                <button
                className={`${typeButton} ${checkButtonStyle} ${checkButtonSizes}`}
                onClick={onClick}
                type={type}>
                    
                    {children}
                </button>
            </Link>
         )


    }


