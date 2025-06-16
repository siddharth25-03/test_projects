import { useState } from "react";
import './index.css'
import axios from 'axios'
import { SpinnerCircular } from 'spinners-react';
import {Link} from 'react-router-dom'


function Movie() {
  const [inp, setinp] = useState("");
  const [movie, setmovie] = useState();
  const [spin,setspin]=useState(false);

  function setting(e) {
    setinp(e.target.value);
  }
  async function sendreq(inp) {
    setspin(true);
    try {
      const response = await axios.get(`https://www.omdbapi.com/?apikey=5e2c4d9e&t=${inp}`);
      setmovie(response);
    }
    catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setspin(false);
    }, 1000);
  }

  function addtofav(){
    let favs = JSON.parse(sessionStorage.getItem("favourites")) || [];
    const dup= favs.filter((m)=> m.imdbID===movie.data.imdbID)
    if(dup.length==0){
      favs.push(movie.data);
      sessionStorage.setItem("favourites", JSON.stringify(favs));
      alert("Added to Favourites")
    }
    else{
      alert("Already Added")
    }
  }

  return (
    <div className="ele">
      <h1>Movie hub</h1>
      <input value={inp} type="text" placeholder="Search..." onChange={setting} className="inp"/>
      <br />
      <button className='btn' onClick={() => sendreq(inp) }>Search</button>
      <br />
      <Link to="/fav">
      <button className="btn">See your favorite movies list</button>
      </Link>
      <br />
      <SpinnerCircular enabled={spin} />
      {
        movie && movie.data.Response !== "False" && spin==false?
          <div className="card">
            <Link to={`/desc/${movie.data.imdbID}`}>
                <img src={movie.data.Poster} alt="Avatar"/>
            </Link>
              <div className="container">
                <h4 className="container"><b className="container">Title: {movie.data.Title}</b></h4>
                <p className="container">imDb Rating: {movie.data.imdbRating}</p>
                <button className="btn" onClick={addtofav}>Add this to your Favourites?</button>
              </div>
          </div>
          :
          <p>Please enter a valid movie name</p>
      }
        {movie && movie.data.Response==="False"? 
            <p>Not existing in the database</p>:null
        }

    </div>

  );
}

export default Movie;