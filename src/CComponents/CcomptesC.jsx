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

function CcomptesC() {
 // const {pr} = useParams();
  const navigate=useNavigate();
  //console.log('use state - ',localStorage.getItem('CcomptesC'))
  const prC = (localStorage.getItem('CcomptesC'));
  const prG2  = (localStorage.getItem('CcomptesG'));
   
  console.log('prg2 -' , localStorage.getItem('CcomptesC'))
  console.log('prC -' , localStorage.getItem('CcomptesG'))
  const [showAvis, setShowAvis] = useState(0);
  const [grupC, setGrupC] = useState([]); 
  const [compteC, setCompteC] = useState([]); 
  const [compteD, setCompteD] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [codiCompteC, setCodiCompteC] = useState('');
  const [XG01, setXG01] = useState('');
  const [deureE, setDeureE] = useState('');
  const [haverE, setHaverE] = useState('');
  const [codiGrup, setCodiGrup] = useState('');
  const [nomGrup, setNomGrup] = useState('');
  const [nomCompteC, setNomCompteC] = useState('');
  const [nomCompteD, setNomCompteD] = useState(''); 
  const [priveg, setPriveg] = useState(true); 
  
  const [tipus, setTipus] = useState('');
  const [notesD, setNotesD] = useState('');
 

  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  const [empresa, setEmpresa] = useState(localStorage.getItem('Empresa'));
  //const [text2, setText2] = useState(localStorage.getItem('Proces052') || '');
  const [administrador, setAdministrador]
                          = useState(localStorage.getItem('AdminFam') || ''); 

  const [logoR, setLogoR] = useState('');

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
  const ajudaD= (
  <Popover id="popover-tipus">
    <Popover.Header as="h3">Selecció DEURE</Popover.Header>
    <Popover.Body>
      <div><strong>I</strong> = Ingrés</div>
      <div><strong>T</strong> = Traspàs</div>
      <div><strong>F</strong> = Càrrecs/fres.</div>
      <div><strong>A</strong> = Tot</div>
      <div><strong>X</strong> = Aper./Tanc.</div>
    </Popover.Body>
  </Popover>
    );
const ajudaH= (
  <Popover id="popover-tipus">
    <Popover.Header as="h3">Selecció HAVER</Popover.Header>
    <Popover.Body>
      <div><strong>I</strong> = Ingrés</div>
      <div><strong>T</strong> = Traspàs</div>
      <div><strong>F</strong> = Càrrecs/fres.</div>
      <div><strong>A</strong> = Tot</div>
      <div><strong>X</strong> = Aper./Tanc.</div>
    </Popover.Body>
  </Popover>
);

   // programa standard per buto triangle android ---------------
  const programa = 'Cmenu_Inici.jsx';   
  useEffect(() => {
  const handleBack = () => {
    Sacabat();

    // Manté la pàgina dins de l'historial
    window.history.pushState(null, "", window.location.href);
  };

  // Creem una entrada inicial
  window.history.pushState(null, "", window.location.href);

  window.addEventListener("popstate", handleBack);

  return () => {
    window.removeEventListener("popstate", handleBack);
  };
}, []);
// final programa standard ---------------------------------
   
  async function Validar()  {
   if (codiCompteC !== '' && nomCompteC !== '' && codiGrup !== '') {
        const docRef2 = doc(db, 'CompteG', empresa+'_' +
                                          codiGrup+'.'+ codiCompteC);                                    
        try {
            await setDoc(docRef2, {
                C00:    empresa,
                C01:     codiCompteC,  
                C02:     nomCompteC,               
                C03:     codiGrup, 
                C51: deureE?.trim() || "",
                C52: haverE?.trim() || ""
             });    
        } catch (error) {
            console.error('Error en crear el document:', error);
        }
    } else {
           console.error('Error en crear el document:', codiCompteC, ' - ', nomCompteC);
         return;
    }   
     setShowAvis(prev => 1 - prev); 
     // setNomGrup('');
      //setCodiGrup('');
      //setTipus('');
      setNomCompteC('');  
      setDeureE('');
      setHaverE('');

   } 
  function Sacabat() {     
       navigate('/Ccomptes');
  } 
  
  useEffect(() => {
    console.log('prG2 i grupc - ', prG2, grupC)

    const codi = prG2;  
    const grupTrobat = grupC.find(
        (item) => item.G01 === codi &&
                  item.G00 === empresa
    );
    if (grupTrobat) {
        setNomGrup(grupTrobat.G02);
        setCodiGrup(codi)
        setTipus(grupTrobat.G03);
    } else {
        setNomGrup('');
        setTipus('');
     }
   }, [prG2,grupC]);
 
  const BuscarCompteC = (valor) => {
    const codi = valor.toUpperCase();
    setCodiCompteC(codi);
    const grupTrobat = compteC.find(
        (item) => item.C01 === codi    && item.C03 === codiGrup
                                       && item.C00 === empresa
    );
    if (grupTrobat) {
        setNomCompteC(grupTrobat.C02);       
        setDeureE(grupTrobat.C51)
        setHaverE(grupTrobat.C52);
    } else {
       setNomCompteC('');  
       setDeureE('')
       setHaverE('');
      }
  };
  useEffect(() => {
    if (prC === '*') {return;}
    setCodiCompteC(prC)
    const grupTrobat = compteC.find(
        (item) => item.C01 === prC    && item.C03 === codiGrup
                                       && item.C00 === empresa
    );
    if (grupTrobat) {
        setNomCompteC(grupTrobat.C02);       
        setDeureE(grupTrobat.C51)
        setHaverE(grupTrobat.C52);
    }
       setPriveg(false);
    }, [prC, compteC, empresa]);
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
    }, []);
       //   *********  llegir  compteC  i posarho a taula CompteC ******
       useEffect(() => {
      const fetchData2 = async () => {
        const linksCollection = collection(db, 'CompteG');
        try {
          const querySnapshot = await getDocs(linksCollection);
          const linksData = querySnapshot.docs.map(doc => ({
            C00: doc.data().C00,
            C01: doc.data().C01,
            C02: doc.data().C02,
            C03: doc.data().C03,
            C51: doc.data().C51,
            C52: doc.data().C52,
              ...doc.data(),
          }));
          setCompteC(linksData);
        } catch (error) {
          console.error('Error llegint CompteC: ', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData2();
    }, [showAvis]);
  
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
           Manteniment <span style={{ color: "#0d6efd" }}>Dels COMPTES</span>
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
       <Col lg={7} xl={4}>
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
                Grup    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Form.Label>  
            <div  className="d-flex align-items-center gap-3 mb-3">    
              <Form.Label
                  className="py-1 rounded-3 fw-bold"
                  style={{
                   width: "70px",
                  fontSize: "0.95rem"
                  }}
                > 
                 {codiGrup} 
            </Form.Label> 
                      
            <Form.Label
                  className="py-2 rounded-3 fw-bold"
                  style={{
                    width: "150px",
                    fontSize: "0.95rem",
                    backgroundColor: "#e7dfbb",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
                   }}
              >{nomGrup}
            </Form.Label>
            <OverlayTrigger
              trigger={['hover', 'focus']}
               placement="right"
                overlay={ajudaTipus}
            >
              <Form.Label
                 className="py-2 rounded-3 text-center fw-bold"
                 style={{
                    width: "50px",
                    fontSize: "0.95rem",
                    backgroundColor: "#e7dfbb",
                    border: "1px solid #b6c2d1",
                    color: "#334155"
                 }}
              >{tipus}
              </Form.Label>   
            </OverlayTrigger>       
           </div>
      </div>
    </Form.Group>
    </Form>
   {/*    COMPTEC **************************** */} 
   <Form onSubmit={(e) => e.preventDefault()}>
    <Form.Group className="mb-4">     
        <div className="d-flex align-items-center gap-3 mb-3">
            <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }}            >
                Compte
            </Form.Label>
            <Form.Control
                type="text"
                maxLength={3}
                value={codiCompteC}
                placeholder=".."
                onChange={(e) => BuscarCompteC(e.target.value)}
                className="py-1 rounded-3 text-uppercase text-center fw-bold"
                style={{
                    width: "70px",
                    fontSize: "0.9rem"
                }}
                required
            />           
            <Form.Control
                 type="text"
                 value={nomCompteC}
                 onChange={(e) => setNomCompteC(e.target.value)}
                 className="py-2 rounded-3 fw-bold"
                  style={{
                     width: "180px",
                      fontSize: "0.95rem",
                      backgroundColor: "#aef2c6",
                       border: "1px solid #b6c2d1",
                     color: "#334155"
                      }}
            />  
              </div>
       </Form.Group>
    </Form>    
    <Form onSubmit={(e) => e.preventDefault()}>
       <Form.Group className="mb-4">     
        <div className="d-flex align-items-center gap-3 mb-3">
                  <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }}
            >  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Form.Label>  
               <OverlayTrigger
              trigger={['hover', 'focus']}
               placement="right"
                overlay={ajudaD}
            >
             <Form.Control
                 type="text"
                 value={deureE}
                 onChange={(e) => setDeureE(e.target.value)}               
                 className="py-2 rounded-3 fw-bold"
                  style={{
                     width: "80px",
                      fontSize: "0.95rem",
                      backgroundColor: "#aef2c6",
                       border: "1px solid #b6c2d1",
                     color: "#334155"
                      }}
             />              
            </OverlayTrigger>
            <OverlayTrigger
              trigger={['hover', 'focus']}
               placement="right"
                overlay={ajudaH}
            >
             <Form.Control
                 type="text"
                 value={haverE}
                 onChange={(e) => setHaverE(e.target.value)}
                 className="py-2 rounded-3 fw-bold"
                  style={{
                     width: "80px",
                      fontSize: "0.95rem",
                      backgroundColor: "#aef2c6",
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
                          <i className="fas fa-sign-out-alt"></i>  Validar
                      </Button>                           
       </div>               
      </div>     
  );
}
export default CcomptesC;
