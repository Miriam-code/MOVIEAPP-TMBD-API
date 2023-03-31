const API_KEY = 'api_key=f734dc0f3991f1e3b58482e9f3d46552';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL +'/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const IMG = 'https://image.tmdb.org/t/p/w1280';
const YouTube = 'https://www.youtube.com/watch?v='
const searchURL = BASE_URL + '/search/movie?'+API_KEY;
const kids = BASE_URL+'/discover/movie?certification_country=US&certification.lte=G&sort_by=popularity.desc&'+API_KEY;
const series_url ='https://api.themoviedb.org/3/trending/tv/week?'+API_KEY+'&language=fr-FR';


const main = document.getElementById('main');
const containerEl = document.querySelector('.movie-details-container');
const form = document.getElementById('form');
const search = document.getElementById('search');
const h2 = document.querySelector('.h2');
const tagsEl = document.getElementById('tags');


getMovies(API_URL);

function getMovies(url) {
      fetch(url).then(res => res.json()).then(data => {
        showMovies(data.results);
  })
}

function showMovies(data) {

    main.innerHTML = '';

    data.forEach(movie => {
        
        const {title, vote_average, id ,backdrop_path} = movie;

        const movieEl = document.createElement('div');

        movieEl.classList.add('movie');

        movieEl.innerHTML = `
             <img  class="knowmore" src="${IMG_URL+backdrop_path}" alt="${title}"id="${id}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div> `

        main.appendChild(movieEl);
    
    })

    // evènement clique image knowmore

    const knowMore = document.querySelectorAll('.knowmore');

    knowMore.forEach(img => {

        img.addEventListener('click', () => {
            const movieId = img.id;
            showMovieDetails(movieId);
            containerEl.style.display = 'flex';
            
        });
    });
}

function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}

function showMovieDetails(movieId) {

 containerEl.innerHTML = '';

 const url = `https://api.themoviedb.org/3/movie/${movieId}?${API_KEY}&language=fr-fr&append_to_response=videos`;

 const credit = `${BASE_URL}/movie/${movieId}/credits?${API_KEY}&language=fr-fr&append_to_response=videos`;

  fetch(url).then(res => res.json()).then(data => {


    const { title, poster_path, vote_average, overview , backdrop_path , genres , release_date, videos } = data;


   fetch(credit).then(res => res.json()).then(creditData => {

    const actors = creditData.cast.slice(0, 5);

    const actorList = actors.map(actor => `<li><img src="${IMG_URL+actor.profile_path}" alt="${actor.name}">${actor.name}</li>`).join('');


      const movieDetailsEl = document.createElement('div');
      
      movieDetailsEl.classList.add('moviedescript');
      movieDetailsEl.innerHTML = `
        <div class='descript'>
        <h3>${title}</h3>
        <p>Note : ${Math.round(vote_average)} | genres : ${genres.map(genre => genre.name)} | date de sortie : ${release_date}</p>
        <p>${overview}</p>
        <div class="actor">
        <p>${actorList}</p>
        </div>
        </div>
      `;

      containerEl.style.backgroundImage = `url(${IMG+backdrop_path})`;

      const movieImg = document.createElement('div');
      movieImg.classList.add('movieimg');
      

      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', `https://www.youtube.com/embed/${videos.results[0].key}?autoplay=1`);
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', title);

      movieImg.appendChild(iframe);
      containerEl.appendChild(movieImg);
      containerEl.appendChild(movieDetailsEl);    
    })
    .catch(err => console.error(err));

  window.scrollTo(0, 0);

 })
}

// search

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if(searchTerm) {
          
        getMovies(searchURL+'&query='+searchTerm)
        h2.innerHTML = "résultat de votre recherche"
        window.scrollTo(0, 500);

    }

})

// genres 

const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    } 
]

var selectedGenre = []

setGenre();

function setGenre() {

    tagsEl.innerHTML= '';
    
    genres.forEach(genre => {

        const t = document.createElement('div');
        t.classList.add('tag');
        t.id= genre.id;
        t.innerText = genre.name;

        t.addEventListener('click', () => {

            if(selectedGenre.length == 0){

                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){

                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)

            getMovies(API_URL +'&with_genres='+encodeURI(selectedGenre.join(',')))
            highlightSelection()
            h2.innerHTML = "Résultat par genre : "
        })
        tagsEl.append(t);
    })
}

