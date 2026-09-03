import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebaseLoc.js";
import {query,where,getDocs,collection} from "firebase/firestore";
import {Container, Card,Button,Row,Col} from "react-bootstrap";
import {ResponsiveContainer,BarChart,Bar,PieChart,Pie,Cell,
        LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend} from "recharts";

export default function Canalis() {
  const navigate = useNavigate();
  const location = useLocation();
  const [caniv, setCaniv] = useState(localStorage.getItem('Canalis'));
  const [caniv01, setCaniv01] = useState(localStorage.getItem('Canalis01'));
  const [caniv02, setCaniv02] = useState(localStorage.getItem('Canalis02'));
  const [caniv03, setCaniv03] = useState(localStorage.getItem('Canalis03'));
  const [caniv13, setCaniv13] = useState(localStorage.getItem('Canalis13'));
  const [caniv23, setCaniv56] = useState(localStorage.getItem('Canalis23'));
  const [nomJ] = useState(localStorage.getItem("NomJ") || "");
  const [empresa, setEmpresa] = useState(localStorage.getItem('Empresa'));
  const [periodeDel, setPeriodeDel] = useState(localStorage.getItem('PeriodeDel'));
  const [periodeAl, setPeriodeAl] = useState(localStorage.getItem('PeriodeAl'));
  const [percon, setPercon] = useState(localStorage.getItem('Percon'));
  const [xM06, setXM06] = useState('');  
  const [apid, setApid] = useState('D');  
  const [textApid, setTextApid] = useState('Despeses');

  const [g1, setG1] = useState(true);  
  const [g2, setG2] = useState(true);  
  const [g3, setG3] = useState(false);  

  // data ------------------
  const datax = location.state?.data || [];
  const dataP = datax
  .filter(item =>
    item.G00 === empresa &&
    item.G03 === apid
  )
  .map(item => {
    const num = Number(item.G04);
    return {
      ...item,
      G04N: isNaN(num) ? 0 : Math.abs(num)
    };
  });
  
  // data1 ------------------
  const datay = location.state?.data1 || [];
  const dataPP = datay
  
  .filter(item2 =>
    item2.C00 === empresa &&
    item2.C03 === localStorage.getItem('Canalis01')
   )
  .map(item2 => {
    const num2 = Number(item2.C04);
    return {
      ...item2,
      C05N: isNaN(num2) ? 0 : Math.abs(num2)
    };
  });
  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899"
  ];

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
    height: "100%"
  };

  const titleStyle = {
    textAlign: "center",
    color: "#334155",
    fontWeight: "600",
    marginBottom: "15px"
  };
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
  function Sacabat() {
    navigate("/CMenu");
  }
  const opcions = [
  { codi: "A", text: "Caixa/Bancs" },
  { codi: "P", text: "Crèdit" },
  { codi: "I", text: "Ingressos" },
  { codi: "D", text: "Despeses" }
];
// useEffect per buscar la data al inici del programa *********************
   useEffect(() => {
     const dataM = new Date();
     setXM06(`${dataM.getDate()}/${dataM.getMonth()+1}
             /${dataM.getFullYear()}`);
    }, []);
   useEffect(() => {
    setTextApid( opcions.find(o => o.codi === apid)?.text || "");
    const dataP = datax
    .filter(item =>
      item.G00 === empresa &&
      item.G03 === apid
    )
    .map(item => {
      const num = Number(item.G04);

      return {
      ...item,
     G04N: Math.abs(Number(item.G04) || 0)
     };
  });
    }, [apid]);
  
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background:
          "linear-gradient(135deg,#eef2ff 0%,#f8fafc 100%)"
      }}
    >
      <Card className="mb-4 shadow-sm border-0">
        <Card.Header
          className="d-flex flex-wrap justify-content-center align-items-center gap-3"
          style={{
            background: "#ffffff"
          }}
        >
          <h3
            style={{
              color: "#1e293b",
              fontWeight: "700",
              margin: 0
            }}
          >
            📊 Gràfics de Comptes
          </h3>

          <div
            className="px-3 py-2 rounded"
            style={{
              background: "#f1f5f9"
            }}
          >
            Usuari: <strong>{nomJ}</strong>
          </div>

          <div
            className="px-3 py-2 rounded"
            style={{
              background: "#dbeafe"
            }}
          >
            Empresa: <strong>{empresa}</strong>
          </div>

          <Button
            variant="warning"
            size="sm"
            onClick={Sacabat}
          >
            ← Enrera
          </Button>
        </Card.Header>
      </Card>
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
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               
                <strong>Perìode - {percon}</strong>    
              </div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
            </div>
          </Card.Header>
        </Card>
        </Col>
        </Row>
 {/*       --------------------  pantalla 0 ----------------------------*/}
        {caniv === '0' && (
          <>     
        <div
          style={{
             display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "20px"
            }}
          >
          {opcions.map(opcio => (
            <button
              key={opcio.codi}
              onClick={() => setApid(opcio.codi)}
              style={{
                  padding: "10px 18px",
                  borderRadius: "30px",
                  border: apid === opcio.codi
                  ? "2px solid #2563eb"
                  : "2px solid #cbd5e1",
              background:
                  apid === opcio.codi
                  ? "#2563eb"
                  : "#fff",
                color:
                  apid === opcio.codi
                    ? "#fff"
                    : "#334155",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "0.2s"
              }}
            >
            {opcio.text}
        </button>
        ))}
      </div>
      <h2
        style={{
          textAlign: "center",
          color: "#334155",
          marginBottom: "25px"
        }}
        >
       {textApid}
      </h2>

      <Row className="g-4">
          {/* BARRES */}
       {g1 && (   
    
        <Col xs={12} lg={6}>
          <div style={cardStyle}>
            <h4 style={titleStyle}>
              📊 Total per compte
            </h4>

            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={dataP}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="G02" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Bar
                    dataKey="G04N"
                    fill="#3B82F6"
                    radius={[8, 8, 0, 0]}
                    name="Import"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
       )}
       {/* FORMATGE */}
         {g2 && (   
        <Col xs={12} lg={6}>
          <div style={cardStyle}>
            <h4 style={titleStyle}>
              🥧 Distribució dels imports
            </h4>

            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={dataP}
                    dataKey="G04N"
                    nameKey="G02"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {dataP.map((item, index) => (
                      <Cell
                        key={item.id}
                        fill={
                          COLORS[index % COLORS.length]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
         )}
         {/* LINIES */}
        {g3 && (          
        <Col xs={12}>
          <div style={cardStyle}>
            <h4 style={titleStyle}>
              📈 Evolució de les despeses
            </h4>

            <div style={{ width: "100%", height: 420 }}>
              <ResponsiveContainer>
                <LineChart data={dataP}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="G02" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="G04N"
                    stroke="#F97316"
                    strokeWidth={4}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                    name="Import"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>
        )}
      </Row>
      </>
    )}
     {/*       --------------------  pantalla 1 ----------------------------*/}
     {caniv === '1' && (             
        <div>
          <Container className="mt-3">
            <Row className="justify-content-center">
              <Col md={8}>
                <Card>
                  <Card.Header
                      className="fw-bold py-3 text-center"
                      style={{ fontSize: "1.2rem" }}
                    >
                    <div className="mb-1">
                    <span className="text-primary">Codi:</span> {caniv01}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span className="text-primary">Nom:</span> {caniv02}
                    </div>        
                  </Card.Header>
               </Card>
             </Col>
           </Row>
          
         {/* BARRES */}
       
       <Row className="g-4">
          {/* BARRES */}
         {g1 && (     
          <Col xs={12} lg={6}>
            <div style={cardStyle}>
            <h4 style={titleStyle}>
              📊 Total per compte
            </h4>

            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={dataPP}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="C02" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Bar
                    dataKey="C05N"
                    fill="#3B82F6"
                    radius={[8, 8, 0, 0]}
                    name="Import"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
           </div>
          </Col>
         )}
        {/* FORMATGE */}
         {g2 && (   
        <Col xs={12} lg={6}>
          <div style={cardStyle}>
            <h4 style={titleStyle}>
              🥧 Distribució dels imports
            </h4>

            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={dataPP}
                    dataKey="C05N"
                    nameKey="C02"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {dataPP.map((item, index) => (
                      <Cell
                        key={item.id}
                        fill={
                          COLORS[index % COLORS.length]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>         
         )}
         </Row>
         </Container>
       </div>          
      )};
     </div>   
 )}

