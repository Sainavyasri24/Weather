

# React Weather App 🌦️
A simple and clean weather forecast application built with React. It allows users to search for any city and get the current weather conditions, a 12-hour forecast, and a 7-day forecast. This project uses the OpenWeatherMap One Call API to fetch comprehensive weather data.

## Features
**Current Weather:** Displays the current temperature (in °C and °F), weather description, humidity, wind speed, precipitation chance, and UV index.

**Hourly Forecast:** Provides a 12-hour weather forecast with temperature and weather icons.

**7-Day Forecast:** Shows a summary of the weather for the next 7 days, including max and min temperatures.

**City Search:** Allows users to find weather information for any city in the world.

**Error Handling:** Provides user-friendly messages for invalid city names or API errors.

## Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

# Prerequisites
You need to have Node.js and npm (or yarn) installed on your machine.

Node.js (which includes npm)

# Installation
1. Clone the repository
   ```
   git clone https://github.com/your-username/react-weather-app.git
   ```
 
2. Navigate to the project directory

  ```
  cd react-weather-app
 ```
 3. Intall NPM packages

```
  npm install
 ```
5. Get an OpenWeatherMap API Key
This project requires an API key from OpenWeatherMap. If you don't have one, you can get a free key by signing up on their website:

* Go to [OpenWeatherMap](https://openweathermap.org/) and create an account.

* Navigate to your API keys page and copy your key.

5. Add your API Key to the project

* Open the src/App.js file.

* Find the following line:
```
JavaScript

const apiKey = 'd4932ffb71dfe62976e4246f81a0c59c'; 
```
* Replace the placeholder key with your own OpenWeatherMap API key.

6. Run the application
```
npm start
```
The app will open in your default browser at http://localhost:3000.

## Technologies Used
**React:** A JavaScript library for building user interfaces.

**OpenWeatherMap API:** Used for fetching weather data.

**HTML & Inline CSS:** For structure and styling.