function highlightSelection() {

    const tags = document.querySelectorAll('.tag');

    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })


    clearBtn()

    if(selectedGenre.length !=0){   

        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }

}

function clearBtn(){

    let clearBtn = document.getElementById('clear');

    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{
            
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();            
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }
    
}

////////////////////////////////


const kidsEl = document.querySelector('.kids')

getMovieskid(kids)

function getMovieskid(url) {
    fetch(url).then(res => res.json()).then(data => {
      showMovieskids(data.results);
})
}

function showMovieskids(data) {

  kidsEl.innerHTML = '';

  data.forEach(movie => {
      
      const {title, vote_average, id ,backdrop_path} = movie;

      const movieEl = document.createElement('div');

      movieEl.classList.add('movie');

      movieEl.innerHTML = `
           <img  class="know" src="${IMG_URL+backdrop_path}" alt="${title}"id="${id}">

          <div class="movie-info">
              <h3>${title}</h3>
              <span class="${getColor(vote_average)}">${vote_average}</span>
          </div> `

      kidsEl.appendChild(movieEl);
  
  })

  // evènement clique image knowmore

  const knowMore = document.querySelectorAll('.know');

  knowMore.forEach(img => {

      img.addEventListener('click', () => {
          const movieId = img.id;
          showMovieDetails(movieId);
          containerEl.style.display = 'flex';
          
      });
  });
}

///////////////////////////////////

const series = document.querySelector('.series')

getSeries(series_url)

function getSeries(url) {
    fetch(url).then(res => res.json()).then(data => {
      showSeries(data.results);
})
}

function showSeries(data) {

  series.innerHTML = '';

  data.forEach(serie => {
      
      const {name, vote_average, id ,backdrop_path} = serie;

      const seriesEl = document.createElement('div');

      seriesEl.classList.add('movie');

     seriesEl.innerHTML = `
           <img  class="knowm" src="${IMG_URL+backdrop_path}" alt="${name}"id="${id}">

          <div class="movie-info">
              <h3>${name}</h3>
              <span class="${getColor(vote_average)}">${vote_average}</span>
          </div> `

      series.appendChild(seriesEl);
  
  })

  // evènement clique image knowmore

  const knowMore = document.querySelectorAll('.knowm');

  knowMore.forEach(img => {

      img.addEventListener('click', () => {
        const tv_id = img.id;
        showDetails(tv_id);
        containerEl.style.display = 'flex';
          
      });
  });
}


function showDetails(tv_id) {

  containerEl.innerHTML = '';
   
  const urls = `https://api.themoviedb.org/3/tv/${tv_id}?${API_KEY}`;

  const vid = `https://api.themoviedb.org/3/tv/${tv_id}/videos?${API_KEY}`;
   
  fetch(urls).then(res => res.json()).then(datax => {
   
  const { name, vote_average, overview , backdrop_path, first_air_date } = datax;

  fetch(vid).then(res => res.json()).then( dat =>{
    
   
  const movieDetails= document.createElement('div');
  
  movieDetails.classList.add('moviedescript');

  movieDetails.innerHTML = `
    <div class='descript'>
    <h3>${name}</h3>
    <p>Note : ${Math.floor(vote_average)} | date de sortie : ${first_air_date}</p>
    <p>${overview}</p>
  </div>`;

  containerEl.style.backgroundImage = `url(${IMG+backdrop_path})`;
  containerEl.appendChild(movieDetails);


  const movieImg = document.createElement('div');
  movieImg.classList.add('movieimg');
        
  
  const iframe = document.createElement('iframe');
  iframe.setAttribute('src', `https://www.youtube.com/embed/${dat.results[0].key}?autoplay=1`);
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('title', name);
  
  movieImg.appendChild(iframe);
  containerEl.appendChild(movieImg);
 containerEl.appendChild(movieDetails);

  })
           
  })
  .catch(err => console.error(err));
   
  window.scrollTo(0, 0);
}


