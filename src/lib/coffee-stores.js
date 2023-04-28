import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});


function getUrlForCoffeeStores(latLng, query, limit) {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLng}&limit=${limit}`
}

async function getListOfCoffeeStorePhotos() {
    const photos = await unsplash.search.getPhotos({
        query: "coffee shop",
        page: 1,
        perPage: 30
    });
    return photos.response.results.map(result => result.urls.small);
}

export async function getCoffeeStores(latLng = "42.3314%2C-83.0458", limit = 6) {
    try {
        const photos = await getListOfCoffeeStorePhotos();

        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
            }
        };
          
        const response = await fetch(getUrlForCoffeeStores(latLng, 'coffee', limit), options);
        const data = await response.json();
        return data.results.map((result, i) => {
            return {
                id: result.fsq_id,
                name: result.name,
                address: result.location.address,
                dma: result.location.dma,
                imgUrl: photos.length ? photos[i] : null
            }
        });       
    } catch (error) {
        console.error(error);
    }
}