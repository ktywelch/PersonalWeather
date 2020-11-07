// Need an app that has two columns - first is a selector
const APIKey = "da610bb405b7ea4f8c0a45c01b2af668";
let cityName = "";
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

        } else {
            let newP = document.createElement("p");
            newP.setAttribute("id","FirstRun");
            newP.innerText = "No History available yet"
            cityMenu.appendChild(newF); 

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
       var minTemp = (((data.main.temp_min - 273.15) * 9/5) + 32).toFixed(2);
       var maxTemp = (((data.main.temp_max - 273.15) * 9/5) + 32).toFixed(2);
       var currTemp =((( data.main.temp  - 273.15) * 9/5) + 32).toFixed(2);
       
        var newHtml ="<h2>" + data.name + ",   " + data.sys.state + "  " + data.sys.country + "</h2>" +
           "<h3><strong>Wind Speed</strong>: " + data.wind.speed + "</h3>" +
            "<h3><strong>Weather</strong>: <img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png'>" + data.weather[0].main + "</h3>" +
            "<h3><strong>Description</strong>: " + data.weather[0].description + "</h3>" +
            "<h4><strong>Temperature</strong>: " + currTemp+ "&deg;F</h4>" +
            "<h3><strong>Pressure</strong>: " + data.main.pressure + "hPa</h3>" +
            "<h3><strong>Humidity</strong>: " + data.main.humidity + " %</h3>" +
            "<h5><strong>Temperature Range</strong>: " + minTemp + "&deg;F - " + maxTemp + "&deg;F</h5>"
            "<h3><strong>Wind Speed</strong>: " + data.wind.speed + "m/s</h3>" +
            "<h3><strong>Wind Direction</strong>: " + data.wind.deg + "&deg;</h3>";
            document.querySelector('#weather-details').innerHTML = newHtml;
            });

    //Get the UV Index
    fetch(`http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIKey}`)
    .then(function(res) { return res.json() }) // Convert data to json
    .then(function(d){
        console.log(d) })

           // http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}

            
        }




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