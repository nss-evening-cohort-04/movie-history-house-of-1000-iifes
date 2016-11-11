"use strict";

let apiKeys = {};
let uid = "";

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
//console.log("ready");
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
			//putTodoInDom();
			$('#login-container').addClass('hide');
			$('#stored-movies').removeClass('hide');
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
			$('#movie-search-output').append(`<h2>${dataFromOMDB.Title}</h2>` + '<button class="btn btn-sm btn-success" id="movie-adder">Add Movie to My Watchlist</button>');
			}).catch((error) => {
				$('#movie-search-button').button('reset');
			});	
		});	


	$('#searchBtn').on('click', function(){
		$('#login-container').addClass('hide');
		$('#stored-movies').addClass('hide');
		$('#movie-search-container').removeClass('hide');
	});

	$('#myMovieBtn').on('click', function(){
		$('#login-container').addClass('hide');
		$('#stored-movies').removeClass('hide');
		$('#movie-search-container').addClass('hide');
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

