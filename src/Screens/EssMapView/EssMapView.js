import { Alert, StyleSheet, Text, View, Image, Animated } from 'react-native'
import React, { useState, useEffect } from 'react'
import MapView, { Marker, Callout, Circle } from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import Lightbox from "react-native-lightbox";
import * as Location from "expo-location"
import AsyncStorage from "@react-native-async-storage/async-storage";

const EssMapView = (props) => {
    const { route } = props;
    const [longitude, SetLongitude] = useState(route && route.params && route.params && route.params.longitude);
    const [latitude, SetLatitude] = useState(route && route.params && route.params && route.params.Latitude);
    const [displayCurrentAddress, setDisplayCurrentAddress] = useState(route && route.params && route.params.DetailsLocation)
    const [GeoFenceLocation, setGeoFenceLocation] = useState("")
    const [GeoFence, setGeoFence] = useState("")

    useEffect(() => {
        AsyncStorage.getItem("sessionData", (err, result) => {
            const ses_data = JSON.parse(result);
            setGeoFence(ses_data.attendance_geofence)
            setGeoFenceLocation(ses_data.geo_fence_locations)
        });
    }, [])

    const CurrentLocation = async () => {
        try {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            let { coords } = await Location.getCurrentPositionAsync();

            if (coords) {
                const { latitude, longitude } = coords;
                SetLatitude(latitude)
                SetLongitude(longitude)
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


        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        if (route && route.params && route.params.CurrentLocation) {
            CurrentLocation()
        }
    }, [])


    return (
        <View>
            {latitude && longitude ?
                <MapView
                    zoomControlEnabled={false}
                    zoomEnabled={true}
                    scrollEnabled={true}
                    style={{ width: "100%", height: "100%" }}
                    region={{
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}

                    type LatLng={{
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                    }}
                >
                    {GeoFence === "1" && (route.params && route.params.CurrentLocation) && GeoFenceLocation && GeoFenceLocation.length ?
                        GeoFenceLocation.map((item) => {
                            return (
                                <>
                                    <Marker
                                        coordinate={{
                                            latitude: parseFloat(item.location_latitude),
                                            longitude: parseFloat(item.location_longitude)
                                        }}

                                    >

                                        <Callout>
                                            <View style={{ width: 140, alignItems: "center" }}>
                                                <Text>{item.location_name}</Text>
                                            </View>
                                        </Callout>
                                    </Marker>
                                    <Circle
                                        key={(parseFloat(item.location_latitude) + parseFloat(item.location_longitude)).toString()}
                                        center={{
                                            latitude: parseFloat(item.location_latitude),
                                            longitude: parseFloat(item.location_longitude)
                                        }}
                                        radius={parseFloat(item.location_boundry)}
                                        strokeWidth={1}
                                        strokeColor={'rgba(36, 211, 39, 1)'}
                                        fillColor={'rgba(71, 194, 73, 0.34)'}
                                    />
                                </>
                            )
                        })
                        :
                        null
                    }

                    <Marker
                        coordinate={{
                            latitude: parseFloat(latitude),
                            longitude: parseFloat(longitude)
                        }}
                    >
                        <Animated.Image
                            source={require('../../../assets/location.png')}
                            style={[styles.marker]}
                            resizeMode="cover"
                        />
                        <Callout>
                            <View style={{ width: 120, alignItems: "center" }}>
                                <Text>Your Location</Text>
                            </View>
                        </Callout>
                    </Marker>
                </MapView>
                :
                <View>
                </View>
            }
            <View style={styles.Box}>
                {route && route.params && route.params.CurrentLocation ?
                    <View></View>
                    :
                    <View style={{ width: "15%", borderRadius: 10, backgroundColor: "#d1e0e0", height: 35 }}>
                        <Lightbox underlayColor="white"
                            renderContent={() => {
                                return (
                                    <Image
                                        style={{ height: "100%", width: "100%", alignSelf: 'center' }}
                                        resizeMode="contain"
                                        source={{ uri: route.params && route.params.DetailsImage }}
                                    />
                                )
                            }}
                        >
                            <Image source={{ uri: route.params && route.params.DetailsImage }} style={styles.image} />
                        </Lightbox>
                    </View>
                }
                <View style={{ width: "80%", borderRadius: 10, left: 10, flexDirection: "row" }}>
                    <Animatable.View style={{ top: route && route.params && route.params.CurrentLocation ? "0%" : "2%" }}
                        animation="pulse"
                        easing="ease-out"
                        iterationCount="infinite"
                    >
                        <Image style={{ width: 25, height: 25, bottom: "1%" }} source={require('../../../assets/location.png')} />
                    </Animatable.View>
                    <View style={{ justifyContent: "center" }}>
                        <Text>{displayCurrentAddress}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default EssMapView

const styles = StyleSheet.create({
    Box: {
        position: "absolute",
        marginTop: 30,
        flexDirection: "row",
        backgroundColor: "#fff",
        width: "90%",
        alignSelf: "center",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#ccc",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 15,
    },
    image: {
        width: "100%",
        height: 38,
        borderRadius: 5
    },

    marker: {
        width: 30,
        height: 30,
    },
})

