import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import './index.css';

import App from './App';
import Cinici from './CCGlobal/Cinici';
import Cbuto from './CCGlobal/Cbuto';
import CContra from './CCGlobal/CContra';

import CMenu_Inici    from './CComponents/CMenu_Inici';
import CPercon    from './CComponents/CPercon';
import CMenu    from './CComponents/CMenu';
import Ccomptes from './CComponents/Ccomptes';
import CcomptesG from './CComponents/CcomptesG';
import CcomptesC from './CComponents/CcomptesC'; 
import CconsultaCB from './CComponents/CconsultaCB';
import Cmovs    from './CComponents/Cmovs';
import CmovsC    from './CComponents/CmovsC';
import CPresG    from './CComponents/CPresG';
import CPresC    from './CComponents/CPresC';
import CPresB    from './CComponents/CPresB';
import CmovsCB    from './CComponents/CmovsCB';
import Canalis    from './CComponents/Canalis'; 

import JMTermsConditions  from './Backups/CTermsConditions';
import JMCopyRight        from './Backups/CCopyRight';
import CBackup             from './Backups/CBackup';
import Importacio         from './Backups/Importacio';
import Exportacio         from './Backups/Exportacio';
import Coleccions         from './Backups/Coleccions';
import CVersio             from './Backups/CVersio';
import CPermisos             from './Backups/CPermisos'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/'                  element={<App/>} />         
        <Route path='/Cinici'            element={<Cinici/>} />
        <Route path='/Cbuto'             element={<Cbuto/>} />
        <Route path='/CContra'           element={<CContra/>} />
        <Route path='/CVersio'           element={<CVersio />} />  
        <Route path='/CPermisos'         element={<CPermisos/>} /> 
        <Route path='/Canalis'           element={<Canalis/>} /> 
   
        <Route path='/CMenu_Inici'       element={<CMenu_Inici/>} />         
        <Route path='/CPercon'           element={<CPercon/>} /> 
        <Route path='/CMenu'             element={<CMenu/>} /> 
        <Route path='/Ccomptes'          element={<Ccomptes/>} /> 
        <Route path="/CcomptesG"     element={<CcomptesG />} />
      
        <Route path='/CcomptesC'     element={<CcomptesC/>} /> 
        <Route path='/CconsultaCB'       element={<CconsultaCB/>} /> 
         <Route path='/Cmovs'            element={<Cmovs/>} /> 
         <Route path='/CPresG'            element={<CPresG/>} />
         <Route path='/CPresC'            element={<CPresC/>} />
         <Route path='/CPresB'            element={<CPresB/>} />
         <Route path='/CmovsC'            element={<CmovsC/>} /> 
        <Route path='/CmovsCB'           element={<CmovsCB/>} /> 

        <Route path='/CBackup'           element={<CBackup />} />
        <Route path='/Exportacio'        element={<Exportacio />} />     
        <Route path='/Importacio'        element={<Importacio />} />
        <Route path='/Coleccions'        element={<Coleccions />} /> 
        <Route path='/JMTermsConditions' element={<JMTermsConditions />} />                  
        <Route path='/JMCopyRight'       element={<JMCopyRight />} />

      
        
      
      </Routes>
    </Router>
  </React.StrictMode>
);


