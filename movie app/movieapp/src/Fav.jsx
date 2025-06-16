import { useEffect, useState } from "react";

function Fav() {
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        const favs = JSON.parse(sessionStorage.getItem("favourites")) || [];
        setFavourites(favs);
    }, []);

    return (
        <div className="ele">
            <h2>Your Favourite Movies</h2>
            {favourites.length === 0 ? (
                <p>No favourites yet.</p>
            ) : (
                <div className="favourites-container">
                    {favourites.map((movie, index) => (
                        <div key={index} className="dup">
                            <img className='ig' src={movie.Poster} alt={movie.Title} />
                            <div className="container">
                                <h4><b>{movie.Title}</b></h4>
                                <p>IMDb Rating: {movie.imdbRating}</p>
                            </div>
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
}

export default Fav;
