
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Col,Nav, Card, Form, Button } from "react-bootstrap";
import { doc, setDoc, getDoc, query, where, getDocs, writeBatch, collection } from 'firebase/firestore';
import { storageCar, db } from '../firebaseLoc.js';
import "./CmovsC";
import Benrera from "../Backups/Benrera.js";

function CconsultaC() {
  const navigate=useNavigate();
  const [text1, setText1] = useState(localStorage.getItem('Proces061') || '');
  const [text2, setText2] = useState(localStorage.getItem('Proces062') || '');
  const [text3, setText3] = useState(localStorage.getItem('Proces063') || '');
  const [administrador, setAdministrador]
                          = useState(localStorage.getItem('AdminFam') || ''); 
  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  const [empresa, setEmpresa] = useState(localStorage.getItem('Empresa'));
  const [peria, setPeria] = useState('');
  const [perim, setPerim] = useState('');
  const [logoR, setLogoR] = useState('');
  
  useEffect(() => {
  const fetchPercon = async () => {
    try {
      const linksCollection = collection(db, 'PeriConta');
      const querySnapshot = await getDocs(linksCollection);
      const registre = querySnapshot.docs.find(
        doc => doc.data().PC00 === empresa
      );

      if (registre) {
        const data = registre.data();
        setPeria(`${data.PC01}`);
        setPerim(`${data.PC02}`);
      } else {
        setPeria('');
        setPerim('');
      }
    } catch (error) {
      console.error('Error llegint periode comptable:', error);
    } finally {
      
    }
  };

  fetchPercon();
}, []);
 function Validar() {   
    localStorage.setItem('Proces061', text1);
    localStorage.setItem('Proces062', text2);
    localStorage.setItem('Proces063', text3); 
    navigate('/CmovsCB');
  } 
  function Sacabat() {     
    navigate('/Cmovs');
  }  
  Benrera(Sacabat); 
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
                 CONSULTA <span style={{ color: "#0d6efd" }}>Apunts Comptables</span>
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
             <Card.Header className="text-center fs-5 fw-bold">Seleccionar Apunts</Card.Header>
             <Card.Body>
            <Form>
              <div className="d-flex justify-content-center mt-4">
              <div
               style={{
                width: "700px",
                 backgroundColor: "#fff",
                 border: "1px solid #dee2e6",
                 borderRadius: "16px",
                 padding: "30px",
                 boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                }}
            >   
          {/* Any */}
           <Form.Group className="row mb-3 align-items-center">
             <Form.Label
               className="col-sm-3 col-form-label fw-semibold"
               >
               Any
             </Form.Label>
              <div className="col-sm-9">
             <Form.Control
              type="text"
              inputMode="numeric"
              maxLength={4}
               placeholder="any "
                value={text1}
                onChange={(e) => {
                 const valor = e.target.value;
                  setText1(valor);
              }}
             />  
             </div>     
           </Form.Group>

      {/* Període */}
      <Form.Group className="row mb-3 align-items-center">
        <Form.Label
          className="col-sm-3 col-form-label fw-semibold"
        >
          Període
        </Form.Label>

        <div className="col-sm-9">
           <Form.Control
              type="text"
              inputMode="numeric"
              maxLength={2}
               placeholder=""
                value={text2}
                   placeholder="mes "
                onChange={(e) => {
                 const valor = e.target.value;
                  setText2(valor);
              }}
             />  
        </div>
      </Form.Group>

      {/* Paraula clau */}
      <Form.Group className="row mb-3 align-items-center">
        <Form.Label
          className="col-sm-3 col-form-label fw-semibold"
        >
          Paraula clau
        </Form.Label>

        <div className="col-sm-9">
          <Form.Control
              type="text"
              placeholder="Escriu una paraula..."
              value={text3}
                onChange={(e) => {
                 const valor = e.target.value;
                  setText3(valor);
                }}
          />
        </div>
      </Form.Group>

      {/* Botons */}
      <div className="text-center mt-4">
        <Button
          variant="warning"
          size="sm"
          onClick={Sacabat}
          className="me-3 px-4"
        >
          <i className="fas fa-arrow-left me-2"></i>
          Enrere
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={Validar}
          className="px-4"
        >
          <i className="fas fa-check me-2"></i>
          Validar
        </Button>
      </div>
    </div>
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
