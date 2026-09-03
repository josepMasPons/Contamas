import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container,Row,Col,Card,Button} from "react-bootstrap";
import { query,where,getDocs,collection} from "firebase/firestore";
import { db } from "../firebaseLoc";
import "./CPresC.css";
import { exportarPDF } from "../Backups/ExportarPDF";
import Benrera from "../Backups/Benrera";
// ============================================================
// COMPONENT
// ============================================================
function CPresC() {
  const navigate = useNavigate();
  const pdfRef = useRef();
  // ==========================================================
  // ESTATS
  // ==========================================================
  const [compteC, setCompteC] = useState([]);
  const [data, setData] = useState([]);
  const [grupx] = useState(localStorage.getItem("Proces071") || "" );
  const [paraulax] = useState(localStorage.getItem("Proces072") || "");
  const [direct1] = useState( localStorage.getItem("Mapa99") || "");
  const [directS] = useState(false);
  const [filaSel] = useState(null);
  const [any, setAny] = useState("");
  const [mesd, setMesd] = useState("");
  const [mesa, setMesa] = useState("");
  const [nomJ] = useState(localStorage.getItem("NomJ") || "" );
  const [empresa] = useState(localStorage.getItem("Empresa") || "" );
  const [percon] = useState( localStorage.getItem("Percon") || "" );
  const [perdel] = useState( localStorage.getItem("PeriodeDel") || "" );
  const [peral]  = useState( localStorage.getItem("PeriodeAl") || "" );
  const [movspr, setMovspr] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(1500);
  // ==========================================================
  // ANY
  // ==========================================================
  useEffect(() => {
    if (!perdel, !peral, !percon) {
       return;
    }
    const [anyii,mesii] = percon.split("/");
    const [anydd,mesdd] = perdel.split("/");
    const [anyaa,mesaa] = peral.split("/");
    setAny(anyii || "");
    setMesd('01' || "");
    setMesa('12' || "");
  }, [perdel, peral,percon]);
  // ==========================================================
  // LLEGIR COMPTEG
  // ==========================================================
  useEffect(() => {
    const fetchCompteC = async () => {
      if (!empresa) return;
      try {
        const linksCollection =
          collection(db, "CompteG");
        const q = query(
          linksCollection,
          where("C00", "==", empresa)
        );
        const querySnapshot =
          await getDocs(q);
        const linksData =
          querySnapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              C00: d.C00,
              C01: d.C01,
              C02: d.C02,
              C03: d.C03,
              ...d
            };
          });
        setCompteC(linksData);
      } catch (error) {
        console.error(
          "Error llegint CompteG:",
          error
        );
      }
    };
    fetchCompteC();
  }, [empresa]);
  // ==========================================================
  // LLEGIR PRESSUPOST  //
  // Aquest useEffect depèn de:  //
  // - empresa compteC movspr  //
  // Per tant, quan movspr acaba de carregar, es torna a executar i ja tenim els REAL.
  // ==========================================================
  useEffect(() => {
    const fetchPressupost = async () => {
      if (!empresa) { return; }
      try {
        const linksCollection =
          collection(db, "PresG");
          const q = query(
             linksCollection,
               where("P00","==",empresa),          
               where("P01","==",any)            
          );
        const querySnapshot = await getDocs(q);
        // ====================================================
        // MAPA DE MOVIMENTS        //
        // movMap.get("43.100")
        // ====================================================
        const movMap =
          new Map(movspr.map((mov) => [
              mov.comptes,mov
             ])
          );
        // console.log("MAPA MOVIMENTS:",movMap);
        // ====================================================
        // LLEGIR PRESG
        // ====================================================
      
        const linksData =  querySnapshot.docs.map( (docSnap) => {
            const mesInicial = Number(mesd);
            const mesFinal   = Number(mesa);
             //console.log('mesd i mes a ',mesInicial,mesFinal);
            const data =   docSnap.data();
            const P02 =    String(data.P02 || "");
            const [P1,P2] = P02.split(".");
              // ------------------------------------------------
              // TOTAL PRESSUPOST
              // ------------------------------------------------
            let importMov = 0;
            for (let mes = 1; mes <= 12; mes++) {
              if (mes >= mesInicial && mes <= mesFinal) {
               const camp = `P${mes + 10}`;
               importMov += Number(data[camp] || 0);
              }
            } 
          
                // ------------------------------------------------
            // NOM COMPTE
            // ------------------------------------------------
            const grup2 =  compteC.find(
                  (g) =>
                    g.C00 === empresa &&
                    String(g.C03) === String(P1) &&
                    String(g.C01) === String(P2)
                );
              // =================================================
              // BUSCAR REAL
              // =================================================
              const movCompte = movMap.get(P02);
              //console.log("Compte:",P02,"Real:",movCompte);
              // =================================================
              // RESULTAT FILA
              // =================================================
              return {
                id: docSnap.id,
                ...data,
                P23: importMov,
                D04N: grup2 ? grup2.C02: "",
                R11:  movCompte?.R11 ?? 0,
                R12:  movCompte?.R12 ?? 0,
                R13:  movCompte?.R13 ?? 0,
                R14:  movCompte?.R14 ?? 0,
                R15:  movCompte?.R15 ?? 0,
                R16:  movCompte?.R16 ?? 0,
                R17:  movCompte?.R17 ?? 0,
                R18:  movCompte?.R18 ?? 0,
                R19:  movCompte?.R19 ?? 0,
                R20:  movCompte?.R20 ?? 0,
                R21:  movCompte?.R21 ?? 0,
                R22:  movCompte?.R22 ?? 0,
                R23:  movCompte?.R23 ?? 0
              };
            }
          );
        // ====================================================
        // ORDENAR PER COMPTE
        // ====================================================
        linksData.sort(
            (a, b) =>
            String(a.P02).localeCompare(
              String(b.P02)
            )
        );
        // ====================================================
        // RESULTATS
        // ====================================================
        const resultat = [];
        let grupActual = "";
        // ====================================================
        // FUNCIÓ CREAR TOTALS
        // ====================================================
        const crearTotals = () => ({
          P11: 0, P12: 0, P13: 0, P14: 0, P15: 0, P16: 0,
          P17: 0, P18: 0, P19: 0, P20: 0, P21: 0, P22: 0, P23: 0,
          R11: 0, R12: 0, R13: 0, R14: 0, R15: 0, R16: 0,
          R17: 0, R18: 0, R19: 0, R20: 0, R21: 0, R22: 0, R23: 0
        });
        let subtotal = crearTotals();
        let total =    crearTotals();
        // ====================================================
        // CAMPS A ACUMULAR
        // ====================================================
        const campsTotals = [ "P11","P12","P13","P14","P15","P16",
                              "P17","P18","P19","P20","P21","P22","P23",
                              "R11","R12","R13","R14","R15","R16",
                              "R17","R18","R19","R20","R21","R22","R23"];
        // ====================================================
        // RECORRER COMPTES
        // ====================================================
        linksData.forEach(
          (fila) => {
            const grup = String( fila.P02 || "").substring(0, 2);
            // =================================================
            // CANVI DE GRUP
            // =================================================
            if (
              grupActual !== "" &&  grup !== grupActual) {
                resultat.push({
                id:   "TOTAL" +  grupActual,
                P02:  grupActual +  ".999",
                D04N: "TOTAL GRUP " + grupActual,
                ...subtotal
              });
              subtotal = crearTotals();
            }
            grupActual = grup;
            // =================================================
            // AFEGIR FILA
            // =================================================
            resultat.push(fila);
            // =================================================
            // ACUMULAR
            // =================================================
            campsTotals.forEach(
              (camp) => {
                subtotal[camp] +=Number(fila[camp] || 0);
                total[camp] +=Number(fila[camp] || 0);
              }
            );
          }
        );
        // ====================================================
        // ÚLTIM GRUP
        // ====================================================
        if (grupActual !== "") {
          resultat.push({
            id: "TOTAL" + grupActual,
            P02: grupActual + ".999",
            D04N: "TOTAL GRUP " + grupActual,
            ...subtotal
          });
        }
        // ====================================================
        // RESULTAT FINAL
        // ====================================================
        resultat.push({
          id:"RESULTAT",
          P02: "99.999",
          D04N: "RESULTAT",
          ...total
        });
       // console.log("=================================");
       // console.log("RESULTAT FINAL:");
       // console.log(resultat);
       // console.log("=================================");
        
        setData(resultat);
        setItemsPerPage(resultat.length);
      } catch (error) {
        console.error("Error llegint PresG:", error);
      }
    };
    fetchPressupost();
  }, [empresa,compteC,movspr,mesd,mesa,any]);

  // ==========================================================
  // ELEMENTS TAULA
  // ==========================================================
  const currentItems = data.slice(0,itemsPerPage );
  const emptyRows =    Math.max(0,itemsPerPage - currentItems.length);
  const paddedItems = [ ...currentItems, ...Array(emptyRows).fill({
      temp: ".",
      nom: " ",
      codi: "empty"
    })
  ];
  // ==========================================================
  // PDF
  // ==========================================================
  const exportar_a_PDF = async () => {
      const dataM = new Date();
      const datae2 = `${dataM.getDate()}/${dataM.getMonth() + 1
                    }/${dataM.getFullYear()}`;
      exportarPDF(pdfRef.current,"Pla_comptes_" + datae2);
    };
  function Sacabat() {
    navigate("/CPresG");
  }
  Benrera(Sacabat);
  // --------------------- return ----------
  return (
    <div className="P02b_center-contentP2">
      <Card.Header className="d-flex align-items-center justify-content-center
                   gap-3  py-3 flex-wrap">
        <div className="fw-bold text-uppercase"
             style={{
              fontSize: "1.4rem",
              letterSpacing: "1px",
              color: "#1f2937",
              whiteSpace: "nowrap"
              }}
        >
          CONSULTA{" "}
          <span
            style={{
              color: "#0d6efd"
            }}
          >
            Pressupost
          </span>
        </div>
        <div className="d-flex gap-3">
          <div className="px-3  py-2 rounded  shadow-sm"
                style={{
                  backgroundColor:
                   "#dbe4f0",
                   border: "1px solid #b6c2d1",
                   minWidth: "220px",
                   textAlign: "center",
                   color:  "#334155"
                }}
          >
            Usuari:{" "}
            <strong>{nomJ}</strong>
          </div>
          <div className=" px-3 py-2 rounded shadow-sm "
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
            <Button
              className="mb-2"
              size="sm"
              variant="warning"
              onClick={Sacabat}
            >
              Enrere
            </Button>
          </div>
        </div>
      </Card.Header>
      {/* =====================================================
          CONTINGUT
      ====================================================== */}
      <Container className="P02B_my-mt5">
        <div  ref={pdfRef}>
          <Row className="P02B_my-justify-center">
            <Col xs={12}>
              <Card>
                <Card.Header   className="P02B_my-fs5 P02B_my-fw-bold " >
                  Comptes
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive"
                        style={{
                        overflowX: "auto",
                        WebkitOverflowScrolling:
                        "touch"
                        }}
                  >
                    <table  className="table  table-sm  table-hover align-middle mb-0"
                            style={{
                              fontSize:"0.78rem",
                              whiteSpace: "nowrap"
                             }} >
                       <thead className="sticky-top"
                              style={{
                              background:
                              "#f8fafc"
                              }}
                        >
                        <tr>
                          <th> Compte </th>
                          <th> Nom compte </th>
                      
                          {Number(mesd)<=1 && Number(mesa)>=1 && (<th className="text-end">Gen</th>)}
                          {Number(mesd)<=2 && Number(mesa)>=2 && (<th className="text-end">Feb</th>)}
                          {Number(mesd)<=3 && Number(mesa)>=3 && (<th className="text-end">Mar</th>)}
                          {Number(mesd)<=4 && Number(mesa)>=4 && (<th className="text-end">Abr</th>)}
                          {Number(mesd)<=5 && Number(mesa)>=5 && (<th className="text-end">Mai</th>)}
                          {Number(mesd)<=6 && Number(mesa)>=6 && (<th className="text-end">Jun</th>)}
                          {Number(mesd)<=7 && Number(mesa)>=7 && (<th className="text-end">Jul</th>)}
                          {Number(mesd)<=8 && Number(mesa)>=8 && (<th className="text-end">Ago</th>)}
                          {Number(mesd)<=9 && Number(mesa)>=9 && (<th className="text-end">Set</th>)}
                          {Number(mesd)<=10 && Number(mesa)>=10 && (<th className="text-end">Oct</th>)}
                          {Number(mesd)<=11 && Number(mesa)>=11 && (<th className="text-end">Nov</th>)}
                          {Number(mesd)<=12 && Number(mesa)>=12 && (<th className="text-end">Des</th>)}
                          <th className="text-end"
                              style={{
                              backgroundColor:"#e2e8f0",
                              fontWeight:"700",
                              borderLeft:"2px solid #94a3b8"
                              }}>Total</th>
                        </tr>
                      </thead>
                      {/* ====================================
                          COS
                      ===================================== */}
                      <tbody>
                        {paddedItems
                          .filter(Boolean)
                          .filter(
                            (item) => item.P02
                          )
                          .map(
                            (item,index) => {
                              const esResultat = item.P02 === "99.999";
                              const esSubtotal = item.P02.endsWith(".999") &&
                                    !esResultat;
                              const rowStyle = {
                                    backgroundColor:
                                    esResultat? "#dcfce7": esSubtotal? 
                                                "#dbeafe": "#fff",
                                    fontWeight:
                                    esSubtotal || esResultat? "700": "500"
                              };
                              return (
                                <React.Fragment
                                  key={index}
                                >
                                  {/* ==================================
                                      PRESSUPOST
                                  =================================== */}
                                
                                   <tr
                                    style={rowStyle }>
                                    <td>{item.P02}</td>
                                    <td>{item.D04N}</td>
                                   
                                
                                    {Array.from({ length: 13 }, (_, i) => 
                                  
                                    <td key={i} className="text-end"
                                      style={i === 12? {
                                           backgroundColor: "#e2e8f0",
                                           fontWeight: "700",
                                           borderLeft: "2px solid #94a3b8",
                                      } : {}
                                      }
                                      >
                                      {Number(item[`P${11 + i}`] || 0).toLocaleString("ca-ES")}
                                    </td>
                                   
                                  )}                               
                                  </tr>                                
                 
                                  {/* ==================================
                                      LÍNIA SUBTOTAL
                                  =================================== */}
                                  {esSubtotal && (
                                    <tr>
                                      <td colSpan={16}
                                        style={{
                                          height:"3px",
                                          padding: 0,
                                          border:"none",
                                          backgroundColor:"#475569"
                                        }}
                                      />
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            }
                          )}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
                {/* ==========================================
                    BOTONS
                =========================================== */}
                <div>
                  <Button className="mb-2"
                    size="sm"
                    variant="warning"
                    onClick={Sacabat}>
                    Enrere
                  </Button>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Button className="mb-2"
                          variant="success"
                          size="sm"
                          onClick={exportar_a_PDF }>
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
export default CPresC;