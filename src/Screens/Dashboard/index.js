import { View, Text, Alert, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import DashboardOffline from './DashboardOffline'
import DashboardOnline from './DashboardOnline'
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDashboard, attendance_add } from "../../apis";
import { manipulateAsync } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as Location from "expo-location"
import * as Speech from 'expo-speech';

export default function index(props) {

  const [isConnected, setIsConnected] = useState(false)
  const [isAppLoaded, setIsAppLoaded] = useState(false)
  const [totalOfflineData, setTotalOfflineData] = useState(0)
  const [pendingOfflineData, setPendingOfflineData] = useState(0)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (isConnected) {
      sync_fn()
    }
  }, [isConnected])

  const sync_fn = () => {
    AsyncStorage.getItem("offlineData_API", (err, result) => {
      const offlineData_API = JSON.parse(result);

      setPendingOfflineData(offlineData_API?.length)
      if (offlineData_API?.length) {
        setSyncing(true)
        attendance_add_fn(offlineData_API && offlineData_API[0])
      } else {
        const data = [
          {
            "login": "",
            "login_image": "",
            "login_latitude": "",
            "login_location": "",
            "login_longitude": "",
            "logout": "",
            "logout_image": "",
            "logout_latitude": "",
            "logout_location": "",
            "logout_longitude": "",
          }
        ]
        AsyncStorage.setItem('offlineData', JSON.stringify(data))
        setSyncing(false)
      }
    })
  }

  const getImageToBase64s = async (uri) => {
    let image;
    try {
      image = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });
    } catch (err) {
      console.log(err);
    }
    return image;
  }

  const attendance_add_fn = async (offlineData_API) => {
    const latitude = await offlineData_API.attendance_latitude
    const longitude = await offlineData_API.attendance_longitude
    const manipResult = await manipulateAsync(
      offlineData_API && offlineData_API.attendance_img,
      [
        { resize: { width: 600, height: 600 } },
        { rotate: 0 }],
      { compress: 1 }
    );
    const response = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });
    getImageToBase64s(manipResult && manipResult.uri).then((base64file) => {
      attendance_add({
        "attendance_date": offlineData_API && offlineData_API.attendance_date,
        "attendance_img": `data:image/png;base64, ${base64file}`,
        "attendance_latitude": offlineData_API && offlineData_API.attendance_latitude,
        "attendance_location": Platform.OS === "ios" ? `${response[0].street},${response[0].city},${response[0].country}` : `${response[0].city},${response[0].subregion},${response[0].country}`,
        "attendance_longitude": offlineData_API && offlineData_API.attendance_longitude,
      }).then((data) => {
        removeAddedData()
        AsyncStorage.getItem("offlineData_API", (err, result) => {
          const offlineData_API = JSON.parse(result);
        if(offlineData_API.length === 1){
          Speech.speak("offline attendance updated successfully")
        }
        })
      })
    })
  }

  const removeAddedData = async () => {
    try {
      AsyncStorage.getItem("offlineData_API", (err, result) => {
        const offlineData_API = JSON.parse(result);
        if (offlineData_API) {
          try {
            AsyncStorage.setItem('offlineData_API', JSON.stringify(offlineData_API && offlineData_API.splice(1)));
          } catch (error) {
            console.log("err");
          } finally {
            sync_fn()
          }
        }
      })
    } catch (error) {
      console.log("error");
    }
  }


  useEffect(async () => {
    AsyncStorage.getItem("offlineData", (err, result) => {
      const offlineData = JSON.parse(result);
      if (!result) {
        setDummy()
      } else {
        setIsAppLoaded(true)
      }
    });

  }, [])

  const setDummy = async () => {
    const data = [
      {
        "login": "",
        "login_image": "",
        "login_latitude": "",
        "login_location": "",
        "login_longitude": "",
        "logout": "",
        "logout_image": "",
        "logout_latitude": "",
        "logout_location": "",
        "logout_longitude": "",
      }
    ]
    const data1 = []
    await AsyncStorage.setItem('offlineData', JSON.stringify(data))
    await AsyncStorage.setItem('offlineData_API', JSON.stringify(data1))
    setIsAppLoaded(true)
  }

  useEffect(() => {
    NetInfo.addEventListener(handleConnectivityChange);
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected)
    });

    return () => {
      NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected)
      });
    }
  }, [NetInfo])

  const handleConnectivityChange = (state) => {
    if (state.isConnected) {
      setIsConnected(true)
    } else {
      setIsConnected(false)
    }
  }

  if (!isAppLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  if (isConnected && !syncing) {
    return (
      <DashboardOnline navigation={props.navigation} />
    )
  }

  if (syncing) {
    return (
      <View style={{ backgroundColor: "white", flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: "center" }}>
        <View style={{ flexDirection: 'column' }}>
          <Image
            style={{ width: 100, height: 80, top: 1, left: 5, borderRadius: 10, alignSelf: 'center' }}
            resizeMode={"cover"}
            source={require("../../../assets/11.gif")}
          />
          <Text style={{ color: "black", alignSelf: "center" }}>{`(${pendingOfflineData})`} Updating...</Text>
        </View>
      </View>
    )
  }
  return (
    <DashboardOffline navigation={props.navigation} />
  )
}
