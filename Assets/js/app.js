// Need an app that has two columns - first is a selector
const APIKey = "da610bb405b7ea4f8c0a45c01b2af668";
let cityName = "",UVIndex="",lastCity="";
let cArray = [];
let forecast = [];

// function - get the city name
function searchCity(){
  cityName = document.querySelector("#city-nm").value;
  //now that we have the value let's clear the value
  document.querySelector("#city-nm").value = '';
   //Validate that there is something when we click on search
   if (cityName == "") {
    document.querySelector('#section-header').innerHTML='Please input a City Name<br>'; 
    setTimeout(() => {location.reload();}, 2000);
    return;
    }
    //if there are things in local storage g and get it 
    if(localStorage.getItem("cities")){
        cArray = JSON.parse(localStorage.getItem("cities"));
    }

  
   // If we already have this city in citybuttons ignore or add to the bottom!
   //should only do this if the fetch is ok... going to put this in a function!
    let upperCity = cityName.toUpperCase();
    let cityN = capitalizeFirstLetter(cityName.toLowerCase());
    if(!cArray.includes(upperCity)){
        storCityList(upperCity);
        if(document.querySelector("#cityChoice")){
        newF =document.querySelector("#cityChoice");
        let newIn = document.createElement("button");
            newIn.setAttribute("class","border  q-button city-button");
            newIn.name = cityName;
            newIn.value = cityName;
            newIn.textContent = cityN;
            newIn.id = cityName.toUpperCase();
            newF.appendChild(newIn);
        } else {
            buildCityButtons();
        }

    }
   fetchForecast(cityName);
  }

// This will build the buttons when we start 
function buildCityButtons(){
    //Set up variables
    let cityMenu = document.querySelector("#cityButtons");
    let newF = document.createElement("form");
    newF.setAttribute("id","cityChoice");
    newF.setAttribute("class","btn-group-vertical p-1")
    if(localStorage.getItem("cities")){ 
        cArray= JSON.parse(localStorage.getItem("cities"));
            for (let i=0; i < cArray.length; i++){
            let city = cArray[i];
            //This routine changes the city to meet general naming conventions
            let cityN = capitalizeFirstLetter(city.toLowerCase());  
            let newIn = document.createElement("button");
            newIn.setAttribute("class","border  q-button city-button");
            newIn.name = city;
            newIn.value = city;
            newIn.textContent = cityN;
            newIn.id = city;
            newF.appendChild(newIn);
            }
            cityMenu.appendChild(newF);   
            fetchForecast(cArray[0]);         
            }
         var btnSelect=document.querySelector("#cityChoice");
         // add event listener for the form created
          if(btnSelect != undefined){
          btnSelect.addEventListener('click', (event) => {
           const isButton = event.target.nodeName === 'BUTTON';
           event.preventDefault();
           cAns = event.target.id;
           fetchForecast(cAns);
           })   
           } else {
          //if this is the first time and nothing in local storage show weather for London
          fetchForecast("London");
      }
      
      }


