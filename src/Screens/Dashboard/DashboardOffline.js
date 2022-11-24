import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, Alert, Dimensions, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Card, Divider, Avatar, ActivityIndicator } from 'react-native-paper'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import Lightbox from "react-native-lightbox";
import MapView, { Marker } from 'react-native-maps';
import * as Location from "expo-location"
import moment from "moment";
// import { useToast } from 'native-base';
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel, { Pagination } from '../../components/react-native-snap-carousel/src/index';

const { height, width } = Dimensions.get('window');
const SLIDER_WIDTH = Dimensions.get('window').width + 80
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const DashboardOffline = (props) => {
  const [index, setIndex] = React.useState(0)
  const isCarousel = React.useRef(null)
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState()
  const [data, setdata] = useState("")
  const [attendance, setAttendance] = useState("")
  const [imageFileurl, setImageFileurl] = useState("")
  const [attendanceOfflineData, setAttendanceOfflineData] = useState("")
  const [isLoding, setisLoding] = useState(false)
  const [isLodingLocation, setisLodingLocation] = useState(true)
  const [currentTime, setCurrentTime] = useState('');
  const [UserImage, setUserImage] = useState()
  const [baseUrl, setbaseUrl] = useState()
  const [UserEmployee, setUserEmployee] = useState()
  const [position, setPosition] = useState(null)
  // const toast = useToast();

  let foregroundSubscription = null


  useEffect(() => {

    AsyncStorage.getItem("offlineData", (err, result) => {
      const offlineData = JSON.parse(result);
      setAttendanceOfflineData(offlineData)
    });

  }, [])

  useEffect(() => {
    if (Platform.OS === "ios") {
      setInterval(() => {
        startForegroundUpdate()
      }, 10000);
    }
  }, [])

  const handleRefresh = () => {
    AsyncStorage.getItem("offlineData", (err, result) => {
      const offlineData = JSON.parse(result);
      setAttendanceOfflineData(offlineData)
    });
  }
  const requestPermissions = async () => {
    const foreground = await Location.requestForegroundPermissionsAsync()
    if (foreground.granted) startForegroundUpdate()
    else location_force_access1()
  }
  const location_force_access1 = () => {
    Alert.alert(
      "Ooops",
      "Sorry, Location permission not granted",
      [

        { text: "Grant now", onPress: () => requestPermissions() }
      ]
    );
  }

  const startForegroundUpdate = async () => {
    const { granted } = await Location.getForegroundPermissionsAsync()
    if (!granted) {
      console.log("location tracking denied")
      return
    }
    foregroundSubscription?.remove()

    foregroundSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
      },
      location => {
        setPosition(location.coords)
        getPlaceName(location.coords)
        setisLodingLocation(false)
      }
    )
  }

  const getPlaceName = async (coords) => {
    // alert("hi")
    const { latitude, longitude } = coords
    let response = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });
    // Alert.alert("--",JSON.stringify( `${response[0].street},${response[0].city},${response[0].country}`))
    for (let item of response) {
      let IOSaddress = `${item.street},${item.city},${item.country}`; //ios
      let AndroidAddress = `${item.city},${item.region},${item.country}`;
      setDisplayCurrentAddress(Platform.OS === "ios" ? IOSaddress : AndroidAddress);
    }
  }

  useEffect(() => {
    AsyncStorage.getItem("sessionData", (err, result) => {
      const ses_data = JSON.parse(result);
      setUserImage(ses_data.userImage)
      setbaseUrl(ses_data.uploads_folder_name)
      setUserEmployee(ses_data.userEmployee)
      //   handleRefresh()
    });
    const timer = setInterval(() => {
      var date = moment().utcOffset('+05:30').format(' hh:mm:ss a');
      setCurrentTime(date);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [])

  const takeImages = async () => {
    if (Constants.platform.ios) {
      const { status: cameraStatus } = await Permissions.askAsync(
        Permissions.CAMERA,
      );
      if (cameraStatus !== 'granted') {
        alert('Sorry, Camera permissions not granted');
      } else {
        null
      }
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [6, 6],
      base64: true
    });

    // console.log("--------------",result.base64);
    if (!result.canceled) return  result.assets[0].uri
  };


  useEffect( () => {
    const permission =  requestPermissions()
    startForegroundUpdate()
  }, [])


  const Register_fn = async () => {
    const image = await takeImages()
    if (image) {
      AsyncStorage.getItem("offlineData", (err, result) => {
        const offlineData = JSON.parse(result);
        if ((offlineData && offlineData.length === 1) && (offlineData && offlineData[0].login === "")) {
          try {
            AsyncStorage.setItem("offlineData", null)
          } catch (error) {
            console.log("error" + error, message);
          } finally {
            try {
              const data = [{
                "offline": true,
                "login": currentTime,
                "login_image": image,
                "login_latitude": position.latitude,
                "login_location": displayCurrentAddress,
                "login_longitude": position.longitude,
                "login_timediff": moment(new Date()).format('MMM D, YYYY HH:mm:ss '),
                "logout": "",
                "logout_image": "",
                "logout_latitude": "",
                "logout_location": "",
                "logout_longitude": "",
                "logout_timediff": "",
                "total_hour": "",
                "total_min": ""
              }]
              const addDatas = [{
                "attendance_date": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                "attendance_latitude": position.latitude,
                "attendance_longitude": position.longitude,
                "attendance_location": displayCurrentAddress,
                "attendance_img": image,
              }]

              AsyncStorage.setItem('offlineData', JSON.stringify(data));
              AsyncStorage.setItem('offlineData_API', JSON.stringify(addDatas))
            } catch (error) {
              console.error('AsyncStorage error: ' + error.message);
            } finally {
              handleRefresh()
            }
          }
        } else if ((offlineData && offlineData.length === 1) && (offlineData && offlineData[0].logout === "")) {
          try {
            AsyncStorage.setItem("offlineData", null)
          } catch (error) {
            console.log("error" + error, message);
          } finally {
            try {

              const data = [{
                "offline": true,
                "login": offlineData[0].login,
                "login_image": offlineData[0].login_image,
                "login_latitude": offlineData[0].login_latitude,
                "login_location": offlineData[0].login_location,
                "login_longitude": offlineData[0].login_longitude,
                "login_timediff": offlineData[0].login_timediff,
                "logout": currentTime,
                "logout_image": image,
                "logout_latitude": position.latitude,
                "logout_location": displayCurrentAddress,
                "logout_longitude": position.longitude,
                "logout_timediff": moment(new Date()).format('MMM D, YYYY HH:mm:ss '),
                "total_hour": "",
                "total_min": ""
              }]


              AsyncStorage.setItem('offlineData', JSON.stringify(data));
              register_fn_first_logout(image)

            } catch (error) {
              console.error('AsyncStorage error: ' + error.message);
            } finally {
              handleRefresh()
            }

          }
        } else if ((offlineData && offlineData.length > 1) && (offlineData && offlineData[0].logout === "")) {
          register_fn_logout(offlineData, image)
        } else {
          register_fn_new_login(offlineData, image)
        }
      })
    }
  }

  const register_fn_new_login = async (offlineData, image) => {
    try {

      const offlineData_API = await AsyncStorage.getItem("offlineData_API")
      const parsed = await JSON.parse(offlineData_API);
      AsyncStorage.setItem('offlineData_API', JSON.stringify([...parsed, {
        "attendance_date": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        "attendance_latitude": position && position.latitude,
        "attendance_longitude": position && position.longitude,
        "attendance_location": displayCurrentAddress,
        "attendance_img": image,
      }]))

      AsyncStorage.setItem('offlineData', JSON.stringify([{
        "offline": true,
        "login": currentTime,
        "login_image": image,
        "login_latitude": position && position.latitude,
        "login_location": displayCurrentAddress,
        "login_longitude": position && position.longitude,
        "login_timediff": moment(new Date()).format('MMM D, YYYY HH:mm:ss '),
        "logout": "",
        "logout_image": "",
        "logout_latitude": "",
        "logout_location": "",
        "logout_longitude": "",
        "logout_timediff": "",
        "total_hour": "",
        "total_min": ""
      }, ...offlineData]))



    } catch (error) {
      console.log("error", error);
    } finally {
      handleRefresh()
    }
  }

  const register_fn_first_logout = async (image) => {

    const offlineData_API = await AsyncStorage.getItem("offlineData_API")
    const parsed = await JSON.parse(offlineData_API);

    AsyncStorage.setItem('offlineData_API', JSON.stringify([...parsed, {
      "attendance_date": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      "attendance_latitude": position.latitude,
      "attendance_longitude": position.longitude,
      "attendance_location": displayCurrentAddress,
      "attendance_img": image,
    }]))
  }

  const register_fn_logout = async (offlineData, image) => {
    const removeLastData = await offlineData && offlineData.splice(1)
    try {
      const offlineData_API = await AsyncStorage.getItem("offlineData_API")
      const parsed = await JSON.parse(offlineData_API);
      AsyncStorage.setItem('offlineData_API', JSON.stringify([...parsed, {
        "attendance_date": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        "attendance_latitude": position && position.latitude,
        "attendance_longitude": position && position.longitude,
        "attendance_location": displayCurrentAddress,
        "attendance_img": image,
      }]))
      AsyncStorage.setItem('offlineData', JSON.stringify([{
        "offline": true,
        "login": attendanceOfflineData && attendanceOfflineData[0].login,
        "login_image": attendanceOfflineData && attendanceOfflineData[0].login_image,
        "login_latitude": attendanceOfflineData && attendanceOfflineData[0].login_latitude,
        "login_location": attendanceOfflineData && attendanceOfflineData[0].login_location,
        "login_longitude": attendanceOfflineData && attendanceOfflineData[0].login_longitude,
        "login_timediff": attendanceOfflineData && attendanceOfflineData[0].login_timediff,
        "logout": currentTime,
        "logout_image": image,
        "logout_latitude": position && position.latitude,
        "logout_location": displayCurrentAddress,
        "logout_longitude": position && position.longitude,
        "logout_timediff": moment(new Date()).format('MMM D, YYYY HH:mm:ss '),
        "total_hour": "",
        "total_min": ""
      }, ...removeLastData]))



    } catch (error) {
      console.log("error", error);
    } finally {
      handleRefresh()
    }
  }

  const hours = () => {
    let total = 0;
    let totalRows = attendanceOfflineData && attendanceOfflineData.length;

    for (let i = 0; i < totalRows; i++) {
      // console.log("____________________________",attendanceOfflineData && attendanceOfflineData[0].logout_timediff);
      if (attendanceOfflineData && attendanceOfflineData[i].logout_timediff != "") {
        //  const date1 = new Date( "Jan 1, 2022 6:00:00" );
        //  const date2 = new Date( "Jan 1, 2022 18:15:00" );
        const date1 = new Date(attendanceOfflineData && attendanceOfflineData[i].login_timediff);
        const date2 = new Date(attendanceOfflineData && attendanceOfflineData[i].logout_timediff);
        // var res = Math.abs(date1 - date2) / 1000;
        // var hours = Math.floor(res / 3600) % 24;
        // var minutes = Math.floor(res / 60) % 60;
        var hours = Math.abs(date1 - date2) / 36e5;
        // count+1
        total += hours
      }
    }

    return total.toFixed(2)
  }
  return (
    <React.Fragment>
      <View style={styles.parent}>
        <View style={styles.child}>
        </View>
      </View>
      <View style={{
        height: "77%", width: width - 40, padding: 10, backgroundColor: "#fff", alignSelf: "center", borderRadius: 20, bottom: "22%",
      }}>
        <View style={{
          width: 110, height: 110, backgroundColor: "#fff", borderRadius: 150 / 2, alignSelf: "center", bottom: "10%",
          shadowColor: "#171717", shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: -2, height: 4 }, shadowColor: '#171717',
          elevation: 4
        }}>
          <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", flex: 1 }}>
            <Text style={{ fontSize: 12, opacity: 0.4 }}>TOTAL</Text>
            <Text style={{ fontSize: 35, opacity: 0.4 }}>{hours() === "NaN" ? "0.00" : hours()}</Text>
            <Text style={{ fontSize: 13, opacity: 0.4 }}>HOURS</Text>
            <Image
              style={{ height: 25, width: 25 }}
              source={require("../../../assets/NONET.png")}
            />
          </View>
        </View>
        <SafeAreaView style={styles.container1}>
          <Carousel
            layout="stack"
            layoutCardOffset={0}
            ref={isCarousel}
            data={attendanceOfflineData}
            renderItem={({ item, index }) =>
              <View style={{ marginTop: Platform.OS === "ios" ? 20 : parseInt(width) === 392 ? 30 : 0 }}>
                <Card style={{
                  width: width - 90, padding: Platform.OS === "ios" ? 10 : 8,
                  shadowColor: "#171717", shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: -1, height: 4 }, backgroundColor: "#FFF", shadowColor: '#171717',
                  elevation: 2, borderRadius: 10, margin: 6,
                  height: parseInt(width) === 392 ? 200 : null
                }}>
                  <View style={{ flexDirection: "row", top: "2%" }}>
                    <AntDesign
                      style={{ left: "23%", marginTop: -2 }}
                      name={"caretdown"}
                      color={"green"} size={26}
                    />

                    <Text style={{ opacity: 0.4, fontSize: 16, left: "80%" }}>CHECK IN</Text>
                  </View>

                  <View style={{ top: 7 }}>
                    <Divider />
                    <Divider />
                  </View>

                  <View style={{ flexDirection: "row", top: "2%" }}>
                    {item.login_image ?
                      <Lightbox underlayColor="white"
                        renderContent={() => {
                          return (
                            <Image
                              style={{ height: "100%", width: "100%", alignSelf: 'center' }}
                              resizeMode="contain"
                              source={{
                                uri: item.login_image.slice(0, 6) === "employ" ? `${baseUrl}attendance/${item.login_image}` : item.offline ? item.login_image : `${baseUrl}attendance/${item.login_image}`
                              }}
                            />
                          )
                        }}
                      >
                        <View style={{ alignSelf: "center", marginTop: 10, marginBottom: 2 }}>
                          <Image
                            style={{ width: 60, height: 50, top: 1, left: 5, borderRadius: 10 }}
                            resizeMode={"cover"}
                            source={{
                              uri: item.login_image.slice(0, 6) === "employ" ? `${baseUrl}attendance/${item.login_image}` : item.offline ? item.login_image : `${baseUrl}attendance/${item.login_image}`
                            }}
                          />
                        </View>
                      </Lightbox>
                      :
                      <View style={{ flexDirection: "row", top: "2%" }}>
                        <Image style={{ width: 60, height: 60, top: 1, left: 5 }} source={require('../../../assets/image-demo.png')} />
                        <Text style={{ fontSize: 18, fontWeight: "bold", alignSelf: "center", left: "25%" }}>--:--</Text>
                      </View>
                    }
                    <Text style={{ fontSize: 18, fontWeight: "bold", alignSelf: "center", left: "25%" }}>{item.login} </Text>
                  </View>

                  {item.login_location ?
                    <View style={{ flexDirection: "row" }}>

                      <Text numberOfLines={1} style={{ marginLeft: "26%", fontSize: 12, top: -9 }}><Image style={{ width: 15, height: 15, }} source={require('../../../assets/pin.png')} /><Text style={{ opacity: 0.5 }}>{item.login_location}</Text></Text>

                    </View>
                    :
                    <View style={{ height: 20 }}></View>
                  }

                  {/* {item.login_location ?
                    <View style={{ flexDirection: "row", top: "2%", padding: 5 }}>
                      <Image style={{ width: 15, height: 15, }} source={require('../../../assets/pin.png')} />
                      <Text numberOfLines={1} style={{ opacity: 0.4, width: "90%" }}>{item.login_location}</Text>
                    </View>
                    : <View style={{ flexDirection: "row", top: "2%", padding: 5 }}>
                      <Image style={{ width: 15, height: 15, }} source={require('../../../assets/pin.png')} />
                      <Text numberOfLines={1} style={{ opacity: 0.4, width: "90%" }}></Text>
                    </View>} */}


                  <View style={{ width: width / 1.4, height: height / 11, alignSelf: "center", top: 2, }}>
                    {item.login_latitude && item.login_longitude ? (
                      <MapView
                        zoomControlEnabled={false}
                        zoomEnabled={false}
                        scrollEnabled={false}
                        style={{ width: "100%", height: "100%" }}
                        region={{
                          latitude: parseFloat(item.login_latitude),
                          longitude: parseFloat(item.login_longitude),
                          latitudeDelta: 0.010,
                          longitudeDelta: 0.010,
                        }}
                      >
                        <Marker
                          coordinate={{
                            latitude: parseFloat(item.login_latitude),
                            longitude: parseFloat(item.login_longitude)
                          }}
                        ></Marker>
                      </MapView>) :
                      <View style={{ width: "100%", height: "100%", backgroundColor: "#f5f5f0", alignItems: "center", justifyContent: "center" }}>
                        <Image style={{ width: 20, height: 20, }} source={{}} />
                      </View>
                    }
                  </View>
                </Card>

                <Card style={{
                  width: width - 90, padding: Platform.OS === "ios" ? 10 : 8,
                  shadowColor: "#171717", shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: -1, height: 4 }, backgroundColor: "#FFF", shadowColor: '#171717',
                  elevation: 2, borderRadius: 10, margin: 6,
                  height: parseInt(width) === 392 ? 200 : null
                }}>
                  <View style={{ flexDirection: "row", top: "2%" }}>
                    <AntDesign
                      style={{ left: "23%", marginTop: "2%" }}
                      name={"caretup"}
                      color={"red"} size={26}
                    />

                    <Text style={{ opacity: 0.4, fontSize: 16, left: "80%", top: 4 }}>CHECK OUT</Text>
                  </View>

                  <View style={{ top: 7 }}>
                    <Divider />
                    <Divider />
                  </View>

                  <View style={{ flexDirection: "row", top: "2%" }}>
                    {item.logout_image ?
                      <Lightbox underlayColor="white"
                        renderContent={() => {
                          return (
                            <Image
                              style={{ height: "100%", width: "100%", alignSelf: 'center' }}
                              resizeMode="contain"
                              source={{
                                uri: item.offline ? item.logout_image : `${baseUrl}attendance/${item.logout_image}`
                              }}
                            />
                          )
                        }}
                      >
                        <View style={{ alignSelf: "center", marginTop: 10, marginBottom: 2 }}>
                          <Image
                            style={{ width: 60, height: 50, top: 1, left: 5, borderRadius: 10 }}
                            resizeMode={"cover"}
                            source={{
                              uri: item.offline ? item.logout_image : `${baseUrl}attendance/${item.logout_image}`
                            }}
                          />
                        </View>
                      </Lightbox>
                      :
                      <View style={{ flexDirection: "row", top: "2%" }}>
                        <Image style={{ width: 60, height: 60, top: 1, left: 5 }} source={require('../../../assets/image-demo.png')} />
                        <Text style={{ fontSize: 18, fontWeight: "bold", alignSelf: "center", left: "25%" }}>--:--</Text>
                      </View>
                    }
                    <Text style={{ fontSize: 18, fontWeight: "bold", alignSelf: "center", left: "25%" }}>{item.logout} </Text>
                  </View>

                  {item.logout_location ?
                    <View style={{ flexDirection: "row" }}>

                      <Text numberOfLines={1} style={{ marginLeft: "26%", fontSize: 12, top: -9 }}><Image style={{ width: 15, height: 15, }} source={require('../../../assets/pin.png')} /><Text style={{ opacity: 0.5 }}>{item.logout_location}</Text></Text>

                    </View>
                    :
                    <View style={{ height: 20 }}></View>
                  }
                  {/* {item.logout_location ?
                    <View style={{ flexDirection: "row", top: "2%", padding: 5 }}>
                      <Image style={{ width: 15, height: 15, }} source={require('../../../assets/pin.png')} />
                      <Text numberOfLines={1} style={{ opacity: 0.4, width: "90%" }}>{item.logout_location}</Text>
                    </View>
                    : <View style={{ flexDirection: "row", top: "2%", padding: 5 }}>
                      <Image style={{ width: 15, height: 15, }} source={require('../../../assets/pin.png')} />
                      <Text numberOfLines={1} style={{ opacity: 0.4, width: "90%" }}></Text>
                    </View>} */}


                  <View style={{ width: width / 1.4, height: height / 11, alignSelf: "center", top: 2, }}>
                    {item.logout_latitude && item.logout_longitude ? (
                      <MapView
                        zoomControlEnabled={false}
                        zoomEnabled={false}
                        scrollEnabled={false}
                        style={{ width: "100%", height: "100%" }}
                        region={{
                          latitude: parseFloat(item.logout_latitude),
                          longitude: parseFloat(item.logout_longitude),
                          latitudeDelta: 0.010,
                          longitudeDelta: 0.010,
                        }}
                      >
                        <Marker
                          coordinate={{
                            latitude: parseFloat(item.logout_latitude),
                            longitude: parseFloat(item.logout_longitude)
                          }}
                        ></Marker>
                      </MapView>) :
                      <View style={{ width: "100%", height: "100%", backgroundColor: "#f5f5f0", alignItems: "center", justifyContent: "center" }}>
                        <Image style={{ width: 20, height: 20, }} source={{}} />
                      </View>
                    }
                  </View>
                </Card>

              </View>

            }
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            onSnapToItem={(index) => setIndex(index)}
            useScrollView={true}
          />

        </SafeAreaView>
        <View style={{ bottom: Platform.OS === "ios" ? "3%" : parseInt(width) === 392 ? "3%" : "5%" }}>
          <Pagination
            dotsLength={attendanceOfflineData && attendanceOfflineData.length}
            activeDotIndex={index}
            carouselRef={isCarousel}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.92)'
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            tappableDots={true}
          />
        </View>


      </View >

      <TouchableOpacity
        onPress={() => {
          if (!isLoding && !isLodingLocation) Register_fn()
        }}
        style={{
          justifyContent: "center",
          width: 110, height: 110, backgroundColor: "#fff", borderRadius: 150 / 2, alignSelf: "center",
          shadowColor: "#171717", shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: -2, height: 4 }, backgroundColor: "#FFF", shadowColor: '#171717',
          elevation: 4, bottom: Platform.OS === "ios" ? "30%" : "28%"
        }}>
        <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", flex: 1 }}>
          {isLoding || isLodingLocation ?
            <View>
              <ActivityIndicator />
              {isLodingLocation ? <Text style={{ alignSelf: 'center', opacity: 0.4, fontSize: Platform.OS === "ios" ? 9 : 10, top: 10 }}>Fetching location...</Text> : null}
            </View>
            :
            <View>
              <Image style={{ alignSelf: 'center', width: 45, height: 45, tintColor: (attendanceOfflineData && (attendanceOfflineData[0].logout === "" && attendanceOfflineData[0].login === "")) ? "green" : attendanceOfflineData && attendanceOfflineData[0].logout === "" ? "red" : "green" }} source={require('../../../assets/tap.png')} />
              <Text style={{ alignSelf: 'center', color: (attendanceOfflineData && (attendanceOfflineData[0].logout === "" && attendanceOfflineData[0].login === "")) ? "green" : attendanceOfflineData && attendanceOfflineData[0].logout === "" ? "red" : "green", top: 5 }}>{(attendanceOfflineData && (attendanceOfflineData[0].logout === "" && attendanceOfflineData[0].login === "")) ? "Check In" : attendanceOfflineData && attendanceOfflineData[0].logout === "" ? "Check Out" : "Check In"}</Text>
              <Text style={{ alignSelf: 'center', opacity: 0.4, fontSize: Platform.OS === "ios" ? 9 : 10, top: 10 }}>{currentTime}</Text>
            </View>
          }

        </View>
      </TouchableOpacity>


    </React.Fragment >
  )
}

export default DashboardOffline

const styles = StyleSheet.create({
  parent: {
    height: '35%',
    width: '100%',
    transform: [{ scaleX: 2 }],
    borderBottomStartRadius: 300,
    borderBottomEndRadius: 300,
    overflow: 'hidden',
  },
  child: {
    flex: 1,
    transform: [{ scaleX: 0.5 }],

    backgroundColor: '#ff2929',
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    width: "80%",
    height: "80%",
    borderRadius: 44 / 2
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 25,
    color: 'white',
  },
  wrapper: {
    bottom: "10%"

  },
  container1: {
    marginTop: "-16%",
    marginLeft: "5%",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

