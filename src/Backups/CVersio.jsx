
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { emoji } from "./emoji";

  const Versio = () => {
    const navigate=useNavigate();
    const dataM = new Date();
    let Versio01 = emoji.grup + 'Contamas/ Versió 3.0  inclou Benrera';
    let Versio02 = emoji.rellotge + 
                `${dataM.getDate()}/${dataM.getMonth()+1}/${dataM.getFullYear()}`;
    let Versio03 = emoji.usuari + 'Copyright 2026 Jmas  /  http://www.josepmaspons.cat';
    let Versio04 = '---------------------------- ';
    let Versio05 = emoji.notificacio + 'Gestió comptes  ';
    let Versio06 = '------ amb Gestió Enrera ----------------------- '; 
    localStorage.setItem('Versio01', Versio01);
    localStorage.setItem('Versio02', Versio02);
    localStorage.setItem('Versio03', Versio03);
    localStorage.setItem('Versio04', Versio04);
    localStorage.setItem('Versio05', Versio05);
    localStorage.setItem('Versio06', Versio06);

    return (
    <div></div>      
 )
};
export default Versio;
