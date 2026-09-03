import React, {useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Col,Nav, Card, Form, Button } from "react-bootstrap";
import { doc, setDoc, getDoc, query, where, getDocs, writeBatch, collection } from 'firebase/firestore';
import { storageCar, db } from '../firebaseLoc.js';
import "./CMenu.css";


import { findAllByTestId } from '@testing-library/react';
import {exportarPDF} from '../CCGlobal/ExportarPDF';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Benrera from "../CCGlobal/Benrera.js";

function CMenu() {
  const navigate=useNavigate();
  const pdfRef = useRef();

  const [xM00, setXM00] = useState(localStorage.getItem('Empresa')); 
  const [xM06, setXM06] = useState('');  // data  dd/mm/yyyy              ##

  const [periodeDel, setPeriodeDel] = useState(localStorage.getItem('PeriodeDel'));
  const [periodeAl, setPeriodeAl] = useState(localStorage.getItem('PeriodeAl'));
  const [percon, setPercon] = useState(localStorage.getItem('Percon'));
 

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);

  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  const [empresa, setEmpresa] = useState(localStorage.getItem('Empresa'));
  const [sipre, setSipre] = useState(localStorage.getItem('Sipre') || '');  
  const [nivell, setNivell] = useState(localStorage.getItem('Nivell') || '');
  //const [text2, setText2] = useState(localStorage.getItem('Proces052') || '');
  const [administrador, setAdministrador]
                          = useState(localStorage.getItem('AdminFam') || ''); 

  const [grupP1, setGrupP1] = useState([]);

  const [grupZ, setGrupZ] = useState([]);
  const [comptesZ, setComptesZ] = useState([]);

  //const [nomOrigen, setnomOrigen] = useState('compte origen');
  //  const [nomDesti, setnomDesti] = useState('compte destí');
  const [nomOrigen1, setnomOrigen1] = useState('compte origen');
  const [nomDesti1, setnomDesti1] = useState('compte destí');      
  
  const [itemsPerPage, setItemsPerPage] = useState(1500);
  const currentItems=data.slice(0, itemsPerPage);
  const emptyRows = itemsPerPage - currentItems.length;
  const paddedItems = [...currentItems, ...Array(emptyRows).fill({ temp: '.', nom: ' ', codi: 'empty' })];
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');
   

  const [itemsPerPage1, setItemsPerPage1] = useState(1500);
  const currentItems1=data1.slice(0, itemsPerPage1);
  const emptyRows1 = itemsPerPage1 - currentItems1.length;
  const paddedItems1 = [...currentItems1, ...Array(emptyRows1).fill({ temp: '.', nom: ' ', codi: 'empty' })];
  const [selectedIndex1, setSelectedIndex1] = useState(null);
  const [selectedItem1, setSelectedItem1] = useState('');
  
  const [itemsPerPage2, setItemsPerPage2] = useState(1500);
  const currentItems2=data2.slice(0, itemsPerPage2);
  const emptyRows2 = itemsPerPage2 - currentItems2.length;
  const paddedItems2 = [...currentItems2, ...Array(emptyRows2).fill({ temp: '.', nom: ' ', codi: 'empty' })];
  const [selectedIndex2, setSelectedIndex2] = useState(null);
  const [selectedItem2, setSelectedItem2] = useState('');

  const [selectedItem3, setSelectedItem3] = useState('');
  const [comptasel, setComptasel] = useState('');
 
  const [pantalla, setPantalla] = useState('0');
  const [pant01, setPant01] = useState('');
  const [pant02, setPant02] = useState('');
  const [pant03, setPant03] = useState('');  
  const [pant13, setPant13] = useState('');  
  const [pant23, setPant23] = useState('');  
  //const [pant04, setPant04] = useState('');
  const [pant05, setPant05] = useState('');
  
  const mesValid = (periode) => {
    const [, mes] = (periode || "").split("/");
    return mes !== "00" && mes !== "13";
  };
  const totalIngresos = paddedItems
      .filter(Boolean)
      .filter(item => item.G01)
      .filter(item => item.G03 === "I")
      .reduce((sum, item) => sum + Number(item.G04 || 0), 0);
  const totalIngresosP = paddedItems
      .filter(Boolean)
      .filter(item => item.G01)
      .filter(item => item.G03 === "I")
      .reduce((sum, item) => sum + Number(item.G06 || 0), 0);
  const totalDespesesP = paddedItems
      .filter(Boolean)
      .filter(item => item.G01)
      .filter(item => item.G03 === "D")
      .reduce((sum, item) => sum + Number(item.G06 || 0), 0);
   const totalDespeses = paddedItems
      .filter(Boolean)
      .filter(item => item.G01)
      .filter(item => item.G03 === "D")
      .reduce((sum, item) => sum + Number(item.G04 || 0), 0);
  const totalActiuMov = paddedItems
      .filter(item => item?.G01)
      .filter(item => item.G03 === "A")
      .reduce((sum, item) => sum + Number(item.G04 || 0), 0); 
  const totalActiuP = paddedItems
      .filter(Boolean)
      .filter(item => item.G01)
      .filter(item => item.G03 === "A")
      .reduce((sum, item) => sum + Number(item.G05 || 0), 0);
   const totalActiu = totalActiuP + totalActiuMov;
   const totalPassiuMov = paddedItems
      .filter(Boolean)
      .filter(item => item.G01)
      .filter(item => item.G03 === "P")
      .reduce((sum, item) => sum + Number(item.G04 || 0), 0);
    const totalPassiuP = paddedItems
      .filter(Boolean)
      .filter(item => item.G01)
      .filter(item => item.G03 === "P")
      .reduce((sum, item) => sum + Number(item.G05 || 0), 0);
    const totalPassiu = totalPassiuP + totalPassiuMov;
useEffect(() => {
  if (sipre === "No") return;

  const fetchDataP = async () => {
    try {
      const linksCollection = collection(db, "PresG");
      const querySnapshot = await getDocs(linksCollection);

      const [anyD, mesD] = periodeDel.split("/");
      const [anyA, mesA] = periodeAl.split("/");

      const mesInicial = Number(mesD);
      const mesFinal = Number(mesA);

      const linksData = querySnapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
        
        .filter((data) => data.P01 === anyD && data.P00 === empresa)
        .map((data) => {
          let importMov = 0;

          for (let mes = mesInicial; mes <= mesFinal; mes++) {
            importMov += Number(data[`P${10 + mes}`] || 0);
          }

          return {
            ...data,
            P23: importMov,
          };
        });

      setGrupP1(linksData);
    } catch (error) {
      console.error("Error llegint PresG:", error);
    }
  };

  fetchDataP();
}, [empresa, periodeDel, periodeAl, sipre]);
   // ************************ fi ****************************************************
   // useEffect per buscar la data al inici del programa *********************
   useEffect(() => {
     const dataM = new Date();
     setXM06(`${dataM.getDate()}/${dataM.getMonth()+1}
             /${dataM.getFullYear()}`);
    }, []);

