import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import * as Location from 'expo-location';

export default function App() {


  // Create state for displaying error message
  const [errorMessage, setErrorMessage] = useState(null)



  useEffect(() => {
    load()
  }, [])

  // Async function that will wait for the user permission for using location
  async function load(){
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()

      if(status !== 'granted'){
        setErrorMessage('Access to location is needed to run the app!')
        return
      }


      // Variable for storing the location data once the user allows it.
      const location = await Location.getCurrentPositionAsync()

      const { latitude, longitude } = location.coords
      alert(`Latitude: ${latitude}, Longitude: ${longitude}`)


    } catch (error) {
      
    }
  }

  return (
    <View style={styles.container}>
      <Text>Hello world!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
