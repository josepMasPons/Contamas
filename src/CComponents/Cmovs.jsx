import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Col,Nav, Card, Form, Button } from "react-bootstrap";
import { storageCar, db } from '../firebaseLoc.js';
import { doc, setDoc, getDoc, query, where, getDocs, writeBatch, collection } from 'firebase/firestore';
import "./Cmovs.css";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { Csaldos } from "../CCGlobal/Csaldos.js";

function Cmovs() {
  const navigate=useNavigate();

  
  const [grupC, setGrupC] = useState([]); 
  const [compteC, setCompteC] = useState([]); 
  const [compteD, setCompteD] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [codiCompteC, setCodiCompteC] = useState('');
  const [codiCompteD, setCodiCompteD] = useState('');

  const [tipusM, setTipusM] = useState("A");
  const [tipusMM, setTipusMM] = useState("Totes");
 
 const opcionsM = [
  { codi: "I", text: "Ingrés" },
  { codi: "T", text: "Traspàs" },
  { codi: "F", text: "Càrrecs/fres." }, 
  { codi: "A", text: "Totes" },
  { codi: "X", text: "Apert/Tancam." }
];
//   *** codis per gravar a MovsC ****************
  const [xM00, setXM00] = useState(localStorage.getItem('Empresa')); // empresa ##
  const [xM01, setXM01] = useState(10000);  // num. ordre
  const [xM02, setXM02] = useState('');  // compta origen                 ##
  const [xM03, setXM03] = useState('');  // compta destí                  ##
  const [xM04, setXM04] = useState(0);  // import                        ##
  const [xM05, setXM05] = useState('');  //  concepte                     ##
  const [xM06, setXM06] = useState('');  // data  dd/mm/yyyy              ##
  const [xM07, setXM07] = useState(localStorage.getItem('Percon'));  // periode   yyyy/mm             ##
  const [xM08, setXM08] = useState('');  // notes 
  const [xM09, setXM09] = useState(localStorage.getItem('NomJ')); // nom usuari  ##
  const [xM10, setXM10] = useState('');  // data : dia dd/mm/yyyy a les hh:mm per usuar1
  
  //   *** codis per gravar a MovsC ****************
  const [mM00, setMM00] = useState(localStorage.getItem('Empresa')); // empresa ##
  const [mM01, setMM01] = useState(10000);  // num. ordre
  const [mM02, setMM02] = useState('');  // compta origen                 ##
  const [mM03, setMM03] = useState('');  // compta destí                  ##
  const [mM04, setMM04] = useState(0);  // import                        ##
  const [mM05, setMM05] = useState('');  //  concepte                     ##
  const [mM06, setMM06] = useState('');  // data  dd/mm/yyyy              ##
  const [mM07, setMM07] = useState(localStorage.getItem('Percon'));  // periode   yyyy/mm             ##
  const [mM08, setMM08] = useState('');  // notes 
  const [mM09, setMM09] = useState(localStorage.getItem('NomJ')); // nom usuari  ##
  const [mM10, setMM10] = useState('');  // data : dia dd/mm/yyyy a les hh:mm per usuar1
  const [nomOrigen, setNomOrigen] = useState('');
  const [nomDesti, setNomDesti] = useState('');
  const [tipOrigen, setTipOrigen] = useState('');
  const [tipDesti, setTipDesti] = useState('');
 // ******************************* 

  const [nomCompteC, setNomCompteC] = useState('');
  const [nomCompteD, setNomCompteD] = useState('');  
  
  const [modifica, setModifica] = useState(false);
  const [tipus, setTipus] = useState('');
  const [notesD, setNotesD] = useState('');
  const [sivalidar, setSivalidar] = useState(false); 
  const [sivalidar2, setSivalidar2] = useState(false); 
  const [sivalidar3, setSivalidar3] = useState(true); 
  const [dataM, setDataM] = useState([]);
  const [sisaldoD, setSisaldoD] = useState(false);
  const [sisaldoH, setSisaldoH] = useState(false); 
  const [saldoD, setSaldoD] = useState(12250);
  const [saldoH, setSaldoH] = useState(19780);

  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  //const [text2, setText2] = useState(localStorage.getItem('Proces052') || '');
  const [administrador, setAdministrador]
                          = useState(localStorage.getItem('AdminFam') || ''); 
  
  
  const saldoDH = async (empresa,compte,perde,peral,DH) => {
    // console.log('......... ',empresa,compte,perde,peral,DH)
      const saldo = await Csaldos(empresa, compte,perde,peral);
      if (DH === 'D') {setSaldoD(saldo)}
      if (DH === 'H') {setSaldoH(saldo)}
      //console.log(saldo);
  };

   // useEffect per anular buto retorn mòbil *********************
  useEffect(() => {
      if  (tipusM === 'A') {setTipusMM('Totes')}
      if  (tipusM === 'I') {setTipusMM('Ingrés')} 
      if  (tipusM === 'T') {setTipusMM('Traspàs')}
      if  (tipusM === 'F') {setTipusMM('Càrrecs i factures')}
      if  (tipusM === 'X') {setTipusMM('Tancament/Apertura')}
     
   }, [tipusM]);
 
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

  useEffect(() => {
     const dataM = new Date();
     setXM06(`${dataM.getDate()}/${dataM.getMonth()+1}
             /${dataM.getFullYear()}`);
    }, []); 
  useEffect(() => {
     if(xM02 === ''|| xM03 === ''||  xM05 === '' || xM04 === 0) {
        setSivalidar(false); 
        setSivalidar3(true); 
     } else {
        setSivalidar(true);
        setSivalidar3(false);  
     } 
  }, [xM02,xM03,xM04,xM05]);
   const BuscarApunt = (valor) => {
        const numValor = Number(valor);
        const registre = dataM.find(
            item => Number(item.M01) === numValor    
        );
         if (!registre) {
            alert(`No s'ha trobat l'apunt ${numValor} en el període ${mM07}`);
            return;
        }
          setMM01(numValor);
          setMM02(registre.M02);
          setMM03(registre.M03);
          setMM04(registre.M04);
          setMM05(registre.M05);
          setMM06(registre.M06);
          setMM08(registre.M08);
          setMM09(registre.M09);
          setMM10(registre.M10);
          const registreO = compteD.find(
           item => item.id === `${mM00}_${registre.M02}`
          );     
          if (registreO) {
            setNomOrigen(`${registreO.D11} / ${registreO.D12} / ${registreO.D02}`);
             setTipOrigen(registreO.D10);
          }   
          const registreD = compteD.find(
            item => item.id === `${mM00}_${registre.M03}`
         );     
        if (registreD) {
             setNomDesti(`${registreD.D11} / ${registreD.D12} / ${registreD.D02}`);
             setTipDesti(registreD.D10);
        } 
        setSivalidar2(true);  
        setSivalidar3(false);
  }; 
  async function Validar2() {    
     const MovCollection = collection(db, 'MovsG');
     const batch = writeBatch(db);
     const newDocRef = doc(MovCollection, `${mM00}_${mM01}`);
     const dataM = new Date();
     const xM10N =  `Modificat el dia - ${dataM.getDate()}/${dataM.getMonth()+1}
                          /${dataM.getFullYear()}a les :
                           ${dataM.getHours()}:${dataM.getMinutes()}
                            per : ${xM09}`;
      batch.set(newDocRef, {
                M00:     mM00,
                M01:     mM01,  
                M02:     mM02,               
                M03:     mM03,                
                M04:     mM04,
                M05:     mM05,
                M06:     mM06,
                M07:     mM07,
                M08:     mM08,
                M09:     mM09,
                M10:     mM10
      });
      await batch.commit();
      //alert("Registre guardat correctament");
   
     setSivalidar2(false);  
     setSivalidar3(true);
     setMM02('');
     setMM03('');
     setMM04(0);
     setMM05(''); 
     setMM08('');
     setMM10('');
     setNomOrigen(''); 
     setNomDesti(''); 
     setTipOrigen('');
     setTipDesti('');
  }   
  async function Validar()  {
     const MovCollection = collection(db, 'MovsG');
     const batch = writeBatch(db);
     const newDocRef = doc(MovCollection, `${xM00}_${xM01}`);
     const dataM = new Date();
     const xM10N =  `dia - ${dataM.getDate()}/${dataM.getMonth()+1}
                          /${dataM.getFullYear()}a les :
                           ${dataM.getHours()}:${dataM.getMinutes()}
                            per : ${xM09}`;
      await batch.set(newDocRef, {
                M00:     xM00,
                M01:     xM01,  
                M02:     xM02,               
                M03:     xM03,                
                M04:     xM04,
                M05:     xM05,
                M06:     xM06,
                M07:     xM07,
                M08:     xM08,
                M09:     xM09,
                M10:     xM10N
      });
      batch.commit(); 
      setSivalidar(false);
      setSivalidar3(true); 
      setXM02('');
      setXM03('');
      setXM04(0);
      setXM05(''); 
      setXM08('');
      setXM10('');
      setNomOrigen(''); 
      setNomDesti('');
      setTipOrigen('');
      setTipDesti('');
      setSisaldoD(false);
      setSisaldoH(false);
    };   
 
  function entrada() {  
    setModifica(false);   
      // navigate('/CMenu');
  }  
  function Modificar() {  
    setModifica(true);   
      // navigate('/CMenu');
  }  
  function NoValidar() {     
     setSivalidar(false);  
     setSivalidar3(true); 
     setXM02('');
      setXM03('');
      setXM04(0);
      setXM05(''); 
      setXM08('');
      setXM10('');
      setNomOrigen(''); 
      setNomDesti(''); 
        setTipOrigen('');
      setTipDesti('');
       setSisaldoD(false);
      setSisaldoH(false);
  } 
  function NoValidar2() {     
     setSivalidar2(false);  
     setSivalidar3(true); 
     setMM02('');
     setMM03('');
     setMM04(0);
     setMM05(''); 
     setMM08('');
     setMM10('');
     setNomOrigen(''); 
     setNomDesti('');
     setTipOrigen('');
      setTipDesti('');
  } 
  function Sacabat() {     
       navigate('/CMenu');
  } 
  function Consulta() {     
       navigate('/CconsultaC');
  }  

 
const BuscarOrigen = (valor) => {
     setXM02(valor);
   
 
     //console.log('origen ----------',valor)
     const registre = compteD.find(
        item => item.id === `${mM00}_${valor}`
     );  
     if (registre) {
         setNomOrigen(`${registre.D11} / ${registre.D12} / ${registre.D02}`);
          setTipOrigen(registre.D10);
    } 
     if(registre.D10 === 'A' || registre.D10 === 'P') {
        setSisaldoD(true);
        const per00x = xM07;
        const per00y = per00x.slice(0, 5);
        saldoDH(xM00,valor,`${per00y}00`,xM07,'D');
     } else {
        setSisaldoD(false);
     }

  };
  const BuscarOrigen2 = (valor) => {
     setMM02(valor);
     //console.log('origen ----------',valor)
     const registre = compteD.find(
        item => item.id === `${mM00}_${valor}`

     );     
     if (registre) {
         setNomOrigen(`${registre.D11} / ${registre.D12} / ${registre.D02}`);
    } 
  };
  const BuscarDesti2 = (valor) => {
     setMM03(valor);
     const registre = compteD.find(
        item => item.id === `${mM00}_${valor}`

     );     
     if (registre) {
         setNomDesti(`${registre.D11} / ${registre.D12} / ${registre.D02}`);
    } 
  };
  const BuscarDesti = (valor) => {
     setXM03(valor);
    
     const registre = compteD.find(
         item => item.id === `${mM00}_${valor}`
     );     
     if (registre) {
         setNomDesti(`${registre.D11} / ${registre.D12} / ${registre.D02}`);
          setTipDesti(registre.D10);
    }
     if(registre.D10 === 'A' || registre.D10 === 'P') {
        setSisaldoH(true);
        const per00x = xM07;
        const per00y = per00x.slice(0, 5);
        saldoDH(xM00,valor,`${per00y}00`,xM07,'H');
     } else {
        setSisaldoH(false);
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
            C51: doc.data().C51?.trim() || "",
            C52: doc.data().C52?.trim() || "",
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
    try {
      const linksCollection = collection(db, 'CompteD');
      const q = query(
        linksCollection,
        where('D00', '==', xM00)
      );

      const querySnapshot = await getDocs(q);

      const linksData = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        const grup1 = grupC.find(g => g.G01 === data.D03 && g.G00 === data.D00);
        const grup2 = compteC.find(
          g => g.C03 === data.D03 && g.C01 === data.D04  && g.C00 === data.D00);

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
          D51: grup2?.C51 || "",
          D52: grup2?.C52 || "",
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
/*
   useEffect(() => { 
  const fetchData3 = async () => {
    const linksCollection = collection(db, 'CompteD');
        where('D00', '==', 'xM00')

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
          D51: grup2?.C51 || "",
          D52: grup2?.C52 || "",
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
  //   *********  buscar el `periode comptable  ******

useEffect(() => {
  const fetchNordre = async () => {
    try {
      const linksCollection = collection(db, 'MovsG');
      const querySnapshot = await getDocs(linksCollection);

      let maxM01 = 10000;

      querySnapshot.docs.forEach(doc => {
        const data = doc.data();

        const m01Value = parseInt(data.M01, 10);

        if (!isNaN(m01Value) && m01Value > maxM01) {
          maxM01 = m01Value;
        }
      });

      setXM01(maxM01 + 5);

    } catch (error) {
      console.error('Error llegint M01:', error);
      setXM01(10000);
    } finally {
      setLoading(false);
    }
  };

  fetchNordre();
}, [xM00,sivalidar]);
*/
useEffect(() => {
  const fetchNordre = async () => {
    try {
      const q = query(
        collection(db, "MovsG"),
        where("M00", "==", xM00)
      );

      const querySnapshot = await getDocs(q);

      let maxM01 = 10000;

      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const m01Value = parseInt(data.M01, 10);

        if (!isNaN(m01Value) && m01Value > maxM01) {
          maxM01 = m01Value;
        }
      });

      setXM01(maxM01 + 5);

    } catch (error) {
      console.error("Error llegint M01:", error);
      setXM01(10000);
    } finally {
      setLoading(false);
    }
  };

  if (xM00) {
    fetchNordre();
  }
}, [xM00, sivalidar]);
/**************************** memoritzar els  movs del periode */
useEffect(() => {
  const fetchDataM = async () => {
    try {
      const q = query(
        collection(db, "MovsG"),
        where("M00", "==", xM00),
  // **********aular si   no verifica  periode  ***************************************** 
     //   where("M07", "==", xM07)
      );

      const movimentsEmpresa = [];
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();

        movimentsEmpresa.push({
          id: docSnap.id,
          ...data,
        });
      });
      //console.log('gravat moviment - ',movimentsEmpresa)
      setDataM(movimentsEmpresa);

    } catch (error) {
      console.error("Error llegint MovsG:", error);
    }
  };

   fetchDataM();
}, [xM00,sivalidar,sivalidar2,sivalidar3]); 

