import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Nav, Col, Card, Button } from "react-bootstrap";
import { doc, setDoc, getDoc, query, where, getDocs, collection } from 'firebase/firestore';
import "./CconsultaCB.css";
import {db } from '../firebaseLoc';

import { findAllByTestId } from '@testing-library/react';
import {exportarPDF} from '../CCGlobal/ExportarPDF';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Benrera from '../CCGlobal/Benrera';
 
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
  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  const [empresa, setEmpresa] = useState(localStorage.getItem('Empresa'));
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const [itemsPerPage, setItemsPerPage] = useState(1500);
  const [mapes, setMapes] = useState([]);
  const currentItems=data.slice(0, itemsPerPage);
  const emptyRows = itemsPerPage - currentItems.length;
  const paddedItems = [...currentItems, ...Array(emptyRows).fill({ temp: '.', nom: ' ', codi: 'empty' })];
 
 useEffect(() => {
    const fetchData = async () => {
      const linksCollection = collection(db, 'CompteD');
      try {
        const querySnapshot = await getDocs(linksCollection);
        const linksData = querySnapshot.docs.map((docSnap) => {
           const data = docSnap.data();
    
         // Buscar coincidència a grupC
           const grup = grupC.find(g => g.G01 === data.D03
                                &&      g.G00 === empresa);
          // Buscar coincidència a comptesC
           const grup2 = compteC.find(g => g.C03 === data.D03
                                &&      g.C00 === empresa
                                &&      g.C01 === data.D04);
        return {
          id: docSnap.id,
          ...docSnap.data(),  
        
          D03N: grup? `${grup?.G02 || ''}` : '',
          D04N: grup2? `${grup2?.C02 || ''}` : '', 
          G03: grup? `${grup?.G03 || ''}` : '', 
        };
      });
 
      const filteredData = linksData.filter((item) => {
          const safeTrimmedValue = (value) => {
          if (value === null || value === undefined) return "";
          return String(value).trim().toLowerCase();
      };

        const empresaNorm = empresa?.trim().toLowerCase() || "";
        const isEmpresaValid =
          (item.D00 || "").trim().toLowerCase() === empresaNorm;

        const isGrupValid =
          grupx?.trim() === "" ||
          grupx?.trim() === "null" ||
          grupx.trim() === item.D03.trim();

        const textCerca = removeAccents(
          (paraulax || "").trim().toLowerCase()
        );
       //  console.log("Text cerca:", textCerca);
        // console.log("Text item:", item.M02O, item.M03D, item.M05);
        const isParaulaxValid =
          textCerca === "" ||
          removeAccents(safeTrimmedValue(item.D01)).includes(textCerca) ||
          removeAccents(safeTrimmedValue(item.D02)).includes(textCerca) ||
          removeAccents(safeTrimmedValue(item.D03N)).includes(textCerca) ||
          removeAccents(safeTrimmedValue(item.D04N)).includes(textCerca) ||
          removeAccents(safeTrimmedValue(item.M05)).includes(textCerca);

        return (
          isEmpresaValid &&
          isGrupValid &&
          isParaulaxValid
        );
      });

      setData(filteredData);
      setItemsPerPage(filteredData.length);
    } catch (error) {
      console.error("Error llegint MovsG:", error);
    }
  };

  
    fetchData();
 
}, [compteC, empresa, grupx, paraulax]);
 
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
          
         }
       };
       fetchData1();
     }, []);
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
 
 const exportar_a_PDF = async () => {
     const dataM = new Date();
     const datae2 =  `${dataM.getDate()}/${dataM.getMonth()+1}/${dataM.getFullYear()}`; 
     const generar = () => {
    exportarPDF(pdfRef.current, "Pla_comptes_"+datae2);
  };
  generar();
};
function Sacabat() {  
      navigate('/Ccomptes');
      }
Benrera(Sacabat);   
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
                   CONSULTA <span style={{ color: "#0d6efd" }}>Dels COMPTES</span>
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
  <Container className="mt-3">
    <div ref={pdfRef}>
    <Row className="P02B_my-justify-center">
      <Col md={8}>
        <Card>
          <Card.Header className="P02B_my-fs5 
                                  P02B_my-fw-bold">
            Comptes seleccionades
          </Card.Header>
          <Card.Body>
  <div className="table-responsive">
    <table
      className="table table-hover align-middle mb-0"
      style={{
        borderCollapse: "separate",
        borderSpacing: "0 8px",
      }}
    >
      <thead>
        <tr>
          <th className="text-secondary small">A/P/I/D</th>
          <th className="text-secondary small">Grup</th>
          <th className="text-secondary small">Nom grup</th>
          <th className="text-secondary small">Compte</th>
          <th className="text-secondary small">Nom compte</th>
          <th className="text-secondary small">Num.</th>
          <th className="text-secondary small">Nom</th>
          <th className="text-secondary small">Compte</th>
        </tr>
      </thead>

      <tbody>
        {paddedItems
          .filter(Boolean)
          .filter((item) => item.D01)
          .map((item, index, array) => {
            const prev = array[index - 1];

            const showGroup =
              !prev || prev.D03 !== item.D03;

            const showCompte =
              !prev ||
              prev.D03 !== item.D03 ||
              prev.D04 !== item.D04;

            return (
              <tr
                key={index}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  transition: "all 0.2s ease",
                }}
              >
                 <td className="fw-semibold text-dark">
                  {showGroup ? item.G03 : ""}
                </td>
                {/* Grup */}
                <td className="fw-semibold text-dark">
                  {showGroup ? item.D03 : ""}
                </td>

                {/* Nom grup */}
                <td className="text-muted">
                  {showGroup ? item.D03N : ""}
                </td>

                {/* Compte */}
                <td className="fw-semibold text-primary">
                  {showCompte ? item.D04 : ""}
                </td>

                {/* Nom compte */}
                <td className="text-muted">
                  {showCompte ? item.D04N : ""}
                </td>

                {/* Número */}
                <td>
                  <span
                    className="badge rounded-pill bg-light text-dark"
                    style={{
                      fontSize: "0.85rem",
                      padding: "6px 10px",
                    }}
                  >
                    {item.D01}
                  </span>
                </td>

                {/* Nom */}
                <td className="fw-medium">
                  {item.D02}
                </td>
               
              {/* compte */}
              <td className="fw-semibold text-dark">
                  {item.D03}.{item.D04}.{item.D01}
             </td>
              </tr>
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