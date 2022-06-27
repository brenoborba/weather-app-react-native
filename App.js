import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import * as Location from 'expo-location';
import WeatherInfo from './components/WeatherInfo';
import UnitsPicker from './components/UnitsPicker';
import {colors} from './utils/index'
import ReloadIcon from './components/ReloadIcon';
import WeatherDetails from './components/WeatherDetails';
import { WEATHER_API_KEY } from '@env'

const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'

export default function App() {


  // Create state for displaying error message
  const [errorMessage, setErrorMessage] = useState(null)
  const [currentWeather, setCurrentWeater] = useState(null)
  const [unitSystem, setUnitSystem] = useState('metric')


  useEffect(() => {
    load()
  }, [unitSystem])

  // Async function that will wait for the user permission for using location
  async function load(){
    setCurrentWeater(null)
    setErrorMessage(null)

    try {
      let { status } = await Location.requestForegroundPermissionsAsync()

      if(status !== 'granted'){
        return setErrorMessage('Access to location is needed to run the app!')
      }

      // ---------------------------------------------------------
      // Isso aqui deveria ser uma função dentro de um service.js
      const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync()
      
      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${WEATHER_API_KEY}`

      const response = await fetch(weatherUrl)

      const result = await response.json()

      // Dai tu chamaria algo do tipo:

      // const location = await Location.getCurrentPositionAsync()
      // const result = getWeatherFromLocation(location)

      // ---------------------------------------------------------

      if(response.ok){
       return setCurrentWeater(result)
      } 
            
      return setErrorMessage(result.errorMessage) // ? é necessario essa validação dupla?

    } catch (error) {
      setErrorMessage(error.errorMessage)
    }
  }

  //Main function
  if(currentWeather) {
      return (
        <View style={styles.container}>
          <StatusBar style="auto" />
          <View style={styles.main}>
            <UnitsPicker unitSystem={unitSystem} setUnitSystem={setUnitSystem} />
            <ReloadIcon load={load}/>
            <WeatherInfo currentWeather={currentWeather}/>

          </View>
          <WeatherDetails currentWeather={currentWeather} unitSystem={unitSystem}/>
        </View>
      );
  } 
  
  if (errorMessage){
      return (
        <View style={styles.container}>
          <ReloadIcon load={load}/>
          <Text>{errorMessage}</Text>
          <StatusBar style="auto" />
        </View>
      )
  } 
  
  return(
    <View style={styles.container}>
        <ActivityIndicator size={"large"} color={colors.PRIMARY_COLOR}/>
        <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  main: {
    justifyContent: 'center',
    flex: 1
  }
});
