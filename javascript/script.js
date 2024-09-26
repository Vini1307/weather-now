document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value;

    if (!cityName) {
        return showAlert('Você precisa digitar uma cidade...');
    }

    const apiKey = 'bab2af24a8f449072a72db058f807444';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

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
        showAlert('Não foi possível localizar...');
    }
});

function showInfo(json) {
    showAlert('');

    document.querySelector('#weather').classList.add('show');
    document.querySelector('#forecast').classList.add('show'); // Adiciona a classe show ao forecast

    // Adiciona a classe hidden à text-container
    document.querySelector('.text-container').classList.add('hidden');

    // Atualiza as informações do clima atual
    document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`;

    const temp = json.temp.toFixed(1).toString().replace('.', ',');
    document.querySelector('#temp_value').innerHTML = `${temp}<sup>C°</sup>`;

    document.querySelector('#temp_description').innerHTML = `${json.description}`;

    document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);

    document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')}<sup>C°</sup>`;
    document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')}<sup>C°</sup>`;

    document.querySelector('#humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('#wind').innerHTML = `${json.windSpeed}km/h`;

    // Remove todas as classes de fundo
    document.body.classList.remove('clear-sky', 'partly-cloudy', 'cloudy', 'light-rain', 'moderate-rain', 'heavy-rain', 'torrential-rain', 'light-snow', 'moderate-snow', 'heavy-snow', 'hail', 'fog', 'storm', 'strong-wind', 'rainy', 'sunny');

    // Adiciona a classe de fundo com base na descrição
    const description = json.description.toLowerCase();
    if (description.includes('céu limpo')) {
        document.body.classList.add('clear-sky');
    } else if (description.includes('parcialmente nublado')) {
        document.body.classList.add('partly-cloudy');
    } else if (description.includes('nuvens dispersas')) {
        document.body.classList.add('partly-cloudy');
    } else if (description.includes('neblina')) {
        document.body.classList.add('cloudy');
    } else if (description.includes('nublado')) {
        document.body.classList.add('cloudy');
    } else if (description.includes('chuva leve')) {
        document.body.classList.add('light-rain');
        document.body.classList.add('rainy'); // Adiciona a classe rainy
    } else if (description.includes('chuva moderada')) {
        document.body.classList.add('moderate-rain');
        document.body.classList.add('rainy'); // Adiciona a classe rainy
    } else if (description.includes('chuva forte')) {
        document.body.classList.add('heavy-rain');
        document.body.classList.add('rainy'); // Adiciona a classe rainy
    } else if (description.includes('chuvas torrenciais')) {
        document.body.classList.add('torrential-rain');
        document.body.classList.add('rainy'); // Adiciona a classe rainy
    } else if (description.includes('neve leve')) {
        document.body.classList.add('light-snow');
    } else if (description.includes('neve moderada')) {
        document.body.classList.add('moderate-snow');
    } else if (description.includes('neve forte')) {
        document.body.classList.add('heavy-snow');
    } else if (description.includes('granizo')) {
        document.body.classList.add('hail');
    } else if (description.includes('nevoeiro')) {
        document.body.classList.add('fog');
    }   else if (description.includes('névoa')) {
        document.body.classList.add('fog');
    }   else if (description.includes('tempestade')) {
        document.body.classList.add('storm');
    } else if (description.includes('vento forte')) {
        document.body.classList.add('strong-wind');
    } else {
        document.body.classList.add('sunny');
    }

    // switch (description) {
    //     case "ceu limpo":
    //         document.body.classList.add('strong-wind');
    //         break;

    //     case "neve":
    //         document.body.classList.add('strong-wind');
    //         break;

    //     default:
    //         document.body.classList.add('strong-wind');
    //         break;
    // }
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
        if (index % 8 === 0 && dayCount < daysToShow) { // Mostra a previsão para cada dia (8 previsões por dia na API)
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

function showAlert(message) {
    const alertBox = document.querySelector('#alert');
    alertBox.textContent = message;
    alertBox.style.display = 'block';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}

