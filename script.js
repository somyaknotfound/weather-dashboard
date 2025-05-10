document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '62f883fcf140f4ab21114d2c699684f9'; // Inactive demonstration key

    // Initializing classes
    const weatherAPI = new WeatherAPI(API_KEY);
    const favourites = new Favourites();
    const recentSearches = new RecentSearches(5);

    // DOM elements
    const cityInput = document.getElementById('cityinput');
    const searchBtn = document.getElementById('searchBtn');
    const weatherCard = document.querySelector('.weather-card');
    const favouritesContainer = document.getElementById('favourites-container');
    const recentContainer = document.getElementById('recent-container');
    const themeToggle = document.getElementById('themeToggle');

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
    });

    // Creating the loading spinner
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.style.display = 'none';
    weatherCard.appendChild(spinner);

    // Adding event listener to search button
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchAndDisplayWeather(city);
        }
    });

    // Adding event listener for enter key
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            if (city) {
                fetchAndDisplayWeather(city);
            }
        }
    });

    // Function to fetch and display weather
    async function fetchAndDisplayWeather(city) {
        spinner.style.display = 'block';
        weatherCard.querySelectorAll(':not(.spinner)').forEach(el => el.remove());
    
        try {
            // Fetching weather data
            const data = await weatherAPI.getWeather(city);

            // Add to recent searches 
            recentSearches.addSearch(city);

            // Create weather display 
            createWeatherDisplay(data);

            // Update recent searches display
            displayRecentSearches();

        } catch(error) {
            // Show error message 
            weatherCard.innerHTML = `<div class="error">City not found or error in fetching data</div>`;

        } finally {
            // Hide spinner
            spinner.style.display = 'none';
        }
    }

    // Function to create weather display
    function createWeatherDisplay(data) {
        // Clearing previous content
        weatherCard.querySelectorAll(':not(.spinner)').forEach(el => el.remove());

        // Create elements
        const cityName = document.createElement('h2');
        cityName.textContent = data.name + ', ' + data.sys.country;

        const temp = document.createElement('div');
        temp.className = 'temp';
        temp.textContent = `${Math.round(data.main.temp)}°C`;

        const weatherIcon = document.createElement('img');
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.alt = data.weather[0].description;

        const description = document.createElement('div');
        description.className = 'description';
        description.textContent = data.weather[0].description;

        const details = document.createElement('div');
        details.className = 'details';
        details.innerHTML = `<div>Humidity: ${data.main.humidity}%</div>
         <div>Wind: ${data.wind.speed} m/s</div>`;

        const favBtn = document.createElement('button');
        favBtn.className = 'fav-btn';
        
        // Set initial button state based on favorite status
        if (favourites.isFavourites(data.name)) {
            favBtn.textContent = 'Remove from Favourites';
            favBtn.classList.add('remove-fav');
        } else {
            favBtn.textContent = 'Add to Favourites';
            favBtn.classList.add('add-fav');
        }
        
        favBtn.addEventListener('click', () => {
            if (favourites.isFavourites(data.name)) {
                favourites.removeFavourites(data.name);
                favBtn.textContent = 'Add to Favourites';
                favBtn.classList.remove('remove-fav');
                favBtn.classList.add('add-fav');
            } else {
                favourites.addFavourites(data.name);
                favBtn.textContent = 'Remove from Favourites';
                favBtn.classList.remove('add-fav');
                favBtn.classList.add('remove-fav');
            }
            // Update favourites display
            displayFavourites();
        });
        
        // Append all elements
        weatherCard.appendChild(cityName);
        weatherCard.appendChild(weatherIcon);
        weatherCard.appendChild(temp);
        weatherCard.appendChild(description);
        weatherCard.appendChild(details);
        weatherCard.appendChild(favBtn);
    }
  
    // Function to display favourites
    function displayFavourites() {
        favouritesContainer.innerHTML = '';
        
        if (favourites.favourites.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = 'No favourite cities yet';
            favouritesContainer.appendChild(emptyMsg);
            return;
        }
        
        const favList = document.createElement('ul');
        favList.className = 'fav-list';
        
        favourites.favourites.forEach(city => {
            const favItem = document.createElement('li');
            
            const cityBtn = document.createElement('button');
            cityBtn.textContent = city;
            cityBtn.className = 'city-btn';
            cityBtn.addEventListener('click', () => {
                fetchAndDisplayWeather(city);
            });
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'x';
            removeBtn.className = 'remove-btn';
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                favourites.removeFavourites(city);
                displayFavourites();
            });
            
            favItem.appendChild(cityBtn);
            favItem.appendChild(removeBtn);
            favList.appendChild(favItem);
        });
        
        favouritesContainer.appendChild(favList);
    }
  
    // Function to display recent searches
    function displayRecentSearches() {
        recentContainer.innerHTML = '';
        
        if (recentSearches.searches.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = 'No recent searches';
            recentContainer.appendChild(emptyMsg);
            return;
        }
        
        const recentList = document.createElement('ul');
        recentList.className = 'recent-list';
        
        recentSearches.searches.forEach(city => {
            const recentItem = document.createElement('li');
            
            const cityBtn = document.createElement('button');
            cityBtn.textContent = city;
            cityBtn.className = 'city-btn';
            cityBtn.addEventListener('click', () => {
                fetchAndDisplayWeather(city);
            });
            
            recentItem.appendChild(cityBtn);
            recentList.appendChild(recentItem);
        });
        
        recentContainer.appendChild(recentList);
    }
  
    // Initial display of favourites and recent searches
    displayFavourites();
    displayRecentSearches();
});
