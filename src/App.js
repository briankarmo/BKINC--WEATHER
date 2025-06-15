import hotBg from "./assets/hot.png";
import coldBg from "./assets/cold.png";
import bkinclogo from "./assets/bkinclogo.png";
import Descriptions from "./components/Descriptions";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./weatherService";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("imperial");
  const [bg, setBg] = useState(hotBg);

  useEffect(() => {
    if (city) {
      const fetchWeatherData = async () => {
        try {
          const data = await getFormattedWeatherData(city, units);
          setWeather(data);

          // dynamic bg
          const threshold = units === "metric" ? 20 : 68;
          if (data.temp <= threshold) setBg(coldBg);
          else setBg(hotBg);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };

      fetchWeatherData();
    }
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        <div className="container">
          {!weather && (
            <div className="welcome-section max-width-centered">
              <img src={bkinclogo} alt="BK Inc Logo" className="welcome-logo" />
              <h1 className="welcome-title">Welcome to BK INC. WEATHER</h1>
              <p className="welcome-subtitle">Your trusted source for accurate weather information</p>
            </div>
          )}

          <div className="section section__inputs max-width-centered">
            <input
              onKeyDown={enterKeyPressed}
              type="text"
              name="city"
              placeholder="Enter your city..."
              autoFocus
            />
            <button onClick={(e) => handleUnitsClick(e)}>°C</button>
          </div>

          {weather ? (
            <>
              <div className="section section__temperature max-width-centered">
                <div className="icon">
                  <h3>{`${weather.name}, ${weather.country}`}</h3>
                  <img src={weather.iconURL} alt="weatherIcon" />
                  <h3>{weather.description}</h3>
                </div>
                <div className="temperature">
                  <h1>{`${weather.temp.toFixed()} °${
                    units === "metric" ? "C" : "F"
                  }`}</h1>
                </div>
              </div>

              {/* bottom description */}
              <Descriptions weather={weather} units={units} />
            </>
          ) : (
            <div className="section section__temperature max-width-centered">
              <div className="icon">
                <h3 className="search-prompt">Start by entering a city above!</h3>
                <p className="search-subtitle">We'll show you the latest weather updates for your location.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;