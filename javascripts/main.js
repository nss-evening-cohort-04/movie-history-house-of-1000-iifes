"use strict";

let apiKeys = {};
let uid = "";
let newMovie = {};

function putMoviesInDom(){
	FbAPI.getMovies(apiKeys, uid).then(function(movies){
		console.log("movies from FB", movies);
		$('#watchedOutput').html("");
		$('#toWatchOutput').html("");
		movies.map(function(movie){
        if(movie.isWatched === true){
          let newListmovie = `<li>`;
          newListmovie+=`<div class="movie-output" data-fbid="${movie.id}">`;
          newListmovie+=`<h2 class="movieTitle">${movie.title}</h2>`;
          newListmovie+=`<h4 class="movieYear">Year Released: ${movie.yearReleased} </h4>`;
          newListmovie+=`<h4>Starring:</h4> <br> <h4 class="movieStars">${movie.starring}</h4>`;
          newListmovie+='<input type="checkbox" class="watched-checkbox" checked value="Seen-it!"> Seen it!</input>';
          newListmovie+='<h4 class="ratingHeader">My Rating:</h4> <select class="ratingDropdown"> <option value="blank">---</option> <option value="5">5</option> <option value="4">4</option> <option value="3">3</option> <option value="2">2</option> <option value="1">1</option></select>';
          newListmovie+=`<br> <button class="btn btn-danger delete">Delete</button> `;
          newListmovie+='</div>';
          newListmovie+='</li>';
          $('#watchedOutput').append(newListmovie);
          //$('#toWatchOutput').append(newListmovie);
        } else {
        	let newListmovie = `<li>`;
          newListmovie+=`<div class="movie-output" data-fbid="${movie.id}">`;
          newListmovie+=`<h2 class="movieTitle">${movie.title}</h2>`;
          newListmovie+=`<h4 class="movieYear">Year Released: ${movie.yearReleased}</h4>`;
          newListmovie+=`<h4>Starring:</h4> <br> <h4 class="movieStars">${movie.starring}</h4>`;
          newListmovie+='<input type="checkbox" class="watched-checkbox" value="Seen-it!"> Seen it!</input>';
          newListmovie+='<h4 class="ratingHeader hidden">My Rating:</h4> <select class="ratingDropdown hidden"> <option value="blank">---</option> <option value="5">5</option> <option value="4">4</option> <option value="3">3</option> <option value="2">2</option> <option value="1">1</option></select>';
          newListmovie+=`<br> <button class="btn btn-danger delete">Delete</button> `;
          newListmovie+='</div>';
          newListmovie+='</li>';
          $('#toWatchOutput').append(newListmovie);
        }	
		});
	});
}


//API search promise
let movieList = (searchText) => {
	return new Promise ((resolve,reject) => {
		$.ajax({
			method: 'GET',
			url: '../apiKeys.json'
		}).then((response) => {
			console.log("API response: ", response);
			apiKeys = response;

			$.ajax({
				method: 'GET',
				url: ` http://www.omdbapi.com/?t=${searchText}&r=json` 
			}).then((response2) => {
				console.log("movie response: ", response2);
				resolve(response2);
			}, (errorResponse2) => {
				console.log("movie fail: ", errorResponse2);
				reject(errorResponse2);
			});


		}, (errorResponse) => {
			console.log("errorResponse:", errorResponse); // these 2 lines are an error message if the 'then' statement fails
			reject(errorResponse);
		});
	});
};



