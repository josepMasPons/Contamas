
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Nav, Col, Card, Button } from "react-bootstrap";
import { collection, getDocs } from 'firebase/firestore';
import "./CmovsCB.css";
import {db } from '../firebaseLoc';
import {exportarPDF} from '../CCGlobal/ExportarPDF';
import Benrera from '../CCGlobal/Benrera';

function CconsultaCB() { 
  const navigate=useNavigate(); 
   const pdfRef = useRef();
  const [compteC, setCompteC] = useState([]); 
  const [compteD, setCompteD] = useState([]); 
  const [anyx, setAnyx] = useState(localStorage.getItem('Proces061') || '');
  const [mesx, setMesx] = useState(localStorage.getItem('Proces062') || '');
  const [paraulax, setParaulax] = useState(localStorage.getItem('Proces063') || '');
  const [data, setData] = useState([]);
  const [nomJ, setNomJ] = useState(localStorage.getItem('NomJ') || '');
  const [empresa, setEmpresa] = useState(localStorage.getItem('Empresa'));
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const [itemsPerPage, setItemsPerPage] = useState(1500);
  const currentItems=data.slice(0, itemsPerPage);
  const emptyRows = itemsPerPage - currentItems.length;
  const paddedItems = [...currentItems, ...Array(emptyRows).fill({ temp: '.', nom: ' ', codi: 'empty' })];
  //   *********  llegir grupC  i posarho a taula grupC ******
  const exportar_a_PDF = async () => {
      const dataM = new Date();
      const datae2 =  `${dataM.getDate()}/${dataM.getMonth()+1}/${dataM.getFullYear()}`; 
      const generar = () => {
     exportarPDF(pdfRef.current, "selec.comptes_"+datae2);
   };
   generar();
  };
 
  useEffect(() => {
       const fetchData1 = async () => {
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
           console.error('Error llegint grupD: ', error);
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
       
         }
       };
       fetchData2();
     }, []);
 useEffect(() => {
  const fetchData = async () => {
    const linksCollection = collection(db, "MovsG");

    try {
      const querySnapshot = await getDocs(linksCollection);

      const linksData = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        const [grupO = "", compteO = "", numeroO = ""] =
          (data.M02 || "").split(".");

        const comptaX = compteD.find(
          (g) =>
            g.D01 === numeroO &&
            g.D04 === compteO &&
            g.D00 === empresa &&
            g.D03 === grupO
        );

        const comptaXX = compteC.find(
          (g) => g.G01 === numeroO && g.G00 === empresa
        );

        const [grupD = "", compteDD = "", numeroD = ""] =
          (data.M03 || "").split(".");

        const comptaY = compteD.find(
          (g) =>
            g.D01 === numeroD &&
            g.D04 === compteDD &&
            g.D00 === empresa &&
            g.D03 === grupD
        );

        const comptaYY = compteC.find(
          (g) => g.G01 === numeroD && g.G00 === empresa
        );

        return {
          id: docSnap.id,
          ...data,
          M02O: comptaX
            ? `${comptaXX?.G02 || ""} - ${comptaX.D02}`
            : "",
          M03D: comptaY
            ? `${comptaYY?.G02 || ""} - ${comptaY.D02}`
            : "",
        };
      });

       const filteredData = linksData.filter((item) => {
          const safeTrimmedValue = (value) => {
          if (value === null || value === undefined) return "";
          return String(value).trim().toLowerCase();
      };

        const [anyy = "", mesy = ""] = (item.M07 || "/").split("/");

        const empresaNorm = empresa?.trim().toLowerCase() || "";

        const isEmpresaValid =
          (item.M00 || "").trim().toLowerCase() === empresaNorm;
        //console.log('any ........',anyx, ' --- ', anyy )
        const isTempAValid =
          anyx?.trim() === "" ||
          anyx?.trim() === "null" ||
          anyy.trim() === anyx?.trim();

        const isTempMValid =
          mesx?.trim() === "" ||
          mesx?.trim() === "null" ||
          mesy.trim() === mesx?.trim();

        const textCerca = removeAccents(
          (paraulax || "").trim().toLowerCase()
        );
         console.log("Text cerca:", textCerca);
         console.log("Text item:", item.M02O, item.M03D, item.M05);
        const isParaulaxValid =
          textCerca === "" ||
          removeAccents(safeTrimmedValue(item.M01)).includes(textCerca) ||
          removeAccents(safeTrimmedValue(item.M05)).includes(textCerca) ||
          removeAccents(safeTrimmedValue(item.M02O)).includes(textCerca) ||
          removeAccents(safeTrimmedValue(item.M03D)).includes(textCerca) ||
          removeAccents(safeTrimmedValue(item.M08)).includes(textCerca);

        return (
          isEmpresaValid &&
          isTempAValid &&
          isTempMValid &&
          isParaulaxValid
        );
      });

      setData(filteredData);
      setItemsPerPage(filteredData.length);
    } catch (error) {
      console.error("Error llegint MovsG:", error);
    }
  };

  if (compteD.length > 0) {
    fetchData();
  }
}, [compteD, compteC, empresa, anyx, mesx, paraulax]);
 
  function Sacabat() {  
      navigate('/CmovsC');
  }  
  const formatValue = (value) => {
  if (value?.toDate) {
    return value.toDate().toLocaleString('ca-ES');
  }
  return value ?? '';
};
  const formatImport = (valor) => {
  return Number(valor || 0).toLocaleString("ca-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
   });
}; 
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
                   CONSULTA <span style={{ color: "#0d6efd" }}> Apunts Comptables</span>
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
    <Row className="P02B_my-justify-center">
     <div ref={pdfRef}>
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
          <th className="text-secondary small">Periode</th>
          <th className="text-secondary small">Num.</th>
          <th className="text-secondary small">Origen</th>
          <th className="text-secondary small"
              style={{ width: "250px" }}
              >
              Nom compte
          </th>
          <th className="text-secondary small">Destí</th>
          <th className="text-secondary small"
              style={{ width: "250px" }}
              >
              Nom compte   
          </th>
          <th className="text-secondary small">Import</th>
          <th className="text-secondary small"
              style={{ width: "250px" }}
              >
              Concepte   
          </th>
          <th className="text-secondary small">Notes</th>
        </tr>
      </thead>

      <tbody>
        {paddedItems
          .filter(item => item?.M00)
       
          .map((item, index) => (
            <tr key={index}>
              <td>{formatValue(item.M07)}</td>
              <td>{formatValue(item.M01)}</td>
              <td>{formatValue(item.M02)}</td>
              <td>{formatValue(item.M02O)}</td>
              <td>{formatValue(item.M03)}</td>
              <td>{formatValue(item.M03D)}</td>              
              <td>{formatImport(item.M04)}</td>
              <td>{formatValue(item.M05)}</td>
              <td>{formatValue(item.M06)}</td>
              
        
            </tr>
          ))}
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
     </div>
    </Row>
      
  </Container>
</div>
  );
}
export default CconsultaCB;