import React, { useState, useEffect } from "react";
import moment from "moment";
import "./App.css";
import { FiSearch } from "react-icons/fi";
import { IconContext } from "react-icons";
import Popup from "./components/Popup.jsx";
import git from "./assets/img/github-mark-white.png";
const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    getWeatherData();
  }, []);

  const getWeatherData = () => {
    navigator.geolocation.getCurrentPosition((success) => {
      let { latitude, longitude } = success.coords;
      fetchWeatherData(latitude, longitude);
    });
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      const currentData = await currentWeatherResponse.json();

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      const forecastData = await forecastResponse.json();

      const adaptedData = {
        current: {
          temp: currentData.main.temp,
          humidity: currentData.main.humidity,
          pressure: currentData.main.pressure,
          wind_speed: currentData.wind.speed,
          weather: currentData.weather,
          sunrise: currentData.sys.sunrise,
          sunset: currentData.sys.sunset,
        },
        timezone: currentData.name,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      };
      const dailyForecasts = processForecastData(forecastData.list);

      setWeatherData(adaptedData);
      setForecast(dailyForecasts);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setPopupMessage("An error occurred while fetching weather data.");
      setShowPopup(true);
    }
  };
  const processForecastData = (forecastList) => {
    const dailyData = [];
    const seenDates = new Set();

    forecastList.forEach((item) => {
      const date = moment.unix(item.dt).format("YYYY-MM-DD");

      if (!seenDates.has(date)) {
        const dayEntries = forecastList.filter(
          (entry) =>
            moment.unix(entry.dt).format("YYYY-MM-DD") === date &&
            moment.unix(entry.dt).hour() >= 6 &&
            moment.unix(entry.dt).hour() <= 18
        );

        const nightEntries = forecastList.filter(
          (entry) =>
            moment.unix(entry.dt).format("YYYY-MM-DD") === date &&
            (moment.unix(entry.dt).hour() < 6 ||
              moment.unix(entry.dt).hour() > 18)
        );

        const maxDayTemp =
          dayEntries.length > 0
            ? Math.max(...dayEntries.map((entry) => entry.main.temp_max))
            : item.main.temp_max;

        const minNightTemp =
          nightEntries.length > 0
            ? Math.min(...nightEntries.map((entry) => entry.main.temp_min))
            : item.main.temp_min;

        const dayWeather =
          dayEntries.length > 0
            ? dayEntries[Math.floor(dayEntries.length / 2)].weather
            : item.weather;
        const nightWeather =
          nightEntries.length > 0
            ? nightEntries[Math.floor(nightEntries.length / 2)].weather
            : item.weather;

        seenDates.add(date);
        dailyData.push({
          dt: item.dt,
          temp: {
            day: maxDayTemp,
            night: minNightTemp,
          },
          weather: {
            day: dayWeather,
            night: nightWeather,
          },
        });
      }
    });

    return dailyData.slice(0, 7);
  };
  useEffect(() => {
    Default();
  }, []);

  const Default = () => {
    const defaultLatitude = 27.7172;
    const defaultLongitude = 85.324;
    fetchWeatherData(defaultLatitude, defaultLongitude);
  };

  const handleSearch = () => {
    let location = document.getElementById("location-input").value.trim();
    if (location !== "") {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          const { coord } = data;
          if (coord) {
            const { lat, lon } = coord;
            fetchWeatherData(lat, lon);
          } else {
            setPopupMessage("Location not found.");
            setShowPopup(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
          setPopupMessage("An error occurred while fetching weather data.");
          setShowPopup(true);
        });
    } else {
      setPopupMessage("Please enter a location.");
      setShowPopup(true);
    }
  };

  const getWeatherBackgroundClass = () => {
    if (!weatherData) return "";
    const weather = weatherData.current.weather[0].main.toLowerCase();
    switch (weather) {
      case "clear":
        return "clear";
      case "clouds":
        return "cloudy";
      case "rain":
        return "rainy";
      case "thunderstorm":
        return "stormy";
      case "snow":
        return "snowy";
      case "haze":
        return "haze";
      case "mist":
        return "mist";
      case "drizzle":
        return "drizzle";
      case "fog":
        return "foggy";
      case "smoke":
        return "smoky";
      case "dust":
        return "dusty";
      case "sand":
        return "sandy";
      case "ash":
        return "ashy";
      case "squall":
        return "squally";
      case "tornado":
        return "tornado";
      case "hurricane":
        return "hurricane";
      case "blizzard":
        return "blizzard";
      default:
        return "";
    }
  };
  const getWeatherIconUrl = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  const getDayNightIcon = (icon, isDay) => {
    const baseIcon = icon.slice(0, -1);
    return baseIcon + (isDay ? "d" : "n");
  };

  return (
    <div className={`container ${getWeatherBackgroundClass()}`}>
      <div className="container-input">
        <input
          type="text"
          id="location-input"
          placeholder="Enter location"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button type="submit" id="search-button" onClick={handleSearch}>
          <IconContext.Provider
            value={{
              color:
                weatherData &&
                (weatherData.current.weather[0].main.toLowerCase() === "snow" ||
                  weatherData.current.weather[0].main.toLowerCase() ===
                    "haze" ||
                  weatherData.current.weather[0].main.toLowerCase() === "mist")
                  ? "black"
                  : "white",
              size: "28px",
            }}
          >
            <FiSearch />
          </IconContext.Provider>
        </button>
      </div>

      {weatherData && (
        <div className="current-info">
          <div className="date-container">
            <div className="time">
              {moment().format("hh:mm A")}
              <span id="am-pm">{moment().format("A")}</span>
            </div>
            <div className="date">{moment().format("dddd, DD MMM")}</div>

            <div className="others">
              <div className="weather-item">
                <div>Humidity</div>
                <div>{weatherData.current.humidity}%</div>
              </div>
              <div className="weather-item">
                <div>Pressure</div>
                <div>{weatherData.current.pressure}</div>
              </div>
              <div className="weather-item">
                <div>Wind Speed</div>
                <div>{weatherData.current.wind_speed}</div>
              </div>
              <div className="weather-item">
                <div>Sunrise</div>
                <div>
                  {moment.unix(weatherData.current.sunrise).format("hh:mm A")}
                </div>
              </div>
              <div className="weather-item">
                <div>Sunset</div>
                <div>
                  {moment.unix(weatherData.current.sunset).format("hh:mm A")}
                </div>
              </div>
            </div>
          </div>

          <div className="place-container">
            <p>Time Zone</p>
            <div className="time-zone">{weatherData.timezone}</div>
            <div className="country">
              {weatherData.lat}N {weatherData.lon}E
            </div>
          </div>
        </div>
      )}
      <div className="git">
        <a
          href="https://github.com/suraj-kumal/skycast"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={git} alt="GitHub Logo" width="40" height="40" />
        </a>
      </div>

      {weatherData && forecast && (
        <div className="future-forecast">
          <div className="today">
            <div className="day">{moment().format("dddd")}</div>
            <div className="c">
              <div className="weather-icons-today">
                <img
                  src={getWeatherIconUrl(
                    getDayNightIcon(weatherData.current.weather[0].icon, true)
                  )}
                  alt="day weather icon"
                  className="w-icon"
                  title="Day"
                />
                <img
                  src={getWeatherIconUrl(
                    getDayNightIcon(weatherData.current.weather[0].icon, false)
                  )}
                  alt="night weather icon"
                  className="w-icon"
                  title="Night"
                />
              </div>
              <div className="other">
                <div className="temp">Day {forecast[0].temp.day}&#176;C</div>
                <div className="temp">
                  Night {forecast[0].temp.night}&#176;C
                </div>
              </div>
            </div>
          </div>

          <div className="weather-forecast">
            {forecast.slice(1).map((day, idx) => (
              <div key={idx} className="weather-forecast-item">
                <div className="day">{moment.unix(day.dt).format("ddd")}</div>
                <div className="wt">
                  <div className="weather-icons">
                    <img
                      src={getWeatherIconUrl(
                        getDayNightIcon(day.weather.day[0].icon, true)
                      )}
                      alt="day weather icon"
                      className="w-icon"
                      title="Day"
                    />
                    <img
                      src={getWeatherIconUrl(
                        getDayNightIcon(day.weather.night[0].icon, false)
                      )}
                      alt="night weather icon"
                      className="w-icon"
                      title="Night"
                    />
                  </div>
                  <div className="T">
                    <div className="temp">Day {day.temp.day}&#176;C</div>
                    <div className="temp">Night {day.temp.night}&#176;C</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPopup && (
        <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default App;