function Consulta() {     
    navigate('/CMovsC');
  }  
  return (    
    <div>  
     <Card.Header className="d-flex 
          align-items-center justify-content-center gap-3 py-3 flex-wrap">
       {!modifica && (
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
       )}  
           {modifica && (
        <div
         className="fw-bold text-uppercase"
         style={{
            fontSize: "1.4rem",
            letterSpacing: "1px",
            color: "#1f2937",
            whiteSpace: "nowrap"
          }}
        >
           Modificació<span style={{ color: "#ea434e" }}> Apunts Comptables</span>
       </div> 
       )}    
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
            Usuari: <strong>{xM09}</strong>
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
            <strong>{xM00}</strong>
        </div>
      </div>
      </Card.Header>
      <div style={{ textAlign: "center" }}>
        <div
            className="px-3 py-2 rounded shadow-sm fw-bold"
            style={{
                display: "inline-block",
                backgroundColor: "#dbe4f0",
                border: "1px solid #b6c2d1",
                fontSize: "0.75rem",
                minWidth: "50px",
                textAlign: "center",
                color: "#010c17"
            }}
        >
            <strong>Data - {xM06}</strong>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <strong>Perìode - {xM07}</strong> 
        </div>  
    </div>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    {!modifica && (
    <div   
        style={{
         display: "flex",
         justifyContent: "center",
         marginTop: "10px"
         }}
    >
    <div
        className="px-3 py-2 rounded shadow-sm fw-bold"
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#dbe4f0",
          border: "1px solid #b6c2d1",
          fontSize: "0.75rem",
          color: "#010c17"
        }}
    >
    <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "24px",
          flexWrap: "wrap"
         
          }}
    >
    {opcionsM.map((opcioM) => (
        <label
            key={opcioM.codi}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection:'column',
              cursor: "pointer",
              marginBottom: 0
            }}
       
        >
        <input
          type="radio"
          name="tipusMoviment"
          value={opcioM.codi}
          checked={tipusM === opcioM.codi}
          onChange={(e) => setTipusM(e.target.value)}
        />
          {opcioM.text}
        </label>
      ))}
      
    </div>
    <p className="mt-2 mb-0 shadow-sm fw-bold"
        style={{ fontSize: "1.25rem" }}>
        Comptes : {tipusMM}
    </p>
  </div>
  </div>
    )}
{/******************  alta ******************************************** */}
   {!modifica && (
    <Row className="justify-content-center">
       <Col lg={4} xl={6}>
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
                Num.Ordre
           </Form.Label> 
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
              &nbsp;&nbsp;&nbsp;
           <Form.Control
             type="int64"
             value={xM01}            
             className="py-1 rounded-3 fw-bold"
             style={{
                    width: "80px",
                    fontSize: "0.95rem",
                    backgroundColor: "#d1fae5",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
              }}
           />
           </div>
      
              <br></br>

              <div className="d-flex align-items-center gap-3 mb-3">
            <Form.Label
                className="fw-bold mb-0"
                style={{ fontSize: "0.80rem" }}
                >
                Origen 
            </Form.Label> 

        {tipusM === 'A' && (
          <>
          <Form.Select
                value={xM02}
                onChange={(e) => BuscarOrigen(e.target.value)}
                className="fw-bold shadow-sm"
                style={{
                    width: "140px",
                    fontSize: "1rem",
                    border: "2px solid #2563eb",
                    backgroundColor: "#eff6ff",
                    color: "#1e293b",
                    borderRadius: "10px"
                }}
                required>
        
          <option value="">📋 Selecciona un compte...</option>
          {(() => {
              let ultimD03 = null;
          return compteD?.filter(item => ["A", "P", "I", "D"].includes(item.D10))
          .sort((a, b) => a.D03.localeCompare(b.D03) || a.D04.localeCompare(b.D04))
          .flatMap(item => {
              const opcions = [];
          if (ultimD03 !== item.D03) {
              ultimD03 = item.D03;
              opcions.push(
                <option
                  key={`sep-${item.D03}`}
                  disabled
                  style={{ fontWeight: "bold" }}
                >
              ───── {item.D03} ─────
            </option>
            );
          }
            opcions.push(
              <option
                key={item.id}
                value={`${item.D03}.${item.D04}.${item.D01}`}
              >
               {item.D03}.{item.D04}.{item.D01} · {item.D11} · {item.D12}
              </option>
          );
        return opcions;
        });
      })()}

         
        </Form.Select>
         </>     
       )}
       {tipusM !== 'A' && (
          <>
          <Form.Select
                value={xM02}
                onChange={(e) => BuscarOrigen(e.target.value)}
                className="fw-bold shadow-sm"
                style={{
                    width: "140px",
                    fontSize: "1rem",
                    border: "2px solid #2563eb",
                    backgroundColor: "#eff6ff",
                    color: "#1e293b",
                    borderRadius: "10px"
                }}
                required>
               {/*    *************************   */}   

        <option value="">📋 Selecciona un compte...</option>
        {(() => {
          let ultimD03 = null;
          return compteD?.filter(item => item.D51?.includes(tipusM))
          .sort((a, b) => a.D03.localeCompare(b.D03) || a.D04.localeCompare(b.D04))
          .flatMap(item => {
            const opcions = [];
            if (ultimD03 !== item.D03) {
            ultimD03 = item.D03;
            opcions.push(
            <option
              key={`sep-${item.D03}`}
              disabled
              style={{ fontWeight: "bold" }}
            >
              ───── {item.D03} ─────
            </option>
          );
        }
        opcions.push(
        <option
          key={item.id}
          value={`${item.D03}.${item.D04}.${item.D01}`}
        >
          {item.D03}.{item.D04}.{item.D01} · {item.D11} · {item.D12}
        </option>
       );
        return opcions;
      });
      })()}

    </Form.Select>
      </>  
     )}   
     {sisaldoD && (
          <Form.Control
             type="text"
             value={`(Saldo : ${saldoD}€)`}
            
             className="py-2 rounded-3 fw-bold"
             style={{
                    width: "150px",
                    fontSize: "0.95rem",
                    backgroundColor: "#d1fae5",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
              }}
           />
            )}
           </div>
           <div className="d-flex align-items-center gap-3 mb-3">
             <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }}
                >
                
            </Form.Label>  
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           <Form.Control
             type="text"
             value={nomOrigen}
            
             className=" rounded-3 fw-bold"
             style={{
                    width: "500px",
                    fontSize: "0.95rem",
                    backgroundColor: "#d1fae5",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
              }}
           />
         </div> 
     
            <br></br>

           <div className="d-flex align-items-center gap-3 mb-3">
                 <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }}
                >
                ..Destí
            </Form.Label>     
            
          {tipusM === 'A' && (
          <>
          <Form.Select
                value={xM03}
                onChange={(e) => BuscarDesti(e.target.value)}
                className="fw-bold shadow-sm"
                style={{
                    width: "140px",
                    fontSize: "1rem",
                    border: "2px solid #2563eb",
                    backgroundColor: "#eff6ff",
                    color: "#1e293b",
                    borderRadius: "10px"
                }}
                required>
 {/*    *************************   */}   
        <option value="">📋 Selecciona un compte...</option>
        {(() => {
          let ultimD03 = null;
          return compteD ?.filter(item => ["A", "P", "I", "D"].includes(item.D10))
          .sort((a, b) => a.D03.localeCompare(b.D03) || a.D04.localeCompare(b.D04))
          .flatMap(item => {
            const opcions = [];
            if (ultimD03 !== item.D03) {
            ultimD03 = item.D03;
            opcions.push(
            <option
              key={`sep-${item.D03}`}
              disabled
              style={{ fontWeight: "bold" }}
            >
              ───── {item.D03} ─────
            </option>
          );
        }
        opcions.push(
        <option
          key={item.id}
          value={`${item.D03}.${item.D04}.${item.D01}`}
        >
          {item.D03}.{item.D04}.{item.D01} · {item.D11} · {item.D12}
        </option>
       );
        return opcions;
      });
      })()}

      {/*    *************************   */}   

          
        </Form.Select>
         </>     
       )}
       {tipusM !== 'A' && (
          <>
          <Form.Select
                value={xM03}
                onChange={(e) => BuscarDesti(e.target.value)}
                className="fw-bold shadow-sm"
                style={{
                    width: "140px",
                    fontSize: "1rem",
                    border: "2px solid #2563eb",
                    backgroundColor: "#eff6ff",
                    color: "#1e293b",
                    borderRadius: "10px"
                }}
                required>
                  {/*   tipusM  comparar-lo amb D52*/}
        
           {/*    *************************   */}   

        <option value="">📋 Selecciona un compte...</option>
        {(() => {
          let ultimD03 = null;
          return compteD?.filter(item => item.D52?.includes(tipusM))
          .sort((a, b) => a.D03.localeCompare(b.D03) || a.D04.localeCompare(b.D04))
          .flatMap(item => {
            const opcions = [];
            if (ultimD03 !== item.D03) {
            ultimD03 = item.D03;
            opcions.push(
            <option
              key={`sep-${item.D03}`}
              disabled
              style={{ fontWeight: "bold" }}
            >
              ───── {item.D03} ─────
            </option>
          );
        }
        opcions.push(
        <option
          key={item.id}
          value={`${item.D03}.${item.D04}.${item.D01}`}
        >
          {item.D03}.{item.D04}.{item.D01} · {item.D11} · {item.D12}
        </option>
       );
        return opcions;
      });
      })()}

      {/*    *************************   */}   
          </Form.Select>
          </>  
        )}
           {sisaldoH && (

           <Form.Control
             type="text"
             value={`(Saldo : ${saldoH}€)`}            
             className="py-2 rounded-3 fw-bold"
             style={{
                    width: "150px",
                    fontSize: "0.95rem",
                    backgroundColor: "#d1fae5",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
              }}
           />
            )}
           </div>
              <div className="d-flex align-items-center gap-3 mb-3">
             <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }}
                >
                
            </Form.Label>  
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Form.Control
             type="text"
             value={nomDesti}            
             className="py-2 rounded-3 fw-bold"
         
             style={{
                    display:'block',
                    width: "500px",
                    fontSize: "0.95rem",
                    backgroundColor: "#d1fae5",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
              }}
           />
           </div>
              <br></br>
           {/* Import */}
        <div className="d-flex align-items-center gap-3 mb-3">
           <Form.Label
               className="fw-semibold mb-0"
               style={{ fontSize: "0.95rem", minWidth: "60px" }}
            >
                Import
             </Form.Label>

         <Form.Control
             type="number"
               min="0"
             value={xM04}
             onFocus={(e) => e.target.select()}
             onChange={(e) => setXM04(e.target.value)}
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

        {/* Concepte */}
   <div className="d-flex align-items-center gap-3 mb-3">
  <Form.Label
    className="fw-semibold mb-0"
    style={{ fontSize: "0.95rem", minWidth: "60px" }}
  >
    Concepte
  </Form.Label>

  <Form.Control
    type="text"
    value={xM05}
    onChange={(e) => setXM05(e.target.value)}
    className="py-2 rounded-3 fw-bold"
    style={{
      width: "500px",
      fontSize: "0.95rem",
      backgroundColor: "#d1fae5",
      border: "1px solid #b6c2d1",
      color: "#334155"
    }}
    placeholder=".."
  />
