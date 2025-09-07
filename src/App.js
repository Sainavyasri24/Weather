import React, { useState } from 'react';

// Replace with your OpenWeatherMap API key
const apiKey = 'd4932ffb71dfe62976e4246f81a0c59c';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  // Fetch coordinates for the city and then fetch weather
  const fetchCoords = async () => {
    if (!city.trim()) {
      setError('Please enter a valid city name.');
      setWeather(null);
      return;
    }
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`
      );
      const data = await res.json();
      console.log('Coords fetch response:', data);
      if (data.cod === 200) {
        const { lat, lon } = data.coord;
        setError(null);
        fetchWeather(lat, lon);
      } else {
        setError('City not found. Please try again.');
        setWeather(null);
      }
    } catch (err) {
      console.error('Fetch coords error:', err);
      setError('Failed to fetch coordinates. Try later.');
      setWeather(null);
    }
  };

  // Fetch weather from One Call API v3 using lat/lon
  const fetchWeather = async (lat, lon) => {
    try {
      const exclude = 'minutely,alerts';
      const units = 'metric';
      const res = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&appid=${apiKey}`
      );
      const data = await res.json();
      if (data.current) {
        setWeather(data);
      } else {
        setError('Could not fetch weather details.');
        setWeather(null);
      }
    } catch (err) {
      console.error('Fetch weather error:', err);
      setError('Failed to fetch weather data. Please try later.');
      setWeather(null);
    }
  };

  // Convert m/s to km/h for wind speed
  const windSpeedKmH = (speed) => (speed * 3.6).toFixed(1);

  // Convert Unix timestamp to local time string
  const getLocalTime = (dt, timezoneOffset) => {
    const date = new Date((dt + timezoneOffset) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Convert Unix timestamp to day name
  const getDayName = (dt, timezoneOffset) => {
    const date = new Date((dt + timezoneOffset) * 1000);
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  };

  return (
    <div className="container" style={{ fontFamily: 'Arial, sans-serif', maxWidth: 600, margin: 'auto', padding: 20 }}>
      <header>
        <h1>React Weather App</h1>
      </header>

      <section className="search-box" style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          aria-label="City"
          style={{ padding: 8, width: '70%', fontSize: 16 }}
        />
        <button
          onClick={fetchCoords}
          style={{ padding: 8, fontSize: 16, marginLeft: 8 }}
          aria-label="Search for weather"
          type="button"
        >
          Search
        </button>
        {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      </section>

      {!city.trim() && (
        <p style={{ color: '#b8860b', marginBottom: 10 }}>
          Please enter a city name to get the weather forecast.
        </p>
      )}

      {weather && (
        <>
          {/* Current Weather */}
          <section
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <h2>{city.charAt(0).toUpperCase() + city.slice(1)}</h2>
            <p style={{ fontSize: 48, margin: '10px 0' }}>
              {Math.round(weather.current?.temp)}°C |{' '}
              {Math.round(weather.current?.temp * 9 / 5 + 32)}°F
            </p>
            <p style={{ fontSize: 18, textTransform: 'capitalize', margin: '5px 0' }}>
              {weather.current?.weather?.[0]?.description}
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                maxWidth: 400,
                marginTop: 20,
              }}
            >
              <div>
                <p>Humidity</p>
                <p>{weather.current?.humidity}%</p>
              </div>
              <div>
                <p>Wind Speed</p>
                <p>{windSpeedKmH(weather.current?.wind_speed)} km/h</p>
              </div>
              <div>
                <p>Precipitation</p>
                <p>{Math.round((weather.hourly?.[0]?.pop || 0) * 100)}%</p>
              </div>
              <div>
                <p>UV Index</p>
                <p>{weather.current?.uvi}</p>
              </div>
            </div>
            <p style={{ marginTop: 10, fontSize: 14, color: '#666' }}>
              Time: {getLocalTime(weather.current?.dt, weather.timezone_offset)}
            </p>
          </section>

          {/* Hourly Forecast */}
          <section style={{ marginBottom: 20 }}>
            <h3>Hourly Forecast</h3>
            <div style={{ display: 'flex', overflowX: 'auto', gap: 12 }}>
              {weather.hourly?.slice(0, 12).map((hour) => (
                <div
                  key={hour.dt}
                  style={{
                    minWidth: 60,
                    backgroundColor: '#f1f1f1',
                    borderRadius: 8,
                    padding: 10,
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: 14 }}>
                    {getLocalTime(hour.dt, weather.timezone_offset)}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${hour.weather?.[0]?.icon}@2x.png`}
                    alt={hour.weather?.[0]?.description}
                    width={40}
                    height={40}
                  />
                  <p style={{ fontWeight: 'bold' }}>{Math.round(hour.temp)}°C</p>
                </div>
              ))}
            </div>
          </section>

          {/* 7-Day Forecast */}
          <section>
            <h3>7-Day Forecast</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {weather.daily?.slice(0, 7).map((day) => (
                <div
                  key={day.dt}
                  style={{
                    textAlign: 'center',
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: '#e6e6e6',
                    width: '13%',
                  }}
                >
                  <p style={{ marginBottom: 4, fontWeight: 'bold' }}>
                    {getDayName(day.dt, weather.timezone_offset)}
                  </p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather?.[0]?.icon}@2x.png`}
                    alt={day.weather?.[0]?.description}
                    width={40}
                    height={40}
                  />
                  <p style={{ marginTop: 4 }}>
                    <span style={{ fontWeight: 'bold' }}>
                      {Math.round(day.temp.max)}°
                    </span>{' '}
                    / <span style={{ color: '#555' }}>{Math.round(day.temp.min)}°</span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <footer style={{ textAlign: 'center', marginTop: 30, fontSize: 12, color: '#777' }}>
        Powered by OpenWeatherMap API
      </footer>
    </div>
  );
}

export default App;