//  useeffect per llegir el grup de comptes  primer  (grupC )*********************
useEffect(() => {
  const fetchData = async () => {
    const linksCollection = collection(db, "GrupC");
    try {
      const querySnapshot = await getDocs(linksCollection);
      const linksData = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      const filteredData = linksData
        .filter((item) => item.G00 === empresa)
        .map((item) => {
           const grupTrobat = grupZ.find(
            (g) => String(g.grup).trim() === String(item.G01).trim()
           );
          // console.log("trobat grupc =", grupTrobat);
          return {
            ...item,
            G04: Number(grupTrobat?.import || 0),
            G05: Number(grupTrobat?.importP || 0),
          };
        });
//**************************************** */       
    const filteredData2 = filteredData.map((item) => {
  const pt = grupP1
    .filter((g) => {
      if (!g?.P02) return false;

      const [P1] = String(g.P02).split(".");
      return P1.trim() === String(item.G01).trim();
    })
    .reduce((total, g) => total + Number(g.P23 || 0), 0);

  return {
    ...item,
    G06: pt,
  };
});    
     // console.log('data........... ',filteredData2)    
      setData(filteredData2);
      setItemsPerPage(filteredData2.length);
        //console.log('acabat GrupC')
    } catch (error) {
      console.error("Error llegint GrupC:", error);
    }
  };
   fetchData();
}, [empresa, grupZ, grupP1]);

 //   *********  llegir  compteC  i posarho a taula CompteC ******
useEffect(() => {
  const fetchData2 = async () => {
    const linksCollection = collection(db, "CompteG");

    try {
      const querySnapshot = await getDocs(linksCollection);

      const linksData = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      const filteredData = linksData
        .filter((item) => item.C00 === empresa)
        .map((item) => {
          // Buscar els imports del compte
          const grupTrobat = comptesZ.find(
            (g) => (g?.comptes || "") === `${item.C03}${item.C01}`
          );

          // Sumar els P23 del grup corresponent
          const pt = grupP1
            .filter((g) => g?.P02 === `${item.C03}.${item.C01}`)
            .reduce((total, g) => total + Number(g.P23 || 0), 0);

          return {
            ...item,
            C04: Number(grupTrobat?.import || 0),
            C05: Number(grupTrobat?.importP || 0),
            C06:
              Number(grupTrobat?.import || 0) +
              Number(grupTrobat?.importP || 0),
            C07: pt,
          };
        });

      setData1(filteredData);
    } catch (error) {
      console.error("Error llegint CompteG:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData2();
}, [empresa, comptesZ, grupP1, pantalla]);

  //   *********  llegir  compteD  i posarho a taula data3 ******
  useEffect(() => {
   const fetchData3 = async () => {
     // console.log('passsso 20 --------')
      const linksCollection = collection(db, 'CompteD');
        try {
          const querySnapshot = await getDocs(linksCollection);
          const linksData = querySnapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data(),
          }));
          const filteredData = linksData
               .filter(item => item.D00 === empresa)
               .map(item => {
                    const registre1 = data1.find(
                      d1 => d1.G01 === item.D03
                     );
                    const registre2 = data2.find(
                      d2 => d2.C01 === item.D04  &&
                          registre1.G01 === item.D03
                     );
    
    return {
      ...item,
      D09N: (registre1?.D02 || "")+' / '+ (registre1?.C02 || ""),
     
    };
  });
        setData3(filteredData);
        } catch (error) {
          console.error('Error llegint CompteD: ', error);
        } finally {
          
        }
      };
    fetchData3();
  }, [empresa,data1,data2]);

// *************************** llegir els movs i sumar import a grup i compte

useEffect(() => {
  const fetchData3 = async () => {
    try {
      const q = query(
        collection(db, "MovsG"),
        where("M00", "==", empresa)
      );

      const querySnapshot = await getDocs(q);

      const grups = {};
      const comptes = {};
      const movimentsEmpresa = [];

      const acumula = (grup, importMov, peco) => {
        if (!grup) return;

        grups[grup] ??= {
          grup,
          import: 0,
          importP: 0,
        };

        if (peco < periodeDel) {
          grups[grup].importP += importMov;
        }

        if (peco >= periodeDel && peco <= periodeAl) {
          grups[grup].import += importMov;
        }
      };

      const acumulaC = (grup, compte, importMov, peco) => {
        if (!grup || !compte) return;

        const key = `${grup}${compte}`;

        comptes[key] ??= {
          comptes: key,
          import: 0,
          importP: 0,
        };

        if (peco < periodeDel) {
          comptes[key].importP += importMov;
        }

        if (peco >= periodeDel && peco <= periodeAl) {
          comptes[key].import += importMov;
        }
      };

//  aqui es on s'afageix els noms dels comptes 
       querySnapshot.forEach((docSnap) => {
          const dataM = docSnap.data();
          //  buscar els noms 
          const [grup1, compte1,numero1] = (dataM.M02 || "").split(".");
          const [grup2, compte2,numero2] = (dataM.M03 || "").split(".");
         
          const nomOrigenx = data.find(
             item => item.G00 === empresa && item.G01 === grup1)?.G02 || "";
          const nomDestix = data.find(
             item => item.G00 === empresa && item.G01 === grup2)?.G02 || "";
          const nomOrigenxx = data1.find(
             item => item.C00 === empresa       && 
                item.C03 === grup1         && 
                item.C01 === compte1)?.C02 || "";
          const nomDestixx = data1.find(
             item => item.C00 === empresa       && 
                item.C03 === grup2         && 
                item.C01 === compte2)?.C02 || "";
          const nomOrigenxxx = data3.find(
             item => item.D00 === empresa       && 
                item.D03 === grup1         && 
                item.D04 === compte1       && 
                item.D01 === numero1)?.D02 || "";
          const nomDestixxx = data3.find(
             item => item.D00 === empresa       && 
                item.D03 === grup2         && 
                item.D04 === compte2       && 
                item.D01 === numero2)?.D02 || "";
          //  fi-buscar els noms
           movimentsEmpresa.push({
              id: docSnap.id,
           ...dataM,
          M02NN: nomOrigenx + ' / '+ nomOrigenxx+ ' / '+ nomOrigenxxx,
          M03NN: nomDestix   + ' / '+ nomDestixx + ' / '+ nomDestixxx,
        });
        const importMov = Number(dataM.M04) || 0;
        const peco = (dataM.M07);

        const [grupO = "", compteO = ""] =
          String(dataM.M02 || "").split(".");

        acumula(grupO, importMov, peco);
        acumulaC(grupO, compteO, importMov, peco);

        const [grupD = "", compteD = ""] =
          String(dataM.M03 || "").split(".");

        acumula(grupD, -importMov, peco);
        acumulaC(grupD, compteD, -importMov, peco);
      });

      setData2(movimentsEmpresa);
      setGrupZ(Object.values(grups));
      setComptesZ(Object.values(comptes));

    } catch (error) {
      console.error("Error llegint MovsG:", error);
    }
  };

  fetchData3();

}, [empresa, periodeDel, periodeAl,data,data1]);

