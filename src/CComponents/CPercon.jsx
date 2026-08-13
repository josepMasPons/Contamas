import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Col,Nav, Card, Form, Button } from "react-bootstrap";
import { doc, setDoc, getDoc, query, where, getDocs, writeBatch, collection } from 'firebase/firestore';
import { storageCar, db } from '../firebaseLoc.js';
import "./CMenu.css";

function CPercon() {
  const navigate=useNavigate();

  const [xM00, setXM00] = useState(localStorage.getItem('Empresa')); 
  const [xM06, setXM06] = useState(''); 

  const [nommes, setNommes] = useState("Gener 2026");
  const [percon, setPercon] = useState("");
  const [acceptat, setAcceptat] = useState('No');
 
 
  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  const [empresa, setEmpresa] = useState(localStorage.getItem('Empresa'));
  const [nempresa, setNempresa] = useState('');
  //const [text2, setText2] = useState(localStorage.getItem('Proces052') || '');
  const [administrador, setAdministrador]
                          = useState(localStorage.getItem('AdminFam') || ''); 

  const [grupZ, setGrupZ] = useState([]);
  const [comptesZ, setComptesZ] = useState([]);

  
 
  const [logoR, setLogoR] = useState('');
   // useEffect per anular buto retorn mòbil *********************
   useEffect(() => {
    const anularReturn = (event) => {
      event.preventDefault();
    // 1.- evita que el butó enrera et tregui de l'aplicació
      if (window.history.state && window.history.state.preventExit) {
          navigate(0);
      }
    }
    // 2.- afageix un estat al historial per no surtir directament
    window.history.pushState({preventExit: true},'');
    // 3.- Gestiona events del butó enrera
    window.addEventListener('popstate',anularReturn);
    // 4.- Neteja 
    return () => {
        window.removeEventListener('popstate',anularReturn);
        window.history.replaceState(null,'');
    }
   }, [navigate]);
// useEffect per EL NOM DEL MES *********************
 useEffect(() => { 
  if (/^\d{4}\/\d{2}$/.test(percon)) {
      const [yyyy, mm] = (percon).split("/");
      if (mm === '00') {setNommes('Apertura '+yyyy)};
      if (mm === '01') {setNommes('Gener del '+yyyy)};
      if (mm === '02') {setNommes('Febrer del '+yyyy)};
      if (mm === '03') {setNommes('Març del '+yyyy)};
      if (mm === '04') {setNommes('Abril del '+yyyy)};
      if (mm === '05') {setNommes('Maig del '+yyyy)};
      if (mm === '06') {setNommes('Juny del '+yyyy)};
      if (mm === '07') {setNommes('Juliol del '+yyyy)};
      if (mm === '08') {setNommes('Agost del '+yyyy)};
      if (mm === '09') {setNommes('Setembre del '+yyyy)};
      if (mm === '10') {setNommes('Octubre del '+yyyy)};
      if (mm === '11') {setNommes('Novembre del '+yyyy)};
      if (mm === '12') {setNommes('Desembre del '+yyyy)};
      if (mm === '13') {setNommes('tancament '+yyyy)};
  }  
 }, [percon]);

 // useEffect per buscar la data al inici del programa *********************
   useEffect(() => {
     const dataM = new Date();
     setXM06(`${dataM.getDate()}/${dataM.getMonth()+1}
             /${dataM.getFullYear()}`);
    }, []);

 // useeffect per trobar el període comptable ******************************
 useEffect(() => {
  const fetchPercon = async () => {
    try {
      const linksCollection = collection(db, 'PeriConta');
      const querySnapshot = await getDocs(linksCollection);

      const registre = querySnapshot.docs.find(
        doc => doc.data().PC00 === xM00
      );

      if (registre) {
        const data = registre.data();      
        setPercon(`${data.PC01}/${data.PC02}`)
        setNempresa(data.PC04 || '');
        setAcceptat(data.PC05 || 'No');
      } 
    } catch (error) {
      console.error('Error llegint periode comptable:', error);
    } finally {
    
    }
  };

  if (xM00) {
    fetchPercon();
  }
}, [xM00]);

  function Sacabat() {  
    navigate('/CMenu_Inici');
  }  
  function Ccomptes() {     
    navigate('/Ccomptes');
  }  
 
  async function Validar() {  
      const MovCollection = collection(db, 'PeriConta');
      const batch = writeBatch(db);
      const newDocRef = doc(MovCollection, `Perc_001_${xM00}`);
      const [yyyy, mm] = (percon).split("/");
      await batch.set(newDocRef, {
                    PC00:     xM00,
                    PC01:     yyyy,  
                    PC02:     mm,               
                    PC03:     nommes,  
                    PC04:     nempresa,
                    PC05:     acceptat                   
          });
          batch.commit();      
     navigate('/CMenu_Inici');
  }  
  return (    
    <div>  
     <Card.Header className="d-flex 
          align-items-center justify-content-center gap-3 py-3 flex-wrap">   
        <div
         className="fw-bold text-uppercase"
         style={{
            fontSize: "1.4rem",
            letterSpacing: "1px",
            color: "#1f2937",
            whiteSpace: "nowrap"
          }}
        >
           Canvi Període <span style={{ color: "#0d6efd" }}>COMPTABLE</span>
        </div>    
       <div className="d-flex gap-3">
         <div
            className="px-3 py-2 rounded shadow-sm"
            style={{
                backgroundColor: "#dbe4f0",
                border: "1px solid #b6c2d1",
                minWidth: "220px",
                textAlign: "center",
                color: "#334155"
            }}
          >
            Usuari: <strong>{nomJ}</strong>
          </div>
        <div
            className="px-3 py-2 rounded shadow-sm"
            style={{
                backgroundColor: "#cfd8e3",
                border: "5px solid #b6c2d1",
                minWidth: "30px",
                textAlign: "center",
                color: "#334155"
            }}
        >
            <strong>{empresa}</strong>
        </div>
     </div>
    </Card.Header>
     

    <Container className="mt-3">
      <>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
          
            <Card.Body className="p-5">           
             <Form>
              <Form.Group className="mb-4">  
                 <div className="d-flex align-items-center gap-3 mb-3">
                   <Form.Label
                    className="fw-semibold mb-0"                 
                    style={{ fontSize: "0.95rem", minWidth: "150px" }} 
                  >
                    Nom empresa   
                   </Form.Label>          
                 <Form.Control
                   type="text"       
                         value={nempresa}     
                         className="py-2 rounded-3 fw-bold"                     
                         onChange={(e) => setNempresa(e.target.value)}                                
                        style={{                       
                          width: "250px",
                          fontSize: "0.80rem",
                          backgroundColor: "#d1fae5",
                          border: "1px solid #b6c2d1",
                          color: "#334155"
                        }}
                   />                         
                </div>  
                <div className="d-flex align-items-center gap-3 mb-3">
                   <Form.Label
                    className="fw-semibold mb-0"                 
                    style={{ fontSize: "0.95rem", minWidth: "150px" }} 
                  >
                    Data actual  
                   </Form.Label>          
                 <Form.Control
                   type="text"                  
                  
                          value={xM06?.replace(/\s+/g, " ") || ""}         
                         className="py-2 rounded-3 fw-bold"
                        style={{                       
                          width: "150px",
                          fontSize: "0.80rem",
                          backgroundColor: "#d1fae5",
                          border: "1px solid #b6c2d1",
                          color: "#334155"
                        }}
                   />                         
                </div> 
                  <div className="d-flex align-items-center gap-3 mb-3">
                                <Form.Label                      
                                  className="fw-semibold mb-0"
                                  style={{ fontSize: "0.95rem", minWidth: "150px" }}
                                 >
                                       Període Comptable
                                </Form.Label>                
                                <Form.Control
                                   type="text"
                                    value={percon}
                                      onChange={(e) => {
                                          const value = e.target.value;
                                           // validació mentre s'escriu
                                          if (/^\d{0,4}(\/\d{0,2})?$/.test(value)) {
                                                setPercon(value);
                                          }
                                      }}
                                 
                                    placeholder="yyyy/mm"
                                    maxLength={7}
                                    className="py-2 rounded-3 fw-bold"
                                   style={{
                                    width: "150px",
                                   fontSize: "1.35rem",
                                    backgroundColor: "#d1fae5",
                                   border: "1px solid #b6c2d1",
                                    color: "#334155",
                                    }}
                               />
                              <Form.Control
                                  type="text"
                                  value={nommes}
                                  className="py-2 rounded-3 fw-bold"
                                  style={{
                                                     width: "200px",
                                                     fontSize: "1.35rem",
                                                     backgroundColor: "#d1fae5",
                                                      border: "1px solid #b6c2d1",
                                                    color: "#334155"
                                  }}
                              />
                        </div>  
                        <div className="d-flex align-items-center gap-3 mb-3">
                           <Form.Label                      
                                  className="fw-semibold mb-0"
                                  style={{ fontSize: "0.95rem", minWidth: "150px" }}
                                 >
                                       Gestió Pressupost
                                </Form.Label>                
                                  
                              <Form.Check
                                    type="radio"
                                    label="No"
                                    name="acceptat"
                                    checked={acceptat === 'No'}
                                    onChange={() => setAcceptat('No')}
                                    />
                              <Form.Check
                                    type="radio"
                                    label="Sí"
                                    name="acceptat"
                                    checked={acceptat === 'Si'}
                                    onChange={() => setAcceptat('Si')}
                              />                          
                           </div> 
                 </Form.Group>
              </Form>    
           </Card.Body> 
         </Card>
     </Col>     
  </Row>
  </>
</Container>
      <div className="d-flex justify-content-center mt-3">
                          <Button className="mb-2" 
                              variant="warning"
                              size='sm'
                              onClick={Sacabat}>                                      
                              <i className="fas fa-sign-out-alt"></i>  Enrere
                          </Button>
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     
                          <Button className="mb-2" 
                              variant="primary"
                              size='sm'                      
                              onClick={Validar}>                             
                              <i className="fas fa-sign-out-alt"></i>  Validar
                          </Button>                                              
                       
     </div>
   </div>
  );
}
export default CPercon;
