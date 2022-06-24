import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import * as Location from 'expo-location';
import WeatherInfo from './components/WeatherInfo';
import UnitsPicker from './components/UnitsPicker';
import {colors} from './utils/index'

const WEATHER_API_KEY = '539e2df1d36b431acd2dff6a5ce764e1'
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
        setErrorMessage('Access to location is needed to run the app!')
        return
      }

      // Variable for storing the location data once the user allows it.
      const location = await Location.getCurrentPositionAsync()

      const { latitude, longitude } = location.coords
      
      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${WEATHER_API_KEY}`

      const response = await fetch(weatherUrl)

      const result = await response.json()

      if(response.ok){
        setCurrentWeater(result)
      } else{
        setErrorMessage(result.errorMessage)
      }

    } catch (error) {
      setErrorMessage(error.errorMessage)
    }
  }

  if(currentWeather) {
      return (
        <View style={styles.container}>
          <StatusBar style="auto" />
          <View style={styles.main}>

            <UnitsPicker unitSystem={unitSystem} setUnitSystem={setUnitSystem}/>
            <WeatherInfo currentWeather={currentWeather}/>

          </View>
        </View>
      );
  } else if (errorMessage){
      return (
        <View style={styles.container}>
          <Text>{errorMessage}</Text>
          <StatusBar style="auto" />
        </View>
      )
  } else {
      return(
        <View style={styles.container}>
            <ActivityIndicator size={"large"} color={colors.PRIMARY_COLOR}/>
            <StatusBar style="auto" />
        </View>
      )
  }
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
