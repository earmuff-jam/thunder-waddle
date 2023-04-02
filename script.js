const inspirationBaseUrl = 'https://api.goprogram.ai/inspiration';
const weatherUrl = 'https://api.open-meteo.com/v1/forecast?';
const publicHolidayBaseUrl = 'https://date.nager.at/api/v3/PublicHolidays/';
const queryParams = ['latitude', 'longitude', 'current_weather', 'temperature_unit', 'daily', 'daily', 'daily', 'timezone'];
// https://date.nager.at/api/v3/PublicHolidays/2023/US
const defaultTimeZone = 'MST7MDT'; // mountain zone
const defaultCountrySelection = 'US';
const showPosition = async (position) => {
    const { coords } = position;
    const { latitude, longitude } = coords;
    const paramOptions = [latitude, longitude, 'true', 'fahrenheit', 'sunrise', 'sunset', 'rain_sum', defaultTimeZone];
    const queryStr = queryParams.reduce((acc, el, index) => {
        acc += el + "=" + paramOptions[index] + '&';
        return acc;
    }, '');
    const completeUrl = weatherUrl + queryStr;
    const response = await fetch(completeUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
        },
        redirect: "follow"
    }).then(response => response.json());
    const current_weather = response?.current_weather;
    const { sunrise, sunset, rain_sum } = response?.daily;
    const current_rain = rain_sum[0];
    const currentDaySunrise = sunrise[0].split('T')[1];
    const currentDaySunset = sunset[0].split('T')[1];
    const loadingEl = document.querySelector('#loader');
    const loaderParent = document.querySelector('#loader-parent');
    const dataEl = document.querySelector('#data-col');
    loadingEl.classList.remove('spinner-grow');
    dataEl.classList.remove('visually-hidden');
    loaderParent.classList.add('visually-hidden');
    const rainMeter = document.querySelector('#rain_sum');
    if (current_rain !== 0) {
        rainMeter.classList.remove('visually-hidden');
    }
    document.getElementById("current_temp").innerHTML = current_weather?.temperature;
    document.getElementById("sunrise").innerHTML = currentDaySunrise;
    document.getElementById("sunset").innerHTML = currentDaySunset;
};
const fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(showPosition);
};
const fetchQuotes = async () => {
    const url = inspirationBaseUrl;
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
const fetchHolidays = async () => {
    const baseUrl = publicHolidayBaseUrl;
    const date = new Date();
    const currentYear = date.getFullYear();
    const formattedDate = date.toISOString().split('T')[0];
    const completeUrl = baseUrl + currentYear + '/' + defaultCountrySelection;
    const response = await fetch(completeUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'follow'
    }).then(response => response.json());
    const selectedDate = response?.reduce((acc, el) => {
        if (formattedDate === el.date) {
            acc['date'] = el.date;
            acc['localName'] = el.localName;
            acc['name'] = el.name;
        }
        return acc;
    }, {});
    document.getElementById("holiday").innerHTML = selectedDate.name || 'No public holiday today';
};
fetchLocation();
fetchQuotes();
fetchHolidays();