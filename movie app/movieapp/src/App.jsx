import Movie from './Movie.jsx'
import {Link, Routes, Route, BrowserRouter} from 'react-router-dom'
import Description from './Description.jsx'
import Fav from './Fav.jsx'


function App(){
  return(
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Movie/>}></Route>
            <Route path='/desc/:id' element={<Description/>}></Route>
            <Route path='/fav' element={<Fav/>}></Route>
            <Route path='*' element={<Movie/>}></Route>
          </Routes>
      </BrowserRouter> 
  );
}

export default App;