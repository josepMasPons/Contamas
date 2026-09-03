import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Col,Nav, Card, Form, Button } from "react-bootstrap";
import { storageCar, db } from '../firebaseLoc.js';
import { doc, setDoc, getDoc, query, where, getDocs, collection } from 'firebase/firestore';
import "./Ccomptes.css";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

function Ccomptes() {
  const navigate=useNavigate();
  const [showAvis, setShowAvis] = useState(0);
  const [grupC, setGrupC] = useState([]); 
  const [compteC, setCompteC] = useState([]); 
  const [compteD, setCompteD] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [codiGrup, setCodiGrup] = useState('');
  const [codiCompteC, setCodiCompteC] = useState('');
  const [codiCompteD, setCodiCompteD] = useState('100');
  const [prE, setPrE] = useState(localStorage.getItem('CcomptesG'));
  const [prC, setPrC] = useState(localStorage.getItem('CcomptesC'));

  const [nomGrup, setNomGrup] = useState('');
  const [nomCompteC, setNomCompteC] = useState('');
  const [nomCompteD, setNomCompteD] = useState(''); 
  const [deureC, setDeureC] = useState('');
  const [haverC, setHaverC] = useState('');
  const [notesD, setNotesD] = useState('');
  const [tipus, setTipus] = useState('');
  const [nivell, setNivell] = useState('0');
 
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
  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  const [empresa, setEmpresa] = useState(localStorage.getItem('Empresa'));
  //const [text2, setText2] = useState(localStorage.getItem('Proces052') || '');
  const [administrador, setAdministrador]
                          = useState(localStorage.getItem('AdminFam') || ''); 

  const [logoR, setLogoR] = useState('');

   useEffect(() => {
     //console.log('pre ---',prE)
      if (prE === '*' || prE === '') {return}
      setCodiGrup(prE);
      const grupTrobat = grupC.find(
        (item) => item.G01 === prE
    );
    if (grupTrobat) {
        setNomGrup(grupTrobat.G02);
        setTipus(grupTrobat.G03);
    } else {
     }
    // console.log('pre ---',prE)
    }, [prE,grupC]);
    
    useEffect(() => {
   //   console.log('prC ---',prC)
      if (prC === '*' || prC === '') {return}
       if (prC === '*' || prC === '') {return};
      const [prG2,prC2] = (prC || '').split('.');
     // const prG2 = '';
     // const prC2 = '';
     setCodiCompteC(prC2);
      const grupTrobat2 = compteC.find(
        (item) => item.C01 === prC2    && item.C03 === codiGrup
    );
    if (grupTrobat2) {
        setNomCompteC(grupTrobat2.C02); 
        setDeureC(grupTrobat2.C51);       
        setHaverC(grupTrobat2.C52); 
    } 
    }, [prC,compteC,codiGrup]);
  
    useEffect(() => {
      if (codiGrup === '') {
        setNivell('0')
      } else {
          if (codiCompteC === '') {
            setNivell('1')           
          } else {
            setNivell('2')
          }
        }
    }, [codiGrup,codiCompteC]);
   
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
        localStorage.setItem('CcomptesG', '');     
        localStorage.setItem('CcomptesC', '');   
       navigate('/CMenu_Inici');
  } 
  function Consulta() {     
       navigate('/CconsultaCB');
  }  
  function GrupG() {
       let cdg = codiGrup;
       if (codiGrup  === '') { cdg = '*'} 
       localStorage.setItem('CcomptesG', cdg);   
       navigate('/CcomptesG');
  }  
  function ComptesG() { 
       let cdg2 = codiCompteC;
       if (!codiCompteC) {cdg2 = '*'}

     
       //console.log('codiGrup i codiCompteC - ',codiGrup, ' - ', cdg2 )
       localStorage.setItem('CcomptesG', codiGrup); 
       localStorage.setItem('CcomptesC',cdg2);     
       navigate('/CcomptesC');    
  }   
  const BuscarGrup = (valor) => {
    const codi = valor.toUpperCase();
    setCodiGrup(codi);
    setCodiCompteC('');
    setCodiCompteD('100');
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
        setCodiCompteD('100');
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
            setCodiCompteD('100');
            setNomCompteC('');
            setNomCompteD('');
            setNotesD('');
            setDeureC('');       
           setHaverC(''); 
         }
         const grupTrobat2 = compteD.find(
            (item2) => item2.D01 === codi && item2.D04 === codi
                                    && item2.D03 === codiGrup
         );

         if (grupTrobat2) {
             setNomCompteD(grupTrobat2.D02);  
            setNotesD(grupTrobat2.D05);   
            //console.log('nom D --- ',grupTrobat2.D02);  
          } 
   
    };
  const BuscarCompteD = (valor) => {
    const codi = valor.toUpperCase();
    setCodiCompteD(codi);
    const grupTrobat = compteD.find(
        (item) => item.D01 === codi && item.D04 === codiCompteC
                                    && item.D03 === codiGrup                                   
    );

    if (grupTrobat) {
        setNomCompteD(grupTrobat.D02);  
        setNotesD(grupTrobat.D05);     
   
    } else {
        setNomCompteD('');
        setNotesD('');
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
        try { 
          const linksCollection = collection(db, 'CompteD');
          const q = query(
               linksCollection,
               where("D00", "==", empresa)
           );       
          const querySnapshot = await getDocs(q);
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
                  style={{ fontSize: "0.60rem" }}
              >
                Grup  
             </Form.Label>  
          
              <Form.Select 
                    type="text" 
                    value={codiGrup}              
                    onChange={(e) => BuscarGrup(e.target.value)}
                    className="py-1 rounded-3 fw-bold"
                    style={{
                     width: "75px",
                    fontSize: "0.9rem"
                    }}
                    required>   
                      <option value="">Sel.</option>       
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
                      width: "200px",
                      fontSize: "0.80rem",
                      backgroundColor: "#e7dfbb",
                       border: "1px solid #b6c2d1",
                     color: "#535533"
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
                           readOnly
                          className="py-2 rounded-3 text-center fw-bold"
                          style={{
                               width: "48px",
                               fontSize: "0.80rem",
                               backgroundColor: "#e7dfbb",
                               border: "1px solid #b6c2d1",
                               color: "#334155"
                          }}
               />          
              </OverlayTrigger>                       
                        <Button className="mb-1" 
                          variant="primary"
                          size='sm'                      
                          onClick={GrupG}>                             
                           Mod.
                       </Button>               
              
             </div>   
          </Form.Group>
         </Form>      
   {/*    COMPTEC **************************** */} 
   
       {(nivell === '1' || nivell === '2') && (
        <Form onSubmit={(e) => e.preventDefault()}>
         <Form.Group className="mb-4">     
   
          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.60rem" }}
                 >
                cte..
            </Form.Label>
           <Form.Select
              value={codiCompteC || ""}
              onChange={(e) => BuscarCompteC(e.target.value)}
              className="py-1 rounded-3 fw-bold"
              style={{
                width: "75px",
                fontSize: "0.9rem"
              }}
              required
              >
              <option value="">Sel.</option>
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
                     width: "200px",
                      fontSize: "0.80rem",
                      backgroundColor: "#aef2c6",
                       border: "1px solid #b6c2d1",
                     color: "#334155"
                      }}
            />  
        
             
              <OverlayTrigger
              trigger={['hover', 'focus']}
               placement="right"
                overlay={ajudaD}
            >          
              <Form.Control
                 type="text"
                 value={deureC}
                 readOnly
                 className="py-2 rounded-3 fw-bold"
                  style={{
                     width: "48px",
                      fontSize: "0.80rem",
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
                 value={haverC}
                 readOnly
                 className="py-2 rounded-3 fw-bold"
                  style={{
                     width: "48px",
                      fontSize: "0.80rem",
                      backgroundColor: "#aef2c6",
                       border: "1px solid #b6c2d1",
                     color: "#334155"
                      }}
            />     
               </OverlayTrigger>            
                   <Button className="mb-1" 
                          variant="primary"
                          size='sm'                      
                          onClick={ComptesG}>                             
                        Mod. 
                   </Button>
        </div>
       </Form.Group>     
      </Form>
      )}
    {/*    COMPTED **************************** */} 
     {( nivell === '2') && (
    <Form onSubmit={(e) => e.preventDefault()}>
    <Form.Group className="mb-4">    
        <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.60rem" }}
            >
                Det.
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
                width: "200px",
                fontSize: "0.80rem",
                 backgroundColor: "#d1fae5",
                border: "1px solid #b6c2d1",
                color: "#334155"
            }}
            required
          />
             </div>     
       
      <div className="d-flex justify-content-center mt-3">
  <Form.Control
    as="textarea"
    rows={4}
    value={notesD}
    placeholder="Notes"
    onChange={(e) => {
      const valor = e.target.value;
      setNotesD(valor);
    }}
    className="py-2 rounded-3 fw-bold"
   style={{
  width: "300px",
  height: "120px",
  fontSize: "0.8rem",
  backgroundColor: "#d1fae5",
  border: "1px solid #b6c2d1",
  color: "#334155",
  resize: "none",
  overflowY: "auto",
  textAlign: "left"
}}

    required
  />
</div>
       <div className="d-flex justify-content-center mt-3">
         <div className="px-4 py-2 rounded-2 shadow-sm text-center"
          style={{
            backgroundColor: "#eef2f7",
            border: "1px solid #cbd5e1",
            color: "#1e293b",
            fontSize: "0.8rem",
            fontWeight: "600",
            minWidth: "300px",
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
     )}
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
                                    
       </div>               
      </div>     
  );
}
export default Ccomptes;
