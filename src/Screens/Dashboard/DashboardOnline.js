import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, Alert, SafeAreaView, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, Divider, ActivityIndicator } from 'react-native-paper'
import AntDesign from "react-native-vector-icons/AntDesign";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import Lightbox from "react-native-lightbox";
import MapView, { Marker } from 'react-native-maps';
import * as Location from "expo-location"
import { getDashboard, attendance_add } from "../../apis";
import moment from "moment";
import * as Speech from 'expo-speech';
import { manipulateAsync } from 'expo-image-manipulator';
// import { useToast } from 'native-base';
import ActionButton from "../../components/ActionButton";
import Carousel, { Pagination } from "../../components/react-native-snap-carousel/src/index";



const { height, width } = Dimensions.get('window');
const SLIDER_WIDTH = Dimensions.get('window').width + 80
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

var Message = require("../../utils/message");

const Dashboard = (props) => {

    const [index, setIndex] = React.useState(0)
    const isCarousel = React.useRef(null)

    const [displayCurrentAddress, setDisplayCurrentAddress] = useState()
    const [data, setdata] = useState("")
    const [attendance, setAttendance] = useState("")
    const [isLoding, setisLoding] = useState(false)
    const [isLodingLocation, setisLodingLocation] = useState(true)
    const [currentTime, setCurrentTime] = useState('');
    const [UserImage, setUserImage] = useState()
    const [baseUrl, setbaseUrl] = useState()
    const [UserEmployee, setUserEmployee] = useState()
    const [position, setPosition] = useState(null)
    const [prefix, setprefix] = useState()

    // const toast = useToast();
    let foregroundSubscription = null

    const handleRefresh = () => {
        getDashboard().then((data) => {
            setdata(data)
            setAttendance(data && data.attendance)
            setisLoding(false)
            AsyncStorage.setItem('offlineData', JSON.stringify(data && data.attendance && data.attendance.log_details))
            try {
                AsyncStorage.getItem('offlineData_API')
            } catch {
                const data1 = []
                AsyncStorage.setItem('offlineData_API', JSON.stringify(data1))
            }
        })
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
        const { latitude, longitude } = coords
        let response = await Location.reverseGeocodeAsync({
            latitude,
            longitude
        });
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
            handleRefresh()
        });
        const timer = setInterval(() => {
            var date = moment().utcOffset('+05:30').format(' hh:mm:ss a');
            setCurrentTime(date);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [])

    const attendance_add_fn = async (imageUri) => {
        if (position) {
            setisLoding(true)
            const addDatas = {
                "attendance_date": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                "attendance_latitude": position.latitude,
                "attendance_longitude": position.longitude,
                "attendance_location": displayCurrentAddress,
                "attendance_img": imageUri,
            }
            attendance_add(addDatas).then((data) => {
                // toast.show({ description: data.msg })
                Message.message("Success!", data.msg, "success")
                Speech.speak(data.msg)
                handleRefresh()
            }
            )
        } else {
            // toast.show({ description: "Something went wrong. Please try again" })
            Speech.speak("Something went wrong. Please try again")
            Message.message("Success!", "Something went wrong", "danger")
            setisLoding(false)
        }
    }

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
            aspect: [6, 6],
        });
        if (!result.canceled) return result.assets[0].uri
    };

    const convertBase64s = async (item) => {
        const imageUri = await `data:image/png;base64, ${item}`
        attendance_add_fn(imageUri)
    }

    useEffect(() => {
        const permission = requestPermissions()
        startForegroundUpdate()
    }, [])

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

    const Register_fn = async () => {
        const image = await takeImages()
        const manipResult = await manipulateAsync(
            image,
            [
                { resize: { width: 600, height: 600 } },
                { rotate: 0 }],
            { compress: 1 }
        );
        getImageToBase64s(manipResult.uri).then((base64file) => {
            convertBase64s(base64file)
        })

    }

    return (
        <React.Fragment>
            <View style={styles.parent}>
                <View style={styles.child}>
                </View>
            </View>
            <View style={{
                height: "77%", width: width - 40, padding: 10, backgroundColor: "#fff", alignSelf: "center", borderRadius: 20,marginTop:"-45%",
            }}>
                <View style={{
                    width: 110, height: 110, backgroundColor: "#fff", borderRadius: 150 / 2, alignSelf: "center", bottom: "10%",
                    shadowColor: "#171717", shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { width: -2, height: 4 }, shadowColor: '#171717',
                    elevation: 4
                }}>
                    <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", flex: 1 }}>
                        <Text style={{ fontSize: 13, opacity: 0.4 }}>TOTAL</Text>
                        <Text style={{ fontSize: 35, opacity: 0.4 }}>{attendance.total_hours}</Text>
                        <Text style={{ fontSize: 13, opacity: 0.4 }}>HOURS</Text>
                    </View>
                </View>
                <SafeAreaView style={styles.container1}>

                    <Carousel
                        layout="stack"
                        layoutCardOffset={0}
                        ref={isCarousel}
                        data={attendance && attendance.log_details && attendance.log_details.length ? attendance.log_details : []}
                        renderItem={({ item, index }) =>
                            <View style={{ marginTop: Platform.OS === "ios" ? 20 : parseInt(width) === 392 ? 40 : 0 }}>
                                <Card style={{
                                    width: width - 90, padding: Platform.OS === "ios" ? 10 : 8,
                                    shadowColor: "#171717", shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: -1, height: 4 }, backgroundColor: "#FFF", elevation: 2, borderRadius: 10,
                                    margin: 6,
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
                                                                uri: `${baseUrl}attendance/${item.login_image}`
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
                                                            uri: `${baseUrl}attendance/${item.login_image}`
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
                                        <View style={{ height: 10 }}></View>
                                    }
                                    {/* 
                  {item.login_location ?
                    <View style={{ flexDirection: "row", top: "2%", padding: 5 }}>
                      <Image style={{ width: 15, height: 15, }} source={require('../../../assets/pin.png')} />
                      <Text numberOfLines={1} style={{ opacity: 0.4, width: "90%" }}>{item.login_location}</Text>
                    </View>
                    : <View style={{ flexDirection: "row", top: "2%", padding: 5 }}>
                      <Image style={{ width: 15, height: 15, }} source={require('../../../assets/pin.png')} />
                      <Text numberOfLines={1} style={{ opacity: 0.4, width: "90%" }}></Text>
                    </View>} */}


                                    <TouchableOpacity style={{ width: width / 1.4, height: height / 11, alignSelf: "center", top: 2, }}
                                        onPress={() => {
                                            props.navigation.navigate("EssMapView",

                                                { DetailsImage: `${baseUrl}attendance/${item.login_image}`, DetailsLocation: item.login_location, Latitude: item.login_latitude, longitude: item.login_longitude })
                                        }}
                                    >
                                        {item.login_latitude && item.login_longitude ? (
                                            <MapView
                                                onPress={() => {
                                                    props.navigation.navigate("EssMapView",

                                                        { DetailsImage: `${baseUrl}attendance/${item.login_image}`, DetailsLocation: item.login_location, Latitude: item.login_latitude, longitude: item.login_longitude })
                                                }}
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
                                    </TouchableOpacity>
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
                                                                uri: `${baseUrl}attendance/${item.logout_image}`
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
                                                            uri: `${baseUrl}attendance/${item.logout_image}`
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
                                        <View style={{ height: 10 }}></View>
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


                                    <TouchableOpacity style={{ width: width / 1.4, height: height / 11, alignSelf: "center", top: 2, }}
                                        onPress={() => {
                                            props.navigation.navigate("EssMapView",

                                                { DetailsImage: `${baseUrl}attendance/${item.logout_image}`, DetailsLocation: item.logout_location, Latitude: item.logout_latitude, longitude: item.logout_longitude })
                                        }}
                                    >
                                        {item.logout_latitude && item.logout_longitude ? (
                                            <MapView
                                                onPress={() => {
                                                    props.navigation.navigate("EssMapView",

                                                        { DetailsImage: `${baseUrl}attendance/${item.logout_image}`, DetailsLocation: item.logout_location, Latitude: item.logout_latitude, longitude: item.logout_longitude })
                                                }}
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
                                    </TouchableOpacity>
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
                        dotsLength={attendance && attendance.log_details && attendance.log_details.length}
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
                    elevation: 4, bottom: Platform.OS === "ios" ? "7%" : "7%"
                }}>
                <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", flex: 1 }}>
                    {isLoding || isLodingLocation ?
                        <View>
                            <ActivityIndicator />
                            {isLodingLocation ? <Text style={{ alignSelf: 'center', opacity: 0.4, fontSize: Platform.OS === "ios" ? 9 : 10, top: 10 }}>Fetching location...</Text> : null}
                        </View>
                        :
                        <View>
                            <Image style={{ alignSelf: 'center', width: 45, height: 45, tintColor: (attendance && (attendance.log_details[0].logout === "" && attendance.log_details[0].login === "")) ? "green" : attendance && attendance.log_details[0].logout === "" ? "red" : "green" }} source={require('../../../assets/tap.png')} />
                            <Text style={{ alignSelf: 'center', color: (attendance && (attendance.log_details[0].logout === "" && attendance.log_details[0].login === "")) ? "green" : attendance && attendance.log_details[0].logout === "" ? "red" : "green", top: 5 }}>{(attendance && (attendance.log_details[0].logout === "" && attendance.log_details[0].login === "")) ? "Check In" : attendance && attendance.log_details[0].logout === "" ? "Check Out" : "Check In"}</Text>
                            <Text style={{ alignSelf: 'center', opacity: 0.4, fontSize: Platform.OS === "ios" ? 9 : 10, top: 10 }}>{currentTime}</Text>
                        </View>
                    }

                </View>
            </TouchableOpacity>

      <View style={{bottom:25}}>
                <ActionButton navigation={props.navigation} EmployeeId={UserEmployee}/>
                </View>
        </React.Fragment >
    )
}

export default Dashboard

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

        backgroundColor: 'green',
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

