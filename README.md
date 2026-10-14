<div align="center">

# ☀️ SkyCast — Weather Dashboard

### Your weather, beautifully clear.

A responsive weather dashboard displaying **real current conditions, hourly forecasts and the next five days** using the free [Open-Meteo](https://open-meteo.com/) public API.

[**🌤️ Live Weather App**](https://st10458151.github.io/skycast-weather/) · [**Developer Portfolio**](https://st10458151.github.io/developer-portfolio/) · [**GitHub**](https://github.com/ST10458151)

![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![API](https://img.shields.io/badge/API-Open--Meteo-148f9e) ![Hosting](https://img.shields.io/badge/Hosting-GitHub_Pages-24292f?logo=github)

</div>

---

## About

**SkyCast** is a lightweight, frontend-only weather application built to demonstrate **REST API integration, asynchronous JavaScript, JSON parsing, conditional rendering, date handling, loading/error states and responsive UI design**.

Start with Johannesburg, search for cities worldwide or use the quick-access city buttons. The dashboard obtains weather forecasts from Open-Meteo's geocoding and forecast APIs — **no API key required for non-commercial use**, subject to the provider's terms.

**Live app:** https://st10458151.github.io/skycast-weather/

## Features

| Feature | What it does |
|---|---|
| **City search** | Search worldwide locations using Open-Meteo Geocoding API |
| **Current conditions** | Display temperature, weather description and illustrative condition icon |
| **Feels-like temperature** | Display the apparent temperature |
| **Today's highlights** | Show humidity, wind speed, precipitation probability and daily UV maximum |
| **Hourly forecast** | Display the next 12 available forecast hours and rain probabilities |
| **Five-day forecast** | Show daily conditions and high/low temperatures |
| **Temperature units** | Toggle Celsius and Fahrenheit (wind switches between km/h and mph) |
| **Quick access** | Load Johannesburg, Cape Town, Durban or London |
| **Preferences** | Remember units and selected location in browser localStorage |
| **Responsive layout** | Adapt to desktop, tablet and mobile |
| **Errors and loading** | Report API/network failures and unsuccessful city searches |

## Tech stack

- **HTML5** — semantic structure and search controls
- **CSS3** — responsive dashboard, illustrations and cards
- **Vanilla JavaScript** — `async/await`, `fetch`, `URLSearchParams`, JSON and DOM updates
- **Open-Meteo** — [Forecast API](https://open-meteo.com/en/docs) and [Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- **localStorage** — optional saved location and units
- **GitHub Pages** — static website hosting

No database, frontend framework, server or API key is needed to run this project.

## How to use

1. Visit the [live SkyCast dashboard](https://st10458151.github.io/skycast-weather/).
2. Search for a city or use the left-hand quick access options on desktop.
3. View current temperature and daily highlights.
4. Scroll to the hourly and five-day forecasts.
5. Switch between **°C** and **°F** in the top-right corner.

> Forecast data is provided by Open-Meteo, and current conditions are model-based weather observations/estimates rather than readings from a local device. Accuracy and update frequency depend on the provider. UV shown is the **daily maximum**; rain chance is from the next available hourly forecast.

## Run locally

```bash
git clone https://github.com/ST10458151/skycast-weather.git
cd skycast-weather
python3 -m http.server 8000
```

Open **http://localhost:8000**. An internet connection is required to fetch the forecast and geocoding data.

## Project structure

```text
skycast-weather/
├── index.html   # Dashboard layout and semantic structure
├── style.css    # Responsive UI, cards and weather illustration
├── app.js       # API calls, units, location search, rendering and state
└── README.md    # Documentation
```

## APIs used

**Geocoding (city search):**

```text
https://geocoding-api.open-meteo.com/v1/search?name=Johannesburg&count=10&language=en&format=json
```

**Weather (forecast):**

```text
https://api.open-meteo.com/v1/forecast?latitude=-26.2041&longitude=28.0473&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto&forecast_days=5&forecast_hours=24
```

## Deployment

For GitHub Pages, go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then save.

**Published URL after deployment:** https://st10458151.github.io/skycast-weather/

## Learning outcomes

- Integrating third-party REST APIs with the browser Fetch API
- Using asynchronous `async/await` operations and handling failed requests
- Working with structured JSON weather and location data
- Converting temperatures and wind speed between units
- Rendering data dynamically with JavaScript DOM manipulation
- Designing reusable, responsive and accessible interface components
- Deploying a functional API-driven frontend using GitHub Pages

## Limitations & future improvements

- Geocoding currently selects the closest/name-matching result automatically; it does not offer a selection list for cities with the same name.
- Search requires internet access and successful API responses.
- Weather icons are simplified illustrative emojis.
- Potential enhancements include autocomplete suggestions, weather maps, severe weather alerts, and location geolocation with user consent.

---

<div align="center">

Built by **Shakeelah Khan** · [Portfolio](https://st10458151.github.io/developer-portfolio/) · [LinkedIn](https://www.linkedin.com/in/shakeelah-k-867b13320/)

Weather forecast and geocoding data: [Open-Meteo](https://open-meteo.com/)

</div>
