import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Navbar, InputGroup, Container, Row, Col,Nav, Card, Form, Button } from "react-bootstrap";
import { storageCar, db } from '../firebaseLoc.js';
import { doc, setDoc, getDoc, query, where, getDocs, writeBatch, collection } from 'firebase/firestore';
import "./Cmovs.css";
import Benrera from '../CCGlobal/Benrera.js';
function CPresG() {
  const navigate=useNavigate();  
  const [grupC, setGrupC] = useState([]); 
  const [compteC, setCompteC] = useState([]); 
   
//   *** codis per gravar a MovsC ****************
  const [xP00, setXP00] = useState(localStorage.getItem('Empresa')); // empresa ##
  const [xP01, setXP01] = useState(2000);  // any
  const [xP02, setXP02] = useState('');  // compta G                 ##
  const [xP03, setXP03] = useState('');  // concepte                  ##
 
  const [xP11, setXP11] = useState(0);  //  mes 1                     ##
  const [xP12, setXP12] = useState((0));  //  mes 2                     ##
  const [xP13, setXP13] = useState((0));  //  mes 3                     ##
  const [xP14, setXP14] = useState((0));  //  mes 4                     ##
  const [xP15, setXP15] = useState((0));  //  mes 5                     ##
  const [xP16, setXP16] = useState((0));  //  mes 6                     ##
  const [xP17, setXP17] = useState((0));  //  mes 7                     ##
  const [xP18, setXP18] = useState((0));  //  mes 8                     ##
  const [xP19, setXP19] = useState((0));  //  mes 9                     ##
  const [xP20, setXP20] = useState((0));  //  mes 10                    ##
  const [xP21, setXP21] = useState((0));  //  mes 11                    ##
  const [xP22, setXP22] = useState((0));  //  mes 12                    ##
  const [xP99, setXP99] = useState((0));  //  totAl   
 
  const [xP25, setXP25] = useState(localStorage.getItem('NomJ')); // nom usuari  ##
  const [xP26, setXP26] = useState('');  // data : dia dd/mm/yyyy a les hh:mm per usuar1
  const [nomOrigen, setNomOrigen] = useState('');
  const [nomDesti, setNomDesti] = useState('');
  // ******************************* 

  const [saldo1, setSaldo1] = useState(0);
  const [saldo2, setSaldo2] = useState(0);

  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  //const [text2, setText2] = useState(localStorage.getItem('Proces052') || '');
  const [periode,setPeriode] = useState(localStorage.getItem('Percon'));
 
 useEffect(() => {
  if (periode) {
    const [anyx, mesx] = periode.split("/");
    setXP01(anyx);
  }
}, [periode]);
useEffect(() => {
  
  setXP99(
    Number(xP11) +
    Number(xP12) +
    Number(xP13) +
    Number(xP14) +
    Number(xP15) +
    Number(xP16) +
    Number(xP17) +
    Number(xP18) +
    Number(xP19) +
    Number(xP20) +
    Number(xP21) +
    Number(xP22)
  );
}, [xP11, xP12, xP13, xP14, xP15, xP16, xP17, xP18, xP19, xP20, xP21, xP22]);
 
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
     
        }
      };
      fetchData1();
    }, [compteC]);
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
          const filteredData = linksData
            .filter((item) => item.C00 === xP00)
            .map((item) => {
             const grupTrobat = grupC.find(
              (g) => (g.G01) === (item.C03)
             );
            return {
              ...item,
              G02:(grupTrobat?.G02 || ''),
              G03:(grupTrobat?.G03 || ''),
              };
          });
          setCompteC(filteredData);
        } catch (error) {
          console.error('Error llegint CompteC: ', error);
        } finally {
          
        }
      };
      fetchData2();
    }, [grupC]);
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
          const filteredData = linksData
            .filter((item) => item.C00 === xP00)
            .map((item) => {
             const grupTrobat = grupC.find(
              (g) => (g.G01) === (item.C03)
             );
            return {
              ...item,
              G02:(grupTrobat?.G02 || ''),
              G03:(grupTrobat?.G03 || ''),
              };
          });
          setCompteC(filteredData);
        } catch (error) {
          console.error('Error llegint CompteC: ', error);
        } finally {
       
        }
      };
      fetchData2();
    }, [grupC]);
 
  useEffect(() => {
      const Csaldos = async () => {
      //  console.log('useeffect ... ')
      try {
        const q = query(
            collection(db, "MovsG"),
            where("M00", "==", xP00)
        );
         const querySnapshot = await getDocs(q);
         let saldox = 0;
         querySnapshot.forEach((docSnap) => {
         const data = docSnap.data();
          if (data.M07 === periode) {
            return; // passa al següent document
          } 
          const importMov = Number(data.M04) || 0;
          const [c1, c2,c3] = data.M02.split(".");
         // El compte és al DEURE
         if (`${c1}.${c2}` === xP02) {
            saldox += importMov;
         }
           const [c4, c5,c6] = data.M03.split(".");
         // El compte és a l'HAVER
          if (`${c4}.${c5}` === xP02) {
                 saldox -= importMov;
          }
          const [anyy, mesy] = periode.split("/");
         let mesos = 0;
         if (mesy <= 1) { mesos = 1}
         else {mesos = mesy - 1;}

          let sm = Math.round(saldox / mesos);
          setSaldo1(saldox)
          setSaldo2(sm);
      });
      return;
      } catch (error) {
        console.error("Error calculant saldo:", error);
      return 0;
      }}
      Csaldos();
   }, [xP00,xP02]); 
  function Sacabat() {     
       navigate('/CMenu');
  } 
   function actuali() {     
     
      setXP11((Math.round(saldo2)));
      setXP12((Math.round(saldo2)));
      setXP13((Math.round(saldo2)));
      setXP14((Math.round(saldo2)));
      setXP15((Math.round(saldo2)));
      setXP16((Math.round(saldo2)));
      setXP17((Math.round(saldo2)));
      setXP18((Math.round(saldo2)));
      setXP19((Math.round(saldo2)));
      setXP20((Math.round(saldo2)));
      setXP21((Math.round(saldo2)));
      setXP22((Math.round(saldo2)));

 } 
  function Consulta() {     
       navigate('/CPresB');
  } 
 
  async function Validar()  {
     const MovCollection = collection(db, 'PresG');
     const batch = writeBatch(db);
      const dataM = new Date();
     const xP60 =  `dia - ${dataM.getDate()}/${dataM.getMonth()+1}
                          /${dataM.getFullYear()}a les :
                           ${dataM.getHours()}:${dataM.getMinutes()}
                            per : ${nomJ}`;
     const newDocRef = doc(MovCollection, `${xP00}_${xP01}_${xP02}`);
     await batch.set(newDocRef, {
                P00:     xP00,
                P01:     xP01,  
                P02:     xP02,               
                P03:     xP60,                
                P11: Math.round(Number(xP11)), 
                P12: Math.round(Number(xP12)),
                P13: Math.round(Number(xP13)),
                P14: Math.round(Number(xP14)),
                P15: Math.round(Number(xP15)),
                P16: Math.round(Number(xP16)),
                P17: Math.round(Number(xP17)),
                P18: Math.round(Number(xP18)),
                P19: Math.round(Number(xP19)),
                P20: Math.round(Number(xP20)),
                P21: Math.round(Number(xP21)),
                P22: Math.round(Number(xP22))
             
      });
      batch.commit(); 
      setXP02('');
      setXP03('');
      setXP11(0);
      setXP12(0);
      setXP13(0);
      setXP14(0);
      setXP15(0);
      setXP16(0);
      setXP17(0);
      setXP18(0);
      setXP19(0);
      setXP20(0);
      setXP21(0);
      setXP22(0);
     
     
      setNomOrigen(''); 
      setSaldo1(0);
      setSaldo2(0);
    };   
 
 const BuscarOrigen = (valor) => {
     setXP02(valor); 
     //console.log(valor);
     const [grup, compte] = (valor).split(".");
     const registre = compteC.find(
          item => item.C00 === xP00
               && item.C03 === grup
               && item.C01 === compte
       );  
     // console.log('origen ----------',valor, ' - ', registre.G02, '.',registre.C02);
      if (registre) {
         setNomOrigen(`${registre.G02} / ${registre.C02}`);
      } 
      let item = `${xP00}_${xP01}_${valor}`;
     llegirItem(item);
  };
  async function llegirItem(item) {
  const docRef = doc(db, "PresG", item);
  const docSnap = await getDoc(docRef);
 // console.log('item---',item)
  if (docSnap.exists()) {
      const dades = docSnap.data();
    // console.log(dades.P02);
      setXP11(dades.P11);
      setXP12(dades.P12);   
      setXP13(dades.P13);
      setXP14(dades.P14);
      setXP15(dades.P15);
      setXP16(dades.P16);
      setXP17(dades.P17);
      setXP18(dades.P18);
      setXP19(dades.P19);
      setXP20(dades.P20);
      setXP21(dades.P21);
      setXP22(dades.P22);  
  } else {
      setXP11(0);
      setXP12(0);
      setXP13(0);
      setXP14(0);
      setXP15(0);
      setXP16(0);
      setXP17(0);
      setXP18(0);
      setXP19(0);
      setXP20(0);
      setXP21(0);
      setXP22(0);
  }
}
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
           Entrada <span style={{ color: "#0d6efd" }}> Pressupost</span>
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
            Usuari: <strong>{xP25}</strong>
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
            <strong>{xP00}</strong>
        </div>
      </div>
      </Card.Header>
      <div style={{ textAlign: "center" }}>
    
    </div>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  
    <Row className="justify-content-center">
       <Col lg={4} xl={6}>
          <Card className="shadow border-0 rounded-4">
            <Card.Body className="p-5"> 
              <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Group className="mb-4">
                   <div className="d-flex align-items-center gap-3 mb-3">
                    <Form.Label
                      className="fw-bold mb-0"
                      style=
                       {{ fontSize: "0.80rem" }}
                    >
                      Any 
                    </Form.Label> 
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control
                         type="text"
                         value={xP01}
                         onChange={(e) => setXP01(e.target.value)}
                         className="py-2 rounded-3 fw-bold"
                        style={{
                        width: "75px",
                        fontSize: "0.95rem",
                        backgroundColor: "#d1fae5",
                        border: "1px solid #b6c2d1",
                        color: "#334155"
                        }}
                        placeholder=".."
                    />
                  </div>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Form.Label
                      className="fw-bold mb-0"
                      style=
                       {{ fontSize: "0.80rem" }}
                    >
                      Compte 
                    </Form.Label> 
             <Form.Select
                value={xP02}
                 onChange={(e) => BuscarOrigen(e.target.value)}
                  className="fw-bold shadow-sm"
                   style={{
                      width: "105px",
                     fontSize: "1rem",
                      border: "2px solid #2563eb",
                      backgroundColor: "#eff6ff",
                       color: "#1e293b",
                      borderRadius: "10px"
                    }}
             required>
              <option value="">📋 Selecciona un compte...</option>
               {compteC?.filter(item => ["D","I"].includes(item.G03))    
                 .map((item) => (
             <option
            key={item.id}
            value={`${item.C03}.${item.C01}`}        >
            {item.C03}.{item.C01} / {item.G02} - {item.C02}
           </option>
          ))}
      </Form.Select>
          <Form.Control
             type="text"
             value={nomOrigen}
            
             className=" rounded-3 fw-bold"
             style={{
                    width: "300px",
                    fontSize: "0.95rem",
                    backgroundColor: "#d1fae5",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
              }}
           />
              </div>
                  <div className="d-flex align-items-center gap-3 mb-3">
                   &nbsp;&nbsp;&nbsp;&nbsp;
                        
          <Form.Control
             type="text"
             value={`total any : ${saldo1}€`}
            
             className="py-2 rounded-3 fw-bold"
             style={{
                    width: "170px",
                    fontSize: "0.95rem",
                    backgroundColor: "#d1fae5",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
              }}
           />
          <InputGroup style={{ width: "250px" }}>
             <InputGroup.Text
                style={{
                backgroundColor: "#d1fae5",
               border: "1px solid #b6c2d1",
                 color: "#334155",
                fontWeight: "bold",
                 }}
             >
                 Prom. mes:
             </InputGroup.Text>
            <Form.Control
               type="number"
               value={saldo2}
               onChange={(e) => setSaldo2(e.target.value)}
               style={{
                       backgroundColor: "#d1fae5",
                        border: "1px solid #b6c2d1",
                       color: "#334155",
                       fontWeight: "bold",
                      flex: "0 0 80px",   // amplada fixa
                      textAlign: "right",
                }}
              />
              <InputGroup.Text
              style={{
                 backgroundColor: "#d1fae5",
                  border: "1px solid #b6c2d1",
                 color: "#334155",
                  fontWeight: "bold",
                  paddingLeft: "4px",
                  paddingRight: "8px",
                }}
               >
                 €
              </InputGroup.Text>
          </InputGroup>
        <Button className="mb-2" 
                          variant="primary"
                          size='sm'
                          onClick={actuali}>                                      
                          <i className="fas fa-sign-out-alt"></i>Actualitzar messos
          </Button>
               
         </div> 
     {/*  ************************* 12 mesos *************************** */}
            <br></br>
                 <div className="d-flex align-items-center gap-3 mb-3">
                    <Form.Label
                      className="fw-bold mb-0"
                      style=
                       {{ fontSize: "0.80rem",
                            textAlign: "right",
                          width: "70px",
                        }}
                    >
                      Gener... 
                    </Form.Label> 
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control
                       type="number"                   
                       value={xP11}
                       onFocus={(e) => e.target.select()}                     
                       onChange={(e) => setXP11(e.target.value)}
                        onBlur={() => {
                          const n = Number(xP11);
                          setXP11(isNaN(n) ? "0" : String(Math.round(n)));
                        }}
                       className="py-2 rounded-3 fw-bold no-spinner"
                       style={{
                        width: "80px",
                        fontSize: "0.95rem",
                        backgroundColor: "#dbe4f0",
                        border: "1px solid #b6c2d1",
                        color: "#334155",
                        textAlign: "right"
                       }}
                    />
                   <Form.Label
                      className="fw-bold mb-0"
                        style=
                       {{ fontSize: "0.80rem",
                            textAlign: "right",
                          width: "70px",
                        }}
                    >
                     Febrer..
                    </Form.Label> 
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control
                       type="number"
                       value={xP12}
                       onFocus={(e) => e.target.select()}
                       onChange={(e) => setXP12(e.target.value)}
                          onBlur={() => {
                          const n = Number(xP12);
                          setXP12(isNaN(n) ? "0" : String(Math.round(n)));
                        }}
                       className="py-2 rounded-3 fw-bold no-spinner"
                       style={{
                        width: "80px",
                        fontSize: "0.95rem",
                        backgroundColor: "#dbe4f0",
                        border: "1px solid #b6c2d1",
                        color: "#334155",
                        textAlign: "right"
                       }}
                    />
                 </div>
                         <div className="d-flex align-items-center gap-3 mb-3">
                    <Form.Label
                      className="fw-bold mb-0"
                         style=
                       {{ fontSize: "0.80rem",
                           textAlign: "right",
                          width: "70px",
                        }}
                    >
                      Març....
                    </Form.Label> 
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control
                       type="number"
                      
                       value={xP13}
                       onFocus={(e) => e.target.select()}
                       onChange={(e) => setXP13(e.target.value)}
                           onBlur={() => {
                          const n = Number(xP13);
                          setXP13(isNaN(n) ? "0" : String(Math.round(n)));
                        }}
                       className="py-2 rounded-3 fw-bold no-spinner"
                       style={{
                        width: "80px",
                        fontSize: "0.95rem",
                        backgroundColor: "#dbe4f0",
                        border: "1px solid #b6c2d1",
                        color: "#334155",
                        textAlign: "right"
                       }}
                    />
                            
                    <Form.Label
                      className="fw-bold mb-0"
                      style=
                       {{ fontSize: "0.80rem",
                            textAlign: "right",
                          width: "70px",
                        }}
                    >
                      Abril... 
                    </Form.Label> 
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control
                       type="number"
                      
                       value={xP14}
                       onFocus={(e) => e.target.select()}
                       onChange={(e) => setXP14(e.target.value)}
                           onBlur={() => {
                          const n = Number(xP14);
                          setXP14(isNaN(n) ? "0" : String(Math.round(n)));
                        }}
                       className="py-2 rounded-3 fw-bold no-spinner"
                       style={{
                        width: "80px",
                        fontSize: "0.95rem",
                        backgroundColor: "#dbe4f0",
                        border: "1px solid #b6c2d1",
                        color: "#334155",
                        textAlign: "right"
                       }}
                    />
                    
                 </div>
                         <div className="d-flex align-items-center gap-3 mb-3">
                    <Form.Label
                      className="fw-bold mb-0"
                        style=
                       {{ fontSize: "0.80rem",
                            textAlign: "right",
                          width: "70px",
                        }}
                    >
                      Maig....
                    </Form.Label> 
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control
                       type="number"
                      
                       value={xP15}
                       onFocus={(e) => e.target.select()}
                       onChange={(e) => setXP15(e.target.value)}
                           onBlur={() => {
                          const n = Number(xP15);
                          setXP15(isNaN(n) ? "0" : String(Math.round(n)));
                        }}
                       className="py-2 rounded-3 fw-bold no-spinner"
                       style={{
                        width: "80px",
                        fontSize: "0.95rem",
                        backgroundColor: "#dbe4f0",
                        border: "1px solid #b6c2d1",
                        color: "#334155",
                        textAlign: "right"
                       }}
                    />
                
                    <Form.Label
                      className="fw-bold mb-0"
                         style=
                       {{ fontSize: "0.80rem",
                           textAlign: "right",
                          width: "70px",
                        }}
                    >
                      Juny....
                    </Form.Label> 
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control
                       type="number"
                  
                       value={xP16}
                       onFocus={(e) => e.target.select()}
                       onChange={(e) => setXP16(e.target.value)}
                           onBlur={() => {
                          const n = Number(xP16);
                          setXP16(isNaN(n) ? "0" : String(Math.round(n)));
                        }}
                       className="py-2 rounded-3 fw-bold no-spinner"
                       style={{
                        width: "80px",
                        fontSize: "0.95rem",
                        backgroundColor: "#dbe4f0",
                        border: "1px solid #b6c2d1",
                        color: "#334155",
                        textAlign: "right"
                       }}
                    />
                    
                  </div>
                         <div className="d-flex align-items-center gap-3 mb-3">
                    <Form.Label
                      className="fw-bold mb-0"
                      style=
                       {{ fontSize: "0.80rem",
                            textAlign: "right",
                          width: "70px",
                        }}
                    >
                      Juliol..
                    </Form.Label> 
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control
                       type="number"
                      
                       value={xP17}
                       onFocus={(e) => e.target.select()}
                       onChange={(e) => setXP17(e.target.value)}
                           onBlur={() => {
                          const n = Number(xP17);
                          setXP17(isNaN(n) ? "0" : String(Math.round(n)));
                        }}
                       className="py-2 rounded-3 fw-bold no-spinner"
                       style={{
                        width: "80px",
                        fontSize: "0.95rem",
                        backgroundColor: "#dbe4f0",
                        border: "1px solid #b6c2d1",
                        color: "#334155",
                        textAlign: "right"
                       }}
                    />
                    
                
                    <Form.Label
                      className="fw-bold mb-0"
                        style=
                       {{ fontSize: "0.80rem",
                            textAlign: "right",
                          width: "70px",
                        }}
                    >
                      Agost...
                    </Form.Label> 
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control
                       type="number"
                     
                       value={xP18}
                       onFocus={(e) => e.target.select()}
                       onChange={(e) => setXP18(e.target.value)}
                           onBlur={() => {
                          const n = Number(xP18);
                          setXP18(isNaN(n) ? "0" : String(Math.round(n)));
                        }}
                       className="py-2 rounded-3 fw-bold no-spinner"
                       style={{
                        width: "80px",
                        fontSize: "0.95rem",
                        backgroundColor: "#dbe4f0",
                        border: "1px solid #b6c2d1",
                        color: "#334155",
                        textAlign: "right"
                       }}
                    />
                 </div>
                         <div className="d-flex align-items-center gap-3 mb-3">
                    <Form.Label
                      className="fw-bold mb-0"
                         style=
                       {{ fontSize: "0.80rem",
                           textAlign: "right",
                          width: "70px",
                        }}
                    >
                      Setembre
                    </Form.Label> 
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control
                       type="number"
                    
                       value={xP19}
                       onFocus={(e) => e.target.select()}
                       onChange={(e) => setXP19(e.target.value)}
                           onBlur={() => {
                          const n = Number(xP19);
                          setXP19(isNaN(n) ? "0" : String(Math.round(n)));
                        }}
                       className="py-2 rounded-3 fw-bold no-spinner"
                       style={{
                        width: "80px",
                        fontSize: "0.95rem",
                        backgroundColor: "#dbe4f0",
                        border: "1px solid #b6c2d1",
                        color: "#334155",
                        textAlign: "right"
                       }}
                    />
                    
              
                    <Form.Label
                      className="fw-bold mb-0"
                      style=
                       {{ fontSize: "0.80rem",
                            textAlign: "right",
                          width: "70px",
                        }}
                    >
                      Octubre.
                    </Form.Label> 
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control
                       type="number"
                    
                       value={xP20}
                       onFocus={(e) => e.target.select()}
                       onChange={(e) => setXP20(e.target.value)}
                           onBlur={() => {
                          const n = Number(xP20);
                          setXP20(isNaN(n) ? "0" : String(Math.round(n)));
                        }}
                       className="py-2 rounded-3 fw-bold no-spinner"
                       style={{
                        width: "80px",
                        fontSize: "0.95rem",
                        backgroundColor: "#dbe4f0",
                        border: "1px solid #b6c2d1",
                        color: "#334155",
                        textAlign: "right"
                       }}
                    />
                     </div>
                         <div className="d-flex align-items-center gap-3 mb-3">
                
                    <Form.Label
                      className="fw-bold mb-0"
                        style=
                       {{ fontSize: "0.80rem",
                            textAlign: "right",
                          width: "70px",
                        }}
                    >
                      Novembre
                    </Form.Label> 
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control
                       type="number"
                      
                       value={xP21}
                       onFocus={(e) => e.target.select()}
                       onChange={(e) => setXP21(e.target.value)}
                           onBlur={() => {
                          const n = Number(xP21);
                          setXP21(isNaN(n) ? "0" : String(Math.round(n)));
                        }}
                       className="py-2 rounded-3 fw-bold no-spinner"
                       style={{
                        width: "80px",
                        fontSize: "0.95rem",
                        backgroundColor: "#dbe4f0",
                        border: "1px solid #b6c2d1",
                        color: "#334155",
                        textAlign: "right"
                       }}
                    />
                
                    <Form.Label
                      className="fw-bold mb-0"
                         style=
                       {{ fontSize: "0.80rem",
                           textAlign: "right",
                          width: "70px",
                        }}
                    >
                      Desembre
                    </Form.Label> 
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control
                       type="number"
                     
                       value={xP22}
                       onFocus={(e) => e.target.select()}
                       onChange={(e) => setXP22(e.target.value)}
                           onBlur={() => {
                          const n = Number(xP22);
                          setXP22(isNaN(n) ? "0" : String(Math.round(n)));
                        }}
                       className="py-2 rounded-3 fw-bold no-spinner"
                       style={{
                        width: "80px",
                        fontSize: "0.95rem",
                        backgroundColor: "#dbe4f0",
                        border: "1px solid #b6c2d1",
                        color: "#334155",
                        textAlign: "right"
                       }}
                    />
                    
                  </div>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Form.Label
                      className="fw-bold mb-0"
                      style=
                       {{ fontSize: "0.80rem",
                            textAlign: "right",
                          width: "70px",
                        }}
                    >
                      TOTAL 
                    </Form.Label> 
                        &nbsp;&nbsp;&nbsp;&nbsp;
                    <Form.Control
                       type="number"
                       min="0"
                       value={xP99}
                       onFocus={(e) => e.target.select()}
                       className="py-2 rounded-3 fw-bold no-spinner"
                       style={{
                        width: "80px",
                        fontSize: "0.95rem",
                        backgroundColor: "#dbe4f0",
                        border: "1px solid #b6c2d1",
                        color: "#334155",
                        textAlign: "right"
                       }}
                    />
                 </div>
  
      </Form.Group>
   
     </Form>    
   </Card.Body>   
   </Card>   
  </Col>
  </Row>
  <div className="d-flex justify-content-center mt-3">
                      <Button className="mb-2" 
                          variant="warning"
                          size='sm'
                          onClick={Sacabat}>                                      
                          <i className="fas fa-sign-out-alt"></i>  Enrera (sortir)
                      </Button>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      
                      <Button className="mb-2" 
                          variant="primary"
                          size='sm'                      
                          onClick={Validar}>                             
                     <i className="fas fa-sign-out-alt"></i>Gravar
                      </Button>                                              
                                      
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button className="mb-2" 
                               variant="primary"
                               size='sm'                      
                               onClick={Consulta}>                             
                            <i className="fas fa-sign-out-alt"></i>Consulta pressupost
                      </Button> 
                   </div>               
      </div>     
  );
}
export default CPresG;
