// -------  Versió   per base de dades SANTVIFLIX -----------------
import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col, Card} from "react-bootstrap";
import "./CPermisos.css";
import { ref as refCar, listAll, getDownloadURL, uploadBytesResumable } from 'firebase/storage'; 
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {storageCar, db } from '../firebaseLoc'; 
import { doc, updateDoc, 
          getDoc, setDoc,
          getDocs, collection, 
          query, orderBy, 
          limit  } from 'firebase/firestore'; 
import { deleteObject } from 'firebase/storage'; 
import { useNavigate } from 'react-router-dom';
import Benrera from './Benrera.js';
 
export default function JMAltaKey() {
  const navigate=useNavigate();
  const [data, setData] = useState([]);   
  const [alta, setAlta] = useState(false);
  const [modificacio, setModificacio] = useState(false); 
  const [xclase, setXclase] = useState('');
  const [mcodi, setMcodi] = useState(0);
  const [inip, setInip] = useState(false);
  const [xcodi, setXcodi] = useState(0);
  const [xmail, setXmail] = useState('');
  const [vmail, setVmail] = useState('');
  const [xnotes, setXnotes] = useState('');   
  const [xempresa, setXempresa] = useState('MA');    
  
  const [xpassword, setXpassword] = useState('');
  const [valida, setValida] = useState('false');

  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  const [empresa, setEmpresa] = useState(localStorage.getItem('Empresa'));
  const [administrador, setAdministrador]
                            = useState(localStorage.getItem('AdminFam') || ''); 
  const [nivell, setNivell]
                            = useState(localStorage.getItem('Nivell') || '5');   
    
  const canviClase = (event) => {
    setXclase(event.target.value); 
  }; 
  const canviEmpresa = (event) => {
    if ((nivell === '2' )  && (event.target.value !== empresa)) {
       alert('Canvi de empresa No autoritzat ')
        return;
    }
    setXempresa(event.target.value); 
    
   };
  
  const canviClau = (e) => {
  const checked = e.target.checked;
  setInip(checked);
  }; 
    
  const modiDoc = async () => {
    if (alta) {
      altaDoc();
      setModificacio(false);
      return;
    }
    const docRef = doc(db, 'Claus', 'Claus_'+ xcodi); 
    if (xcodi === null || xcodi === undefined) {setXcodi('.')} 
    if (xclase === null || xclase === undefined) {setXclase('.')} 
    if (xnotes === null || xnotes === undefined) {setXnotes('.')} 
    if (xempresa === null || xempresa === undefined) {setXempresa(empresa)} 
    let passw = xpassword;
    if(inip) {passw=''};
        try {
          await updateDoc(docRef, {
            codi : xcodi,
            clase: xclase,
            notes: xnotes,         
            empresa: xempresa,
            password: passw
              
          });             
          setModificacio(false);
          console.log('actualització  correcta.');
        } catch (error) {
          console.error('Error en actualització: ', error);
        }   
  };
  const altaDoc = async () => {
    if (xclase === '') {
      return;
    }
    const docRef = doc(db, 'Claus', 'Claus_' + xcodi);
    try {
    // Verificar si el document ja existeix
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      console.error('El document ja existeix.');
      return;
    }
    await setDoc(docRef, {
      clase:    xclase,
      codi:     xcodi,  
      mail:     xmail,               
      notes:    xnotes,     
      empresa:  xempresa,
      password: xpassword     
    });
    setAlta(false);
    console.log('Document creat correctament.'+ xcodi);
    setXcodi(xcodi+1);
    setMcodi(xcodi+1);
    } catch (error) {
    console.error('Error en crear el document:', error);
    }
  };
  function Sacabat() {    
    localStorage.setItem('Programa', '/Cinici');
    localStorage.setItem('IniciJMP', 'No');
    navigate('/Cinici');
  } 
  const checkIfmailexist = (vmail) => {
    return data.some(item => item.mail === vmail);
  };
  const Verimail = (event) => {
    setVmail(event.target.value); 
  };
  const Validar = () => {
    //console.log('mail rebut - '+ vmail )
    if (vmail === '') {
       return;
    }
    const mailExists = checkIfmailexist(vmail);
    if (mailExists) {
      const userData = data.find(item => item.mail === vmail);
      if (userData) {
          const user = {
            xmail: userData.mail,
            xcodi: userData.codi,
            xnotes: userData.notes,             
            xclase: userData.clase,
            xempresa: userData.empresa,
            xpassword: userData.password
           
          };
          if ((nivell === '2' )  && (user.xempresa !== empresa)) {
             alert('No tens permisos per modificar aquest usuari');
             return;
          }
          console.log('Usuari trobat - ' + user.xpassword + ' - ' + 
                      user.xclase + '  - ' + user.xnotes);        
          setXmail(user.xmail);
          setXcodi(user.xcodi);
          setXclase(user.xclase);
          setXnotes(user.xnotes);
          setXempresa(user.xempresa);
          setXpassword(user.xpassword);
          setModificacio(true);   
          setValida(false); 
          setAlta(false);  
         
      } else {        
           setXcodi(mcodi);
           setXclase('');
           setXnotes('5');
           setXmail(vmail);
           setXpassword('');
           setXempresa(empresa);
           setInip(true);
           setAlta(true);
          setValida(false); 
          setModificacio(true);     
          console.log(' mail no trobat 2.....' , vmail)
        //setEmailError('E-mail desconegut');
      };
    }  else {        
           setXcodi(mcodi);
           setXclase('');
           setXnotes('5');
           setXmail(vmail);
           setXpassword('');
           setXempresa(empresa);
           setInip(true);         
           setAlta(true);
           setValida(false);
           setModificacio(true);      
          console.log(' mail no trobat 1 .....' , vmail)
        //setEmailError('E-mail desconegut');
      };
  };
 
  //  **** useeffect per llegir tots els registres de claus i posar-los a data ** 
  useEffect(() => {
     const fetchData = async () => {
       const linksCollection = collection(db, 'Claus');
       try {
         const querySnapshot = await getDocs(linksCollection);
         const linksData = querySnapshot.docs.map(doc => ({
           codi: doc.data().codi,
           clase: doc.data().clase,
           mail: doc.data().mail,
           notes: doc.data().notes,
           nivell: doc.data().nivell,
           empresa: doc.data().empresa,
           password: doc.data().password,
            ...doc.data(),
         }));
         setData(linksData);
       } catch (error) {
         console.error('Error llegint Claus: ', error);
       }
     };
     fetchData();
     
  }, []);

