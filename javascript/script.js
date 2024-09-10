document.querySelector('#search').addEventListener('submit', async (event) =>{
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value;

    if (!cityName){
        return showAlert('Você precisa digitar uma cidade...')
    }
    const apiKey = 'bab2af24a8f449072a72db058f807444'
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`

    const results = await fetch(apiUrl)
    const json = await results.json()

    if(json.cod === 200){
        showInfo({
            city: json.name,
            country: json.sys.country,
            temp: json.main.temp,
            tempMax: json.main.temp_max,
            tempMin: json.main.temp_min,
            description: json.weather[0].description,
            tempIcon: json.weather[0].icon,
            windSpeed: json.wind.speed,
            humidity: json.main.humidity,
        })
    }else{
        showAlert(
            `Não foi possivel localizar...
            
            <img src="img/undraw_alert_re_j2op.svg/">
            
        `)
    }
})

function showInfo(json) {
    showAlert('');

    document.querySelector('#weather').classList.add('show');

    // Adiciona a classe hidden à text-container
    document.querySelector('.text-container').classList.add('hidden');

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
    } else if (description.includes('tempestade')) {
        document.body.classList.add('storm');
    } else if (description.includes('vento forte')) {
        document.body.classList.add('strong-wind');
    } else {
        document.body.classList.add('sunny');
    }
}


function showAlert(msg){
    document.querySelector('#alert').innerHTML = msg;
}

