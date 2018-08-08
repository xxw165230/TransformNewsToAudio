var news ={}
var API_ENDPOINT = "https://tc3r5ir9pg.execute-api.us-east-1.amazonaws.com/dev"

function loadDoc() {
  var imgurl = "http://global.fncstatic.com/static/orion/styles/img/fox-news/og/og-fox-news.png"
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    var obj = JSON.parse(this.responseText);
    
    news.title1 = obj.articles[1].title
    news.title2 = obj.articles[2].title
    news.title3 = obj.articles[3].title
    
	
    news.descr1 = obj.articles[1].description
    news.descr2 = obj.articles[2].description
    news.descr3 = obj.articles[3].description
    
	var inputData = {
		"voice": "Joanna",
		"text1" : news.title1,
		"text2" : news.title2,
		"text3" : news.title3		
	};
	
	$.ajax({
	      url: API_ENDPOINT,
	      type: 'POST',
	      data:  JSON.stringify(inputData),
	      contentType: 'application/json; charset=utf-8',
	      success: function (response) {
		  document.getElementById("news").innerHTML = 
		'<div>' +
    
		'<div class="w3-card w3-margin" style="float:left; width:30%" >' +
		'<img src="'+obj.articles[1].urlToImage+'" style="width:100%">' + 
		'<div class="w3-container">'+
		'<h4><b>"'+obj.articles[1].title+'"</b></h4>' +
		'<p>"'+obj.articles[1].description+'"</p>' +
		'<audio controls  style="width: 100%">' + '<source src="'+response[0]+'" type="audio/mpeg">' + '</audio>' +
		'</div>' + '</div>' +
	
		'<div class="w3-card w3-margin" style="float:left; width:30%" >' +
		'<img src="'+obj.articles[2].urlToImage+'" style="width:100%">' + 
		'<div class="w3-container">'+
		'<h4><b>"'+obj.articles[2].title+'"</b></h4>' +
		'<p>"'+obj.articles[2].description+'"</p>' +
		'<audio controls style="width: 100%">' + '<source src="'+response[1]+'" type="audio/mpeg">' + '</audio>' +
		'</div>' + '</div>' +
	
		'<div class="w3-card w3-margin" style="float:right; width:30%" >' +
		'<img src="'+obj.articles[3].urlToImage+'" style="width:100%">' + 
		'<div class="w3-container">'+
		'<h4><b>"'+obj.articles[3].title+'"</b></h4>' +
		'<p>"'+obj.articles[3].description+'"</p>' +
		'<audio controls style="width: 100%">' + '<source src="'+response[2]+'" type="audio/mpeg">' + '</audio>' +
		'</div>' + '</div>' +
	
		'</div>';
	      },
	      error: function () {
	          alert("error");
	      }
	  });  
    }
  };
  var api = 'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=8923d7b2f3c945cd9b3e714ef0edb897';
  
  xhttp.open("GET", api, true);
  xhttp.send();
};



function DataToS3 (){
	var inputData = {
		"voice": "Joanna",
		"text1" : news.descr1,
		"text2" : news.descr2,
		"text3" : news.descr3
		
	};

	$.ajax({
	      url: API_ENDPOINT,
	      type: 'POST',
	      data:  JSON.stringify(inputData),
	      contentType: 'application/json; charset=utf-8',
	      success: function (response) {
		  document.getElementById("urltest").innerHTML="URL: " + response + '<audio controls>' + '<source src="'+response[1]+'" type="audio/mpeg">' + '</audio>';
	      },
	      error: function () {
	          alert("error");
	      }
	  });
}

