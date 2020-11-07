// Need an app that has two columns - first is a selector
const APIKey = "da610bb405b7ea4f8c0a45c01b2af668";
let cityName = "",UVIndex="";
let cArray = [];
let forecast = [];

// function - get the city name
function searchCity(){

    if(document.querySelector('#fiveDayCards')){
        var myobj = document.querySelector('#fiveDayCards');
        myobj.remove();
      }
    //create the list of all cities so we can use them
    cityName = document.querySelector("#city-nm").value;
    //sotre City for the next time
    if(!document.querySelector("#"+cityName.toUpperCase())){
        storCityList(cityName);
        if(document.querySelector("#cityChoice")){
        newF =document.querySelector("#cityChoice");
        let newIn = document.createElement("button");
            newIn.setAttribute("class","border  q-button city-button");
            newIn.name = cityName;
            newIn.value = cityName;
            newIn.textContent = cityName;
            newIn.id = cityName.toUpperCase();
            newF.appendChild(newIn);
        } else {
            buildCityButtons()
        }
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
    
    
      var btnSelect=document.querySelector("#cityChoice");
      // add event listener for the form created
        btnSelect.addEventListener('click', (event) => {
        const isButton = event.target.nodeName === 'BUTTON';
        event.preventDefault();
        cAns = event.target.id;
        console.log (cAns);
        fetchForecast(cAns);
      })
}


function fetchForecast(city){  
   if(document.querySelector('#fiveDayCards')){
        var myobj = document.querySelector('#fiveDayCards');
        myobj.remove();
      } 
  let lat=0,lon=0; 
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`)
    .then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data){
       lat = data.coord.lat;
       lon = data.coord.lon;
      /*
       var minTemp = (((data.main.temp_min - 273.15) * 9/5) + 32).toFixed(2);
       var maxTemp = (((data.main.temp_max - 273.15) * 9/5) + 32).toFixed(2);
       var currTemp =((( data.main.temp  - 273.15) * 9/5) + 32).toFixed(2);
      */
       var minTemp = data.main.temp_min;
       var maxTemp = data.main.temp_max;
       var currTemp =data.main.temp;
       
        var newHtml ='<h2 id="cityDetails">' + data.name + "   (" + new Date().toLocaleDateString() + 
         ") <img src='http://openweathermap.org/img/w/"+data.weather[0].icon + ".png'></h2>" +
           "<p>Temperature</strong>: " + currTemp+ " &deg;F" + "</p>" +
           "<p>Humidity</strong>: " + data.main.humidity + " %" +"</p>" +
           "<p>Wind Speed</strong>: " + data.wind.speed + "mph" +"</p>"  
            document.querySelector('#weather-details').innerHTML = newHtml;
            });

      fetch(`http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIKey}`)
      .then(function(res) { return res.json() }) // Convert data to json
      .then(function(d){
         let uvi=d.value;
         let newP = document.createElement("span");
         newP.innerText = "UV Index: " 
         newB = document.createElement("button")
         newB.setAttribute("class","uv-index");
         newB.innerText = uvi;
         let j = document.querySelector('#weather-details');
         j.appendChild(newP);
         j.appendChild(newB);
                })  

      fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`)
      .then(function(res) { return res.json() }) // Convert data to json
      .then(function(d){
          console.log(d)
          let j = document.querySelector('#fiveDay');
          let newD = document.createElement("div");
          newD.setAttribute("id","fiveDayCards");
          newD.setAttribute("class","row col-12");
          let newHTML = '<div class="container-fluid text-center">5-Day Forecast</div><div class="col-12 container" id="forecast">'; 
          let count = d.cnt;
          for (let i = 3; i < count; i += 8){
            let date = d.list[i].dt_txt.split(" ");
            today = date[0];
            console.log(today);
            
            let icon =  `'http://openweathermap.org/img/w/${d.list[i].weather[0].icon}.png'`;
            let temp = d.list[i].main.temp;
            let hum = d.list[i].main.humidity;
          
          let html = (`
          <div class="col rounded">
            <div class="card">
              <div class="card-body">
                  <p class="title">${today}</p>
                  <p><img class="icon" src=${icon}></p>
                  <p class="temps">Temperature: ${temp} &deg;F</p>
                  <p class="temps">Humidity: ${hum} %</p>
              </div>
              </div>
          </div>
          `)
          newHTML = newHTML + html;
        }
       newD.innerHTML = newHTML;  
       j.appendChild(newD)
      })   
   }



           // http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}

            


//function - create a localstorage array for that  city and and the city to the cities list
function storCityList(city){
        console.log(typeof(cArray))
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