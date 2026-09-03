import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { useNavigate , useLocation} from 'react-router-dom';
import Versio  from "./CCGlobal/CVersio";
 
function App() {

  const navigate = useNavigate();

  useEffect(() => { 
       Proces();
  
  }, []); 
  const Proces = () => {  
   localStorage.setItem('IniciJMP', 'Si'); 
   navigate('/CInici')
  };
 return (
    <div>
       <Versio/>    
    </div>
     );
}
export default App;