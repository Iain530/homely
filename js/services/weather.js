import { get } from './requests.js';

const BASE_URL = 'https://www.metaweather.com';
const LOCATION_URL = BASE_URL + '/api/location/search';
const WEATHER_URL = BASE_URL + '/api/location';


export const iconURL = (state) => {
    return `${BASE_URL}/static/img/weather/${state}.svg`;
};

export const getLocationByLattLong = ({
    latt,
    long,
}, callback, error = null) => {
    const url = `${LOCATION_URL}?lattlong=${latt},${long}`;
    get(url, callback, error);
};

export const getLocationByNameQuery = (query, callback, error = null) => {
    const url = new URL(LOCATION_URL);
    url.searchParams.set('query', query);
    get(url, callback, error);
};

export const getWeatherAtLocation = (woeid, callback, error = null) => {
    const url = `${WEATHER_URL}/${woeid}/`;
    get(url, callback, error);
};