useEffect(() => {
     const importZ = grupZ.find(
            (g) => (g.grup) === (selectedItem.G01)
           );
     const importx = (importZ?.importP ?? 0)+(importZ?.import ?? 0)
      setPant01(selectedItem.G01); 
      setPant02(selectedItem.G02);
      setPant03(importZ?.import ?? 0)   
      setPant13(importZ?.importP ?? 0)   
      setPant23(importx ?? 0)   
      setPant05(selectedItem.G03);
  }, [selectedItem]); 
useEffect(() => {
     setComptasel('');
  }, [selectedItem1,pant01]); 

 function Fisegonapart() {     
    setPantalla('0')
  }    
  
 function Fitercerapart() {     
    setPantalla('1')
  }    
   function Fiquart() {     
    setPantalla('2')
  }  
  function Sacabat() {  
   localStorage.setItem('IniciJMP', 'No');   
    navigate('/CMenu_Inici');
  }  
  function Ccomptes() {     
    navigate('/Ccomptes');
  }
  function CmovsC() {     
    navigate('/CmovsC');
  } 
   function CPresG() {     
    navigate('/CpresG');
  }   
  function Canalis() { 
    if (pantalla === '0')
       {localStorage.setItem('Canalis', pantalla)
       navigate('/Canalis', {
           state: {
                data: data
           }})
    } 
    if (pantalla === '1')
       {localStorage.setItem('Canalis', pantalla)
        localStorage.setItem('Canalis01', pant01)
        localStorage.setItem('Canalis02', pant02)
        localStorage.setItem('Canalis03', pant03)
        localStorage.setItem('Canalis13', pant13)
        localStorage.setItem('Canalis23', pant23)
       navigate('/Canalis', {
           state: {
                data1: data1
           }})
    }
  }   
   function Cmovs() {     
    navigate('/Cmovs');
  }  
   function Comparar() {     
    navigate('/CPresC');
  }  
  const exportar_a_PDF = async () => {
       const dataM = new Date();
       const datae2 =  `${dataM.getDate()}/${dataM.getMonth()+1}`; 
       const generar = () => {
      exportarPDF(pdfRef.current, "inf."+pantalla+'_=_('+datae2+')_=_'+periodeDel+'_a_'+periodeAl);
    };
    generar();
  };
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
        <Navbar className="SVNavbarP2 shadow mb-2" 
              variant="light" expand="lg">       
        <Container className="px-4">
          <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="d-flex flex-row gap-3 align-items-center">
            {(nivell === '1' || nivell === '2' || nivell === '3') &&  (
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
              )}
              {(nivell === '1' || nivell === '2' ||
                nivell === '3' || nivell === '4') &&  (
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
               )}
                 <Nav.Link
                    onClick={Canalis}
                     className="border border-2 rounded-pill px-3 py-1 fw-semibold shadow-sm"
                    style={{
                      fontSize: "0.85rem",
                      backgroundColor: "#f8fafc",
                      color: "#334155",
                      borderColor: "#94a3b8"
                  }}
              >
                          Anàlisi comptes
              </Nav.Link>
              
             {(nivell === '1' || nivell === '2' ||
               nivell === '3' || nivell) &&  (sipre === 'Si') && (
               <>
              <Nav.Link
                   onClick={CPresG}
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
                 </>
           )}
          </Nav>
          </Navbar.Collapse>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </Container>
      </Navbar> 
   
      <Row className="justify-content-center">
            <Col md={20}>
              <Card>
        
                <Card.Header 
                      className="text-center fs-5 fw-bold">
                         <div style={{ textAlign: "center" }}>
        <div
            className="px-3 py-2 rounded shadow-sm fw-bold"
            style={{
                display: "inline-block",
                backgroundColor: "#dbe4f0",
                border: "1px solid #b6c2d1",
                fontSize: "0.85rem",
                minWidth: "50px",
                textAlign: "center",
                color: "#010c17"
            }}
        >
            <strong>Data - {xM06}</strong>
             &nbsp;&nbsp;&nbsp;&nbsp;
          
            <strong>Perìode - {percon}</strong>    
        </div>
         &nbsp;&nbsp;&nbsp;&nbsp;
         <div
            className="px-3 py-2 rounded shadow-sm fw-bold"
            style={{
                display: "inline-block",
                backgroundColor: "#dbf0db",
                border: "1px solid #b6c2d1",
                fontSize: "0.85rem",
                minWidth: "50px",
                textAlign: "center",
                color: "#010c17"
            }}
           >                   
            <strong>Per. pantalla del- {periodeDel} al-{periodeAl}</strong> 
            </div>
                 &nbsp;&nbsp;&nbsp;&nbsp;
                 <Button className="mb-2"  
                                 variant="success"
                                 size="sm"
                                 onClick={exportar_a_PDF}
                                 >
                                 Generar PDF
                             </Button>  
                                  &nbsp;&nbsp;&nbsp;&nbsp;      
                {sipre === 'Si' && (                
                 <Button className="mb-2"  
                                 variant="success"
                                 size="sm"
                                 onClick={Comparar}
                                 >
                                 Comparar real-Pressup
                             </Button>  
                )}      
           </div>
      </Card.Header>
           

