document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value;

    if (!cityName) {
        return showAlert('Você precisa digitar uma cidade...');
    }

    const apiKey = 'bab2af24a8f449072a72db058f807444';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const weatherResults = await fetch(weatherUrl);
        const weatherJson = await weatherResults.json();

        if (weatherJson.cod === 200) {
            showInfo({
                city: weatherJson.name,
                country: weatherJson.sys.country,
                temp: weatherJson.main.temp,
                tempMax: weatherJson.main.temp_max,
                tempMin: weatherJson.main.temp_min,
                description: weatherJson.weather[0].description,
                tempIcon: weatherJson.weather[0].icon,
                windSpeed: weatherJson.wind.speed,
                humidity: weatherJson.main.humidity,
            });

            // Buscar a previsão dos próximos dias
            const forecastResults = await fetch(forecastUrl);
            const forecastJson = await forecastResults.json();
            displayForecast(forecastJson);
        } else {
            showAlert('Não foi possível localizar a cidade.');
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        showAlert('Erro ao obter os dados meteorológicos.');
    }
});

function showInfo(json) {
    showAlert('');

    document.querySelector('#weather').classList.add('show');
    document.querySelector('#forecast').classList.add('show');

    // Oculta o texto "Weather Now"
    document.querySelector('.text-container').classList.add('hidden');

    // Atualiza as informações do clima atual
    document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`;

    const temp = json.temp.toFixed(1).replace('.', ',');
    document.querySelector('#temp_value').innerHTML = `${temp}<sup>C°</sup>`;
    document.querySelector('#temp_description').innerHTML = `${json.description}`;
    document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);
    document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1).replace('.', ',')}<sup>C°</sup>`;
    document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1).replace('.', ',')}<sup>C°</sup>`;
    document.querySelector('#humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('#wind').innerHTML = `${json.windSpeed} km/h`;

    // Verifica se a cidade já é favorita e atualiza o estado do botão
    checkFavorite(json.city);

    // Atualiza o fundo com base no clima
    updateBackground(json.description);
}

function checkFavorite(city) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.includes(city)) {
        document.querySelector('#favorite-btn').classList.add('favorited');
    } else {
        document.querySelector('#favorite-btn').classList.remove('favorited');
    }
}

function toggleFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.includes(city)) {
        // Remove dos favoritos
        favorites = favorites.filter(favCity => favCity !== city);
        document.querySelector('#favorite-btn').classList.remove('favorited');
    } else {
        // Adiciona aos favoritos
        favorites.push(city);
        document.querySelector('#favorite-btn').classList.add('favorited');
    }

    // Atualiza o localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

document.querySelector('#favorite-btn').addEventListener('click', () => {
    const city = document.querySelector('#title').textContent.split(',')[0];
    toggleFavorite(city);
});

function updateBackground(description) {
    // Remove todas as classes de fundo
    document.body.classList.remove(
        'clear-sky', 'partly-cloudy', 'cloudy', 'light-rain', 'moderate-rain', 'heavy-rain', 'torrential-rain',
        'light-snow', 'moderate-snow', 'heavy-snow', 'hail', 'fog', 'storm', 'strong-wind', 'rainy', 'sunny'
    );

    // Adiciona a classe de fundo com base na descrição
    const lowerDescription = description.toLowerCase();
    if (lowerDescription.includes('céu limpo')) {
        document.body.classList.add('clear-sky');
    } else if (lowerDescription.includes('parcialmente nublado') || lowerDescription.includes('nuvens dispersas')) {
        document.body.classList.add('partly-cloudy');
    } else if (lowerDescription.includes('nublado') || lowerDescription.includes('neblina')) {
        document.body.classList.add('cloudy');
    } else if (lowerDescription.includes('chuva leve')) {
        document.body.classList.add('light-rain', 'rainy');
    } else if (lowerDescription.includes('chuva moderada')) {
        document.body.classList.add('moderate-rain', 'rainy');
    } else if (lowerDescription.includes('chuva forte')) {
        document.body.classList.add('heavy-rain', 'rainy');
    } else if (lowerDescription.includes('chuvas torrenciais')) {
        document.body.classList.add('torrential-rain', 'rainy');
    } else if (lowerDescription.includes('neve leve')) {
        document.body.classList.add('light-snow');
    } else if (lowerDescription.includes('neve moderada')) {
        document.body.classList.add('moderate-snow');
    } else if (lowerDescription.includes('neve forte')) {
        document.body.classList.add('heavy-snow');
    } else if (lowerDescription.includes('granizo')) {
        document.body.classList.add('hail');
    } else if (lowerDescription.includes('nevoeiro') || lowerDescription.includes('névoa')) {
        document.body.classList.add('fog');
    } else if (lowerDescription.includes('tempestade')) {
        document.body.classList.add('storm');
    } else if (lowerDescription.includes('vento forte')) {
        document.body.classList.add('strong-wind');
    } else {
        document.body.classList.add('sunny');
    }
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-days');
    forecastContainer.innerHTML = ''; // Limpa o conteúdo existente

    if (!data || !data.list) {
        forecastContainer.innerHTML = '<p>Não foi possível obter a previsão.</p>';
        return;
    }

    // Define o número máximo de dias a serem exibidos
    const daysToShow = 5;
    let dayCount = 0;

    // Exibe a previsão para os próximos dias
    data.list.forEach((item, index) => {
        if (index % 8 === 0 && dayCount < daysToShow) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('forecast-day');

            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'long' });
            const description = item.weather[0].description;
            const temp = item.main.temp.toFixed(1);

            dayDiv.innerHTML = `
                <h3>${day}</h3>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${description}">
                <p>${description}</p>
                <p>Temperatura: ${temp}°C</p>
            `;

            forecastContainer.appendChild(dayDiv);
            dayCount++;
        }
    });
}

// Função para adicionar ou remover uma cidade dos favoritos
function toggleFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.includes(city)) {
        // Se a cidade já estiver favoritada, removê-la
        favorites = favorites.filter(favoriteCity => favoriteCity !== city);
        document.querySelector('#favorite-btn').classList.remove('favorited'); // Remove a classe favoritada
    } else {
        // Se a cidade não estiver favoritada, adicioná-la
        favorites.push(city);
        document.querySelector('#favorite-btn').classList.add('favorited'); // Adiciona a classe favoritada
    }

    // Atualiza o localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Evento para o clique no botão de favorito
document.querySelector('#favorite-btn').addEventListener('click', () => {
    const city = document.querySelector('#title').textContent.split(',')[0]; // Extrai o nome da cidade
    toggleFavorite(city);
});




function displayFavoriteCities() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteContainer = document.createElement('div');  // Cria o container de favoritos

    favoriteContainer.classList.add('favorite-cities'); // Adiciona a classe para estilização

    // Verifica se há cidades favoritas
    if (favorites.length === 0) {
        favoriteContainer.innerHTML = '<p>Você ainda não tem cidades favoritas.</p>';
    } else {
        favoriteContainer.innerHTML = '<h2>Cidades Favoritas</h2>';
        const ul = document.createElement('ul');

        favorites.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.addEventListener('click', () => {
                // Chama a função para buscar a previsão ao clicar na cidade favorita
                document.querySelector('#city_name').value = city;
                document.querySelector('#search').dispatchEvent(new Event('submit'));
            });
            ul.appendChild(li);
        });

        favoriteContainer.appendChild(ul);
    }

    // Adiciona o container de favoritos após o div.container
    const container = document.querySelector('#container');
    if (container) {
        container.parentNode.insertBefore(favoriteContainer, container.nextSibling);
    } else {
        console.error('Container not found on this page');
    }
}

document.querySelector('#favorite-btn').addEventListener('click', () => {
    const city = document.querySelector('#title').textContent.split(',')[0]; // Extrai o nome da cidade
    toggleFavorite(city);
});

// Chama a função somente se estiver na página favoritos.html
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('favoritos.html')) {
        displayFavoriteCities();  // Exibe as cidades favoritas apenas na página correta
    }
});

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = ''; // Limpa o conteúdo existente

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>Você ainda não tem cidades favoritas.</p>';
    } else {
        const ul = document.createElement('ul');
        favorites.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;

            li.addEventListener('click', () => {
                // Exibe os dados da cidade favorita ao clicar
                document.querySelector('#city_name').value = city;
                document.querySelector('#search').dispatchEvent(new Event('submit'));
            });

            ul.appendChild(li);
        });

        favoritesList.appendChild(ul);
    }
}


function showAlert(message) {
    const alertBox = document.querySelector('#alert');
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}
