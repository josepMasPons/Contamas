import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Col,Nav, Card, Form, Button } from "react-bootstrap";
import { storageCar, db } from '../firebaseLoc.js';
import { doc, setDoc, getDoc, query, where, getDocs, collection } from 'firebase/firestore';
import "./Cmovs.css";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function Cmovs() {
  const navigate=useNavigate();

  const [showAvis1, setShowAvis1] = useState(false);
  const [showAvis2, setShowAvis2] = useState(false);
  const [showAvis3, setShowAvis3] = useState(false);
  const [grupC, setGrupC] = useState([]); 
  const [compteC, setCompteC] = useState([]); 
  const [compteD, setCompteD] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [codiCompteC, setCodiCompteC] = useState('');
  const [codiCompteD, setCodiCompteD] = useState('');

  const [codiOrigen, setCodiOrigen] = useState('');
  const [nomOrigen, setNomOrigen] = useState('');
   const [codiDesti, setCodiDesti] = useState('');
  const [nomDesti, setNomDesti] = useState('');

  const [nomCompteC, setNomCompteC] = useState('');
  const [nomCompteD, setNomCompteD] = useState('');  
  
  const [tipus, setTipus] = useState('');
  const [notesD, setNotesD] = useState('');
 

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

 
   
  async function Validar()  {
    /*
    if (codiGrup !== '' && nomGrup !== '' && tipus !== '') {
        //console.log('Grabar GrupC - ',codiGrup , ' - ', nomGrup , ' - ',tipus);
        const docRef1 = doc(db, 'GrupC', 'GC_' + codiGrup);
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
        setShowAvis1(true);
        return;
    } 
    if (codiCompteC !== '' && nomCompteC !== '') {
        const docRef2 = doc(db, 'CompteG', empresa+'_' +
                                          codiGrup+'.'+ codiCompteC);
        try {
            await setDoc(docRef2, {
                C00:    empresa,
                C01:     codiCompteC,  
                C02:     nomCompteC,               
                C03:     codiGrup       
             });    
        } catch (error) {
            console.error('Error en crear el document:', error);
        }
    } else {
        setShowAvis2(true);
        return;
    }
    if (codiCompteD !== '' && nomCompteD !== '') {
        //console.log('Grabar CompteD - ',codiCompteD, ' - ', nomCompteD);
        const docRef3 = doc(db, 'CompteD', empresa+'_' + 
                              codiGrup+'.'+ codiCompteC+'.'+codiCompteD);
        try {
            await setDoc(docRef3, {
                D00:    empresa,
                D01:    codiCompteD,  
                D02:    nomCompteD,               
                D03:    codiGrup  ,
                D04:    codiCompteC,  
                D05:    notesD  
             });    
        } catch (error) {
            console.error('Error en crear el document:', error);
        }
    
      } else {
        setShowAvis3(true);
        return;
    }
        */
  } 
   
  function TancarAvis() {     
      setShowAvis1(false)
      setShowAvis2(false)
      setShowAvis3(false)
   
  }  
  function Sacabat() {     
       navigate('/CMenu');
  } 
  function Consulta() {     
       navigate('/CconsultaC');
  }   
  const BuscarOrigen = (valor) => {
     setCodiOrigen(valor);
     const registre = compteD.find(
        item => item.id === valor
     );     
     if (registre) {
         setNomOrigen(`${registre.D11} / ${registre.D12} / ${registre.D02}`);
    } 
  };
  const BuscarDesti = (valor) => {
     setCodiOrigen(valor);
     const registre = compteD.find(
        item => item.id === valor
     );     
     if (registre) {
         setNomDesti(`${registre.D11} / ${registre.D12} / ${registre.D02}`);
    } 
  };
  
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
    }, []);
   //   *********  llegir  comptaD  i posarho a taula ComptaD ******
  useEffect(() => { 
  const fetchData3 = async () => {
    const linksCollection = collection(db, 'CompteD');
    try {
      const querySnapshot = await getDocs(linksCollection);
      const linksData = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        // Buscar coincidència a grupC
        const grup1 = grupC.find(g => g.G01 === data.D03);
        // Buscar coincidència a compteC
        const grup2 = compteC.find(
          g => g.C03 === data.D03 && g.C01 === data.D04
        );
        return {
          id: docSnap.id,
          D00: data.D00,
          D01: data.D01,
          D02: data.D02,
          D03: data.D03,
          D04: data.D04,
          D05: data.D05,
          D10: grup1?.G03 || "",
          D11: grup1?.G02 || "",
          D12: grup2?.C02 || "",
          ...data,
        };
      });
      setCompteD(linksData);
    } catch (error) {
      console.error('Error llegint CompteD: ', error);
    } finally {
      setLoading(false);
    }
  };
  fetchData3();
}, [compteC, grupC]);
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
           Entrada <span style={{ color: "#0d6efd" }}> Apunts Comptables</span>
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
    
    {/*    origen  **************************** */}        
     <Form onSubmit={(e) => e.preventDefault()}>
      <Form.Group className="mb-4">
       <div className="d-flex align-items-center gap-3 mb-3">
            <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }}
            >
                Origen
            </Form.Label>
     
            <Form.Select
                  value={codiOrigen}
                  onChange={(e) => BuscarOrigen(e.target.value)}
                  className="py-1 rounded-3 fw-bold"
                  style={{
                   width: "120px",
                  fontSize: "0.9rem"
            }}
            required>
                <option value="">Origen - </option>
                {compteD?.filter(item => ["A", "P"].includes(item.D10))
                 .map((item) => (
                     <option key={item.id} value={item.id}>
                          {item.D03}.{item.D04}.{item.D01} -
                          {item.D11} / {item.D12} / {item.D02}
                     </option>
    
             ))}
          </Form.Select>           
          <Form.Control
             type="text"
             value={nomOrigen}
            
             className="py-2 rounded-3 fw-bold"
             style={{
                    width: "260px",
                    fontSize: "0.95rem",
                    backgroundColor: "#d1fae5",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
              }}
           />
           </div>
           <div className="d-flex align-items-center gap-3 mb-3">
                 <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }}
                >
                ..Destí
            </Form.Label>     
            <Form.Select
                  value={codiDesti}
                  onChange={(e) => BuscarDesti(e.target.value)}
                  className="py-1 rounded-3 fw-bold"
                  style={{
                   width: "120px",
                  fontSize: "0.9rem"
            }}
            required>
                <option value="">Destí - </option>
                {compteD?.filter(item => ["I", "D"].includes(item.D10))
                 .map((item) => (
                     <option key={item.id} value={item.id}>
                          {item.D03}.{item.D04}.{item.D01} -
                          {item.D11} / {item.D12} / {item.D02}
                     </option>
    
             ))}
          </Form.Select>           
          <Form.Control
             type="text"
             value={nomDesti}            
             className="py-2 rounded-3 fw-bold"
             style={{
                    width: "260px",
                    fontSize: "0.95rem",
                    backgroundColor: "#d1fae5",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
              }}
           />
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
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button className="mb-2" 
                          variant="primary"
                          size='sm'                      
                          onClick={Consulta}>                             
                          <i className="fas fa-sign-out-alt"></i>  Consulta comptes
                      </Button> 
                       
         <ToastContainer
                position="top-end"
                className="p-3"
                style={{ zIndex: 9999 }}
          >
         <Toast
            bg="warning"
            onClose={() => TancarAvis()}
            show={showAvis1 || showAvis2 || showAvis3}
            delay={3000}
            autohide
        >
          <Toast.Header>
            <strong className="me-auto">
                Avís
            </strong>
          </Toast.Header>
          <Toast.Body className="text-dark fw-semibold">
            Camp no informat 
          </Toast.Body>
        </Toast>
       </ToastContainer>                            
       </div>               
      </div>     
  );
}
export default Cmovs;