useEffect(() => {
  const fetchAllMediaI = async () => {
    try {
      const colRef = collection(db, "Claus");
      const q = query(colRef, orderBy("codi", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      let lastC00 = 0;

      querySnapshot.forEach((doc) => {
        const codi = doc.data().codi;

        // Funciona tant si codi és number com string
        lastC00 = isNaN(Number(codi)) ? 0 : Number(codi);
      });

      const nouCodi = lastC00 + 1;

      setMcodi(nouCodi);
      console.log("Nou codi:", nouCodi);

    } catch (error) {
      console.error("Error en obtenir l'últim codi:", error);
    }
  };

  fetchAllMediaI();
}, []);
 Benrera(Sacabat); 
  return ( 
    <> 
      
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
              Gestió <span style={{ color: "#0d6efd" }}> Permisos </span>
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
               Admin: <strong>{nomJ}</strong>
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
       
     <Container fluid className="mt-5">
       <Row className="justify-content-center">
         <Col lg={4} xl={4}>
          <Card className="shadow border-0 rounded-4">
           <Card.Body className="p-5">          
             <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Group className="mb-4">
                 <Form.Label className="fw-semibold fs-5">
                          Usuari a Modificar
                 </Form.Label>               
                 <Form.Control
                                 type="email"
                                 onChange={Verimail}
                                 placeholder="Introdueix e-mail"
                                 className="py-3 fs-5 rounded-3 w-100"
                                 required>
                 </Form.Control>
                </Form.Group> 
                <Button
                                  className="mb-2"
                                  size='sm'
                                  variant="primary"           
                                  onClick={Validar}
                                >
                                 <i className="fas fa-check"></i> Validar e-mail
                </Button>                 
            </Form>
            <br></br>        
            {valida === false && (
  <div
    style={{
      border: "1px solid #e0e0e0",
      padding: "20px",
      borderRadius: "10px",
      maxWidth: "500px",
      margin: "20px auto",
      backgroundColor: "#fafafa"
    }}
  >

    {/* Nom Usuari */}
    <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
      <label style={{ minWidth: "180px", fontWeight: "600" }}>
        Nom Usuari
      </label>
      <input
        type="text"
        value={xclase}
        onChange={canviClase}
        style={{
          flex: 1,
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />
    </div>
     <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
      <label style={{ minWidth: "180px", fontWeight: "600" }}>
        Codi empresa
      </label>
      <input
        type="text"
        value={xempresa}
        onChange={canviEmpresa}
        style={{
          flex: 1,
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />
    </div>
  
   <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
  <label style={{ minWidth: "180px", fontWeight: "600" }}>
    Nivell Accés (2-5)
  </label>

  <input
    type="number"
    value={xnotes}
    onChange={(e) => {
      let value = e.target.value;

      // Evitar valors fora de rang
      if (value === "") {
        setXnotes("");
        return;
      }

      value = Math.max(2, Math.min(5, Number(value)));
      setXnotes(value);
    }}
    min="1"
    max="5"
    style={{
      flex: 2,
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #ccc"
    }}
  />
</div>
<div
  style={{
    border: "1px solid #d6e4f0",
    backgroundColor: "#f7fbff",
    borderRadius: "8px",
    padding: "12px 16px",
    width: "fit-content",
    color: "#4f545b",
    lineHeight: "1.8"
  }}
>
  <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
    Nivells d'accés
  </div>

  <div><strong>2</strong> - Administrador del seu Grup</div>
  <div><strong>3</strong> - Usuari  (consultar, apunts i modif.comptes)</div>
  <div><strong>4</strong> - Usuari bàsic (consultar i apunts)</div>
  <div><strong>5</strong> - Convidat (pot consultar)</div>
</div>

<br></br>
    {/* Password */}
       <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
      <label style={{ minWidth: "180px", fontWeight: "600" }}>
        Reinicialitzar Password
      </label>

      <input
        type="checkbox"
        checked={inip}
        onChange={canviClau}     
        style={{ transform: "scale(1.3)" }}
      />
    </div> 
    </div>
   )}
     <br></br>     
     <div className="d-flex gap-2 menys-espaiAK">
        <Button
                  className="mb-2"
                  size='sm'
                  variant="warning"           
                  onClick={Sacabat}>
                  <i className="fas fa-check"></i>        Enrere
        </Button>  
        {modificacio  && (
             <Button className="mb-2" 
                         size='sm'
                         variant='primary'                                  
                         onClick={modiDoc}>
                         <i className="fas fa-sign-out-alt"></i>Guardar Usuari
              </Button> 
         )}              
      </div>                        
     </Card.Body>
    </Card>
   </Col>
  </Row>
  </Container>
 
 </>
 );
};
   