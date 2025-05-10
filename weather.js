// const { response } = require("express");

class WeatherAPI {
    constructor(apikey) {
        this.apiKey = apikey;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    }

    async getWeather(city) {
        try {
            const response = await fetch(`${this.baseUrl}?q=${city}&appid=${this.apiKey}&units=metric`);
            if (!response.ok) {
                throw new Error(`City not found (${response.status})`);
            }
            return await response.json();
        } catch(error) {
            console.log("Error fetching weather:", error);
            throw error;
        }
    }
}