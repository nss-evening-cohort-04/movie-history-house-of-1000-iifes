'use strict';

var FbAPI =(function(oldFirebase){

oldFirebase.getMovies = function(apiKeys, uid){
		return new Promise((resolve,reject)=>{
			$.ajax({
				method : 'GET',
				url: `${apiKeys.databaseURL}/movies.json?orderBy="uid"&equalTo="${uid}"`
			}).then((response)=>{
				//console.log("response", response);
				let movies = [];
				Object.keys(response).forEach(function(key){
					response[key].id = key;
					movies.push(response[key]);
				});
				resolve(movies);
			},(error)=>{
				console.log("error", error);
				reject(error);
			});
		});
	};

oldFirebase.addMovie = function(apiKeys, newMovie){
    return new Promise((resolve, reject)=>{
      $.ajax({
        method: "POST",
        url: `${apiKeys.databaseURL}/movies.json`,
        data: JSON.stringify(newMovie),
        dataType: 'json'
      }).then((response)=>{
        console.log("response from POST", response);
        resolve(response);
      }, (error)=>{
        reject(error);
      });
    });
  };

  oldFirebase.deleteMovie = function(apiKeys, movieId){ 
    return new Promise((resolve, reject)=>{
      $.ajax({
        method: "DELETE",
        url: `${apiKeys.databaseURL}/movies/${movieId}.json`,
      }).then((response)=>{
        console.log("response from DELETE", response);
        resolve(response);
      }, (error)=>{
        reject(error);
      });
    });
  };

  oldFirebase.editMovie = function(apiKeys, movieId, editedMovie){
    return new Promise((resolve, reject)=>{
      $.ajax({
        method: "PUT",
        url: `${apiKeys.databaseURL}/movies/${movieId}.json`,
        data: JSON.stringify(editedMovie),
        dataType: 'json'
      }).then((response)=>{
        console.log("response from PUT", response);
        resolve(response);
      }, (error)=>{
        reject(error);
      });
    });
  };

  return oldFirebase;
})(FbAPI || {});

