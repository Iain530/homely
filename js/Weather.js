import { minsToMillis, createElement, buildBlurSection } from './utils.js';

import Storage from './services/storage.js';
import { formatDate } from './services/dates.js';
import { loadSettings } from './services/settings.js';
import { addOverlay } from './services/overlay.js';
import { 
    getLocationByLattLong,
    getWeatherAtLocation,
    iconURL,
} from './services/weather.js';


const PREVIOUS_WEATHER_KEY = 'last_weather';
const PREVIOUS_WEATHER_TIME_KEY = 'last_weather_time';

const storage = new Storage('WEATHER');


export default class Weather {
    constructor(refreshEvery = 1) {
        this.refreshEvery = minsToMillis(refreshEvery);
        this.weatherElement = null;
        this.weatherOverlay = null;
        
        this.enabled = null;

        this.initialised = this.init();
    }

    async init() {
        this.weatherElement = document.getElementById('weather-container');
        this.weatherOverlay = document.getElementById('weather-overlay');
        
        const settings = await loadSettings();
        this.enabled = settings.weatherEnabled;
        if (!this.enabled) {
            this.weatherElement.style.display = 'none';
            return;
        }

        // TODO: enable overlay + cursor pointer in css
        // addOverlay('weather-container', 'weather-overlay');

        this.geolocationAvailable = 'geolocation' in navigator;
        if (!this.geolocationAvailable) return;
        const geolocation = navigator.geolocation;

        const previousWeatherTime = await storage.get(PREVIOUS_WEATHER_TIME_KEY);

        if (this.usePreviousWeather(previousWeatherTime)) {
            const previousWeatherData = await storage.get(PREVIOUS_WEATHER_KEY);
            this.weatherData = previousWeatherData;
            this.render();
            return;
        }


        geolocation.getCurrentPosition((position) => {
            this.position = position;
            const lattlong = {
                latt: position.coords.latitude,
                long: position.coords.longitude,
            };

            getLocationByLattLong(lattlong, (request) => {
                const locations = JSON.parse(request.response);
                const woeid = locations[0].woeid;

                getWeatherAtLocation(woeid, (request) => {
                    const weatherData = JSON.parse(request.response);
                    storage.set(PREVIOUS_WEATHER_KEY, weatherData);
                    storage.set(PREVIOUS_WEATHER_TIME_KEY, Date.now());
                    this.weatherData = weatherData;
                    this.render();
                });

            });

        });
    }

    usePreviousWeather(previousWeatherTime) {
        return previousWeatherTime && Date.now() - previousWeatherTime <= this.refreshEvery;
    }

    isAvailable() {
        return this.geolocationAvailable;
    }

    formatTemp(temp) {
        return `${Math.round(temp)}°`;
    }

    buildWeatherBox(day) {
        const weatherBox = document.createElement('div');
        // weatherBox.className = 'weather-box';
        
        const date = document.createElement('div');
        date.className = 'weather date';
        date.textContent = formatDate(day.applicable_date);

        const state = document.createElement('div');
        state.className = 'weather state';

        const stateIcon = document.createElement('img');
        stateIcon.src = iconURL(day.weather_state_abbr);

        const temp = document.createElement('div');
        temp.className = 'weather temp';
        temp.textContent = this.formatTemp(day.the_temp);

        state.appendChild(temp);
        state.appendChild(stateIcon);

        // weatherBox.appendChild(date);
        weatherBox.appendChild(state);
        // weatherBox.appendChild(temp);

        const { section, blurContent } = buildBlurSection();
        blurContent.className += ' med-pad-v';
        blurContent.appendChild(weatherBox);

        section.className += ' no-margin';

        return weatherBox;
    }

    renderWeatherClock() {
        if (this.weatherData) {
            this.weatherElement.innerHTML = '';

            // const location = document.createElement('div');
            // location.className = 'weather location';
            // location.textContent = this.weatherData.title;

            this.weatherElement.appendChild(this.buildWeatherBox(this.weatherData.consolidated_weather[0]));
            this.weatherElement.style.visibility = 'visible';
            // this.weatherElement.appendChild(location);
        } else {
            // render placeholder
        }
    }

    renderWeatherOverlay() {
        if (this.weatherData) {
            // detailed weather in overlay
        }
    }

    render() {
        if (this.enabled) {
            this.renderWeatherClock();
            this.renderWeatherOverlay();
        }
    }
}