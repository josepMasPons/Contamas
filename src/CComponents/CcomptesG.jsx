import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar, Container, Row, Col,Nav, Card, Form, Button } from "react-bootstrap";
import { storageCar, db } from '../firebaseLoc.js';
import { doc, setDoc, getDoc, query, where, getDocs, collection } from 'firebase/firestore';
import "./Ccomptes.css";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Benrera from "../Backups/Benrera.js";

function CcomptesG() {
  const [pr, setPr] = useState(localStorage.getItem('CcomptesG'));   
  //const {pr} = useParams();
   // console.log(pr); //  
  const navigate=useNavigate();
  const [showAvis, setShowAvis] = useState(0);
  const [grupC, setGrupC] = useState([]); 
  const [compteC, setCompteC] = useState([]); 
  const [compteD, setCompteD] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [codiGrup, setCodiGrup] = useState('');
  const [codiCompteC, setCodiCompteC] = useState('');
  const [codiCompteD, setCodiCompteD] = useState('');


  const [nomGrup, setNomGrup] = useState('');
  const [nomCompteC, setNomCompteC] = useState('');
  const [nomCompteD, setNomCompteD] = useState('');  
  const [priveg, setPriveg] = useState(true);
  const [tipus, setTipus] = useState('');
  const [notesD, setNotesD] = useState('');


  const ajudaTipus = (
  <Popover id="popover-tipus">
    <Popover.Header as="h3">Tipus</Popover.Header>
    <Popover.Body>
      <div><strong>A</strong> = Actiu</div>
      <div><strong>P</strong> = Passiu</div>
      <div><strong>I</strong> = Ingrés</div>
      <div><strong>D</strong> = Despesa</div>
    </Popover.Body>
  </Popover>
);
 

  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  const [empresa, setEmpresa] = useState(localStorage.getItem('Empresa'));
  //const [text2, setText2] = useState(localStorage.getItem('Proces052') || '');
  const [administrador, setAdministrador]
                          = useState(localStorage.getItem('AdminFam') || ''); 

  async function Validar()  {
    if (codiGrup !== '' && nomGrup !== '' && tipus !== '') {
        //console.log('Grabar GrupC - ',codiGrup , ' - ', nomGrup , ' - ',tipus);
        const docRef1 = doc(db, 'GrupC',empresa + '_' + codiGrup);
        try {
            await setDoc(docRef1, {
                G00:    empresa,
                G01:     codiGrup,  
                G02:     nomGrup,               
                G03:     tipus         
             });    
        } catch (error) {
            console.error('Error en crear el document:', error);
        }
      } else {
        
        return;
      }
       setShowAvis(prev => 1 - prev);
       if (pr === '*') {
          setCodiGrup('');
          setNomGrup('');
          setTipus('');
       } else {
          navigate('/Ccomptes');
       }       
    }
  function Sacabat() {     
       navigate('/Ccomptes');
  } 
  const BuscarGrup = (valor) => {
    const codi = valor.toUpperCase();
    setCodiGrup(codi);
    const grupTrobat = grupC.find(
        (item) => item.G01 === codi  &&
                  item.G00 === empresa
    );
    if (grupTrobat) {
        setNomGrup(grupTrobat.G02);
        setTipus(grupTrobat.G03);
    } else {
        setNomGrup('');
        setTipus('');
     }
  };
 
 useEffect(() => {
  if (pr === '*') {return;}
  const grupTrobat = grupC.find(        
        (item) => item.G01 === pr  &&
                  item.G00 === empresa
    );
    if (grupTrobat) {
        setCodiGrup(pr);
        setNomGrup(grupTrobat.G02);
        setTipus(grupTrobat.G03);
    } else {
        setNomGrup('');
        setTipus('');
     }
     setPriveg(false);
  }, [pr, grupC, empresa]);
  
   //   *********  llegir grupC  i posarho a taula grupC ******
  useEffect(() => {
      const fetchData1 = async () => {
        const linksCollection = collection(db, 'GrupC');
        try {
          const querySnapshot = await getDocs(linksCollection);
          const linksData = querySnapshot.docs.map(doc => ({
            G00: doc.data().G00,
            G01: doc.data().G01,
            G02: doc.data().G02,
            G03: doc.data().G03,
              ...doc.data(),
          }));
          setGrupC(linksData);
        } catch (error) {
          console.error('Error llegint grupC: ', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData1();
    }, [showAvis]);  
  Benrera(Sacabat); 
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
           Manteniment dels <span style={{ color: "#0d6efd" }}>Grups</span>
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
       <Col lg={4} xl={4}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="p-5"> 

    {/*    GRUPC **************************** */}        
     <Form onSubmit={(e) => e.preventDefault()}>
      <Form.Group className="mb-4">
       <div className="d-flex align-items-center gap-3 mb-3">
            <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }}
            >
                Grup
            </Form.Label>
            <Form.Control
                type="text"
                maxLength={2}
                value={codiGrup}
                placeholder=".."
                onChange={(e) => BuscarGrup(e.target.value)}
                className="py-1 rounded-3 text-uppercase text-center fw-bold"
                style={{
                    width: "70px",
                    fontSize: "0.9rem"
                }}
                required
            />
           {/* NOM GRUP */}
          <Form.Control
             type="text"
             value={nomGrup}
             onChange={(e) => setNomGrup(e.target.value)}
             className="py-2 rounded-3 fw-bold"
             style={{
                    width: "260px",
                    fontSize: "0.95rem",
                    backgroundColor: "#e7dfbb",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
              }}
           />

        <OverlayTrigger
              trigger={['hover', 'focus']}
               placement="right"
                overlay={ajudaTipus}
        >
         <Form.Control
              type="text"
              value={tipus}
              maxLength={1}
               onChange={(e) => {
                  const valor = e.target.value.toUpperCase();
                   if (['A', 'P', 'I', 'D'].includes(valor) || valor === '') {
                        setTipus(valor);
                   }
                }}
             className="py-2 rounded-3 text-center fw-bold"
             style={{
                  width: "70px",
                  fontSize: "0.95rem",
                  backgroundColor: "#e7dfbb",
                  border: "1px solid #b6c2d1",
                  color: "#334155"
              }}
              /> 
            </OverlayTrigger>         
        </div>
    </Form.Group>
    </Form>  
   </Card.Body>   
    </Card>
   </Col>
  </Row>
    <br></br>          
   <div className="d-flex justify-content-center mt-3">
                      <Button className="mb-2" 
                          variant="warning"
                          size='sm'
                          onClick={Sacabat}>                                      
                          <i className="fas fa-sign-out-alt"></i>  Enrere
                      </Button>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                   
                      <Button className="mb-2" 
                          variant="primary"
                          size='sm'                      
                          onClick={Validar}>                             
                            Validar
                      </Button> 
                 
       </div>               
      </div>     
  );
}
export default CcomptesG;
