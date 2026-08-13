import { Card, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { translateText } from "../CCGlobal/Ctranslator";

function JMTermsConditions() {
  const navigate = useNavigate();
  // ------------------------------------------------------------------------------
  // ---- posar a import :   import { translateText } from "../CCGlobal/Ctranslator";
  // ---------------------- {textes,t001} +++,= resultas ---------------------
  //      RUTINA DE TRADUCCIÓ -------------------------------------------
  
  const [idioma, setIdioma] = useState(localStorage.getItem('Idioma') || 'CA');
  const [textes, setTextes] = useState([]);
 //  ------------- cams a traduir -----------------------------------------
  const textesCA = {
      	t001: "Termes i Condicions",
	      t002: "1. Identificació del Titular del Domini",
	      t003: "En compliment de l'article 10 de la Llei 34/2002, de Serveis de la Societat de la Informació i del Comerç Electrònic, es publiquen les següents dades:",  
        
	      t005: " amb domicili al carrer Corominas,79, 08201 Sabadell.",           
        t006: "Telèfon: ",	 
        t008: "Correu electrònic:",
        t009: "2. Condicions d'ús del Web",
        t010: "L'usuari que accedeix i utilitza aquest web accepta les presents condicions d’ús. L'usuari serà responsable de proporcionar informació veraç i lícita durant el procés de registre.",
        t011: "Queda totalment prohibit:",
        t012: "Intentar accedir o modificar comptes d'altres usuaris.",
        t013: "Publicar contingut discriminatori, xenòfob, racista o il·legal.",
        t014: "Propietat Intel·lectual i Industrial",
        t015: "·Tots els drets de propietat intel·lectual d'aquest lloc web i el seu contingut són propietat de Josep Mas. La reproducció, distribució o comunicació pública sense autorització està prohibida.",
        t016: "4. Responsabilitat",
        t017: "El titular del domini no es fa responsable de danys derivats d'interferències tècniques, virus informàtics o altres factors aliens al seu control.",
        t018: "5. Privacitat i Protecció de Dades",
        t019: "D’acord amb la Llei de Protecció de Dades, Josep Mas Pons és el responsable del tractament de dades personals.",
        t020: "Els usuaris poden exercir els seus drets d’accés, rectificació o eliminació dirigint-se a ", 
	      t021: "6. Legislació Aplicable",
        t022: "Les presents condicions es regeixen per la legislació espanyola. Qualsevol controvèrsia serà sotmesa als tribunals de Sabadell.",
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
return (
  <>
      
    <Container className="d-flex justify-content-center align-items-center mt-4">
      <Card className="shadow-lg p-4" style={{ maxWidth: "800px", width: "100%" }}>
        <Card.Body>
          <h3 className="text-center text-primary fw-bold mb-4">{textes.t001}</h3>
    
          <h4 className="text-danger">{textes.t002}</h4>
          <p className="text-justify">{textes.t003}
            <br />
            <strong>Josep Mas Pons</strong>  {textes.t005}  
            <br />           
            {textes.t006} <strong>937277024</strong>
            <br />
           {textes.t008}<a href="mailto:jmas2011@gmail.com">jmas2011@gmail.com</a>
          </p>
          <hr />
          <h4 className="text-danger mt-3">{textes.t009}</h4>
          <p className="text-justify">{textes.t010} </p>
          <p><strong>{textes.t011}</strong></p>
          <ul>
            <li>{textes.t012}</li>
            <li>{textes.t013}</li>
          </ul>
          <hr />
          <h4 className="text-danger mt-3">{textes.t014}</h4>
          <p className="text-justify">{textes.t015}
          </p>
          <hr />
          <h4 className="text-danger mt-3">{textes.t016}</h4>
          <p className="text-justify">{textes.t017}
            </p>
          <hr />
          <h4 className="text-danger mt-3">{textes.t018}</h4>
          <p className="text-justify">{textes.t019}
           <br />
            {textes.t020}
          </p>
          <hr />
          <h4 className="text-danger mt-3">{textes.t021}</h4>
          <p className="text-justify">{textes.t022}
           </p>
          <hr />
          <div className="text-center">
            <Button variant="danger" onClick={() => navigate('/Cinici')}>
              {textes.b001}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
    </>
  );
}

export default JMTermsConditions;
