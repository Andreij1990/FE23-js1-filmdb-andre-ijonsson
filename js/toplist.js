let page = 1;
let currentPageRated = 1;
let currentPagePopular = 1;

const numberOfPagesToFetch = 5;

const API_KEY = "9451350a84bd8f4b2bd8929f67364a18";

const ratedTopList = document.getElementById('ratedTopList');
const popularTopList = document.getElementById('popularTopList');

const ratedKnapp = document.getElementById('ratedKnapp');
const popularKnapp = document.getElementById('popularKnapp');

function doljPopular() {
    popularTopList.style.display = 'none';
    popularKnapp.style.background = 'darkgrey'
    popularKnapp.style.color = 'black'
    ratedTopList.style.display = 'block';
    ratedKnapp.style.background = 'darkred';
    ratedKnapp.style.color = 'gold';
}

function doljRated() {
    ratedTopList.style.display = 'none';
    popularTopList.style.display = 'block';
    popularKnapp.style.background = 'darkred';
    popularKnapp.style.color = 'gold'
    ratedKnapp.style.background = 'darkgrey';
    ratedKnapp.style.color = 'black';
}

ratedKnapp.addEventListener("click", doljPopular);
popularKnapp.addEventListener("click", doljRated);

function fetchRatedMovies() {
  if (currentPageRated > numberOfPagesToFetch) {
    return;
  }

  const urlRated = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPageRated}&api_key=${API_KEY}`;

  fetch(urlRated)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      data.results.forEach(movie => {
        const listItem = createMovieLink(movie);
        ratedTopList.appendChild(listItem);

        const posterImg = createMoviePost(movie);
        ratedTopList.appendChild(posterImg);
      });

      currentPageRated++;

      if (currentPageRated <= data.total_pages) {
        fetchRatedMovies();
      } else {
        fetchPopularMovies();
      }
    })
    .catch(err => console.error(err));
}

function fetchPopularMovies() {
  if (currentPagePopular > numberOfPagesToFetch) {
    return;
  }

  const urlPopular = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${currentPagePopular}&api_key=${API_KEY}`;

  fetch(urlPopular)
  .then(response => response.json())
  .then(data => {
      console.log(data);

      data.results.forEach(movie => {
          const listItem = createMovieLink(movie);
          popularTopList.appendChild(listItem);

          const posterImg = createMoviePost(movie);
          popularTopList.appendChild(posterImg);
      });

      currentPagePopular++;

      if (currentPagePopular <= data.total_pages) {
          fetchPopularMovies();
      }
  })
  .catch(err => console.error(err));
}

fetchPopularMovies();

fetchRatedMovies();

function createMovieLink(movie) {
    const listItem = document.createElement('li');
    const movieRef = document.createElement("a");
    movieRef.href = `infosida.html?movieId=${movie.id}`;
    movieRef.textContent = movie.title + " (" + movie.release_date + ")";
    movieRef.setAttribute("target", "_blank");
    listItem.appendChild(movieRef);
    return listItem;
  }

function createMoviePost(movie) {

    const posterImgUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'het-archief-van-verschillende-media-de-spoel-en-de-omslag-van-de-film-23883411.jpg';

    const posterImg = document.createElement('img');
    posterImg.src = posterImgUrl;
    posterImg.alt = `${movie.title} Poster`;
    posterImg.classList.add('topListImg');

    const postLink = document.createElement("a");
    postLink.href = `infosida.html?movieId=${movie.id}`;
    postLink.setAttribute("target", "_blank");

    postLink.appendChild(posterImg);

    const movieView = document.createElement('div');
    movieView.appendChild(postLink);
 
    return movieView;
}





