import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Col,Nav, Card, Form, Button } from "react-bootstrap";
import { storageCar, db } from '../firebaseLoc.js';
import { doc, setDoc, getDoc, query, where, getDocs, collection } from 'firebase/firestore';
import "./Ccomptes.css";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function Ccomptes() {
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
  const [deureC, setDeureC] = useState('');
  const [haverC, setHaverC] = useState('');
  const [notesD, setNotesD] = useState('');
  const [tipus, setTipus] = useState('');
 

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
       
        setShowAvis(prev => 1 - prev); 
        return;
    }
   } 

  function Sacabat() {  
       //navigate(-1);   
       navigate('/CMenu_Inici');
  } 
  function Consulta() {     
       navigate('/CconsultaCB');
  }  
  function GrupG() {     
       navigate('/CcomptesG');
  }  
  function ComptesG() {     
       navigate('/CcomptesC');
  }   
  const BuscarGrup = (valor) => {
    const codi = valor.toUpperCase();
    setCodiGrup(codi);
    setCodiCompteC('');
    setCodiCompteD('');
    setNomGrup('');
    setTipus('');
    setNomCompteC('');
    setNomCompteD('');
    setNotesD('');
    const grupTrobat = grupC.find(
        (item) => item.G01 === codi
    );
    if (grupTrobat) {
        setNomGrup(grupTrobat.G02);
        setTipus(grupTrobat.G03);
    } else {
     }
  };
  const BuscarCompteC = (valor) => {
    const codi = valor.toUpperCase();
        setCodiCompteC(codi);
        setCodiCompteD('');
        setNomCompteC('');
        setNomCompteD('');
        setNotesD('');
        setDeureC('');       
        setHaverC(''); 
    const grupTrobat = compteC.find(
        (item) => item.C01 === codi    && item.C03 === codiGrup
    );
    if (grupTrobat) {
        setNomCompteC(grupTrobat.C02); 
        setDeureC(grupTrobat.C51);       
        setHaverC(grupTrobat.C52); 
    } else {
        setCodiCompteC(codi);
        setCodiCompteD('');
        setNomCompteC('');
        setNomCompteD('');
        setNotesD('');
        setDeureC('');       
        setHaverC(''); 
      }
  };
  const BuscarCompteD = (valor) => {
    const codi = valor.toUpperCase();
    setCodiCompteD(codi);
    setNomCompteD('');
    setNotesD('');
    const grupTrobat = compteD.find(
        (item) => item.D01 === codi && item.D04 === codiCompteC
                                    && item.D03 === codiGrup
    );

    if (grupTrobat) {
        setNomCompteD(grupTrobat.D02);  
        setNotesD(grupTrobat.D05);     
   
    } else {
        }
  };
   //   *********  llegir grupC  i posarho a taula grupC ******
  useEffect(() => {
      const fetchData1 = async () => {
        const linksCollection = collection(db, 'GrupC');
        try {

           const q = query(
            linksCollection,
             where("G00", "==", empresa)
          );

          const querySnapshot = await getDocs(q);
     
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
    try {
      const linksCollection = collection(db, "CompteG");

      const q = query(
        linksCollection,
        where("C00", "==", empresa)
      );

      const querySnapshot = await getDocs(q);

      const linksData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        C51: doc.data().C51?.trim() || "",
        C52: doc.data().C52?.trim() || "",
      }));

      setCompteC(linksData);
    } catch (error) {
      console.error("Error llegint CompteC:", error);
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
          const linksData = querySnapshot.docs.map(doc => ({
            D00: doc.data().D00,
            D01: doc.data().D01,
            D02: doc.data().D02,
            D03: doc.data().D03,
            D04: doc.data().D04,
            D05: doc.data().D05,
              ...doc.data(),
          }));
          setCompteD(linksData);
        } catch (error) {
          console.error('Error llegint CompteD: ', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData3();
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
           Gestió <span style={{ color: "#0d6efd" }}>Dels COMPTES</span>
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
 
       <Col xs={12} md={10} lg={7} xl={6}>
     
       <Card className="shadow border-0 rounded-4 w-100">
         <Card.Body className="p-5"> 
    {/*    GRUPC   nou  **************************** */} 
          <Form onSubmit={(e) => e.preventDefault()}>
           <Form.Group className="mb-4">
        
              <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
              <Form.Label
                  className="fw-semibold mb-0"
                  style={{ fontSize: "0.95rem" }}
              >
                Grup.....
             </Form.Label>  
       <div className="d-flex flex-wrap align-items-center gap-3 mb-3">  
            <Form.Select 
                    type="text" 
                    value={codiGrup}              
                    onChange={(e) => BuscarGrup(e.target.value)}
                    className="py-1 rounded-3 fw-bold"
                    style={{
                     width: "70px",
                    fontSize: "0.9rem"
                    }}
                    required>          
                  {grupC?.map((item) => (
                       <option key={item.G01} value={item.G01}>
                          {`${item.G01} - ${item.G02}`}
                       </option>    
               ))}
           </Form.Select> 
           <Form.Control
                  type="text"
                   value={nomGrup}
                    readOnly
                    className="py-2 rounded-3 fw-bold"
                    style={{
                      width: "150px",
                      fontSize: "0.95rem",
                      backgroundColor: "#e7dfbb",
                       border: "1px solid #b6c2d1",
                     color: "#535533"
                     }}
             />
              <Form.Control
                           type="text"
                           value={tipus}
                           readOnly
                          className="py-2 rounded-3 text-center fw-bold"
                          style={{
                               width: "50px",
                               fontSize: "0.95rem",
                               backgroundColor: "#e7dfbb",
                               border: "1px solid #b6c2d1",
                               color: "#334155"
                          }}
              />                     
             </div>
            </div>            
          </Form.Group>
         </Form>      
   {/*    COMPTEC **************************** */} 
   <Form onSubmit={(e) => e.preventDefault()}>
    <Form.Group className="mb-4">     
   
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }}            >
                Compte
            </Form.Label>
           <Form.Select
              value={codiCompteC || ""}
              onChange={(e) => BuscarCompteC(e.target.value)}
              className="py-1 rounded-3 fw-bold"
              style={{
                width: "80px",
                fontSize: "0.9rem"
              }}
              required
              >
              <option value="">-- Selecciona --</option>
              {compteC
                   ?.filter(item => item.C03 === codiGrup)
                    .map((item) => (
                   <option key={item.C01} value={item.C01}>
                            {`${item.C01} - ${item.C02}`}
                    </option>
                 ))
              }
           </Form.Select>
           <Form.Control
                 type="text"
                 value={nomCompteC}
                 readOnly
                 className="py-2 rounded-3 fw-bold"
                  style={{
                     width: "260px",
                      fontSize: "0.95rem",
                      backgroundColor: "#aef2c6",
                       border: "1px solid #b6c2d1",
                     color: "#334155"
                      }}
            />  
             
              <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }} >
         
              </Form.Label>             
              <Form.Control
                 type="text"
                 value={deureC}
                 readOnly
                 className="py-2 rounded-3 fw-bold"
                  style={{
                     width: "60px",
                      fontSize: "0.95rem",
                      backgroundColor: "#aef2c6",
                       border: "1px solid #b6c2d1",
                     color: "#334155"
                      }}
              />               
              <Form.Control
                 type="text"
                 value={haverC}
                 readOnly
                 className="py-2 rounded-3 fw-bold"
                  style={{
                     width: "60px",
                      fontSize: "0.95rem",
                      backgroundColor: "#aef2c6",
                       border: "1px solid #b6c2d1",
                     color: "#334155"
                      }}
            />               
       
        </div>
       </Form.Group>
    </Form>
    {/*    COMPTED **************************** */} 
    <Form onSubmit={(e) => e.preventDefault()}>
    <Form.Group className="mb-4">    
        <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }}
            >
                Detall
            </Form.Label>
            <Form.Control
                type="text"
                maxLength={3}
                value={codiCompteD}
                placeholder=".."
                onChange={(e) => BuscarCompteD(e.target.value)}
                className="py-1 rounded-3 text-uppercase text-center fw-bold"
                style={{
                    width: "70px",
                    fontSize: "0.9rem"
                }}
                required
            />         
     
         {/* NOM COMPTE */}        
          <Form.Control
            type="text"
            value={nomCompteD}
            placeholder="Nom compte"
            onChange={(e) => setNomCompteD(e.target.value)}
            className="py-2 rounded-3 fw-bold"
            style={{
                width: "260px",
                fontSize: "0.95rem",
                 backgroundColor: "#d1fae5",
                border: "1px solid #b6c2d1",
                color: "#334155"
            }}
            required
          />
             </div>     
        <div className="d-flex ">
          <Form.Control
            type="text"
            value={notesD}           
            placeholder="notes"
            onChange={(e) => {
                const valor = e.target.value;
                setNotesD(valor);
                }}        
            className="py-1 rounded-3 text-center fw-bold"
            style={{
                width: "300px",
                fontSize: "0.9rem",
                backgroundColor: "#d1fae5",
                border: "1px solid #b6c2d1",
                color: "#334155"
            }}
            required
          />       
       </div>          
       <div className="d-flex justify-content-center mt-4">
         <div className="px-4 py-2 rounded-4 shadow-sm text-center"
          style={{
            backgroundColor: "#eef2f7",
            border: "1px solid #cbd5e1",
            color: "#1e293b",
            fontSize: "1rem",
            fontWeight: "600",
            minWidth: "320px",
            letterSpacing: "0.5px"
          }}
          >
        <span style={{ color: "#64748b" }}>
            Compte:
        </span>
      
        <span style={{ color: "#0f172a" }}>
            {codiGrup}.{codiCompteC}.{codiCompteD}
        </span>
       </div>      
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
                          <i className="fas fa-sign-out-alt"></i>  Consulta 
                      </Button> 
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button className="mb-2" 
                          variant="primary"
                          size='sm'                      
                          onClick={GrupG}>                             
                          <i className="fas fa-sign-out-alt"></i>  Grup
                      </Button> 
                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button className="mb-2" 
                          variant="primary"
                          size='sm'                      
                          onClick={ComptesG}>                             
                          <i className="fas fa-sign-out-alt"></i>  Comptes 
                      </Button>             
       </div>               
      </div>     
  );
}
export default Ccomptes;
