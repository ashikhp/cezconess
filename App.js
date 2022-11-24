import React, { useState, useEffect } from 'react';
import { Platform, View, Text, } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/theme';
// import { NativeBaseProvider } from 'native-base';
import NetInfo from "@react-native-community/netinfo";
import App from './src/App'
import Store from './src/store'
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';

export default Main = () => {
  LogBox.ignoreAllLogs();
  return (
    <Store>
      {/* <NativeBaseProvider> */}
        <StatusBar backgroundColor={"green"} />
        <PaperProvider theme={theme}>
          <App></App>
        </PaperProvider>
      {/* </NativeBaseProvider> */}
    </Store>
  )
}
