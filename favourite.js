class Favourites {
    constructor() {
        this.favourites = this.loadFavourites();
    }

    loadFavourites() {
        const storedFavourites = localStorage.getItem('weatherFavourites');
        return storedFavourites ? JSON.parse(storedFavourites):[];
    }

    saveFavourites() {
        localStorage.setItem('weatherFavourites',JSON.stringify(this.favourites));
    }

    addFavourites(city) {
        if(!this.favourites.includes(city)) {
            this.favourites.push(city);
            this.saveFavourites();
            return true;
        }
        return false;
    }
    removeFavourites(city) {
        const index = this.favourites.indexOf(city);
        if (index!== -1) {
            this.favourites.splice(index,1);
            this.saveFavourites();
            return true;
        }
        return false;
    }

    isFavourites(city) {
        return this.favourites.includes(city);
    }
}

class RecentSearches {
    constructor(maxItems = 5) {
        this.maxItems = maxItems;
        this.searches = this.loadSearches();
    }

    loadSearches() {
        const storedSearches = localStorage.getItem('recentSearches');
        return storedSearches ? JSON.parse(storedSearches): [];
    }

    saveSearches() {
        localStorage.setItem('recentSearches',JSON.stringify(this.searches));
    }

    addSearch(city) {
        // remove if it already exists
        const index = this.searches.indexOf(city);
        if (index!==-1) {
            this.searches.splice(index,1);
        }

        // add to beggining
        this.searches.unshift(city);

        // keep only maximum number of items 
        if (this.searches.length > this.maxItems) {
            this.searches = this.searches.slice(0,this.maxItems);
        }
        this.saveSearches();
    }
}