"use strict";

const API = "5ce7b5ad98ae84783fe21706536e72d7";

const daye1 = document.querySelector(".default_day")
const datee1 = document.querySelector(".default_date")
const btne1 = document.querySelector(".btn_search")
const inpute1 = document.querySelector(".input_field")


const iconscontainer = document.querySelector(".icons")
const dayinfoe1 = document.querySelector(".day_info")
const listcontente1 = document.querySelector(".list_content ul")


const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];


const day = new Date();
const dayname = days[day.getDay()];
daye1.textContent = dayname;

let month = day.toLocaleString("default",{month:"long"})
let date = day.getDate()
let year = day.getFullYear()

console.log();
datee1.textContent = date + " " + month + " " + year;

btne1.addEventListener("click", (e) => {
    e.preventDefault();

    if (inpute1.value !==""){
        const search = inpute1.value;
        inpute1.value = ""
        findLocation(search)
    }
    else{
        console.log("please enter the city or country name")
    }
})

async function findLocation(name){
    iconscontainer.innerHTML = ""
    dayinfoe1.innerHTML = ""
    listcontente1.innerHTML=""
    try{
        const api_url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
        const data = await fetch(api_url);
        const result = await data.json();
        console.log(result);

        if (result.cod !=="404"){
            const imagecontent = displayimagecontent(result);

            const rightside = rightsidecontent(result)

            displayforecast(result.coord.lat,result.coord.lon)

            setTimeout(()=>{
                iconscontainer.insertAdjacentHTML("afterbegin",imagecontent)
                iconscontainer.classList.add("fadeIn")
                dayinfoe1.insertAdjacentHTML("afterbegin",rightside);
            },1500)
        }
        else{
            const message = `<h2 class="weather_temp">${result.cod}</h2>
            <h3 class="cloudtxt">${result.message}</h3>`
            iconscontainer.insertAdjacentHTML("afterbegin",message)
        }
    }
    catch(error){}
}

function displayimagecontent(data){
    return `
    <h2 class="weather_temp">${Math.round(data.main.feels_like - 275.15)}°C</h2>
    <h3 class="cloudtxt">${data.weather[0].description}</h3>`
    
}

function rightsidecontent(result){
    return `<div class="content">
    <p class="title">NAME</p>
    <span class="value">${result.name}</span>
  </div>
  <div class="content">
    <p class="title">TEMPERATURE</p>
    <span class="value">${Math.round(result.main.temp - 275.15)}°C</span> 
  </div> 
  <div class="content">
    <p class="title">HUMIDITY</p>
    <span class="value">${result.main.humidity}%</span> 
  </div> 
  <div class="content">
    <p class="title">FEELS_LIKE</p>
    <span class="value">${Math.round(result.main.temp - 275.15)}°C</span> 
  </div> 
  <div class="content">
    <p class="title">WIND SPEED</p>
    <span class="value">${Math.round(result.wind.speed + 2)} km/h</span> 
  </div>
  <div class="content">
    <p class="title">PRESSURE</p>
    <span class="value">${result.main.pressure} mb</span> 
  </div>
  `
}

async function displayforecast(lat,lon){
    const forecast_api=`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&long=${lon}&appid=${API}`
    const data = await fetch(forecast_api);
    const result = await data.json();

    const uniqueforecastdays = [];
    const daysforecast = result.list ?.filter((forecast)=>{
        const forecastdate = new Date(forecast.dt).getDate();
        if (!uniqueforecastdays.includes(forecastdate)){
            return uniqueforecastdays.push(forecastdate)
        }
    });
    console.log(daysforecast);
    daysforecast ?.forEach((content,indx)=>{
        if (indx<=3){
            listcontente1.insertAdjacentHTML("afterbegin",forecast(content));
        }
    });
}

function forecast(frcontent){
    const day = new Date(frcontent.dt);
    const dayName = days[day.getDay()];
    const splitday = dayName.split("",3)
    const joinday = splitday.join("");

    return `<li>
    <img src="https://openweathermap.org/img/wn/${frcontent.weather[0].icon}@2x.png"/>
    <span>${joinday}</span>
    <span class="day_temp">${Math.round(frcontent.main.temp - 275.15)}°C</span
    </li>`;
}