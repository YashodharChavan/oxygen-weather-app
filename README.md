# Weather App

This is a simple weather app that provides real-time weather information based on a city name. The app fetches data from a weather API and displays various weather details. The location (city name) is manually set in the code and does not track the user's location.

## Features
The app displays the following weather details:

- **Current Date**: Shows today's date (day, month, year).
- **Temperature**: The current temperature in Celsius.
- **Humidity**: The current humidity percentage.
- **Weather Description**: The current weather conditions (e.g., clear, cloudy, rainy).
- **Sunrise and Sunset**: The time of sunrise and sunset for the given city.
- **Wind Speed and Direction**: The speed and direction of the wind.
- **UV Index**: The current UV index.
- **Max UV Index**: The maximum UV index for the day.
- **Ozone Level**: The current level of ozone (measured in µg/m³).
- **Cloudiness**: The percentage of cloud cover for the city.
- **Average Cloudiness**: The average cloudiness for the day.

## Features Currently Not Implemented
- **Location Tracking**: The app does not automatically track the user's location. The city name is manually set in the code for fetching weather data.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YashodharChavan/oxygen-weather-app
   cd oxygen-weather-app
2. **Install Dependencies**
   ```bash
    npm install
3. **create a .env file (optional)**
   ```bash
   WEATHER_API_KEY=your_weather_api_key
    OPEN_WEATHER_API_KEY=your_open_cage_api_key
4. **Run the app**
   ```bash
    npm start
## Notes
* The app uses the WeatherAPI.com to fetch weather data.

* Make sure to replace your_weather_api_key and 
your_open_cage_api_key in the .env file with valid keys from the respective APIs.

* The location (city) is hardcoded into the code, so you will need to modify the city name manually in the code if you want weather data for a different city.
