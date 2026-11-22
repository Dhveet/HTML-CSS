const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const statusEl = document.getElementById("status");
const weatherCard = document.getElementById("weatherCard");

async function fetchWeather(city) {
    statusEl.textContent = "Loading weather data...";
    weatherCard.style.display = "none";

    try {
        // Step 1: Convert city name to latitude & longitude
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please try another name.");
        }

        const { name, country, latitude, longitude } = geoData.results[0];

        // Step 2: Fetch current weather using coordinates
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherRes.json();
        const current = weatherData.current_weather;

        // Save preferred city to Local Storage
        localStorage.setItem("preferredCity", name);

        statusEl.textContent = "";
        weatherCard.style.display = "block";
        weatherCard.innerHTML = `
            <h2>${name}, ${country}</h2>
            <p class="temp">${current.temperature}°C</p>
            <p><strong>Wind Speed:</strong> ${current.windspeed} km/h</p>
            <p><strong>Time:</strong> ${current.time.replace("T", " ")}</p>
        `;
    } catch (error) {
        statusEl.textContent = `Error: ${error.message}`;
    }
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

// Load saved city on page reload
window.addEventListener("DOMContentLoaded", () => {
    const savedCity = localStorage.getItem("preferredCity") || "Ahmedabad";
    cityInput.value = savedCity;
    fetchWeather(savedCity);
});