$(document).ready(function(){
FbAPI.firebaseCredentials().then(function(keys){
	//console.log("keys", keys);
		apiKeys = keys;
		firebase.initializeApp(apiKeys);
	});

//register
	$('#registerButton').on('click', function(){
		let email = $('#inputEmail').val();
		let password = $('#inputPassword').val();
		let username = $('#inputUsername').val();
		let user = {
			"email": email,
			"password": password
		};
		FbAPI.registerUser(user).then(function(registerResponse){
			console.log("reg response",registerResponse);
			let newUser = {
				"username":username,
				"uid":registerResponse.uid
			};
			return FbAPI.addUser(apiKeys,newUser);
			//return FbAPI.loginUser(user);
		}).then(function(userResponse){
			return FbAPI.loginUser(user);
		}).then(function(loginResponse){
			console.log("loginResponse", loginResponse);
			uid = loginResponse.uid;
			//createLoginButton();
			//putTodoInDom();
			$('#login-container').addClass('hide');
			$('#stored-movies').removeClass('hide');
		});
	});


	//login
	$('#loginButton').on('click' , function(){
		let email = $('#inputEmail').val();
		let password = $('#inputPassword').val();

		let user = {
			"email": email,
			"password": password
		};
		FbAPI.loginUser(user).then(function(loginResponse){
			console.log("loginResponse", loginResponse);
			uid = loginResponse.uid;
			//createLoginButton();
			
			$('#login-container').addClass('hide');
			$('#stored-movies').removeClass('hide');
			$('#searchBtn').removeClass('hide');
			$('#signedInAs').removeClass('hide');
			$('#logoutBtn').removeClass('hide');
			putMoviesInDom();
		});
	});

	//Search Events
	$('#movie-search-button').on('click', () => {
		$('#movie-search-button').button('loading'); 
		$('#movie-search-output').html(""); // Clears the output for a new search
		let userSearchInput = $('#movie-search').val();
		console.log("User Search Input: ", userSearchInput);
		movieList(userSearchInput).then((dataFromOMDB) => {
			$('#movie-search-button').button('reset'); 
			console.log("dataFromOMDB: ", dataFromOMDB);
			console.log("Title returned from search: ", dataFromOMDB.Title);
			$('#movie-search-output').append(`<div class="movie-output" id="${dataFromOMDB.imdbID}">` + `<h2>${dataFromOMDB.Title}</h2>` + `<h4>Year Released: ${dataFromOMDB.Year}</h4>` + `<h4>Starring:</h4> <h4>${dataFromOMDB.Actors}</h4>` + '<br/>' + '<input type="checkbox" class="watched-checkbox" value="Seen-it!"> Seen it!</input>' + '<h4 class="ratingHeader hidden">My Rating:</h4> <select class="ratingDropdown hidden"> <option value="blank">---</option> <option value="5">5</option> <option value="4">4</option> <option value="3">3</option> <option value="2">2</option> <option value="1">1</option></select>' + '<br/>' + '<button class="btn btn-sm btn-success movie-adder">Add Movie to My Watchlist</button>'+ '</div>');

			// //Add to Watchlist Button
			$('.movie-adder').on('click', function(){
			    $(`#${dataFromOMDB.imdbID}`).appendTo('#toWatchOutput');
			    let newMovie = {
			      "title": dataFromOMDB.Title,
			      "yearReleased": dataFromOMDB.Year,
			      "starring": dataFromOMDB.Actors,
			      "isWatched": false,
			      "uid": uid
			    };
			    FbAPI.addMovie(apiKeys, newMovie).then(function(){
			      putMoviesInDom();
			    });
			});
			// //The commented-out code isn't quite working, continuing to plug away at



			//Watched (Seen It!) Checkbox
			$('.watched-checkbox').on('click', function (clickEvent) {
				if ($('.watched-checkbox').is(':checked')){
					$('.ratingHeader').removeClass('hidden');
					$('.ratingDropdown').removeClass('hidden');
				} else {
					$('.ratingHeader').addClass('hidden');
					$('.ratingDropdown').addClass('hidden');
				}				
			});

			}).catch((error) => {
				$('#movie-search-button').button('reset');
			});


	});

	//delete
	$('ol').on('click','.delete', function(){
		let movieId = $(this).parent().data('fbid');
		FbAPI.deleteMovie(apiKeys, movieId).then(function(){
			putMoviesInDom();
		});
	});

	//checkbox
	$('ol').on('change', 'input[type="checkbox"]', function(){
			let updatedIsWatched = $(this).closest('li').data('watchedOutput');
			let movieId = $(this).parent().data('fbid');
			let title = $(this).siblings('.movieTitle').html();
			let year = $(this).siblings('.movieYear').html();
			let starring = $(this).siblings('.movieStars').html();

			let watchedMovie = {
			      "title": title,
			      "yearReleased": year,
			      "starring": starring,
			      "isWatched": !updatedIsWatched,
			      "uid": uid
			    };

			// let watchedMovie = {
			//       "title": dataFromOMDB.Title,
			//       "yearReleased": dataFromOMDB.Year,
			//       "starring": dataFromOMDB.Actors,
			//       "isWatched": false,
			//       "uid": uid
			//     };    

			FbAPI.watchedMovie(apiKeys, movieId, watchedMovie).then(function(){
				putMoviesInDom();
			});
	});


	$('#searchBtn').on('click', function(){
		$('#login-container').addClass('hide');
		$('#stored-movies').addClass('hide');
		$('#myMovieBtn').removeClass('hide');
		$('#searchBtn').addClass('hide');
		$('#movie-search-container').removeClass('hide');
	});

	$('#myMovieBtn').on('click', function(){
		$('#login-container').addClass('hide');
		$('#stored-movies').removeClass('hide');
		$('#searchBtn').removeClass('hide');
		$('#myMovieBtn').addClass('hide');
		$('#movie-search-container').addClass('hide');
	});	

  $('#movie-adder').on('click', function(){
    let newMovie = {
      "title": "${dataFromOMDB}.Title",
      "isWatched": false,
      "uid": uid
    };
    FbAPI.addMovie(apiKeys, newMovie).then(function(){
      putMoviesInDom();
    });
  });

	$('#logout-container').on("click", "#logoutBtn", function(){
  	FbAPI.logoutUser();
  	uid = "";
  	$('#inputEmail').val("");
  	$('#inputPassword').val("");
  	$('#inputUsername').val("");
  	$('#login-container').removeClass("hide");
  	$('#movie-container').addClass("hide");

	});

});

