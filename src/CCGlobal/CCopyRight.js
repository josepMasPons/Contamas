import { Card, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { translateText } from "./Ctranslator.js";
import Benrera from './Benrera.js';
function JMCopyRight() {
  const navigate = useNavigate();
  let Versio01 = localStorage.getItem("Versio01");
  let Versio02 = localStorage.getItem("Versio02");
  let Versio03 = localStorage.getItem("Versio03");
  let Versio04 = localStorage.getItem("Versio04");
  let Versio05 = localStorage.getItem("Versio05");
  let Versio06 = localStorage.getItem("Versio06");  
  const [passWord, setPassWord] = useState(localStorage.getItem('PassWord') || 'Convidat');
  // ------------------------------------------------------------------------------
   // ---- posar a import :   import { translateText } from "../CCGlobal/Ctranslator";
   // ---------------------- {textes,t001} +++,= resultas ---------------------
   //      RUTINA DE TRADUCCIÓ -------------------------------------------
   
   const [idioma, setIdioma] = useState(localStorage.getItem('Idioma') || 'CA');
   const [textes, setTextes] = useState([]);
  //  ------------- cams a traduir -----------------------------------------
   const textesCA = {
        t001: "Informació de la Versió",
        t002: Versio05,  
        t003: Versio06,    
        b001:  "Enrera" 
   //  ---------------fi cams a traduir -------------------------------------    
 };
 
   useEffect(() => {
     const traduir = async () => {
         if (idioma.toLowerCase() === "ca") {
             setTextes(textesCA);
             return;
         }
         const nousTextes = {};
 
         for (const key of Object.keys(textesCA)) {
             nousTextes[key] = await translateText(
                 textesCA[key],
                 "ca",
                 idioma
             );
         }
         setTextes(nousTextes);
     };
     traduir();
 }, [idioma]);
 // ------------------------------------------------------------------------------
 // ---------------------------  final  traductor --------------------------------
 // ------------------------------------------------------------------------------
  
  function Sacabat() {     
    navigate('/Cinici');
  }
  Benrera(Sacabat);     
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-4 text-center" style={{ maxWidth: "500px" }}>
        <Card.Body>
          <h4 className="fw-bold text-danger">{textes.t001}</h4>
          <hr />
          <h5 className="text-primary">{Versio03}</h5>
          <p className="text-muted">{Versio01}</p>
          <p className="text-muted">{Versio02}</p>
       
          <p className="text-primary">{Versio04}</p>       
          <p className="text-primary">{textes.t002}</p>
          <p className="text-primary">{textes.t003}</p>
           
          <hr />
          <Button 
            className="mt-3" 
            variant="danger"             
            onClick={Sacabat}>
            {textes.b001}          
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default JMCopyRight;