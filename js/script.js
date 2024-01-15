const apiKey = "9451350a84bd8f4b2bd8929f67364a18";

const searchForm = document.getElementById("searchForm");
const searchResultsContainer = document.getElementById("searchResults");
const movieDetailsContainer = document.getElementById("movieDetails");
const ovrigt = document.getElementById('ovrigt');
const movieList = document.getElementById('movieList');
const svgCont1 = document.getElementById('svg-container1');
const svgCont2 = document.getElementById('svg-container2');

const toggleButton = document.getElementById('toggleButton');
const filmResultat1 = document.querySelector('.filmResultat1');
const filmResultat2 = document.querySelector('.filmResultat2');
const filmResultat3 = document.querySelector('.filmResultat3');

const personResultat1 = document.querySelector('.personResultat1');
const personResultat2 = document.querySelector('.personResultat2');
const personResultat3 = document.querySelector('.personResultat3');

const divx = document.getElementById('divx');

let intervalId;

const personTitlar = document.getElementById('personTitlar');
const filmTitlar = document.getElementById('filmTitlar');

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchFilm();
    document.body.style.background = "lightgrey";

    const searchType = document.getElementById("searchType").value;

    if (searchType === 'movies') {
        movieList.style.display = 'block';
        peopleList.style.display = 'none';
        filmTitlar.style.display = 'block';
        personTitlar.style.display = 'none'; 
    } else if (searchType === 'people') {
        movieList.style.display = 'none';
        peopleList.style.display = 'block';
        personTitlar.style.display = 'block';
        filmTitlar.style.display = 'none'; 
    }

    if (filmTitlar.style.display === 'block') {
        filmResultat1.style.display = 'flex';
        filmResultat2.style.display = 'none';
        filmResultat3.style.display = 'none';
    } else if (personTitlar.style.display === 'block') {
        personResultat1.style.display = 'flex';
        personResultat2.style.display = 'none';
        personResultat3.style.display = 'none';
    }

    ovrigt.style.display = 'block';
    startImageEvent();

    svgCont1.style.display = 'none';
    svgCont2.style.display = 'none';
});

//automatiskt bildspel mellan de 15 första sökresultaten
function startImageEvent() {
    intervalId = setInterval(startoverImageEvent, 3500);

    filmResultat1.removeEventListener('mouseover', stopImageEvent);
    filmResultat1.addEventListener('mouseover', stopImageEvent);
    filmResultat1.addEventListener('mouseout', startImageEvent);

    filmResultat2.removeEventListener('mouseover', stopImageEvent);
    filmResultat2.addEventListener('mouseover', stopImageEvent);
    filmResultat2.addEventListener('mouseout', startImageEvent);

    filmResultat3.removeEventListener('mouseover', stopImageEvent);
    filmResultat3.addEventListener('mouseover', stopImageEvent);
    filmResultat3.addEventListener('mouseout', startImageEvent);

    personResultat1.removeEventListener('mouseover', stopImageEvent);
    personResultat1.addEventListener('mouseover', stopImageEvent);
    personResultat1.addEventListener('mouseout', startImageEvent);

    personResultat2.removeEventListener('mouseover', stopImageEvent);
    personResultat2.addEventListener('mouseover', stopImageEvent);
    personResultat2.addEventListener('mouseout', startImageEvent);

    personResultat3.removeEventListener('mouseover', stopImageEvent);
    personResultat3.addEventListener('mouseover', stopImageEvent);
    personResultat3.addEventListener('mouseout', startImageEvent);
}

function stopImageEvent() {
    clearInterval(intervalId);
}

function startoverImageEvent() {
    toggleButton.click();
}

let overviewElement;

