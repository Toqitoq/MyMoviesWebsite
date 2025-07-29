import React from 'react';

export default function MovieCard({ movie, onClick }) {
  return (
    <div className="movie-card" onClick={onClick}>
      <div className="movie-img-title">
        <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
        <h3>{movie.title}</h3>
      </div>
      <p>Rating: {movie.vote_average}</p>
    </div>
  );
}