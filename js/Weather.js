import { get } from './requests.js';
import Storage from './Storage.js';
import { minsToMillis } from './utils.js';
import { buildBlurSection } from './Blur.js';
import { isToday, isTomorrow } from './dates.js';

const BASE_URL = 'https://www.metaweather.com';
const LOCATION_URL = BASE_URL + '/api/location/search';
const WEATHER_URL = BASE_URL + '/api/location';

const WEATHER_KEY = 'WEATHER';
const PREVIOUS_WEATHER_KEY = 'last_weather';
const PREVIOUS_WEATHER_TIME_KEY = 'last_weather_time';

const storage = new Storage(WEATHER_KEY);

const DAYS = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
];

export const iconURL = (state) => {
    return `${BASE_URL}/static/img/weather/${state}.svg`;
};

export const getLocationByLattLong = ({ latt, long }, callback, error) => {
    const url = `${LOCATION_URL}?lattlong=${latt},${long}`;
    get(url, callback, error);
};

export const getLocationByNameQuery = (query, callback, error) => {
    const url = new URL(LOCATION_URL);
    url.searchParams.set('query', query);
    get(url, callback, error);
};

export const getWeatherAtLocation = (woeid, callback, error) => {
    const url = `${WEATHER_URL}/${woeid}/`;
    get(url, callback, error);
};


export default class Weather {
    constructor(refreshEvery = 1) {
        this.refreshEvery = minsToMillis(refreshEvery);
        this.weatherElement = null;

        this.initialised = this.init();
    }

    async init() {
        this.weatherElement = document.getElementById('weather-container');

        this.geolocationAvailable = 'geolocation' in navigator;
        if (!this.geolocationAvailable) return;
        const geolocation = navigator.geolocation;

        const previousWeatherTime = await storage.get(PREVIOUS_WEATHER_TIME_KEY);

        if (previousWeatherTime && Date.now() - previousWeatherTime <= this.refreshEvery) {
            const previousWeatherData = await storage.get(PREVIOUS_WEATHER_KEY);
            this.weatherData = previousWeatherData;
            this.updateHTML();
            return;
        }

        const requestError = (request) => {
            console.log(`Error calling ${request.url}`);
        };

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
                    this.updateHTML();
                }, requestError)
            }, requestError);
        });

        this.updateHTML();
    }

    isAvailable() {
        return this.geolocationAvailable;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        return `${DAYS[date.getDay()]} ${date.getDate()}`;
    }

    formatTemp(temp) {
        return `${Math.round(temp)}°`;
    }

    buildWeatherBox(day) {
        const weatherBox = document.createElement('div');
        weatherBox.className = 'weather-box';
        
        const date = document.createElement('div');
        date.className = 'weather date';
        date.textContent = this.formatDate(day.applicable_date);

        const state = document.createElement('div');
        state.className = 'weather state';

        const stateIcon = document.createElement('img');
        stateIcon.src = iconURL(day.weather_state_abbr);

        const temp = document.createElement('div');
        temp.className = 'weather temp';
        temp.textContent = this.formatTemp(day.the_temp);

        state.appendChild(stateIcon);
        state.appendChild(temp);

        weatherBox.appendChild(date);
        weatherBox.appendChild(state);
        // weatherBox.appendChild(temp);

        const { section, blurContent } = buildBlurSection();
        blurContent.className += ' no-pad';
        blurContent.appendChild(weatherBox);

        // section.className += ' no-margin';

        return section;
    }

    updateHTML() {
        if (this.weatherData) {
            const boxes = this.weatherData.consolidated_weather.map(day => this.buildWeatherBox(day));
            this.weatherElement.innerHTML = '';
            boxes.forEach(box => this.weatherElement.appendChild(box));
        } else {
            console.log('No weather data');
        }
    }
}