{/* ************************************* pantalla 0  general *********** */}
  {pantalla === '0' && (
    <>
    {/*  ******************  Taula de Ingresos  ****************** */}
    <div ref={pdfRef}> 
    <Container className="mt-3">
    <Row className="justify-content-center">
      <Col md={8}>
      <Card>
        <Card.Header
          className="fw-bold py-2 px-3"
          style={{ fontSize: "1rem" }}
        >
          Ingresos
        </Card.Header>

        <Card.Body className="p-2">
          <div className="table-responsive"> 
          
            <table
              className="table table-sm table-hover align-middle mb-0"
              style={{
                fontSize: "0.85rem",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th className="text-secondary fw-normal py-1">Codi</th>
                  <th className="text-secondary fw-normal py-1">Nom</th>
                  <th className="text-secondary fw-normal py-1 text-end">
                    Import
                  </th>   
                     {sipre === 'Si' && ( 
                      <>               
                    <th className="text-secondary fw-normal py-1 text-end">
                    Pressup.
                    </th>
                     <th className="text-secondary fw-normal py-1 text-end">
                    Difer.
                  </th>
                     <th className="text-secondary fw-normal py-1 text-end">
                    %
                  </th>    
                  </>
                     )}            
                </tr>
              </thead>

              <tbody>
                {paddedItems
                  .filter(Boolean)
                  .filter(item => item.G01)
                  .filter(item => item.G03 === "I")
                  .map((item, index) => (
                    <tr
                      key={index}
                       onClick={() => {
                              setSelectedItem(item);
                              setPantalla('1');
                       }}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedItem?.G01 === item.G01
                            ? "#e7f1ff"
                            : "transparent",
                      }}
                    >
                      <td className="fw-semibold py-1 px-2">
                        {item.G01}
                      </td>
                      <td
                             className="fw-bold text-muted py-1 px-2"
                              title={item.G02}
                              style={{
                              maxWidth: "100px",
                              whiteSpace: "nowrap",
                               overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                      >
                          {item.G02}
                    </td>                    
                       <td className=" fw-bold text-end py-1 px-2">
                         {(item.G04 ?? 0).toLocaleString("ca-ES", {
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0,
                          })}
                      </td> 
                      {sipre === 'Si' && (
                        <>    
                        <td className=" fw-bold text-end py-1 px-2">
                         {(item.G06 ?? 0).toLocaleString("ca-ES", {
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0,
                          })}
                      </td>      <td className=" fw-bold text-end py-1 px-2">
                         {((item.G04 - item.G06) ?? 0).toLocaleString("ca-ES", {
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0,
                          })}
                      </td>
                      <td className="fw-bold text-end py-1 px-2">
                            {(item.G06 !== 0
                              ? (item.G04 * 100) / item.G06
                              : 0
                            ).toLocaleString("ca-ES", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>   
                   
                      </>
                      )}           
                    </tr>
                  ))}
              </tbody>
                <tfoot>
                <tr
                    style={{
                    borderTop: "2px solid #dee2e6",
                    backgroundColor: "#f8f9fa",
                }}
                 >
                <td colSpan={2} className="fw-bold text-end py-2">
                      Total Ingresos  període
                </td>
                <td
                    className="fw-bold text-end py-2"
                    style={{
                        color: "#198754",
                        fontSize: "0.95rem",
                    }}
                    >
                     {totalIngresos.toLocaleString("ca-ES", {
                         minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                    })}
                  </td>
                  {sipre === 'Si' && (
                    <>
                    <td
                    className="fw-bold text-end py-2"
                    style={{
                        color: "#198754",
                        fontSize: "0.95rem",
                    }}
                    >
                     {totalIngresosP.toLocaleString("ca-ES", {
                         minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                    })}
                  </td>
                    <td
                    className="fw-bold text-end py-2"
                    style={{
                        color: "#198754",
                        fontSize: "0.95rem",
                    }}
                    >
                     {(totalIngresosP - totalIngresos).toLocaleString("ca-ES", {
                         minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                    })}
                  </td>
                 <td className="fw-bold text-end py-1 px-2"
                       style={{
                        color: "#198754",
                        fontSize: "0.95rem",
                    }}                     
                    >
                    {(totalIngresosP !== 0
                      ? (totalIngresos * 100) / totalIngresosP 
                      : 0
                    ).toLocaleString("ca-ES", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    </td>

                    </>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>
   {/*  ******************  Taula de Despeses ****************** */}
   <Container className="mt-3">
    <Row className="justify-content-center">
      <Col md={8}>
      <Card>
        <Card.Header
          className="fw-bold py-2 px-3"
          style={{ fontSize: "1rem" }}
        >
          Despeses
        </Card.Header>

        <Card.Body className="p-2">
          <div className="table-responsive">
            <table
              className="table table-sm table-hover align-middle mb-0"
              style={{
                fontSize: "0.85rem",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th className="text-secondary fw-normal py-1">Codi</th>
                  <th className="text-secondary fw-normal py-1">Nom</th>
                  <th className="text-secondary fw-normal py-1 text-end">
                    Import
                  </th>
                {sipre === 'Si' && ( 
                      <>               
                    <th className="text-secondary fw-normal py-1 text-end">
                    Pressup.
                    </th>
                     <th className="text-secondary fw-normal py-1 text-end">
                    Difer.
                  </th>
                     <th className="text-secondary fw-normal py-1 text-end">
                    %
                  </th>    
                  </>
                     )}            
                </tr>
              </thead>

              <tbody>
                {paddedItems
                  .filter(Boolean)
                  .filter(item => item.G01)
                  .filter(item => item.G03 === "D")
                  .map((item, index) => (
                    <tr
                      key={index}
                     
                       onClick={() => {
                              setSelectedItem(item);
                              setPantalla('1');
                       }}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedItem?.G01 === item.G01
                            ? "#e7f1ff"
                            : "transparent",
                      }}
                    >
                      <td className="fw-semibold py-1 px-2">
                        {item.G01}
                      </td>                      
                      <td
                             className="fw-bold text-muted py-1 px-2"
                              title={item.G02}
                              style={{
                              maxWidth: "100px",
                              whiteSpace: "nowrap",
                               overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                      >
                          {item.G02}
                    </td>                      
                       <td className=" fw-bold text-end py-1 px-2">
                         {(item.G04 ?? 0).toLocaleString("ca-ES", {
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0,
                          })}
                      </td>
                                  {sipre === 'Si' && (
                        <>    
                        <td className=" fw-bold text-end py-1 px-2">
                         {(item.G06 ?? 0).toLocaleString("ca-ES", {
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0,
                          })}
                      </td> 
                      <td className=" fw-bold text-end py-1 px-2">
                         {((item.G04 - item.G06) ?? 0).toLocaleString("ca-ES", {
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0,
                          })}
                      </td> 
                          <td className="fw-bold text-end py-1 px-2">
                              {(item.G06 !== 0
                                ? (item.G04 * 100) / item.G06
                                : 0
                              ).toLocaleString("ca-ES", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                   
                      </>
                      )}           
                    </tr>
                  ))}
              </tbody>
                <tfoot>
                <tr
                    style={{
                    borderTop: "2px solid #dee2e6",
                    backgroundColor: "#f8f9fa",
                }}
                 >
                <td colSpan={2} className="fw-bold text-end py-2">
                      Total Despeses  període
                </td>
                <td
                    className="fw-bold text-end py-2"
                    style={{
                        color: "#198754",
                        fontSize: "0.95rem",
                    }}
                    >
                     {totalDespeses.toLocaleString("ca-ES", {
                         minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                    })}
                  </td>
                    {sipre === 'Si' && (
                    <>
                    <td
                    className="fw-bold text-end py-2"
                    style={{
                        color: "#198754",
                        fontSize: "0.95rem",
                    }}
                    >
                     {totalDespesesP.toLocaleString("ca-ES", {
                         minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                    })}
                  </td>
                    <td
                    className="fw-bold text-end py-2"
                    style={{
                        color: "#198754",
                        fontSize: "0.95rem",
                    }}
                    >
                     {(totalDespesesP - totalDespeses).toLocaleString("ca-ES", {
                         minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                    })}
                  </td>
                 <td className="fw-bold text-end py-1 px-2"
                       style={{
                        color: "#198754",
                        fontSize: "0.95rem",
                    }}                     
                    >
                    {(totalDespesesP !== 0
                      ? (totalDespeses * 100) / totalDespesesP 
                      : 0
                    ).toLocaleString("ca-ES", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    </td>

                    </>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>
   {/*  ******************  Taula de Actiu  ****************** */}    
   <Container className="mt-3">
    <Row className="justify-content-center">
      <Col md={8}>
      <Card>
        <Card.Header
          className="fw-bold py-2 px-3"
          style={{ fontSize: "1rem" }}
        >
          Actiu
        </Card.Header>

        <Card.Body className="p-2">
          <div className="table-responsive">
            <table
              className="table table-sm table-hover align-middle mb-0"
              style={{
                fontSize: "0.85rem",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th className="text-secondary fw-normal py-1">Codi</th>
                  <th className="text-secondary fw-normal py-1">Nom</th>
                  <th className="text-secondary fw-normal py-1 text-end">
                    Import
                  </th>
                </tr>
              </thead>

              <tbody>
                  <tr
                    style={{
                        borderBottom: "2px solid #dee2e6",
                        backgroundColor: "#f8f9fa",
                         }}
                    >
                    <td colSpan={2} className="fw-bold text-end py-2">
                    Saldo inici període
                  </td>
                  <td
                      className="fw-bold text-end py-2"
                      style={{
                      color: "#0d6efd",
                      fontSize: "0.95rem",
                      }}
                    >                     
                    {totalActiuP.toLocaleString("ca-ES", {
                         minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                    })}
                
                  </td>
                </tr>
                {paddedItems
                  .filter(Boolean)
                  .filter(item => item.G01)
                  .filter(item => item.G03 === "A")
                  .map((item, index) => (
                    <tr
                      key={index}
                      
                       onClick={() => {
                              setSelectedItem(item);
                              setPantalla('1');
                       }}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedItem?.G01 === item.G01
                            ? "#e7f1ff"
                            : "transparent",
                      }}
                      
                    >
                      <td className="fw-semibold py-1 px-2">
                        {item.G01}
                      </td>
                      <td
                             className="fw-bold text-muted py-1 px-2"
                              title={item.G02}
                              style={{
                              maxWidth: "100px",
                              whiteSpace: "nowrap",
                               overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                      >
                          {item.G02}
                   </td>                    
                       <td className=" fw-bold text-end py-1 px-2">
                         {(item.G04 ?? 0).toLocaleString("ca-ES", {
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0,
                          })}
                      </td>
                    </tr>
                  ))}
              </tbody>
                <tfoot>
                <tr
                    style={{
                    borderTop: "2px solid #dee2e6",
                    backgroundColor: "#f8f9fa",
                }}
                 >
                <td colSpan={2} className="fw-bold text-end py-2">
                      Saldo  final període
                </td>
               
                <td
                    className="fw-bold text-end py-2"
                    style={{
                        color: "#198754",
                        fontSize: "0.95rem",
                    }}
                    >
                     {totalActiu.toLocaleString("ca-ES", {
                         minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>
   {/*  ******************  Taula de Passiu  ****************** */}
   <Container className="mt-3">
    <Row className="justify-content-center">
      <Col md={8}>
      <Card>
        <Card.Header
          className="fw-bold py-2 px-3"
          style={{ fontSize: "1rem" }}
        >
          Passiu
        </Card.Header>

        <Card.Body className="p-2">
          <div className="table-responsive">
            <table
              className="table table-sm table-hover align-middle mb-0"
              style={{
                fontSize: "0.85rem",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th className="text-secondary fw-normal py-1">Codi</th>
                  <th className="text-secondary fw-normal py-1">Nom</th>
                  <th className="text-secondary fw-normal py-1 text-end">
                    Import
                  </th>
                </tr>
              </thead>

              <tbody>
                  <tr
                    style={{
                        borderBottom: "2px solid #dee2e6",
                        backgroundColor: "#f8f9fa",
                         }}
                    >
                    <td colSpan={2} className="fw-bold text-end py-2">
                    Saldo inici període
                  </td>
                  <td
                      className="fw-bold text-end py-2"
                      style={{
                      color: "#0d6efd",
                      fontSize: "0.95rem",
                      }}
                    >
                
                             
                    {totalPassiuP.toLocaleString("ca-ES", {
                         minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                    })} 
                
                  </td>
                </tr>
                {paddedItems
                  .filter(Boolean)
                  .filter(item => item.G01)
                  .filter(item => item.G03 === "P") 
                  .map((item, index) => (
                    <tr
                      key={index}
                     
                       onClick={() => {
                              setSelectedItem(item);
                              setPantalla('1');
                       }}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedItem?.G01 === item.G01
                            ? "#e7f1ff"
                            : "transparent",
                      }}
                    >
                      <td className="fw-semibold py-1 px-2">
                        {item.G01}
                      </td>
                      <td
                             className="fw-bold text-muted py-1 px-2"
                              title={item.G02}
                              style={{
                              maxWidth: "100px",
                              whiteSpace: "nowrap",
                               overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                      >
                          {item.G02}
                  </td>                    
                       <td className=" fw-bold text-end py-1 px-2">
                         {(item.G04 ?? 0).toLocaleString("ca-ES", {
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0,
                          })}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr
                    style={{
                    borderTop: "2px solid #dee2e6",
                    backgroundColor: "#f8f9fa",
                }}
                 >
                <td colSpan={2} className="fw-bold text-end py-2">
                      Saldo final període
                </td>
                <td
                    className="fw-bold text-end py-2"
                    style={{
                        color: "#198754",
                        fontSize: "0.95rem",
                    }}
                    >
                     {totalPassiu.toLocaleString("ca-ES", {
                         minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>
</div>
</>
  )};
{/* *******************  pantalla 2 ****************************************** */}
  {pantalla === '1' && (
       <>
         <div ref={pdfRef}> 
    <Container className="mt-3">
  <Row className="justify-content-center">
    <Col md={8}>
      <Card>
        <Card.Header
          className="fw-bold py-3 text-center"
          style={{ fontSize: "0.8rem" }}
        >
          <div className="mb-1">
            <span className="text-primary">Codi:</span> {pant01}
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-primary">Nom:</span> {pant02}
          </div>
          {pant05 === 'I' && (
            <div>
              <span className="text-success">Ingressos període :</span> {pant03} €
            </div>
          )}
           {pant05 === 'D' && (
            <div>
              <span className="text-success">Despeses període :</span> {pant03} €
            </div>
          )}
           {pant05 === 'A' && (
            <div>
              <span className="text-success">Saldo ant.:</span> {pant13} €
                &nbsp;&nbsp;&nbsp;
              <span className="text-success">Movs. període :</span> {pant03} €
                &nbsp;&nbsp;&nbsp;
              <span className="text-success">Saldo act :</span> {pant23} €
            </div>
          )}
           {pant05 === 'P' && (
               <div>
              <span className="text-success">Saldo ant.:</span> {pant13} €
                &nbsp;&nbsp;&nbsp;
              <span className="text-success">Movs. període :</span> {pant03} €
                &nbsp;&nbsp;&nbsp;
              <span className="text-success">Saldo act :</span> {pant23} €
            </div>
          )}
        </Card.Header>
         {(pant05 === 'I' || pant05 === 'D') && (
          <Card.Body className="p-2">
           <div className="table-responsive">
              <table
              className="table table-sm table-hover align-middle mb-0"
                   style={{
                       fontSize: "0.85rem",
                        borderCollapse: "collapse",
                    }}
               >
              <thead>
                <tr>
                  <th className="text-secondary fw-bold py-1">Codi</th>
                  <th className="text-secondary fw-bold py-1">Nom</th>
                  <th className="text-secondary fw-bold py-1 text-end">Ing./desp.</th>
                     {sipre === 'Si' && (
                      <>
                  <th className="text-secondary fw-bold py-1 text-end">pressupost</th>
                  <th className="text-secondary fw-bold py-1 text-end">difer.</th>
                  <th className="text-secondary fw-bold py-1 text-end">%</th>
                      </>
                     )}
                  </tr>
              </thead>
              <tbody>
                {paddedItems1
                  .filter(Boolean)
                  .filter(item => item.C03 === pant01)                  
                  .map((item, index) => (
                    <tr
                      key={index}                     
                       onClick={() => {
                              setSelectedItem1(item);
                              setPantalla('2');
                       }}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedItem?.C01 === item.C01
                            ? "#e7f1ff"
                            : "transparent",
                      }}
                    >
                      <td className="fw-semibold py-1 px-2"
                                          
                          style={{
                             minWidth: "4ch", 
                             whiteSpace: "nowrap",
                            }}
                            >
                             {item.C01}
                      </td>
                 
                        <div
                          className="text-muted"
                           style={{
                              fontSize: "0.75rem",
                              lineHeight: "1.1",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              }}
                             >
                               {item.C02}
                          </div>                 
                       <td className=" fw-bold text-end py-1 px-2"
                         style={{
                              maxWidth: "40px",                           
                            }}
                       >
                         {(item.C04 ?? 0).toLocaleString("ca-ES", {
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0,
                          })}
                      </td>
                        {sipre === 'Si' && (
                        <>    
                        <td className=" fw-bold text-end py-1 px-2">
                         {(item.C07 ?? 0).toLocaleString("ca-ES", {
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0,
                          })}
                      </td>      <td className=" fw-bold text-end py-1 px-2">
                         {((item.C07 - item.C04) ?? 0).toLocaleString("ca-ES", {
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0,
                          })}
                      </td>
                      <td className="fw-bold text-end py-1 px-2">
                            {(item.C07 !== 0
                              ? (item.C04 * 100) / item.C07
                              : 0
                            ).toLocaleString("ca-ES", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>   
                   
                      </>
                      )}           
                      
                  
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
         </Card.Body>
          )}
          {(pant05 === 'A' || pant05 === 'P') && (
          <Card.Body className="p-2">
           <div className="table-responsive">
              <table
              className="table table-sm table-hover align-middle mb-0"
                   style={{
                       fontSize: "0.85rem",
                        borderCollapse: "collapse",
                    }}
               >
              <thead>
                <tr>
                  <th className="text-secondary fw-bold py-1">Codi</th>
                  <th className="text-secondary fw-bold py-1">Nom</th>
                  <th className="text-secondary fw-bold py-1 text-end">Saldo Anterior</th>
                  <th className="text-secondary fw-bold py-1 text-end">Movs. període</th>
                  <th className="text-secondary fw-bold py-1 text-end">Saldo Actual</th>
                </tr>
              </thead>
              <tbody>
                {paddedItems1
                  .filter(Boolean)
                  .filter(item => item.C03 === pant01)                  
                  .map((item, index) => (
                    <tr
                      key={index}                     
                       onClick={() => {
                              setSelectedItem1(item);
                              setPantalla('2');
                       }}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedItem?.C01 === item.C01
                            ? "#e7f1ff"
                            : "transparent",
                      }}
                    >
                      <td className="fw-semibold py-1 px-2"
                                          
                          style={{
                             minWidth: "4ch", 
                             whiteSpace: "nowrap",
                            }}
                            >
                             {item.C01}
                      </td>
                 
                        <div
                          className="text-muted"
                           style={{
                              fontSize: "0.75rem",
                              lineHeight: "1.1",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              }}
                             >
                               {item.C02}
                          </div>                 
                       <td className=" fw-bold text-end py-1 px-2"
                         style={{
                              maxWidth: "40px",                           
                            }}
                       >
                         {(item.C05 ?? 0).toLocaleString("ca-ES", {
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0,
                          })}
                      </td>
                        <td className=" fw-bold text-end py-1"
                         style={{
                              maxWidth: "40px",                           
                            }}
                        >
                         {(item.C04?? 0).toLocaleString("ca-ES", {
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0,
                          })}
                      </td>
                        <td className=" fw-bold text-end py-1 px-2"
                         style={{
                              maxWidth: "40px",                           
                            }}
                        >
                         {(item.C06 ?? 0).toLocaleString("ca-ES", {
                             minimumFractionDigits: 0,
                             maximumFractionDigits: 0,
                          })}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
         </Card.Body>
          )}
         <div>
          <Button
            variant="warning"
            size="sm"
            onClick={Fisegonapart}
          >
            <i className="fas fa-sign-out-alt me-2"></i>
            Tancar pantalla
          </Button>  
          </div>     
        </Card>
      </Col>
    </Row>
   </Container> 
   </div>   
    </>
   )}
    {/* *******************  pantalla 3 ****************************************** */}
  {pantalla === '2' && (
       <>
         <div ref={pdfRef}> 
    <Container className="mt-3">
  <Row className="justify-content-center">
    <Col md={8}>
      <Card>
        <Card.Header
          className="fw-bold py-3 text-center"
          style={{ fontSize: "0.85rem" }}
        >
            <div className="mb-1">
            <span className="text-primary">Codi:</span> {pant01}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-primary"></span> {pant02}
          </div>
          <div className="mb-1">
            <span className="text-primary">compte -</span> {selectedItem1.C01}
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className="text-primary"></span> {selectedItem1.C02}
          </div>
          <div>
               {/*  compte seleccionat a comptasel */}
            <span className="text-success">Selecciona un compte:</span>
           &nbsp;&nbsp;&nbsp;
      <span>{pant01}.{selectedItem1.C01}.</span>
      <input
          type="text"
          maxLength={3}
          style={{ width: "40px" }}
          onChange={(e) => {
          const detall = e.target.value.replace(/\D/g, "");
          if (detall.length === 3) {
            setComptasel(`${pant01}.${selectedItem1.C01}.${detall}`);
          } else {
            setComptasel("");
          }
           }}
      />
       </div>
        </Card.Header>
        <Card.Body className="p-2">
           <div className="table-responsive">
              <table
              className="table table-sm table-hover align-middle mb-0"
                   style={{
                       fontSize: "0.80rem",
                        borderCollapse: "collapse",
                    }}
               >
              <thead>
                <tr>
                  <th className="text-secondary fw-normal py-1">ordre</th>
                  <th className="text-secondary fw-normal py-1">Mes</th>
                  <th className="text-secondary fw-normal py-1">origen</th>
                 
                  <th className="text-secondary fw-normal py-1">destí</th>
                
                  <th className="text-secondary fw-normal py-1">concepte</th>
                  <th className="text-secondary fw-normal py-1 text-end">
                    Import
                  </th>
                </tr>
              </thead>

           <tbody>
  {paddedItems2    
    .filter(Boolean)
    .filter(item => {
  const [grup1, compte1, detall1] = (item.M02 || "").split(".");
  const [grup2, compte2, detall2] = (item.M03 || "").split(".");
  const [grup3, compte3, detall3] = (comptasel || "").trim().split(".");

  const matchSelected =
    (grup1 === selectedItem1.C03 &&
      compte1 === selectedItem1.C01) ||
    (grup2 === selectedItem1.C03 &&
      compte2 === selectedItem1.C01);

  const matchComptaSel =
    !comptasel?.trim() ||
    (
      (grup1 === grup3 &&
        compte1 === compte3 &&
        detall1 === detall3) ||
      (grup2 === grup3 &&
        compte2 === compte3 &&
        detall2 === detall3)
    );

  return (
    matchSelected &&
    matchComptaSel &&
    item.M07 >= periodeDel &&
    item.M07 <= periodeAl
  );
})
 
    .map((item, index) => {
      const filaSeleccionada =     
        selectedItem3?.C01 === item.C01;
      const [grup1, compte1] = (item.M02 || "").split(".");
      const [grup2, compte2] = (item.M03 || "").split(".");

      const pintarM02 =
        filaSeleccionada &&
        grup1 === selectedItem1.C03 &&
        compte1 === selectedItem1.C01;

      const pintarM03 =
        filaSeleccionada &&
        grup2 === selectedItem1.C03 &&
        compte2 === selectedItem1.C01;
      
        const DH =
        filaSeleccionada &&
        grup2 === selectedItem1.C03 &&
        compte2 === selectedItem1.C01;
      return (
     <tr
  key={index}
  onClick={() => {
    setSelectedItem3(item);
    setPantalla("3");
  }}
  style={{
    cursor: "pointer",
    backgroundColor: filaSeleccionada ? "#e7f1ff" : "transparent",
  }}
>
  <td className="py-1 px-2">{item.M01}</td>
 
  <td className="py-1 px-2">{item.M07?.substring(5, 7)}</td>
  <td
    className="py-1 px-2"
    style={{
      backgroundColor: pintarM02 ? "#e5f68f" : undefined,
      minWidth: "140px",
    }}
  >
    <div className="fw-bold">{item.M02}</div>
    <div
      className="text-muted"
      style={{
        fontSize: "0.75rem",
        lineHeight: "1.1",
        whiteSpace: "normal",
        wordBreak: "break-word",
      }}
    >
      {item.M02NN}
    </div>
  </td>

  <td
    className="py-1 px-2"
    style={{
      backgroundColor: pintarM03 ? "#e5f68f" : undefined,
      minWidth: "140px",
    }}
  >
    <div className="fw-bold">{item.M03}</div>
    <div
      className="text-muted"
      style={{
        fontSize: "0.75rem",
        lineHeight: "1.1",
        whiteSpace: "normal",
        wordBreak: "break-word",
      }}
    >
      {item.M03NN}
    </div>
  </td>

  <td
    className="text-muted py-1 px-2"
    style={{
      maxWidth: "250px",
      whiteSpace: "normal",
    }}
  >
    {item.M05}
  </td>

  <td className="fw-bold text-end py-1 px-2">
    {(DH ? -item.M04 : item.M04).toLocaleString("ca-ES", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}
  </td>
</tr>
      );
    })}
</tbody>
            </table>
          </div>
        </Card.Body>
         <div>
          <Button
            variant="warning"
            size="sm"
            onClick={Fitercerapart}
          >
            <i className="fas fa-sign-out-alt me-2"></i>
            Tancar pantalla
          </Button>  
          </div>     
        </Card>
      </Col>
    </Row>
   </Container> 
   </div>   
    </>
  )}
      {/* *******************  pantalla 4 ****************************************** */}
  {pantalla === '3' && (
       <>
   <div ref={pdfRef}> 
    <Container className="mt-3">
  <Row className="justify-content-center">
    <Col md={8}>
      <Card>
        <Card.Header
          className="fw-bold py-3 text-center"
          style={{ fontSize: "1.2rem" }}
        >
           
          <div className="mb-1">
            <span className="text-primary">Ordre -</span> {selectedItem3.M01}          
          </div>          
        </Card.Header> 
       
            <Card.Body className="p-5">           
             <Form>
              <Form.Group className="mb-4">   
                <div className="d-flex align-items-center gap-3 mb-3">
                   <Form.Label
                    className="fw-semibold mb-0"
                 
                    style={{ fontSize: "0.95rem", minWidth: "70px" }} 
                  >
                    Data 
                   </Form.Label>          
                <Form.Control
                  type="text"
                  
                     value={selectedItem3.M06?.replace(/\s+/g, " ") || ""} 
                         className="py-2 rounded-3 fw-bold"
                        style={{
  
                       
                          width: "90px",
                          fontSize: "0.80rem",
                          backgroundColor: "#d1fae5",
                          border: "1px solid #b6c2d1",
                          color: "#334155"
                        }}
                />  
                
                       
                </div> 
                  <div className="d-flex align-items-center gap-3 mb-3">
                   <Form.Label
                    className="fw-semibold mb-0"
                  
                    style={{ fontSize: "0.95rem", minWidth: "70px" }} 
                  >
                    Periode 
                   </Form.Label>          
                <Form.Control
                  type="text"
                    value={selectedItem3.M07}
                         className="py-2 rounded-3 fw-bold"
                        style={{
  
                       
                          width: "90px",
                          fontSize: "0.80rem",
                          backgroundColor: "#d1fae5",
                          border: "1px solid #b6c2d1",
                          color: "#334155"
                        }}
                />  
                
                       
                </div> 
                     <div className="d-flex align-items-center gap-3 mb-3">
                   <Form.Label
                    className="fw-semibold mb-0"
                   
                   style={{ fontSize: "0.95rem", minWidth: "70px" }} 
                  >
                    origen
                   </Form.Label>          
                <Form.Control
                  type="text"
                    value={selectedItem3.M02}
                         className="py-2 rounded-3 fw-bold"
                        style={{
                          width: "100px",
                          fontSize: "0.80rem",
                          backgroundColor: "#d1fae5",
                          border: "1px solid #b6c2d1",
                          color: "#334155"
                        }}
                />  
                
                <Form.Control
                  type="text"
                   value={selectedItem3.M02NN}  
                         className="py-2 rounded-3 fw-bold"
                        style={{
                          width: "450px",
                          fontSize: "0.80rem",
                          backgroundColor: "#d1fae5",
                          border: "1px solid #b6c2d1",
                          color: "#334155"
                        }}
                />                
                </div>           
                <div className="d-flex align-items-center gap-3 mb-3">
                   <Form.Label
                    className="fw-semibold mb-0"                   
                    style={{ fontSize: "0.95rem", minWidth: "70px" }}
                  >
                    Destí
                   </Form.Label>     
          
            <Form.Control
             type="text"
             value={selectedItem3.M03}            
             className="py-2 rounded-3 fw-bold"
             style={{
                    width: "100px",
                    fontSize: "0.80rem",
                    backgroundColor: "#d1fae5",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
              }}
           />
            <Form.Control
             type="text"
             value={selectedItem3.M03NN}                   
             className="py-2 rounded-3 fw-bold"
             style={{
                    width: "450px",
                    fontSize: "0.80rem",
                    backgroundColor: "#d1fae5",
                     border: "1px solid #b6c2d1",
                   color: "#334155"
              }}
           />
           </div>
    
          <div className="d-flex align-items-center gap-3 mb-3">
          <Form.Label
              className="fw-semibold mb-0"
              style={{ fontSize: "0.95rem", minWidth: "70px" }}
          >
          Import
           </Form.Label>
          <Form.Control
              type="number"
              step="0.01"
              min="0"
              value={selectedItem3.M04}
             
              className="py-2 rounded-3 fw-bold"
              style={{
              width: "80px",
              fontSize: "0.80rem",
              backgroundColor: "#dbe4f0",
              border: "1px solid #b6c2d1",
              color: "#334155",
              textAlign: "right"
               }}
              placeholder="0,00"
           />
            </div> 
            <div className="d-flex align-items-center gap-3 mb-3">
       <Form.Label
          className="fw-semibold mb-0"
          style={{ fontSize: "0.95rem", minWidth: "70px" }}       >
             Concepte
        </Form.Label>
        <Form.Control
            type="text"
            value={selectedItem3.M05}
          
            className="py-2 rounded-3 fw-bold"
            style={{
                width: "300px",
                fontSize: "0.80rem",
                backgroundColor: "#d1fae5",
                border: "1px solid #b6c2d1",
                color: "#334155"
             }}
            placeholder=".."
          />
           </div>
                <div className="d-flex align-items-center gap-3 mb-3">
       <Form.Label
          className="fw-semibold mb-0"
          style={{ fontSize: "0.95rem", minWidth: "70px" }}       >
             Notes
        </Form.Label>
        <Form.Control
            type="text"
           
            value={selectedItem3.M10?.replace(/\s+/g, " ") || ""}         
            className=" fw-bold"
            style={{
                width: "300px",
                fontSize: "0.80rem",
                backgroundColor: "#d1fae5",
                border: "1px solid #b6c2d1",
                color: "#334155"
             }}
       
          />
           </div>
          </Form.Group>
        </Form>    
      </Card.Body>   
 
    <br></br>    
   
         <div>
          <Button
            variant="warning"
            size="sm"
            onClick={Fiquart}          >
            <i className="fas fa-sign-out-alt me-2"></i>
            Tancar pantalla
          </Button>  
          </div>     
        </Card>
      </Col>
    </Row>
   </Container> 
   </div> 
   </>  
  )}
     </Card>
    </Col>
    </Row>
   </div>
  );
}
export default CMenu;


{/*
 .filter(item => {
      const [grup1, compte1] = (item.M02 || "").split(".");
      const [grup2, compte2] = (item.M03 || "").split(".");
      const [grup3, compte3,detall3] = (comptasel || "").split(".");
      const usarComptaSel = comptasel?.trim() !== "";
      
      return (
        ( (grup1 === selectedItem1.C03      &&
            compte1 === selectedItem1.C01)    ||
          (grup2 === selectedItem1.C03      && 
           compte2 === selectedItem1.C01))  &&
          ( item.M07 >= periodeDel )        &&
          ( item.M07 <= periodeAl)
        )
    })

  */}