</div>
      </Form.Group>
    </Form>    
  </Card.Body>   
    </Card>

   </Col>
  </Row>
  )}
  {/******************  Modific  ******************************************** */}
  {modifica && (
    <Row className="justify-content-center">
     <Col lg={4} xl={6}>
      <Card className="shadow border-0 rounded-4">
        <Card.Body className="p-5"> 

         {/*    entrar numero  **************************** */}        
         <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group className="mb-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }}
                >
                Num.Ordre
              </Form.Label> 
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
              
              <Form.Control
                type="int64"
                     
                className="py-1 rounded-3 fw-bold"
                     onClick={(e) => {
                      e.target.value = "";
                        }}
                    onChange={(e) => {
                    const valor = e.target.value.replace(/\D/g, '');
                    if (valor.length === 5) {
                        BuscarApunt(Number(valor));
                    }
                  }} 
                  style={{
                    width: "80px",
                    fontSize: "0.95rem",
                    backgroundColor: "#d1fae5",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
                }}
              />
            </div>
            <br></br>
            <div className="d-flex align-items-center gap-3 mb-3">
            <Form.Label
                className="fw-bold mb-0"
                style={{ fontSize: "0.80rem" }}
                >
                Origen 
            </Form.Label>  
           <Form.Select
                  value={mM02}
                  onChange={(e) => BuscarOrigen2(e.target.value)}
                  className="fw-bold shadow-sm"
                  style={{
                      width: "140px",
                    fontSize: "1rem",
                    border: "2px solid #2563eb",
                    backgroundColor: "#eff6ff",
                    color: "#1e293b",
                    borderRadius: "10px"
                   }}
                required>
                <option value="📋Sel."> </option>
                {compteD?.filter(item => ["D","I","A","P"].includes(item.D10))
                 .map((item) => (
                     <option key={item.id} value={`${item.D03}.${item.D04}.${item.D01}`}>
                          {item.D03}.{item.D04}.{item.D01} -
                          {item.D11} / {item.D12} / {item.D02}
                     </option>
    
             ))}
          </Form.Select>  
         </div>
           <div className="d-flex align-items-center gap-3 mb-3">
             <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }}
                >
                
            </Form.Label>  
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   
            <Form.Control
             type="text"
             value={nomOrigen}
            
             className=" rounded-3 fw-bold"
             style={{
                    width: "500px",
                    fontSize: "0.95rem",
                    backgroundColor: "#d1fae5",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
              }}
           />
         </div> 
         <br></br>
         <div className="d-flex align-items-center gap-3 mb-3">
                 <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }}
                >
                ..Destí
            </Form.Label>                 
            <Form.Select
                  value={mM03}
                  onChange={(e) => BuscarDesti2(e.target.value)}
                  className="fw-bold shadow-sm"
                style={{
                      width: "140px",
                    fontSize: "1rem",
                    border: "2px solid #2563eb",
                    backgroundColor: "#eff6ff",
                    color: "#1e293b",
                    borderRadius: "10px"
                  }}
            required>
                <option value="📋Sel."> </option>
                {compteD?.filter(item => [ "D" ,"I", "A","P"].includes(item.D10))
                 .map((item) => (
                     <option key={item.id} value={`${item.D03}.${item.D04}.${item.D01}`}>
                          {item.D03}.{item.D04}.{item.D01} -
                          {item.D11} / {item.D12} / {item.D02}
                     </option>
    
             ))}
          </Form.Select>    
           </div>
           <div className="d-flex align-items-center gap-3 mb-3">
             <Form.Label
                className="fw-semibold mb-0"
                style={{ fontSize: "0.95rem" }}
                >                
            </Form.Label>  
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;         
          <Form.Control
             type="text"
             value={nomDesti}            
             className="py-2 rounded-3 fw-bold"
             style={{
                    width: "500px",
                    fontSize: "0.95rem",
                    backgroundColor: "#d1fae5",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
              }}
           />
           </div>
        <br></br>
           {/* Import */}
  <div className="d-flex align-items-center gap-3 mb-3">
  <Form.Label
    className="fw-semibold mb-0"
    style={{ fontSize: "0.95rem", minWidth: "60px" }}
  >
    Import
  </Form.Label>

 <Form.Control
  type="number"
  min="0"
  value={mM04}
  onFocus={(e) => e.target.select()}
  onChange={(e) => setMM04(e.target.value)}
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

