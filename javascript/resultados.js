document.getElementById('compare-btn').addEventListener('click', async () => {
    const city1 = document.querySelector('#city1').value;
    const city2 = document.querySelector('#city2').value;

    if (!city1 || !city2) {
        alert('Por favor, digite os nomes das duas cidades.');
        return;
    }

    const apiKey = ''; //inserir APIkey

    const fetchCityWeather = async (city) => {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=${apiKey}&units=metric&lang=pt_br`;
        try {
            const response = await fetch(weatherUrl);
            if (!response.ok) throw new Error('Erro ao buscar dados');
            return await response.json();
        } catch (error) {
            console.error(`Erro ao buscar dados para ${city}:`, error);
            return null;
        }
    };

    const [city1Data, city2Data] = await Promise.all([fetchCityWeather(city1), fetchCityWeather(city2)]);

    if (!city1Data || city1Data.cod !== 200 || !city2Data || city2Data.cod !== 200) {
        alert('Não foi possível obter os dados de uma ou ambas as cidades.');
        return;
    }

    // Redireciona para a página de resultados com os dados das cidades
    const url = `resultados.html?city1Data=${encodeURIComponent(JSON.stringify(city1Data))}&city2Data=${encodeURIComponent(JSON.stringify(city2Data))}`;
    window.location.href = url;
});

const params = new URLSearchParams(window.location.search);
const city1Data = JSON.parse(params.get('city1Data'));
const city2Data = JSON.parse(params.get('city2Data'));

// Exibir os dados das cidades
const city1Result = document.querySelector('#city1-result');
const city2Result = document.querySelector('#city2-result');

city1Result.innerHTML = `
    <div class="weather-info">
        <h3>${city1Data.name}, ${city1Data.sys.country}</h3>
        <p class="temp">
            Temperatura: ${city1Data.main.temp.toFixed(1)}°C
        </p>
        <p class="max-min">
            Máxima: ${city1Data.main.temp_max.toFixed(1)}°C
        </p>
        <p class="max-min">
            Mínima: ${city1Data.main.temp_min.toFixed(1)}°C
        </p>
        <p>Humidade: ${city1Data.main.humidity}%</p>
        <p class="description">Descrição: ${city1Data.weather[0].description}</p>
    </div>
`;

city2Result.innerHTML = `
    <div class="weather-info">
        <h3>${city2Data.name}, ${city2Data.sys.country}</h3>
        <p class="temp">Temperatura: ${city2Data.main.temp.toFixed(1)}°C</p>
        <p class="max-min">Máxima: ${city2Data.main.temp_max.toFixed(1)}°C</p>
        <p class="max-min">Mínima: ${city2Data.main.temp_min.toFixed(1)}°C</p>
        <p>Humidade: ${city2Data.main.humidity}%</p>
        <p class="description">Descrição: ${city2Data.weather[0].description}</p>
    </div>
`;