//hämta information sökresultat
function searchFilm() {
    const searchInput = document.getElementById("searchInput").value;
    const searchType = document.getElementById("searchType").value;

    stopImageEvent();
    
    movieList.innerHTML = '';
    peopleList.innerHTML = '';

    let searchUrl;
    if (searchType === 'movies') {
        searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchInput}`;
        movieList.style.display = 'block';
        peopleList.style.display = 'none';
    } else if (searchType === 'people') {
        searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${searchInput}`;
        movieList.style.display = 'none';
        peopleList.style.display = 'block';
    }

    fetch(searchUrl)
        .then((res) => {
            if (res.status === 200) {
               return res.json();
            }
            else if (res.status >= 400) {
                throw 'Error ' + res.status;
            }
        })
        .then((json) => {
            console.log(json);
            if (json.results && json.results.length > 0) {
                if (searchType === 'movies') {
                    const totalIteration = 15;
                    for (let i = 0; i < totalIteration; i++) {
                        const result = json.results[i % json.results.length];
                        const resultId = "result" + (i + 1);
                        displayMovieInfo(result, resultId);
                    }
                } else if (searchType === 'people') {
                    const totalIteration = 15;
                    for (let i = 0; i < totalIteration; i++) {
                        const result = json.results[i % json.results.length];
                        const resultId = "result" + (i + 1);
                        displayPeopleInfo(result, resultId);
                    }
                }
            } else {
                alert(`No ${searchType === 'movies' ? 'movies' : 'people'} found with the given title.`);
            }
        })

        //Uppdaterat så visas meddelande vid fel 
        .catch((err) => {
            console.error("Error: " + err);
              alert("Failed to load posters. " + err.message);
          });
        }

//lista sökresultat personer med länk till respektive sida
function displayPeople(peoples) {
    for (let peopleCount = 0; peopleCount < peoples.length; peopleCount++) {
        const person = peoples[peopleCount];
            const listItem = document.createElement('li');
            const peopleRef = document.createElement("a");
            peopleRef.href = `infosida.html?personId=${person.id}`;
            peopleRef.textContent = person.original_name;
            peopleRef.setAttribute("target", "_blank");
            listItem.appendChild(peopleRef);
            peopleList.appendChild(listItem);
    }
}

//personposter med länkning
function displayPeopleInfo(person, resultIdentifier) {
    const personTitle = person.original_name;

    const personImageUrl = person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : 'bilder/inkognito-okänd-person-kontur-av-mannen-110196097.jpg';

    const personImageLink = document.createElement("a");
    personImageLink.href = `infosida.html?personId=${person.id}`;
    personImageLink.setAttribute("target", "_blank");

    personImageLink.addEventListener("mouseover", (event) => {
        event.preventDefault();
        showPeopleOverview(person);
    });
    personImageLink.addEventListener("mouseout", (event) => {
        event.preventDefault();
        divx.style.display = "none";
    });

    const personImage = document.createElement("img");
    personImage.src = personImageUrl;
    personImage.alt = `${personTitle} Poster`;
    personImage.classList.add("posterImg");

    personImageLink.appendChild(personImage);

    const personInfoElement = document.getElementById(`person-info-${resultIdentifier}`);
    personInfoElement.innerHTML = "";
    personInfoElement.appendChild(personImageLink);
}

//information om person när hovrar över poster
function showPeopleOverview(person) {
    const personName = person.original_name;
    divx.style.display = "block";

    const titleElement = document.createElement("h1");
    titleElement.classList.add("title");
    titleElement.textContent = personName;

    const textElement = document.createElement("p");
    textElement.textContent = "Click on poster to read more about " + personName + "!";

    overviewElement.innerHTML = '';
    overviewElement.appendChild(titleElement);
    overviewElement.appendChild(textElement);
}

toggleButton.addEventListener('click', () => {
    if (filmResultat1.style.display !== 'none') {
        filmResultat1.style.display = 'none';
        filmResultat2.style.display = 'flex';
        filmResultat3.style.display = 'none';
    } else if (filmResultat2.style.display == 'none') {
        filmResultat1.style.display = 'flex';
        filmResultat2.style.display = 'none';
        filmResultat3.style.display = 'none';
    } else {
        filmResultat1.style.display = 'none';
        filmResultat2.style.display = 'none';
        filmResultat3.style.display = 'flex';
    }

    if (personResultat1.style.display !== 'none') {
        personResultat1.style.display = 'none';
        personResultat2.style.display = 'flex';
        personResultat3.style.display = 'none';
    } else if (personResultat2.style.display == 'none') {
        personResultat1.style.display = 'flex';
        personResultat2.style.display = 'none';
        personResultat3.style.display = 'none';
    } else {
        personResultat1.style.display = 'none';
        personResultat2.style.display = 'none';
        personResultat3.style.display = 'flex';
    }
});

