const API_KEY = "9451350a84bd8f4b2bd8929f67364a18";

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('movieId');
const personId = urlParams.get('personId');

if (movieId) {
    fetchMovieDetails(movieId);
} else if (personId) {
    fetchActorDetails(personId);
}

async function fetchMovieDetails(movieId) {
  try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
      const data = await response.json();
      displayMovieDetails(data);
  } catch (error) {
      console.error('Error:', error);
  }
}

async function fetchActorDetails(personId) {
  try {
      const response = await fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${API_KEY}`);
      const data = await response.json();
      displayActorDetails(data);
  } catch (error) {
      console.error('Error:', error);
  }
}

function displayMovieDetails(movie) {
  const backdropPath = movie.backdrop_path;
  const backdropUrl = backdropPath ? `https://image.tmdb.org/t/p/original${backdropPath}` : '';

  const posterImageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'bilder/het-archief-van-verschillende-media-de-spoel-en-de-omslag-van-de-film-23883411.jpg';

  const titleLink = document.createElement("a");
  titleLink.href = `https://www.themoviedb.org/movie/${movie.id}`;
  titleLink.textContent = "TMDb";
  titleLink.setAttribute("target", "_blank");

  const posterImg = document.createElement("img");
  posterImg.src = posterImageUrl;
  posterImg.alt = `${movie.original_title} Poster`;
  posterImg.classList.add('BigPosterImg');

  const movieDetailsContainer = document.getElementById('movieDetailsContainer');

  const movieDetailsWrapper = document.createElement("div");
  movieDetailsWrapper.classList.add('movieDetailsText');

  const titleElement = document.createElement("h2");
  titleElement.textContent = movie.original_title;
  titleElement.classList.add('titleElementStyle');

  const releaseDateElement = document.createElement("p");
  releaseDateElement.textContent = `Released: ${movie.release_date}`;

  const overviewElement = document.createElement("p");
  overviewElement.textContent = `Overview: ${movie.overview}`;

  const voteAverageElement = document.createElement("p");
  voteAverageElement.textContent = `Vote Average: ${movie.vote_average}`;

  const runtimeElement = document.createElement("p");
  runtimeElement.textContent = `Runtime: ${movie.runtime} minutes`;

  const genresElement = document.createElement("p");
  genresElement.textContent = `Genres: ${getGenresString(movie.genres)}`;

  movieDetailsWrapper.append(titleElement, releaseDateElement, overviewElement, voteAverageElement, runtimeElement, genresElement, titleLink);

  movieDetailsContainer.appendChild(posterImg);
  movieDetailsContainer.appendChild(movieDetailsWrapper);

  document.body.style.backgroundImage = backdropUrl ? `url('${backdropUrl}')` : '';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundSize = 'cover';
}


function getGenresString(genres) {
    return genres.map(genre => genre.name).join(', ');
}

function displayActorDetails(person) {
    const profilePath = person.profile_path;
    const profileImageUrl = profilePath ? `https://image.tmdb.org/t/p/w500${profilePath}` : 'bilder/inkognito-okänd-person-kontur-av-mannen-110196097.jpg';

    document.body.style.background = 'lightgrey';

    const profileImg = document.createElement("img");
    profileImg.src = profileImageUrl;
    profileImg.alt = `${person.name} Profile`;
    profileImg.classList.add('BigPosterImg');

    const actorDetailsWrapper = document.createElement("div");
    actorDetailsWrapper.classList.add('actorDetailsStyle');

    const nameElement = document.createElement("h2");
    nameElement.textContent = person.name;

    const knownForElement = document.createElement("p");
    knownForElement.textContent = `Known For: ${person.known_for_department}`;

    const biographyElement = document.createElement("p");
    biographyElement.textContent = `Biography: ${person.biography}`;

    const birthdayElement = document.createElement("p");
    birthdayElement.textContent = `Birthday: ${person.birthday}`;

    const placeOfBirthElement = document.createElement("p");
    placeOfBirthElement.textContent = `Place of Birth: ${person.place_of_birth}`;

    const actorLink = document.createElement("a");
    actorLink.href = `https://www.themoviedb.org/person/${person.id}`;
    actorLink.textContent = "TMDb";
    actorLink.setAttribute("target", "_blank");

    actorDetailsWrapper.append(nameElement, knownForElement, biographyElement, birthdayElement, placeOfBirthElement, actorLink);
    actorDetailsContainer.append(profileImg, actorDetailsWrapper);
}

function getPersonIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("personId");
}

async function fetchAndDisplayTopCredits(personId) {
    const API_KEY = "9451350a84bd8f4b2bd8929f67364a18";
    const url = `https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${API_KEY}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.cast && data.cast.length > 0) {
        const movieCredits = data.cast.filter(item => item.media_type === "movie");
        const tvCredits = data.cast.filter(item => item.media_type === "tv");
  
        movieCredits.sort((a, b) => b.vote_count - a.vote_count);
        tvCredits.sort((a, b) => b.vote_count - a.vote_count);
  
        const topMovieCredits = movieCredits.slice(0, 5);
        const topTvCredits = tvCredits.slice(0, 5);
  
        const movieulElement = createListElement(topMovieCredits);
        const tvulElement = createListElement(topTvCredits);
        const movieRubrik = document.createElement('h2');
        movieRubrik.innerText = "Most popular movies known for:";
        const tvRubrik = document.createElement('h2');
        tvRubrik.innerText = "Most popular TV-series known for:";
  
        document.body.appendChild(movieRubrik);
        document.body.appendChild(movieulElement);
        document.body.appendChild(tvRubrik);
        document.body.appendChild(tvulElement);
      } else {
        console.log("Ingen creditinformation tillgänglig.");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      throw error;
    }
  }
  
  function createListElement(credits, title) {
    const ulElement = document.createElement("ul");
  
    const headerElement = document.createElement("h2");
    headerElement.textContent = title;
    document.body.appendChild(headerElement);
  
    credits.forEach(credit => {
      const liElement = document.createElement("li");
  
      const linkElement = document.createElement("a");
      linkElement.href = `infosida.html?movieId=${credit.id}`;
      linkElement.textContent = credit.title || credit.name;
  
      linkElement.addEventListener("click", function (event) {
        event.preventDefault();
        navigateTo(linkElement.href);
      });
  
      liElement.appendChild(linkElement);
      ulElement.appendChild(liElement);
    });
  
    return ulElement;
  }
  
  function navigateTo(url) {
    window.location.href = url;
  }
   
  const personsId = getPersonIdFromUrl();
  
  if (personsId) {
    fetchAndDisplayTopCredits(personsId)
      .catch(error => {
        console.error("Fel vid hämtning och visning av listorna:", error);
      });
  }
