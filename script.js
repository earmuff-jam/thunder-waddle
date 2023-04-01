
const defaultUrl = 'https://api.open-meteo.com/v1/forecast?';
const queryParams = ['latitude', 'longitude', 'current_weather', 'temperature_unit', 'daily', 'daily', 'timezone'];
// https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
const defaultTimeZone = 'MST7MDT'; // mountain zone
const showPosition = async (position) => {
    const { coords } = position;
    const { latitude, longitude } = coords;
    const paramOptions = [latitude, longitude, 'true', 'fahrenheit', 'sunrise', 'sunset', defaultTimeZone];
    const queryStr = queryParams.reduce((acc, el, index) => {
        acc += el + "=" + paramOptions[index] + '&';
        return acc;
    }, '');
    const completeUrl = defaultUrl + queryStr;
    const response = await fetch(completeUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
        },
        redirect: "follow"
    }).then(response => response.json());
    const current_weather = response?.current_weather;
    const { sunrise, sunset } = response?.daily;
    const currentDaySunrise = sunrise[0].split('T')[1];
    const currentDaySunset = sunset[0].split('T')[1];
    const loadingEl = document.querySelector('#loader');
    const dataEl = document.querySelector('#data-col');
    const loaderParent = document.querySelector('#loader-parent');
    loadingEl.classList.remove('spinner-grow');
    dataEl.classList.remove('visually-hidden');
    document.getElementById("current_temp").innerHTML = current_weather?.temperature;
    document.getElementById("sunrise").innerHTML = currentDaySunrise;
    document.getElementById("sunset").innerHTML = currentDaySunset;
};
const getLocation = () => {
    navigator.geolocation.getCurrentPosition(showPosition);
};
async function fetchQuotes() {
    const url = "https://api.goprogram.ai/inspiration";
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
        },
        redirect: "follow"
    }).then(response => response.json());
    document.getElementById("author").innerHTML = response?.author;
    document.getElementById("quote").innerHTML = response?.quote;
}
getLocation();
fetchQuotes();
