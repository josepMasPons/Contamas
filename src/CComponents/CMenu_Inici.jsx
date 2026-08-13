import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Col,Nav, Card, Form, Button } from "react-bootstrap";
import { doc, setDoc, getDoc, query, where, getDocs, writeBatch, collection } from 'firebase/firestore';
import { storageCar, db } from '../firebaseLoc.js';
import "./CMenu.css";

function CMenu_Inici() {
  const navigate=useNavigate();

  const [xM00, setXM00] = useState(localStorage.getItem('Empresa')); 
  const [xM06, setXM06] = useState('');  // data  dd/mm/yyyy              ##  

  const [periodeDel, setPeriodeDel] = useState("");
  const [periodeAl, setPeriodeAl] = useState("");
  const [periany, setPeriany] = useState("");
  const [perimesD, setPerimesD] = useState("");
  const [perimesA, setPerimesA] = useState("");
  const [percon, setPercon] = useState("");
  const [sipre, setSipre] = useState("");
  const [anyInput, setAnyInput] = useState('');
 
 
  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  const [empresa, setEmpresa] = useState(localStorage.getItem('Empresa'));
  //const [text2, setText2] = useState(localStorage.getItem('Proces052') || '');
  const [administrador, setAdministrador]
                          = useState(localStorage.getItem('AdminFam') || ''); 
  const [nivell, setNivell]
                          = useState(localStorage.getItem('Nivell') || '5'); 
  const [grupZ, setGrupZ] = useState([]);
  const [comptesZ, setComptesZ] = useState([]);

  
 
  const [logoR, setLogoR] = useState('');
  useEffect(() => {
     //console.log('periany - ',periany)
      //console.log('perimesA - ',perimesA)
     // console.log('perimesD - ',perimesD)
     // console.log('anyInput - ', anyInput)
      setPeriodeDel(`${periany}/${perimesD}`);
      setPeriodeAl(`${periany}/${perimesA}`);
      setAnyInput(periany)
      
  }, [periany,perimesA,perimesD]);
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
        setPeriodeAl(`${data.PC01}/${data.PC02}`)
        setPeriodeDel(`${data.PC01}/01`)
        setPercon(`${data.PC01}/${data.PC02}`)
        setSipre(data.PC05 || 'No');
        setPeriany(data.PC01);
        setPerimesD('01');
        setPerimesA(data.PC02);
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
   function CPercon() {     
    navigate('/CPercon');
  }  
 
  function Sacabat() {  
   localStorage.setItem('IniciJMP', 'No');
    navigate('/Cinici');
  }  
  function Ccomptes() {     
    navigate('/Ccomptes');
  }  
   function Validar() { 
    localStorage.setItem('Sipre', sipre);   
    localStorage.setItem('Percon', percon); 
    localStorage.setItem('PeriodeDel',periodeDel);  
    localStorage.setItem('PeriodeAl', periodeAl);
    navigate('/CMenu');
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
           Gestió <span style={{ color: "#0d6efd" }}>COMPTABLE</span>
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
     
        <div>
            <Button className="mb-2" 
                          variant="warning"
                          size='sm'
                          onClick={Sacabat}>                                      
                          <i className="fas fa-sign-out-alt"></i>  Enrera
            </Button>
        </div>
      </div>
    </Card.Header>
   <Navbar className="SVNavbarP2 shadow mb-2" variant="light">
  <Container className="px-4 d-flex justify-content-center">

    <Nav className="d-flex flex-row gap-3 align-items-center justify-content-center">

      {(nivell === '1' || nivell === '2' || nivell === '3') && (
        <Nav.Link
          onClick={Ccomptes}
          className="border border-2 rounded-pill px-3 py-1 fw-semibold shadow-sm"
          style={{
            fontSize: "0.85rem",
            backgroundColor: "#f8fafc",
            color: "#334155",
            borderColor: "#94a3b8"
          }}
        >
          Gestió Comptes
        </Nav.Link>
      )}

      {(nivell === '1' || nivell === '2') && (
        <Nav.Link
          onClick={CPercon}
          className="border border-2 rounded-pill px-3 py-1 fw-semibold shadow-sm"
          style={{
            fontSize: "0.85rem",
            backgroundColor: "#f8fafc",
            color: "#334155",
            borderColor: "#94a3b8"
          }}
        >
          Canvi període comptable
        </Nav.Link>
      )}

    </Nav>

  </Container>
</Navbar>
    <Container className="mt-3">
      <>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header
              className="fw-bold py-3 text-center"
              style={{ fontSize: "1.2rem" }}
            >
           
              <div className="mb-1">
                  <span className="text-primary"> Dades Inicials </span>        
              </div>           
            </Card.Header>        
            <Card.Body className="p-5">           
             <Form>
              <Form.Group className="mb-4">   
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
                    Periode comptable
                   </Form.Label>  
                           
                <Form.Control
                  type="text"
                   
                          value={percon?.replace(/\s+/g, " ") || ""}     
                         className="py-2 rounded-3 fw-bold"
                        style={{                       
                          width: "150px",
                          fontSize: "1.20rem",
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
                    Gestió pressupost
                   </Form.Label>  
                           
                <Form.Control
                  type="text"
                   
                          value={sipre}     
                         className="py-2 rounded-3 fw-bold"
                        style={{                       
                          width: "60px",
                          fontSize: "1.20rem",
                          backgroundColor: "#d1fae5",
                          border: "1px solid #b6c2d1",
                          color: "#334155"
                        }}
                />  
                </div>
                
              <div className="bg-blue-100 border border-blue-400 rounded-lg p-4">
  <div
    className="text-center fw-bold text-primary mb-3 pb-2 border-bottom border-primary"
    style={{ fontSize: "1.1rem" }}
  >
    Període de Pantalla
  </div>
                 <div className="d-flex align-items-center  mb-3">
                  <Form.Label
      
                  className="fw-semibold mb-0"
                  style={{ fontSize: "0.95rem", minWidth: "140px" }}
                 >
                       Any  - 
                </Form.Label>            
 
                  <Form.Control
                   type="text"               
                    value={anyInput}
                    onChange={(e) => {                          
                          const value = e.target.value.replace(/\D/g, "");                          
                          setAnyInput(value);
                          if (value.length === 4) {
                            setPeriany(value);
                          }                          
                    }}                
                    placeholder=""
                    maxLength={4}
                    className="rounded-3 fw-bold"
                   style={{
                    width: "80px",
                   fontSize: "1.20rem",
                    backgroundColor: "#d1fae5",
                   border: "1px solid #b6c2d1",
                    color: "#334155",
                    }}
                 />
               </div> 
            
                <div className="d-flex align-items-center  mb-3">
                  <Form.Label
      
                  className="fw-semibold mb-0"
                  style={{ fontSize: "0.95rem", minWidth: "140px" }}
                 >
                       Del mes 
                </Form.Label>
                
                <Form.Control
                   type="text"
                    value={periodeDel.substring(5,7)}
                      onChange={(e) => {
                          const value = e.target.value;                          
                          setPerimesD(value);                     
                  }}
                    placeholder="mm"
                    maxLength={2}
                    className="rounded-3 fw-bold"
                   style={{
                    width: "50px",
                   fontSize: "1.20rem",
                    backgroundColor: "#d1fae5",
                   border: "1px solid #b6c2d1",
                    color: "#334155", 
                    }}
                 />

               <Form.Label
                      className="fw-semibold mb-0"
                    style={{
                          fontSize: "1.20rem", 
                           
                          
                          width: "30px" }}
                     >
                      al
                </Form.Label>

              <Form.Control
                  type="text"
                  value={periodeAl.substring(5,7)}
                  onChange={(e) => {
                          const value = e.target.value;
                         
                          setPerimesA(value);
                      
                  }}
                    placeholder="mm"
                    maxLength={2}
                  className="rounded-3 fw-bold"
                  style={{
                    width: "50px",
                    fontSize: "1.20rem",
                    backgroundColor: "#d1fae5",
                   border: "1px solid #b6c2d1",
                   color: "#334155",
                  }}
              />
            </div>      
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
export default CMenu_Inici;