{/* Concepte */}
<div className="d-flex align-items-center gap-3 mb-3">
  <Form.Label
    className="fw-semibold mb-0"
    style={{ fontSize: "0.95rem", minWidth: "60px" }}
  >
    Concepte
  </Form.Label>

  <Form.Control
    type="text"
    value={mM05}
    onChange={(e) => setMM05(e.target.value)}
    className="py-2 rounded-3 fw-bold"
    style={{
      width: "500px",
      fontSize: "0.95rem",
      backgroundColor: "#d1fae5",
      border: "1px solid #b6c2d1",
      color: "#334155"
    }}
    placeholder=".."
  />
</div>
      </Form.Group>
    </Form>
  
    
  </Card.Body>   
    </Card>
   </Col>
  </Row>
  )}
    <br></br>     
   
   <div className="d-flex justify-content-center mt-3">
                      <Button className="mb-2" 
                          variant="warning"
                          size='sm'
                          onClick={Sacabat}>                                      
                          <i className="fas fa-sign-out-alt"></i>  Enrera (sortir)
                      </Button>
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {sivalidar && ( 
                      <Button className="mb-2" 
                          variant="warning"
                          size='sm'
                          onClick={NoValidar}>                                      
                          <i className="fas fa-sign-out-alt"></i>  NO validar
                      </Button>
                      )}
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {sivalidar && ( 
                      <Button className="mb-2" 
                          variant="primary"
                          size='sm'                      
                          onClick={Validar}>                             
                          <i className="fas fa-sign-out-alt"></i>  Validar
                      </Button>                                              
                      )}   
                       {sivalidar2 && ( 
                      <Button className="mb-2" 
                          variant="warning"
                          size='sm'
                          onClick={NoValidar2}>                                      
                          <i className="fas fa-sign-out-alt"></i>  NO validar
                      </Button>
                      )}
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {sivalidar2 && ( 
                      <Button className="mb-2" 
                          variant="primary"
                          size='sm'                      
                          onClick={Validar2}>                             
                          <i className="fas fa-sign-out-alt"></i>  Validar
                      </Button>                                              
                      )}   
                      {sivalidar3 && ( 
                          <>
                      {!modifica && (
                      <Button className="mb-2" 
                               variant="primary"
                               size='sm'                      
                               onClick={Modificar}>                             
                            <i className="fas fa-sign-out-alt"></i> Modificar Apunt
                      </Button>
                      )} 
                       {modifica && (
                      <Button className="mb-2" 
                               variant="primary"
                               size='sm'                      
                               onClick={entrada}>                             
                            <i className="fas fa-sign-out-alt"></i> Entrada Apunts
                      </Button>
                      )} 
                         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <Button className="mb-2" 
                               variant="primary"
                               size='sm'                      
                               onClick={Consulta}>                             
                            <i className="fas fa-sign-out-alt"></i>  Consulta apunts
                      </Button> 
                     </>
                      )}                  
       
       </div>               
      </div>     
  );
}
export default Cmovs;
