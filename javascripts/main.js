"use strict";

let apiKeys = {};
let uid = "";

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