import React, { useEffect, useState } from 'react';
import './Cinici.css';
import logo1 from '../Logos/sacabat.png'; 
import logo2 from '../Logos/sacabat.png'; 
import logo3 from '../Logos/sacabat.png'; 
const Pbuto = ({ name, onClick, nLogo, disabled }) => {
  const [logoR, setLogoR] = useState(null);

  useEffect(() => {
    switch (nLogo) {
      case '1':
        setLogoR(logo1);
        break;
      case '2':
        setLogoR(logo2);
        break;
      default:
        setLogoR(logo3);
    }
  }, [nLogo]);

  return (
    <button className={disabled? 'Pbutton-disabled' : 'Pbutton-enabled'}  
    onClick={onClick}
    disabled={disabled}>
      {logoR && <img src={logoR} alt="Logo" className="Plogo" />}
      <span className="Pbutton-text">{name}</span>
    </button>
  );
};

export default Pbuto;
