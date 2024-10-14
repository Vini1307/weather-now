async function loadFavoritesWeather() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoritesList = document.getElementById("favorites-list");
  favoritesList.innerHTML = ""; // Limpa o conteúdo anterior

  if (favorites.length === 0) {
    favoritesList.innerHTML = "<p>Você ainda não tem cidades favoritas.</p>";
    return;
  }

  for (let city of favorites) {
    const weatherDiv = document.createElement("div");
    weatherDiv.classList.add("weather-container");
    weatherDiv.innerHTML = `<h2>Carregando previsão para ${city}...</h2>`;
    favoritesList.appendChild(weatherDiv);

    try {
      const apiKey = "bab2af24a8f449072a72db058f807444"; // Substitua pela sua chave
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(
        city
      )}&appid=${apiKey}&units=metric&lang=pt_br`;
      const weatherResults = await fetch(weatherUrl);
      const weatherJson = await weatherResults.json();

      if (weatherJson.cod === 200) {
        // Definir gradiente de fundo com base no clima
        const description = weatherJson.weather[0].description.toLowerCase();
        let weatherClass = "";

        if (description.includes("céu limpo")) {
            weatherClass = "clear-sky";
        } else if (
            description.includes("parcialmente nublado") ||
            description.includes("nuvens dispersas")
        ) {
            weatherClass = "partly-cloudy";
        } else if (description.includes("nublado") || description.includes("neblina")) {
            weatherClass = "cloudy";
        } else if (description.includes("chuva leve")) {
            weatherClass = "light-rain rainy"; 
        } else if (description.includes("chuva moderada")) {
            weatherClass = "moderate-rain rainy"; 
        } else if (description.includes("chuva forte")) {
            weatherClass = "heavy-rain rainy"; 
        } else if (description.includes("chuvas torrenciais")) {
            weatherClass = "torrential-rain rainy"; 
        } else if (description.includes("neve leve")) {
            weatherClass = "light-snow";
        } else if (description.includes("neve moderada")) {
            weatherClass = "moderate-snow";
        } else if (description.includes("neve forte")) {
            weatherClass = "heavy-snow";
        } else if (description.includes("granizo")) {
            weatherClass = "hail";
        } else if (description.includes("nevoeiro") || description.includes("névoa")) {
            weatherClass = "fog";
        } else if (description.includes("tempestade")) {
            weatherClass = "storm";
        } else if (description.includes("vento forte")) {
            weatherClass = "strong-wind";
        } else {
            weatherClass = "sunny"; // Padrão se nenhuma condição for atendida
        }

        weatherDiv.classList.add(weatherClass);

        weatherDiv.innerHTML = `
                    <h2>${weatherJson.name}, ${weatherJson.sys.country}</h2>
                    <div>
                        <img src="https://openweathermap.org/img/wn/${
                          weatherJson.weather[0].icon
                        }@2x.png" alt="${weatherJson.weather[0].description}">
                        <p>${weatherJson.weather[0].description}</p>
                        <p>Temperatura: ${weatherJson.main.temp.toFixed(
                          1
                        )}°C</p>
                        <p>Máxima: ${weatherJson.main.temp_max.toFixed(1)}°C</p>
                        <p>Mínima: ${weatherJson.main.temp_min.toFixed(1)}°C</p>
                        <p>Humidade: ${weatherJson.main.humidity}%</p>
                        <p>Vento: ${weatherJson.wind.speed} km/h</p>
                    </div>
                `;
      } else {
        weatherDiv.innerHTML = `<p>Não foi possível obter a previsão para ${city}.</p>`;
      }
    } catch (error) {
      console.error("Erro ao buscar os dados do clima:", error);
      weatherDiv.innerHTML = `<p>Erro ao carregar a previsão para ${city}.</p>`;
    }
  }
}

document.addEventListener("DOMContentLoaded", loadFavoritesWeather);
