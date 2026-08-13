import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Row, Nav, Col, Card, Button } from "react-bootstrap";
import { collection, getDocs } from 'firebase/firestore';
import "./CconsultaCB.css";
import {db } from '../firebaseLoc';

import { findAllByTestId } from '@testing-library/react';
function CconsultaCB() { 
  const navigate=useNavigate(); 
  const [grupC, setGrupC] = useState([]); 
  const [compteC, setCompteC] = useState([]); 
  const [compteD, setCompteD] = useState([]); 
  const [anyx, setAnyx] = useState(localStorage.getItem('Proces051') || '');
  const [paraulax, setParaulax] = useState(localStorage.getItem('Proces052') || '');
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
      const linksCollection = collection(db, 'CompteD');
      try {
        const querySnapshot = await getDocs(linksCollection);
        const linksData = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();
         // Buscar coincidència a grupC
        const grup = grupC.find(g => g.G01 === data.D03);
          // Buscar coincidència a comptesC
        const grup2 = compteC.find(g => g.C03 === data.D03
                                &&      g.C01 === data.D04);
        return {
          id: docSnap.id,
          D00: data.D00,
          D01: data.D01,
          D02: data.D02,
          D03: data.D03,
          D03N: grup.G02,
          D04N: grup2.C02,
          D04: data.D04,
          D05: data.D05,
        };
      });
      //console.log('grupd .........',linksData,' . ',data.D03);
      setData(linksData);
     setItemsPerPage(paddedItems.length);
     setDirectS(true);
   
    } catch (error) {
      console.error(error);
    }
  };
  if (grupC.length > 0) {
    
   // const filteredData = linksData.filter(item => {
   /*   const safeTrimmedValue = (value) =>
            value ? value.trim().toLowerCase() : "";  
     const isTempValid = item.D01 && 
    //                      item.temp.includes(anyx.trim()) 
    //                      || anyx === '' 
                          || anyx === null || anyx.trim() === 'null';
      const isParaulaxValid = 
      /* removeAccents(safeTrimmedValue(item.nom))
         .includes(removeAccents(paraulax.toLowerCase())) ||
       removeAccents(safeTrimmedValue(item.codi))
         .includes(removeAccents(paraulax.toLowerCase())) ||
       removeAccents(safeTrimmedValue(item.ubic))
         .includes(removeAccents(paraulax.toLowerCase())) ||
       removeAccents(safeTrimmedValue(item.notes))
         .includes(removeAccents(paraulax.toLowerCase())) ||
       removeAccents(safeTrimmedValue(item.obrac))
         .includes(removeAccents(paraulax.toLowerCase())) ||
       removeAccents(safeTrimmedValue(item.director))
         .includes(removeAccents(paraulax.toLowerCase())) || 
        paraulax === ''   ||
        paraulax === null || paraulax.trim() === 'null';
      return isTempValid && isParaulaxValid;
      
   // });
    console.log('fet useeffect')
     setData(linksData);
     setItemsPerPage(paddedItems.length);
     setDirectS(true);
    } catch (error) {
        console.error('Error llegint documents: ', error);
    }      */
   };
  fetchData();
  }, [grupC,compteC]); 
  
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
 
  function Sacabat() {  
      navigate('/CconsultaC');
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
        
              </div>
   </Card.Header>
  <Container className="P02B_my-mt5">
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
                  {item.D03}.{item.D01}.{item.D04}
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
         
             <div className="     P02B_my-flex
                               P02B_my-justify-center 
                                ">
            

          </div>

          </div>
        </Card>
      </Col>
    </Row>
  </Container>
</div>
  );
}
export default CconsultaCB;