const APP = {
    APIKEY: '41c63e310079ec6610c94fa202d85688',
    mainImg:'https://image.tmdb.org/t/p/',
    active: "search",
    pages: [],
    baseURL: null,
    init: () => {
      APP.pages = document.querySelectorAll(".page");
      
      let fabs = document.querySelectorAll('.fab');
      fabs.forEach(fab=>{
        fab.addEventListener('click',function(ev){
          APP.nav(ev);
          document.getElementById('list_actors').innerHTML="";
          document.getElementById('list_movies').innerHTML="";
          document.getElementById('list_cast').innerHTML="";
        })
      })
      let searchBar = document.getElementById('search_input')
      let searchBtn = document.getElementById('btnClick');   
      searchBtn.addEventListener('click', function(ev){
              
        if(searchBar.value){
            APP.nav(ev);
            APP.inputText();
        }
        });
  
      APP.baseURL = location.href.split("#")[0];
      let hash = location.hash;
      //check for current url hash
      if (hash && hash != "#") {
        //there is an id in the url
        APP.active = hash.replace("#", "");
        APP.showPage(APP.active);
      } else {
        //no url so use our default
        history.replaceState({}, APP.active, `${APP.baseURL}#${APP.active}`);
        APP.showPage(APP.active);
      }
      //handle the back button
      window.addEventListener("popstate", APP.poppy);
    },
  
    inputText: () => {  //first page fetch call
      let name = "" + document.getElementById('search_input').value;
      let url = `https://api.themoviedb.org/3/search/person?api_key=${APP.APIKEY}&query=${name}&include_aldult=true&language=en-US`;
      fetch(url)
      .then(response => response.json())
      .then (data => {    
          console.log(data);
          APP.getData(data.results);
      })
      .catch(err =>{
          console.log(err);
      });
  
    },
  
    getData: (data) => {   //second page
      let ul = document.querySelector('.list_actors');
  
      data.forEach(element => {
  
        let path = element.profile_path;
        let name = element.name;
        let img = document.createElement('img');
        if (path == null){
          img.src = "./img/people-searcher.svg";
        }
        else {
          img.src = APP.mainImg + "w185" + path;
        }
        
        let actor = document.createElement('li');
        img.alt="profile";
        actor.setAttribute("data-href", 'movies');
        actor.setAttribute("id", name);
        actor.textContent = name;
        console.log(name);
        ul.appendChild(actor);
        ul.appendChild(img);
  
        actor.addEventListener('click', function(ev){
          APP.nav(ev);
          APP.getMovies(element);
      })
  
      });
  
    },
  
    getMovies: (movieS) =>{  //third page
      let div = document.getElementById('actor');
      let movieName = movieS.known_for;
      let ul = document.querySelector('.list_movies');
      let h1 = div.querySelector('h1');
      h1.textContent = movieS.name;
  
      movieName.forEach(titleMovie=> {
        let movieList = document.createElement('li');
        movieList.setAttribute("data-href", "movie_detail");
        movieList.textContent = titleMovie.title;
        ul.appendChild(movieList);
        let path = titleMovie.poster_path;
        let img = document.createElement('img');
        if (path == null){
          img.src = "./img/people-searcher.svg";
        }
        else {
          img.src = APP.mainImg + 'w185' + path;
        }
        
        ul.appendChild(img);
  
        movieList.addEventListener('click', function(ev){
        APP.nav(ev);
        APP.movieInfo(titleMovie.id);
        })
      })
      let path = movieS.profile_path;
      let img = div.querySelector('img');
      if (path == null){
        img.src = "./img/people-searcher.svg";
      }
      else {
        img.src = APP.mainImg + "w300" + path;
      }
      
    },
  
    movieInfo: (movie_id) =>{   //fourth page
      let url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${APP.APIKEY}&language=en-US`;
      let urlCast = `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${APP.APIKEY}&language=en-US`;
  
      fetch(url)  //fetch for movie info
      .then(response => response.json())
      .then(data => {
        console.log(data);
        APP.movieData(data);
        // APP.movieGenre(data.genres);
      }) 
      .catch(err =>{
        console.log(err);
    });
  
      fetch(urlCast)  //fetch for cast
      .then(response => response.json())
      .then (data => {    
          console.log(data);
          APP.movieCast(data.cast);
      })
      .catch(err =>{
          console.log(err);
      });
    },
  
    movieData: (data) => {   //movie title 
      let div = document.getElementById('movie_detail');
      let h1 = div.querySelector('h1');
      h1.textContent = data.title;
      console.log(h1);
  
      let span1 = div.querySelector('.year span');
      
      let span2 = div.querySelector('.genre span');
      let string = " ";
      span1.textContent = data.release_date;
      data.genres.forEach(item=>{
        span2.textContent = string+item.name;
      }
      )
  
  
  
      
  
      let path = data.poster_path;
      let img = div.querySelector('img');
      
      img.src = APP.mainImg + "w300" + path;
    },
  
    movieCast: (data) => {
      console.log(data);
      // let div = document.getElementById('movie_detail');
      let ul = document.querySelector('.list_cast');
  
      data.forEach(cast => {
        let path = cast.profile_path;
        let name = cast.name;
        // console.log(name);
        let img = document.createElement('img');
        if (path == null){
          img.src = "./img/people-searcher.svg";
        }
        else {
          img.src = APP.mainImg + "w185" + path;
        }
        
        let actors = document.createElement('li');
        img.alt="profile";
        actors.setAttribute("data-href", 'movie_detail');
        actors.setAttribute("id", name);
        actors.textContent = name;
        // console.log(name);
        ul.appendChild(actors);
        ul.appendChild(img);
      })
    },
  
    nav: ev => {
      ev.preventDefault();
      ev.stopPropagation();
      let link = ev.target.closest("[data-href]");
      let target = link.getAttribute("data-href");
      //update URL
      history.pushState({}, target, `${APP.baseURL}#${target}`);
      //change the display of the "page"
      APP.showPage(target);
      //use switch case with target for page specific things
    },
  
    showPage: target => {
      document.querySelector(".active").classList.remove("active");
      document.querySelector(`#${target}`).classList.add("active");
    },
  
    poppy: ev => {
      //get the id
      let target = location.hash.replace("#", "");
      APP.showPage(target);
    }
  };
  
  document.addEventListener("DOMContentLoaded", APP.init);