//filmposter med länkning
function displayMovieInfo(movie, resultIdentifier) {
    const movieTitle = movie.original_title;

    const posterImageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'bilder/het-archief-van-verschillende-media-de-spoel-en-de-omslag-van-de-film-23883411.jpg';

    const posterLink = document.createElement("a");
    posterLink.href = `infosida.html?movieId=${movie.id}`;
    posterLink.setAttribute("target", "_blank");

    posterLink.addEventListener("mouseover", (event) => {
        event.preventDefault();
        showMovieOverview(movie);
    });
    posterLink.addEventListener("mouseout", (event) => {
        event.preventDefault();
        divx.style.display = "none";
    });

    const posterImage = document.createElement("img");
    posterImage.src = posterImageUrl;
    posterImage.alt = `${movieTitle} Poster`;
    posterImage.classList.add("posterImg");

    posterLink.appendChild(posterImage);

    const movieInfoElement = document.getElementById(`movie-info-${resultIdentifier}`);
    movieInfoElement.innerHTML = "";
    movieInfoElement.appendChild(posterLink);
}

overviewElement = document.getElementById("divx");

//information om film när hovrar poster
function showMovieOverview(movie) {
    const movieTitle = movie.original_title;
    const movieOverview = movie.overview;
    const movieReleaseDate = movie.release_date;

    const titleElement = document.createElement("h1");
    titleElement.classList.add("title");
    titleElement.textContent = movieTitle;

    const overviewTextElement = document.createElement("div");
    overviewTextElement.textContent = movieReleaseDate + ". " + movieOverview;

    const moreInfo = document.createElement("p");
    moreInfo.textContent = "Click on poster to read more about " + movieTitle + "!";

    overviewElement.innerHTML = '';
    overviewElement.appendChild(titleElement);
    overviewElement.appendChild(overviewTextElement);
    overviewElement.appendChild(moreInfo);

    divx.style.display = "block";
}

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const searchTerm = document.getElementById('searchInput').value;

    fetchMovies(searchTerm);
    fetchPeople(searchTerm);
});

function fetchMovies(searchTerm) {

    const apiUrl = 'https://api.themoviedb.org/3/search/movie';

    let page = 1;
    let totalPages = 1;

    function fetchPage(page) {
        const url = `${apiUrl}?query=${searchTerm}&api_key=${apiKey}&page=${page}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                totalPages = data.total_pages;

                displayMovies(data.results); 

                if (page < totalPages) {
                    fetchPage(page + 1);
                }
            })

            //Uppdaterat så visas meddelande vid fel 
            .catch(error => {
                console.error('Error:' + error)
                alert('Problem loading list of movies. ' + error.message);
            });
        }

    fetchPage(page);
}

function fetchPeople(searchTerm) {
    const personApiUrl = 'https://api.themoviedb.org/3/search/person';

    let personPage = 1;
    let personTotalPages = 1;

    function fetchPersonPage(personPage) {
        const personUrl = `${personApiUrl}?query=${searchTerm}&api_key=${apiKey}&page=${personPage}`;

        fetch(personUrl)
            .then(response => response.json())
            .then(data => {
                personTotalPages = data.total_pages;

                displayPeople(data.results);

                if (personPage < personTotalPages) {
                    fetchPersonPage(personPage + 1);
                }
            })

            //Uppdaterat så visas meddelande vid fel 
            .catch(error => {
                console.error('Error:' + error)
                alert('Problem loading list of people. ' + error.message);
            });
    }

    fetchPersonPage(personPage);
}

//lista sökresultat personer med länk till respektive sida
function displayMovies(movies) {
    for (let movieCount = 0; movieCount < movies.length; movieCount++) {
        const movie = movies[movieCount];
            const listItem = document.createElement('li');
            const movieRef = document.createElement("a");
            movieRef.href = `infosida.html?movieId=${movie.id}`;
            movieRef.textContent = movie.title;
            movieRef.setAttribute("target", "_blank");
            listItem.appendChild(movieRef);
            movieList.appendChild(listItem);
    }
}

//animation med lutande F och understreck
anime({
    targets: '.letter-f',
    rotate: [
        { value: '-30', duration: 2000, easing: 'easeInOutQuad' },
        { value: '0', duration: 2000, easing: 'easeInOutQuad' }
    ],
    easing: 'linear',
    loop: false
  });
  
  anime({
    targets: '#lineToDraw',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'linear',
    duration: 3500,
    direction: 'alternate',
    loop: false
  });
