import { defineStore } from 'pinia';
import { ref, watch, nextTick } from 'vue';


// const route = useRoute();

// const scoreboardScore = useScoreboardStore()

const useMapStore = defineStore('control', () => {

    const currentLocation = ref([45.5017, -73.5673])
    const currentZoom = ref(12)
    const map = ref()


    function setCurrentLocation(location){
        if (currentZoom.value <= 15) {
            map.value.leafletObject.flyTo(location, 18, {
                animate: true,
                duration: 2
            })

        } else {
            
            map.value.leafletObject.setView(location, 18)
        }
        
        // currentZoom.value = 15
        // currentLocation.value = location
    }

    return {
        currentLocation,
        setCurrentLocation,
        currentZoom,
        map
    }
})

export { useMapStore }