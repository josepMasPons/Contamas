import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Nav, Col, Card, Button } from "react-bootstrap";
import { doc, setDoc, getDoc, query, where, getDocs, collection } from 'firebase/firestore';
import "./CPresC.css";
import {db } from '../firebaseLoc';

import { findAllByTestId } from '@testing-library/react';
import {exportarPDF} from '../Backups/ExportarPDF';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
 
function CconsultaCB() { 
  const navigate=useNavigate();
   const pdfRef = useRef();
  const [grupC, setGrupC] = useState([]); 
  const [compteC, setCompteC] = useState([]); 
  const [compteD, setCompteD] = useState([]); 
  const [grupx, setGrupx] = useState(localStorage.getItem('Proces071') || '');
  const [paraulax, setParaulax] = useState(localStorage.getItem('Proces072') || '');
  const [data, setData] = useState([]);
  const [direct1, setDirect1] = useState(localStorage.getItem('Mapa99') || '');
  const [directS, setDirectS] = useState(false);
  const [filaSel, setFilaSel] = useState(null);

  const [any, setAny] = useState('');
  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  const [empresa, setEmpresa] = useState(localStorage.getItem('Empresa'));
  const [percon, setPercon] = useState(localStorage.getItem('Percon'));
  const [grupZ, setGrupZ] = useState([]);
  const [comptesZ, setComptesZ] = useState([]);
  const removeAccents = (str) => {
     return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const [itemsPerPage, setItemsPerPage] = useState(1500);
  const [mapes, setMapes] = useState([]);
  const currentItems=data.slice(0, itemsPerPage);
  const emptyRows = itemsPerPage - currentItems.length;
  const paddedItems = [...currentItems, ...Array(emptyRows).fill({ temp: '.', nom: ' ', codi: 'empty' })];

  useEffect(() => {
    const [anyi, mesi] = percon.split("/");
    setAny(anyi);
  }, [percon]); 
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

useEffect(() => {
  const fetchData = async () => {
   // console.log('emresa ----- ',empresa)
    const linksCollection = collection(db, "PresG");

    try {
      const q = query(linksCollection, where("P00", "==", empresa));
      const querySnapshot = await getDocs(q);
      // Llegim totes les files
      let linksData = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const [P1, P2] = data.P02.split(".");

        const importMov =
          Number(data.P11 || 0) +
          Number(data.P12 || 0) +
          Number(data.P13 || 0) +
          Number(data.P14 || 0) +
          Number(data.P15 || 0) +
          Number(data.P16 || 0) +
          Number(data.P17 || 0) +
          Number(data.P18 || 0) +
          Number(data.P19 || 0) +
          Number(data.P20 || 0) +
          Number(data.P21 || 0) +
          Number(data.P22 || 0);

        const grup2 = compteC.find(
          (g) =>
            g.C00 === empresa &&
            g.C03 === P1 &&
            g.C01 === P2
        );
        const grup3 = comptesZ.find(
          (h) =>
            h.M00 === empresa          
        );
        console.log('grup3 - ',grup3);
        return {
          id: docSnap.id,
          ...data,
          P23: importMov,
          D04N: grup2 ? grup2.C02 : "",
          R11: 234,
          R14:12,
          R21:2324,
        };
      });

      // Ordenar pel compte
      linksData.sort((a, b) => a.P02.localeCompare(b.P02));

      const resultat = [];

      let grupActual = "";
      let subtotal = {
        P11:0,P12:0,P13:0,P14:0,P15:0,P16:0,
        P17:0,P18:0,P19:0,P20:0,P21:0,P22:0,P23:0
      };

      let total = {
        P11:0,P12:0,P13:0,P14:0,P15:0,P16:0,
        P17:0,P18:0,P19:0,P20:0,P21:0,P22:0,P23:0
      };
      //console.log(linksData.map(x => x.P02));
      linksData.forEach((fila,index)=>{

        const grup=fila.P02.substring(0,2);

        if(grupActual!=="" && grup!==grupActual){

            resultat.push({
                id:"TOTAL"+grupActual,
                P02:grupActual+".999",
                D04N:"TOTAL GRUP "+grupActual,
                ...subtotal
            });

            subtotal={
              P11:0,P12:0,P13:0,P14:0,P15:0,P16:0,
              P17:0,P18:0,P19:0,P20:0,P21:0,P22:0,P23:0
            };
        }

        grupActual=grup;

        resultat.push(fila);

        ["P11","P12","P13","P14","P15","P16",
         "P17","P18","P19","P20","P21","P22","P23"]
         
        .forEach(camp=>{
            subtotal[camp]+=Number(fila[camp]||0);
            total[camp]+=Number(fila[camp]||0);
        });

      });

      // últim grup

      resultat.push({
          id:"TOTAL"+grupActual,
          P02:grupActual+".999",
          D04N:"TOTAL GRUP "+grupActual,
          ...subtotal
      });

      // resultat final

      resultat.push({
          id:"RESULTAT",
          P02:"99.999",
          D04N:"RESULTAT",
          ...total
      });
      //console.log(resultat.length);
     // console.log(resultat);
      setData(resultat);
      setItemsPerPage(resultat.length);

    } catch (error) {
      console.error(error);
    }
  };

  fetchData();

}, [compteC, empresa,comptesZ]);

        //   *********  llegir  compteC  i posarho a taula CompteC ******
        useEffect(() => {
       const fetchData2 = async () => {
         const linksCollection = collection(db, 'CompteG');
         try {
           const q = query(
                      linksCollection,
                       where("C00", "==", empresa)
                    );
          
           const querySnapshot = await getDocs(q);
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
       
         }
       };
       fetchData2();
     }, []);
 // *************************** llegir els movs i sumar import a grup i compte
 
 useEffect(() => {
   const fetchData3 = async () => {
     try {
       const q = query(
         collection(db, "MovsG"),         
         where("M00", "==", empresa),
         where("M07", ">=", `${any}/01`),
         where("M07", "<=", `${any}/12`)
        ); 
       const querySnapshot = await getDocs(q);
 
       const grups = {};
       const comptes = {};
       const movimentsEmpresa = [];    
       const acumulaC = (grup, compte,importMovz,mesz) => {
           if (!grup || !compte) return;
           const key = `${grup}${compte}`; 
           comptes[key] ??= {
             comptes: key,
             import: 0, R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0,
                        R17: 0, R18: 0, R19: 0, R20: 0, R21: 0, R22: 0,
           };
          comptes[key].import += importMovz;
          if (mesz === '01') {comptes[key].R11 += importMovz;} 
          if (mesz === '02') {comptes[key].R12 += importMovz;}
          if (mesz === '03') {comptes[key].R13 += importMovz;}
          if (mesz === '04') {comptes[key].R14 += importMovz; }
          if (mesz === '05') {comptes[key].R15 += importMovz; }
          if (mesz === '06') {comptes[key].R16 += importMovz; }
          if (mesz === '07') {comptes[key].R17 += importMovz; }
          if (mesz === '08') {comptes[key].R18 += importMovz; }
          if (mesz === '09') {comptes[key].R19 += importMovz; }
          if (mesz === '10') {comptes[key].R20 += importMovz; }
          if (mesz === '11') {comptes[key].R21 += importMovz; }
          if (mesz === '12') {comptes[key].R22 += importMovz; }
       }; 
       
       querySnapshot.forEach((docSnap) => {
           const dataM = docSnap.data();
           const [grup1, compte1,numero1] = (dataM.M02 || "").split(".");
           const [grup2, compte2,numero2] = (dataM.M03 || "").split(".");          
           const importMovz = Number(dataM.M04) || 0;
           const [anyz,mesz] = (dataM.M07).split('.'); 
           const [grupO = "", compteO = ""] =
           String(dataM.M02 || "").split(".");
           acumulaC(grupO, compteO, importMovz, mesz);
           const [grupD = "", compteD = ""] =
           String(dataM.M03 || "").split(".");
           acumulaC(grupD, compteD, -importMovz, mesz);
       });
 
       //setData2(movimentsEmpresa);
       //setGrupZ(Object.values(grups));
       setComptesZ(Object.values(comptes));
 
     } catch (error) {
       console.error("Error llegint MovsG:", error);
     }
   };
 
   fetchData3();
 
 }, [empresa,]);



 const exportar_a_PDF = async () => {
     const dataM = new Date();
     const datae2 =  `${dataM.getDate()}/${dataM.getMonth()+1}/${dataM.getFullYear()}`; 
     const generar = () => {
    exportarPDF(pdfRef.current, "Pla_comptes_"+datae2);
  };
  generar();
};


