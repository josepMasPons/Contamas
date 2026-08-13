// -------  Versió   per base de dades SANTVIFLIX -----------------
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Col,Nav, Card, Form, Button } from "react-bootstrap";

import "./CconsultaC";

function CconsultaC() {
  const navigate=useNavigate();
  const [text1, setText1] = useState(localStorage.getItem('Proces051') || '');
  const [text2, setText2] = useState(localStorage.getItem('Proces052') || '');
  const [administrador, setAdministrador]
                          = useState(localStorage.getItem('AdminFam') || ''); 
  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  const [empresa, setEmpresa] = useState(localStorage.getItem('Empresa'));
  const [logoR, setLogoR] = useState('');
  // useEffect per dirigir auto màticament al invitats
  
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
 // useEffect per anular buto retorn mòbil *********************

  
  function Temporada(e) {    
    setText1(e.target.value);    
  }  

  function Validar() {         
    navigate('/CconsultaCB');
  } 
  function Paraula1(event) {    
    setText2(event.target.value);        
  } 
  function Sacabat() {     
    navigate('/Ccomptes');
  }  
 
  
  return (
    <>
    <div className="center-contentP2">  
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
                 CONSULTA <span style={{ color: "#0d6efd" }}>Dels COMPTES</span>
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
      
           <Row className="justify-content-center">
            <Col md={20}>
              <Card>
                <Card.Header className="text-center fs-5 fw-bold">Seleccionar Comptes</Card.Header>
                <Card.Body>
                  <Form>
                   <Form.Group controlId="formBasicText" className="d-flex align-items-center">
                   <Form.Label className="me-2" style={{ width: '160px' }}>Any </Form.Label>
                   <Form.Control
                        type="text"
                          placeholder="Compte - "
                            value={text1}
                              onChange={Temporada}                  
                      />
                   </Form.Group>
                   <Form.Group controlId="formBasicText" className="d-flex align-items-center">
                      <Form.Label className="me-2" style={{ width: '160px' }}>paraula clau</Form.Label>
                      <Form.Control
                        type="text"
                          placeholder="paraula"
                            value={text2}
                              onChange={Paraula1}                  
                      />
                   </Form.Group>                                   
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
                   </Form>
                 </Card.Body>   
              </Card>
            </Col>
          </Row>
      </div>
      </>
  );
}
export default CconsultaC;
