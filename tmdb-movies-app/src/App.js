import React, { useEffect, useState } from 'react';
import {
  fetchPopularMovies,
  fetchMovieCredits,
  fetchGenres,
  fetchMoviesByGenre,
  searchMovies,
  fetchSimilarMovies,
  fetchMovieTrailer
} from './api_call';
import MovieCard from './MovieCard';
import './App.css';

function App() {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [similarMovies, setSimilarMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);



  useEffect(() => {
    if (searchTerm.trim()) {
      searchMovies(searchTerm, page).then(setMovies);
    } else if (selectedGenre) {
      fetchMoviesByGenre(selectedGenre, page).then(setMovies);
    } else {
      fetchPopularMovies(page).then(setMovies);
    }
  }, [page, selectedGenre, searchTerm]);

  useEffect(() => {
    fetchGenres().then(setGenres);
  }, []);

  useEffect(() => {
  if (selectedMovie) {
    fetchMovieCredits(selectedMovie.id).then(setCast);
    fetchSimilarMovies(selectedMovie.id).then(setSimilarMovies);
    fetchMovieTrailer(selectedMovie.id).then(setTrailerKey);
  } else {
    setCast([]);
    setSimilarMovies([]);
    setTrailerKey(null);
  }
}, [selectedMovie]);

  // Fetch cast when selectedMovie changes
  useEffect(() => {
    if (selectedMovie) {
      fetchMovieCredits(selectedMovie.id).then(setCast);
    } else {
      setCast([]);
    }

    fetchGenres().then(setGenres);

  }, [selectedMovie]);

  // Handle genre change
  const handleGenreChange = async (e) => {
    const genreId = e.target.value;
    setSelectedGenre(genreId);
    setSearchTerm('');
    setPage(1);
    if (genreId) {
      const moviesByGenre = await fetchMoviesByGenre(genreId, 1);
      setMovies(moviesByGenre);
    } else {
      fetchPopularMovies(1).then(setMovies);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setPage(1);
    if (searchTerm.trim()) {
      const results = await searchMovies(searchTerm, 1);
      setMovies(results);
      setSelectedGenre('');
    } else {
      fetchPopularMovies(1).then(setMovies);
    }
  };

  function handleTitleClick() {
    setSearchTerm('');
    setSelectedGenre('');
    setPage(1);
    fetchPopularMovies(1).then(setMovies);
  }

  const handlePrevPage = () => setPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setPage(prev => prev + 1);

  return (
    <div className="app-container">
      <h1 style={{ cursor: 'pointer' }} onClick={handleTitleClick}>Movies</h1>
      <h2 style={{ marginTop: '-1rem', marginBottom: '1.5rem', fontWeight: 'normal', color: '#ccc' }}>
        Popular Movies
      </h2>
      <section className="movies-section">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <select className="genre-dropdown" value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Categories</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button className="close-btn" onClick={handlePrevPage} disabled={page === 1}>Previous</button>
          <span style={{ alignSelf: 'center', color: '#fff' }}>Page {page}</span>
          <button className="close-btn" onClick={handleNextPage}>Next</button>
        </div>
      </section>
      {selectedMovie && (
  <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ position: 'relative', overflow: 'hidden' }}>
      {selectedMovie.backdrop_path && (
        <div
          className="modal-bg"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w780${selectedMovie.backdrop_path})`,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
            opacity: 0.18
          }}
        />
      )}
        <button
        className="modal-close-x"
        onClick={() => setSelectedMovie(null)}
        aria-label="Close"
        style={{
          position: 'absolute',
          top: 5,
          right: 10,
          zIndex: 2,
          background: 'transparent',
          border: 'none',
          fontSize: '2rem',
          color: '#fff',
          cursor: 'pointer',
          padding: 0,
          lineHeight: 1,
        }}
      >
        &times;
      </button>
      <div
  style={{
    display: 'flex',
    alignItems: 'stretch',
    marginBottom: '1.5rem',
    width: '100%',
    height: '1100px' // Increased from 320px to 440px
  }}
>
  <div style={{ flex: 0.4, display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
    <img
      src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
      alt={selectedMovie.title}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
      }}
    />
  </div>
  <div style={{ flex: 1, display: 'flex', alignItems: 'left', justifyContent: 'right' }}>
    {trailerKey ? (
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${trailerKey}`}
        title="Trailer"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
        }}
      />
    ) : (
      <div style={{ color: '#ccc', fontStyle: 'italic', textAlign: 'center' }}>No trailer available.</div>
    )}
  </div>
</div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2>{selectedMovie.title}</h2>
        <div style={{display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background:
              selectedMovie.vote_average < 5
                ? '#e50914'
                : selectedMovie.vote_average < 7
                ? '#ffd600'
                : '#21d07a',
            color: '#181818',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.3rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            margin: '0 auto'
          }}
          title="Rating"
        >
          {selectedMovie.vote_average.toFixed(2)}
        </div>
      </div>
        <p><strong>Overview:</strong> {selectedMovie.overview}</p>
        <h3>Cast:</h3>
        <ul>
          {cast.slice(0, 10).map(member => (
            <li key={member.cast_id || member.credit_id}>
              <img
                src={member.profile_path ? `https://image.tmdb.org/t/p/w45${member.profile_path}` : 'https://via.placeholder.com/45x68?text=No+Image'}
                alt={member.name}
              />
              <span>
                <strong>{member.name}</strong>
                <br />
                <span style={{ fontSize: '0.95em', color: '#ccc' }}>as {member.character}</span>
              </span>
            </li>
          ))}
        </ul>
        <h3>Recommended Movies</h3>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {similarMovies.slice(0, 8).map(movie => (
            <div key={movie.id} style={{ minWidth: 90, textAlign: 'center', cursor: 'pointer' }}
                onClick={() => setSelectedMovie(movie)}>
              <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/92x138?text=No+Image'}
                alt={movie.title}
                style={{ width: 70, height: 105, borderRadius: 6, objectFit: 'cover', marginBottom: 4 }}
              />
              <div style={{
                fontSize: '0.85em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: 70
              }}>
                {movie.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default App;