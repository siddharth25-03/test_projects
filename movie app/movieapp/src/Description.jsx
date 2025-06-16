import { useParams } from "react-router-dom";
import { useState , useEffect} from "react";
import axios from "axios";

function Description() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios.get(`https://www.omdbapi.com/?apikey=5e2c4d9e&i=${id}`)
      .then(res => setMovie(res.data));
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="ele">
      <h2  className="desc">{movie.Title}</h2>
      <img src={movie.Poster} alt={movie.Title} />
      <p  className="desc">{movie.Plot}</p>
    </div>
  );
}

export default Description