import Nav from './Navb.jsx'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import About from './About.jsx'
import Services from './Services.jsx'

function App(){

  return (
    <BrowserRouter>
          <Routes>
                <Route path="/" element={<Nav/>}/>
                <Route path="/home" element={<Nav/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/services" element={<Services/>}/>
          </Routes>
    </BrowserRouter>
  );
}

export default App;