$(document).ready(function () {
    const timeEl = document.querySelector("#time"),
    dateEl = document.querySelector("#date"),
    // Weather = weda
    currentWedaItems = document.querySelector("#current-weather-items"),
    timeZone = document.querySelector("#time-zone"),
    country = document.querySelector("#country"),
    wedaForeCast = document.querySelector("#weather-cast"),
    currentTemp = document.getElementById("current-temp");
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const API_KEY = `60a9eded7bce65ed1e3eb34566ac3da9`;
    
    setInterval(() => {
        const time = new Date();
        const month = time.getMonth();
        const date = time.getDate();
        const day = time.getDay();
        const hour = time.getHours();
        const hoursin12Hrformat = hour >= 13 ? hour %12: hour;
        const minutes = time.getMinutes();
        const amPm = hour >= 12 ? 'PM' : 'AM';
    
        timeEl.innerHTML = (hoursin12Hrformat < 10 ? '0' + hoursin12Hrformat : hoursin12Hrformat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + '' + `<span id="am pm">${amPm}</span>`;
    
        dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
    }, 1000);
    
    getWeatherData()
    function getWeatherData() {
        navigator.geolocation.getCurrentPosition((success) => {
            let {latitude, longitude} = success.coords;
    
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutes&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
    
                console.log(data);
                showWeatherData(data);
            });
        })
    }
    
    function showWeatherData (data) {
        let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
    
        timeZone.innerHTML = data.timezone;
        country.innerHTML = data.lat + '&#176; N ' + data.lon + ' &#176; E';
    
        currentWedaItems.innerHTML = `<div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure}</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${wind_speed}</div>
        </div>
        <div class="weather-item">
            <div>Sunrise</div>
            <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
        </div>
        <div class="weather-item">
            <div>Sunset</div>
            <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
        </div>`;
    
    
        let otherDaysCast = ``;
        data.daily.forEach((day, index) => {
            if (index == 0) {
    
                // console.log(currentTemp);
                currentTemp.innerHTML = `
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" class="w-icon" alt="">
                <div class="others">
                    <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
                    <div class="temp">Night - ${day.temp.night}&#176; C</div>
                    <div class="temp">Day - ${day.temp.day}&#176; C</div>
                </div>
                `;
            } else {
                otherDaysCast += ` <div class="weather-cast-item">
                    <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" class="w-icon" alt="">
                    <div class="temp">Night - ${day.temp.night}&#176; C</div>
                    <div class="temp">Day - ${day.temp.day}&#176; C</div>
                </div>`;
                
            }
        });
        
        wedaForeCast.innerHTML = otherDaysCast;
    }
    
});