import { defineStore } from 'pinia'
import { ref } from 'vue'

interface WeatherData {
  temperature: number
  windspeed: number
}

export const useWeatherStore = defineStore('weather', () => {
  const weatherData = ref<Record<string, WeatherData>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchWeather(lat: number, lon: number, branchId: string) {
    loading.value = true
    error.value = null
    
    try {

      const mockData = {
        temperature: Math.round(15 + Math.random() * 10),
        windspeed: Math.round(5 + Math.random() * 20)
      }
      
      weatherData.value[branchId] = mockData
    } catch (err) {
      error.value = 'Error fetching weather'
    } finally {
      loading.value = false
    }
  }

  function getWeather(branchId: string) {
    return weatherData.value[branchId]
  }

  return {
    weatherData,
    loading,
    error,
    fetchWeather,
    getWeather
  }
})