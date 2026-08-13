import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Col,Nav, Card, Form, Button } from "react-bootstrap";

import "./CMenu.css";

function CMenu() {
  const navigate=useNavigate();
  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  const [empresa, setEmpresa] = useState(localStorage.getItem('Empresa'));
  //const [text2, setText2] = useState(localStorage.getItem('Proces052') || '');
  const [administrador, setAdministrador]
                          = useState(localStorage.getItem('AdminFam') || ''); 

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
 // useEffect per anular buto retorn mòbil *********************

  function Temporada(e) {    
   // setText1(e.target.value);    
  }  

  function Validar() {         
    //localStorage.setItem('Proces051', text1);
   // localStorage.setItem('Proces052', text2);
    //localStorage.setItem('Programa', '/Pantalla02b');    
   // navigate('/Pantalla02B');
  } 
  function Paraula1(event) {    
   // setText2(event.target.value);        
  } 
  function Sacabat() {     
    localStorage.setItem('Programa', '/Pinici');
    localStorage.setItem('IniciJMP', 'No');
    navigate('/Cinici');
  }  
  function Ccomptes() {        
    navigate('/Ccomptes');
  }
  function Cmovs() {        
    navigate('/Cmovs');
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

      </div>
    </Card.Header>
      <Navbar className="SVNavbarP2 shadow mb-2" 
              variant="light" expand="lg">       
        <Container className="px-4">
          <Navbar.Collapse id="basic-navbar-nav">
             {administrador === 'Si' && (
             <Nav className="d-flex flex-row gap-3 align-items-center">
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
              <Nav.Link
                  onClick={Cmovs}
                   className="border border-2 rounded-pill px-3 py-1 fw-semibold shadow-sm"
                  style={{
                      fontSize: "0.85rem",
                      backgroundColor: "#f8fafc",
                      color: "#334155",
                      borderColor: "#94a3b8"
                  }}
                
              >
                        Entrada Apunts
              </Nav.Link>
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
                         Gestió pressupost
              </Nav.Link>
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
                          Últims moviments
              </Nav.Link>
             </Nav>
             )}
          </Navbar.Collapse>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Container>
      </Navbar> 

      <Row className="justify-content-center">
            <Col md={20}>
              <Card>
                <Card.Header 
                      className="text-center fs-5 fw-bold">
                        Situació a 01/06/2026
                </Card.Header>/
                <Card.Body>
                  <Form>
                   <Form.Group 
                      controlId="formBasicText" 
                      className="d-flex align-items-center">
                   <Form.Label 
                      className="me-2" style={{ width: '160px' }}>
                          Període -  dd/mm/yyyy </Form.Label>
                   <Form.Control
                        type="text"
                         
                      
                              onChange={Temporada}                  
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
     
  );
}
export default CMenu;
