// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weatherInfo = document.getElementById('weather-info');

const cityName = document.getElementById('city-name');
const date = document.getElementById('date');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const feelsLike = document.getElementById('feels-like');
const pressure = document.getElementById('pressure');

// Your OpenWeatherMap API key
const apiKey = '331ca92302e15a439c9d10c2f72bc394';

// Weather icons mapping
const weatherIcons = {
    'clear': 'fas fa-sun',
    'clouds': 'fas fa-cloud',
    'rain': 'fas fa-cloud-rain',
    'snow': 'fas fa-snowflake',
    'thunderstorm': 'fas fa-bolt',
    'drizzle': 'fas fa-cloud-drizzle',
    'mist': 'fas fa-smog',
    'fog': 'fas fa-smog',
    'haze': 'fas fa-smog',
    'default': 'fas fa-cloud'
};

// Update date display
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    date.textContent = now.toLocaleDateString('en-US', options);
}

// Update weather display and background
function updateWeather(data) {
    console.log('Weather data received:', data);
    
    cityName.textContent = data.name + ', ' + data.sys.country;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    windSpeed.textContent = `${data.wind.speed} m/s`;
    humidity.textContent = `${data.main.humidity}%`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    pressure.textContent = `${data.main.pressure} hPa`;
    
    // Update weather icon
    const weatherMain = data.weather[0].main.toLowerCase();
    const iconClass = weatherIcons[weatherMain] || weatherIcons.default;
    weatherIcon.className = iconClass;
    
    // Update background based on weather
    updateBackground(weatherMain, data.main.temp);
}

// Update background based on weather condition and temperature
function updateBackground(weatherCondition, temperature) {
    // Remove all weather classes
    document.body.className = '';
    
    // Add the appropriate weather class
    document.body.classList.add(weatherCondition);
    
    // Add seasonal classes based on temperature
    if (temperature > 30) {
        document.body.classList.add('summer');
    } else if (temperature < 10) {
        document.body.classList.add('winter');
    } else {
        document.body.classList.add('moderate');
    }
}

// Show loading state
function showLoading() {
    loading.style.display = 'block';
    weatherInfo.style.display = 'none';
    error.style.display = 'none';
}

// Show weather data
function showWeather() {
    loading.style.display = 'none';
    weatherInfo.style.display = 'block';
    error.style.display = 'none';
}

// Show error with specific message
function showError(message = 'City not found. Please try again.') {
    loading.style.display = 'none';
    weatherInfo.style.display = 'none';
    error.style.display = 'block';
    error.innerHTML = `<p>${message}</p>`;
}

// Fetch weather data from API
async function fetchWeather(city) {
    if (!city.trim()) {
        showError('Please enter a city name');
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    
    console.log('Fetching weather for:', city);
    console.log('API URL:', url);
    
    try {
        showLoading();
        const response = await fetch(url);
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your API key.');
            } else {
                throw new Error('Failed to fetch weather data. Please try again.');
            }
        }
        
        const data = await response.json();
        updateWeather(data);
        showWeather();
        
        // Clear input after successful search
        cityInput.value = '';
        
    } catch (err) {
        console.error('Error fetching weather data:', err);
        showError(err.message);
    }
}

// Event listeners
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        showError('Please enter a city name');
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        } else {
            showError('Please enter a city name');
        }
    }
});

// Initialize with default city and date
updateDate();
fetchWeather('New York');