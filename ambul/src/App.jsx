import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import LoginForm from './components/LoginForm';  // Ensure correct filename casing
import DriverSignup from './components/DriverSignup';
import MapComponent from './components/MapComponent';
import Mapforambulance from './components/Mapforambulance';
import MedulanceSupport from './components/MedulanceSupport';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/LoginForm" element={<LoginForm />}/>
        <Route path="/DriverSignup" element={<DriverSignup/> }/>
        <Route path="/MapComponent" element={<MapComponent/> }/>
        <Route path="/Mapforambulance" element={<Mapforambulance/>}/>
        <Route path="/MedulanceSupport" element={<MedulanceSupport/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