//clear the five day cards if they are there to prevent multiple
function fetchForecast(city){  
  let lat=0,lon=0; 
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`)
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data){
       lat = data.coord.lat;
       lon = data.coord.lon;
       var minTemp = data.main.temp_min;
       var maxTemp = data.main.temp_max;
       var currTemp =data.main.temp;
       
        var newHtml1 =`<div class="order-1 p-2"><h3 id="cityDetails">${data.name} 
          <span style="color: black;font-weight: normal;">   (${new Date().toLocaleDateString()} 
          )</span> <img src='https://openweathermap.org/img/w/${data.weather[0].icon}.png'></h2></div>
          <div class="order-2 ml-4"><p>Temperature</strong>: ${currTemp} &deg;F</p></div>
          <div class="order-4 ml-4"><p>Humidity</strong>: ${data.main.humidity} %</p></div>
          <div class="order-5 ml-4"><p>Wind Speed</strong>: ${data.wind.speed} mph</p></div>`;
          document.querySelector('#weather-details').innerHTML = newHtml1;


        fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIKey}`)
         .then(function(res) { return res.json() }) //This function converts resules to json
         .then(function(d){
          if(document.querySelector('#uv-index')){
            var myobj = document.querySelector('#uv-index');
            myobj.remove();
          } 
           let uvi=d.value;
           let ubtn = "";
           let newP = document.createElement("div");
           newP.setAttribute("id","uv-index");
           if (uvi<3) {ubtn='uv-index-good'} else if(uvi >= 3 && uvi < 6) {ubtn='uv-index-med'}
           else if(uvi >= 7 && uvi < 8) {ubtn='uv-index-pbad'} else if (uvi >= 8 && uvi < 11) {ubtn='uv-index-bad'} 
           else {ubtn='uv-index-vbad'};
           let newHTML2 = `<div class="order-6 ml-4 mb-4">UV Index: <button class = "${ubtn}">${uvi}</button></div>`
            newP.innerHTML = newHTML2;
            let j = document.querySelector('#weather-details');
           j.appendChild(newP);
                }).catch(function() {
                  console.log("error-");
              })
            }).catch(function() {
              console.log("error+");
          })

      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`)
      .then(function(res) { return res.json() })
      .then(function(d){
        //If the cards are there remove them so we can create new ones
        if(document.querySelector('#fiveDayCards')){
          var myobj = document.querySelector('#fiveDayCards');
          myobj.remove();
        } 
          let j = document.querySelector('#fiveDay');
          let newD = document.createElement("div");
          newD.setAttribute("id","fiveDayCards");
          newD.setAttribute("class","row");
          let newHTML3 = '<div class="container text-center mt-3"><h3>5-Day Forecast<h3></div><div class="container w-100" id="forecast">'; 
          let count = d.cnt;
          for (let i = 0; i < count; i += 8){
            let date = d.list[i].dt_txt.split(" ");
            today = date[0];
            today = today.replace(/-/g,'/');  // replaces all occurances of "-" with "/"
            let dayOfWeek = new Date(date).toLocaleString('en-us', {  weekday: 'long' });
            let usDay = new Date(date).toLocaleString('en-us', {  dateStyle: 'short' });
            let icon =  `'https://openweathermap.org/img/w/${d.list[i].weather[0].icon}.png'`;
            let temp = d.list[i].main.temp;
            let hum = d.list[i].main.humidity;
          
          let html = (`
          <div class="col rounded">
            <div class="card">
              <div class="card-body">
                  <p class="title" style="color: blue;">${dayOfWeek}</p>
                  <p class="title">${usDay}</p>
                  <p><img class="icon" src=${icon}></p>
                  <p class="temps"><strong>Temperature:</strong> ${temp} &deg;F</p>
                  <p class="temps"><strong>Humidity:</strong> ${hum} %</p>
              </div>
              </div>
          </div>
          `)
          newHTML3 = newHTML3 + html;
        }
       newD.innerHTML = newHTML3;  
       j.appendChild(newD)
      }).catch(function() {
        console.log("error1");
    })   
   }
            
function capitalizeFirstLetter(string) {
    let newString ="";
    let spString = string.split(" ");
    for (let i=0; i< spString.length; i++ ){
        let string1 =  spString[i];
        let string2 = string1.charAt(0).toUpperCase() + string1.slice(1);
        newString += string2 + " ";
    }       
    return newString;
}
          


//function - create a localstorage array for that  city and and the city to the cities list
function storCityList(city){
        cArray.push(city);
        localStorage.setItem("cities",JSON.stringify(cArray));
}

function clearHist(){
localStorage.removeItem("cities");
location.reload();
}


//populate the buttons for places already visited
buildCityButtons();
//Action if Search is used instead
document.querySelector("#search-button").addEventListener("click",searchCity);
document.querySelector("#clear-history").addEventListener("click",clearHist);