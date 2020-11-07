// Need an app that has two columns - first is a selector
const APIKey = "da610bb405b7ea4f8c0a45c01b2af668";
let cityName = "",UVIndex="";
let cArray = {};
let forecast = [];

//const jsonLocations = require('../files/city.list.json');

//const Locations = JSON.parse(jsonLocations);
//

//console.log(Locations);

// api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// api.openweathermap.org/data/2.5/weather?q={city name},{state code}&appid={API key}

// api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}

// api.openweathermap.org/data/2.5/forecast?q=London&appid={API key}

//icons
//("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
//******************* *

// function - get the city name
function searchCity(){
    console.log(this);
    //create the list of all cities so we can use them
    cityName = document.querySelector("#city-nm").value;
    //sotre City for the next time
    if(!document.querySelector("#"+cityName.toUpperCase())){
        storCityList(cityName);
    }
   //go and fetch the forecast
  fetchForecast(cityName);
}

function buildCityButtons(){
    let cityMenu = document.querySelector("#cityButtons");
    let newF = document.createElement("form");
    newF.setAttribute("id","cityChoice");
    newF.setAttribute("class","btn-group-vertical p-1")
    console.log("in functin")
    if(localStorage.getItem("cities")){
        let fr = document.querySelector("#FirstRun")
        if(fr){fr.remove()}
        //cArray = localStorage.getItem("cities");
       
        cArray= JSON.parse(localStorage.getItem("cities"));
        console.log(cArray.length);
        for (let i=0; i < cArray.length; i++){
            let city = cArray[i];
            let newIn = document.createElement("button");
            newIn.setAttribute("class","border  q-button city-button");
            newIn.name = city;
            newIn.value = city;
            newIn.textContent = city;
            newIn.id = city.toUpperCase();
            newF.appendChild(newIn);
         }
            cityMenu.appendChild(newF); 
            fetchForecast(cArray[0]);
        } else {
            let newP = document.createElement("p");
            newP.setAttribute("id","FirstRun");
            newP.innerText = "No history wil show info for London"
            cityMenu.appendChild(newF); 
            fetchForecast("London");
        }
    }
    /*
      var ansForm=document.querySelector("#ansForm");
      // add event listener for the form created
    

      ansForm.addEventListener('click', (event) => {
        const isButton = event.target.nodeName === 'BUTTON';
        event.preventDefault();
        cAns = event.target.id;
        console.log (cAns);
        checkans(ans,cAns,explain);
        console.dir(event.target.id);
      })
      */


function fetchForecast(city){   
  let lat=0,lon=0; 
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`)
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data){
       console.log(data);
       lat = data.coord.lat;
       lon = data.coord.lon;
       getUVIndex(lat,lon);
       var minTemp = (((data.main.temp_min - 273.15) * 9/5) + 32).toFixed(2);
       var maxTemp = (((data.main.temp_max - 273.15) * 9/5) + 32).toFixed(2);
       var currTemp =((( data.main.temp  - 273.15) * 9/5) + 32).toFixed(2);
       
        var newHtml ="<h2>" + data.name + ",   " + new Date().toLocaleDateString() + "</h2>" +
           "<br>Temperature</strong>: " + currTemp+ " &deg;F" +
           "<br>Humidity</strong>: " + data.main.humidity + " %" +
           "<br>Wind Speed</strong>: " + data.wind.speed + "mph" +
           "<br>UV Index</strong>: " + UVIndex + "";
            document.querySelector('#weather-details').innerHTML = newHtml;
            });
       }

    function getUVIndex(lat,lon){ 
    let d="",uvi="";         
    fetch(`http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIKey}`)
    .then(function(res) { return res.json() }) // Convert data to json
    .then(function(d){
        UVIndex=d.value;
        console.log(d,UVIndex); 
        })
    }

           // http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}

            


//function - create a localstorage array for that  city and and the city to the cities list
function storCityList(city){
        let cname = [];
        cArray.push(city);
        localStorage.setItem("cities",JSON.stringify(cArray));
}



//populate the buttons for places already visited
buildCityButtons();
//Action if Search is used instead
document.querySelector("#search-button").addEventListener("click",searchCity);