function Sacabat() {  
      navigate('/CPresG');
      }   
  return (    
  <div className="P02b_center-contentP2">
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
                   CONSULTA <span style={{ color: "#0d6efd" }}>Pressupost</span>
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
                    <div >
            <Button className="mb-2"  
              size='sm'                         
              variant="warning"
              onClick={Sacabat}>
                   Enrere
            </Button>           
          </div>
        
              </div>
   </Card.Header>
  <Container className="P02B_my-mt5">
    <div ref={pdfRef}>
    <Row className="P02B_my-justify-center">
      <Col xs={12}>
        <Card>
          <Card.Header className="P02B_my-fs5 
                                  P02B_my-fw-bold">
            Comptes
          </Card.Header>
          <Card.Body>
<div
  className="table-responsive"
  style={{
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  }}
>
  <table
    className="table table-sm table-hover align-middle mb-0"
    style={{
      fontSize: "0.78rem",
      whiteSpace: "nowrap",
    }}
  >
    <thead
      className="sticky-top"
      style={{
        background: "#f8fafc",
      }}
    >
      <tr>
        <th>Compte</th>
        <th>Nom compte</th>
        <th>real/press.</th>
        <th className="text-end">Gen</th>
        <th className="text-end">Feb</th>
        <th className="text-end">Mar</th>
        <th className="text-end">Abr</th>
        <th className="text-end">Mai</th>
        <th className="text-end">Jun</th>
        <th className="text-end">Jul</th>
        <th className="text-end">Ago</th>
        <th className="text-end">Set</th>
        <th className="text-end">Oct</th>
        <th className="text-end">Nov</th>
        <th className="text-end">Des</th>
        <th
               className="text-end"
               style={{
                backgroundColor: "#e2e8f0",
               fontWeight: "700",
               borderLeft: "2px solid #94a3b8",
                }}
          >
            Total
        </th>
      </tr>
    </thead>

 <tbody>
  {paddedItems
    .filter(Boolean)
    .filter((item) => item.P02)
    .map((item, index) => {
      const esResultat = item.P02 === "99.999";
      const esSubtotal = item.P02.endsWith(".999") && !esResultat;

      const rowStyle = {
        backgroundColor: esResultat
          ? "#dcfce7"
          : esSubtotal
          ? "#dbeafe"
          : "#fff",
        fontWeight: esSubtotal || esResultat ? "700" : "500",
       // borderTop: esSubtotal  ? "2px solid #8b7e64" : "",
      };

      return (
       <React.Fragment key={index}>
          {/* PRESSUPOST */}
          <tr style={rowStyle}>
            <td>{item.P02}</td>
            <td>{item.D04N}</td>
            <td>Press.</td>

            {Array.from({ length: 13 }, (_, i) => (
              <td key={i} className="text-end"
              style={
                i === 12
              ? {
               backgroundColor: "#e2e8f0",
                fontWeight: "700",
                borderLeft: "2px solid #94a3b8",
                }
            : {}
             }
              >
                {Number(item[`P${11 + i}`] || 0).toLocaleString("ca-ES")}
              </td>
            ))}
          </tr>

          {/* REAL */}
          <tr style={rowStyle}>
            <td></td>
            <td></td>
            <td>Real</td>
            {Array.from({ length: 13 }, (_, i) => (
            <td
              key={i}
              className="text-end"
             style={
                i === 12
                  ? {
                   backgroundColor: "#e2e8f0",
                   fontWeight: "700",
                   borderLeft: "2px solid #94a3b8",
                }
             : {}
            }
            >
           {Number(item[`R${11 + i}`] || 0).toLocaleString("ca-ES")}
         </td>
          ))}
        
          </tr>

          {/* DIFERÈNCIA */}
          <tr style={rowStyle}>
            <td></td>
            <td></td>
            <td>Dif.</td>
          {Array.from({ length: 13 }, (_, i) => {
              const pressupost = Number(item[`P${11 + i}`] || 0);
               const real = Number(item[`R${11 + i}`] || 0);
               const diferencia = real - pressupost;

              return (
              <td
                 key={i}
                    className="text-end"
                    style={{
                        color:
                        diferencia > 0
                         ? "green"
                        : diferencia < 0
                          ? "red"
                        : "inherit",
                        ...(i === 12
                          ? {
                        backgroundColor: "#e2e8f0",
                       fontWeight: "700",
                       borderLeft: "2px solid #94a3b8",
                    }
                    : {}),
                  }}
                  >
                  {diferencia.toLocaleString("ca-ES")}
                </td>
             );
            })}
          </tr>

        {/* FILA EN BLANC ENTRE GRUPS */}
<tr>
  <td
    colSpan={16}
    style={{
      height: "10px",
      padding: 0,
      border: "none",
      backgroundColor: "#f2dcdc",
    }}
  />
</tr>

{/* LÍNIA DESPRÉS DEL SUBTOTAL */}
{esSubtotal && (
  <tr>
    <td
      colSpan={16}
      style={{
        height: "3px",
        padding: 0,
        border: "none",
        backgroundColor: "#475569", // gris fosc
      }}
    />
  </tr>
)}
        </React.Fragment>
      );
    })}
</tbody>
  </table>
</div>
</Card.Body>
          <div >
            <Button className="mb-2"  
              size='sm'                         
              variant="warning"
              onClick={Sacabat}>
                   Enrere
            </Button>
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button className="mb-2"  
                variant="success"
                size="sm"
                onClick={exportar_a_PDF}
                >
                Generar PDF
            </Button>           
          </div>
        </Card>
      </Col>
    </Row>
    </div>
  </Container>
</div>
  );
}
export default CconsultaCB;