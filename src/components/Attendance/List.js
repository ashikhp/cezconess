
import React, { useState, useEffect } from 'react'
import { View, Text, Platform, Alert, StyleSheet, ImageBackground } from 'react-native'


const List = (props) => {
    const {
        listColors,
        item,
        index,
        GeoFence
    } = props


    return (
        <View style={{ flexDirection: "row", padding: 5, }}>
            <View style={{ width: "25%", minHeight: 35, backgroundColor: item.leave_name === "" ? "#fff" : "#ffe6e6", alignItems: "center", justifyContent: "center", padding: 12, borderTopStartRadius: 10, borderBottomStartRadius: 10 }}>
                <View style={styles.Box1}>
                    <ImageBackground source={require("../../../assets/cal.png")} resizeMode="cover"
                        style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontWeight: "bold", top: 6 }} >{item.attendance_date_split.day}</Text>
                        <Text style={{ top: 2, fontSize: 12 }}>{item.attendance_date_split.day_name}</Text>
                    </ImageBackground>
                </View>

            </View>
            {item.leave_name === "" ?
                <View style={{ width: "25%", minHeight: 35, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", padding: 12 }}>
                    {
                        item.log_time && item.log_time.length ?
                            item.log_time.map((time) => {
                                return (
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>
                                        <Text style={{ fontSize: Platform.OS === "ios" ? 12 : 13, opacity: 0.6, color: (GeoFence === "1" && time.biometricInWithinGeofence === "0") ? "red" : "black" }}>{time.login}</Text>
                                    </View>
                                )
                            })
                            :
                            <Text style={{ fontSize: 24, alignSelf: "center" }}>--:--</Text>
                        // <View></View>
                    }
                </View>
                : <View></View>}
            {item.leave_name === "" ?
                <View style={{ width: "25%", minHeight: 35, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", padding: 12 }}>
                    {
                        item.log_time && item.log_time.length ?
                            item.log_time.map((time) => {
                                return (
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: "center" }}>
                                        {time.logout ?
                                            null
                                            :
                                            <Text style={{ fontSize: 16, alignSelf: "center" }}>---:---</Text>
                                        }
                                        <Text style={{ fontSize: Platform.OS === "ios" ? 12 : 13, opacity: 0.6, color: (GeoFence === "1" && time.biometricOutWithinGeofence === "0") ? "red" : "black" }}>{time.logout}</Text>
                                    </View>
                                )
                            })
                            :
                            <View></View>

                    }
                </View>
                : <View style={{ width: "50%", backgroundColor: "#ffe6e6", alignItems: 'center', justifyContent: "center", }}>

                    <Text style={{ alignSelf: 'center', fontWeight: "bold", opacity: 0.6 }}>{item.leave_name}</Text>
                </View>}

            <View style={{ width: "25%", minHeight: 35, backgroundColor: item.leave_name === "" ? "#fff" : "#ffe6e6", alignItems: "center", justifyContent: "center", borderTopEndRadius: 10, borderBottomEndRadius: 10 }}>
                {item.total_hours === "0.00" ?
                    <Text style={{ fontSize: 24 }}></Text> :
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.total_hours}</Text>
                }
            </View>
        </View >
    )
}

export default List
const styles = StyleSheet.create({
    Box: {
        borderRadius: 10,
        shadowColor: "#ccc",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        height: 40,
        width: 40,
        backgroundColor: "#fff",
        alignItems: "center",
        borderRadius: 5
    },
    Box1: {
        borderRadius: 10,
        shadowColor: "#ccc",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
        height: 40,
        width: 40,
        backgroundColor: "#fff",
        alignItems: "center",
        borderRadius: 5
    },
    image: {
        width: "100%",
        height: 38,
        borderRadius: 5
    },
})
