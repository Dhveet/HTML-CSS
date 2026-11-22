const form = document.getElementById("weatherForm");
const statusEl = document.getElementById("status");
const currentBox = document.getElementById("currentWeather");
const forecastGrid = document.getElementById("forecastGrid");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = document.getElementById("cityInput").value.trim();
    if (!city) return;

    statusEl.textContent = "Fetching weather data...";
    currentBox.style.display = "none";
    forecastGrid.innerHTML = "";

    try {
        // 1. Geocoding API call
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
        if (!geoRes.ok) throw new Error(`HTTP Error: ${geoRes.status}`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found.");
        }

        const { name, country, latitude, longitude } = geoData.results[0];

        // 2. Forecast API call
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`
        );
        if (!weatherRes.ok) throw new Error(`HTTP Error: ${weatherRes.status}`);
        const data = await weatherRes.json();

        statusEl.textContent = "";
        currentBox.style.display = "block";
        currentBox.innerHTML = `
            <h2>${name}, ${country}</h2>
            <p class="temp">${data.current_weather.temperature}°C</p>
            <p><strong>Wind Speed:</strong> ${data.current_weather.windspeed} km/h</p>
        `;

        // Render 3-day forecast
        data.daily.time.forEach((date, i) => {
            const card = document.createElement("div");
            card.className = "day-card";
            card.innerHTML = `
                <strong>${date}</strong>
                <p>Max: ${data.daily.temperature_2m_max[i]}°C</p>
                <p>Min: ${data.daily.temperature_2m_min[i]}°C</p>
            `;
            forecastGrid.appendChild(card);
        });
    } catch (err) {
        statusEl.textContent = `Error: ${err.message}`;
    }
});