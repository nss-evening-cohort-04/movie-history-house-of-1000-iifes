'use strict';

var FbAPI = (function(oldFirebase){
	oldFirebase.getUser = function(apiKeys,uid){
		return new Promise((resolve,reject)=>{
			$.ajax({
				method : 'GET',
				url: `${apiKeys.databaseURL}/users.json?orderBy="uid"&equalTo="${uid}"`
			}).then((response)=>{
				let users = [];
				Object.keys(response).forEach(function(key){
					response[key].id = key;
					users.push(response[key]);
				});
				resolve(users[0]);
			},(error)=>{
				console.log("error", error);
				reject(error);
			});
		});
	};

	oldFirebase.addUser = function(apiKeys,newUser){
		return new Promise((resolve,reject)=>{
			$.ajax({
				method : 'POST',
				url: `${apiKeys.databaseURL}/users.json`,
				data: JSON.stringify(newUser),
				dataType: 'json'
			}).then((response)=>{
				console.log("response of addUser", response);
				resolve(response);
			},(error)=>{
				console.log("error", error);
				reject(error);
			});
		});
	};

	return oldFirebase;