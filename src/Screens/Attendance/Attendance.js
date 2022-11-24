
import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity, FlatList, RefreshControl, SafeAreaView, Platform, Image } from 'react-native'
import { Divider, IconButton, withTheme } from 'react-native-paper';
import { getAttendance } from '../../apis';
import moment, { months } from "moment";
import List from "../../components/Attendance/List";
import MonthYearPicker from "../../components/MonthYearPicker/MonthYearPicker"
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from "expo-linear-gradient";


const Attendance = (props) => {
    const { route } = props;
    const { listColors } = props.theme;
    const [Data, setdata] = useState([])
    const [isLoding, setisLoding] = useState(true)
    const [TotalWorkingDays, setTotalWorkingDays] = useState("")
    const [TotalWorkedDays, setTotalWorkedDays] = useState("")
    const [TotalLeaves, setTotalLeaves] = useState("")
    const [TotalWorkingHourse, setTotalWorkingHourse] = useState("")
    const [TotalWorkedHourse, setTotalWorkedHourse] = useState("")
    const [datepicker, hideDatePicker] = useState(false)
    const [Month, setMonth] = useState(moment().format('MMM'))
    const [Year, setYear] = useState(moment().format('YYYY'))
    const [forceRefresh, setForceRefresh] = useState(false)
    const [CurrentMonth, setCurrentMonth] = useState(moment().format('MMMM'))
    const [refreshing, setRefreshing] = useState(true);
    const [EmployeeId, setEmployeeId] = useState(route.params.EmployeeId)
    const [GeoFence, setGeoFence] = useState("")

    const SortMonth = (data) => {
        setMonth(data.Abbreviation)
        setCurrentMonth(data.name)
    }
    const SortYear = (data) => {
        setYear(data)
    }
    const handleRefresh = () => {
        const data = { "searchAttendanceDate": `${Month} - ${Year}` }
        getAttendance(data).then((data) => {
            setRefreshing(false);
            setdata(data && data.attendance)
            setTotalWorkingDays(data && data.total_working_days)
            setTotalWorkedDays(data && data.total_worked_days)
            setTotalLeaves(data && data.total_leaves)
            setTotalWorkingHourse(data && data.total_working_hours)
            setTotalWorkedHourse(data && data.total_worked_hours)
            setisLoding(false)

        })
    }


    useEffect(() => {
        handleRefresh()
    }, [])

    useEffect(() => {
        setisLoding(true)
        handleRefresh()
    }, [forceRefresh])

    useEffect(() => {
        AsyncStorage.getItem("sessionData", (err, result) => {
            const ses_data = JSON.parse(result);
            setGeoFence(ses_data.attendance_geofence)
        });
    }, [])


    const renderItem = ({ item, index }) => (
        < TouchableOpacity
            activeOpacity={item.leave_name === "" ? .1 : .9} onPress={() => {
                item.leave_name === "" ?
                    props.navigation.navigate("Details", { AttendanceDate: item.attendance_date, GeoFence: GeoFence })
                    :
                    null
            }}>

            <List key={index} item={item} index={index} listColors={listColors} GeoFence={GeoFence} />
        </TouchableOpacity>
    );

    return (


        <View style={{ flex: 1 }}>
            <View style={{ width: "100%", height: "20%" }}>

                <View style={{ height: "70%", width: "100%", flexDirection: "row", backgroundColor: "#fff", bottom: 1 }}>
                    <View style={{ height: "100%", width: "33%", alignItems: 'center', justifyContent: "center" }}>
                        {/* <TouchableOpacity style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}> */}
                        <TouchableOpacity style={styles.baseBottom}
                            onPress={() => {
                                props.navigation.navigate("Profile",
                                    { EmployeeId: EmployeeId }
                                )
                            }}
                        >
                            <LinearGradient
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                colors={['#0066CC', '#00FFFF']}
                                // colors={['#f3f2ff', '#ceffc9']}
                                style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", borderRadius: 10 }}
                            >
                                <MaterialCommunityIcons name="account-outline" size={24} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                        <View>
                            <Text style={{ opacity: 0.5, top: 2, fontSize: 11 }}>My Profile</Text>
                        </View>
                    </View>
                    <View style={{ height: "100%", width: "33%", alignItems: 'center', justifyContent: "center" }}>
                        <TouchableOpacity style={styles.baseBottom}
                            onPress={() => {
                                props.navigation.navigate("EssMapView", { CurrentLocation: true })

                            }}
                        >
                            <LinearGradient
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                colors={['#FF0000', '#FF9966']}
                                // colors={['#f3f2ff', '#ceffc9']}
                                style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", borderRadius: 10 }}
                            >
                                <MaterialIcons name="location-pin" size={24} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                        <View>
                            {GeoFence === "1" ?
                                <Text style={{ opacity: 0.5, top: 2, fontSize: 11 }}>Geo Location</Text>
                                :
                                <Text style={{ opacity: 0.5, top: 2, fontSize: 11 }}>My Location</Text>
                            }
                        </View>
                    </View>

                    <View style={{ height: "100%", width: "33%", alignItems: 'center', justifyContent: "center" }}>
                        <TouchableOpacity style={styles.baseBottom}
                            onPress={() => { props.navigation.navigate("Settings") }}
                        >
                            <LinearGradient
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                colors={['#2d8659', '#79d2a6']}
                                // colors={['#f3f2ff', '#ceffc9']}
                                style={{ width: "100%", height: "100%", alignItems: "center", justifyContent: "center", borderRadius: 10 }}
                            >
                                <Ionicons name="md-settings-outline" size={24} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                        <View>
                            <Text style={{ opacity: 0.5, top: 2, fontSize: 12 }}>Settings</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={{ width: "100%", height: "30%", justifyContent: "center", alignSelf: "center", backgroundColor: "#fff" }}
                    onPress={() => { hideDatePicker(true) }}
                >
                    {/* <View style={{ width: "100%", height: "15%", justifyContent: "center", borderTopWidth: 0.3, borderBottomWidth: 0.3, borderTopColor: "f5f5f0", borderBottomColor: "f5f5f0" }}> */}
                    <View style={{ alignItems: "center", justifyContent: "center" }}
                    >
                        <View style={{ flexDirection: "row" }}>
                            <MaterialCommunityIcons name="calendar-month" size={22} color="#00ace6" />
                            <Text style={{ color: "#00ace6", fontSize: 15, fontWeight: "bold", left: 2 }}>{`${CurrentMonth} - ${Year}`}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <MonthYearPicker
                    isShow={datepicker}
                    close={() => {
                        hideDatePicker(false)
                        setForceRefresh(!forceRefresh)
                    }}
                    onChangeYear={(year) => {
                        SortYear(year)
                    }
                    }
                    onChangeMonth={(Month) => {
                        SortMonth(Month)
                    }}
                />


            </View>

            {isLoding ?
                <View style={{ alignItems: "center", justifyContent: "center", flex: 1, bottom: "5%" }}>
                    <ActivityIndicator color="green" size={45} style={{
                    }} />
                </View>
                :
                <View style={{ flex: 1 }}>
                    <Divider />
                    <View style={{ width: "100%", height: "11%", flexDirection: "row" }}>
                        <View style={{ width: "33%", height: "100%", backgroundColor: "#fff", flexDirection: "row" }}>
                            <View style={{ alignItems: "flex-end", width: "36%", justifyContent: "center" }}>
                                <Feather name="user-check" size={25} color="#00ace6" />
                            </View>
                            <View style={{ left: 8, alignSelf: "center" }}>
                                <Text style={{ fontWeight: "bold", fontSize: 12 }}>{TotalWorkedDays} / {TotalWorkingDays}</Text>
                                <Text style={{ opacity: 0.5, fontSize: Platform.OS === "ios" ? 11 : 12 }}>Worked Days</Text>
                            </View>
                        </View>
                        <View style={{ width: "34%", height: "100%", backgroundColor: "#fff", flexDirection: "row" }}>
                            <View style={{ alignItems: "flex-end", width: "36%", justifyContent: "center" }}>
                                <MaterialCommunityIcons name="clock-check-outline" size={25} color="#00ace6" />
                            </View>
                            <View style={{ left: 8, alignSelf: "center" }}>
                                <Text style={{ fontWeight: "bold", fontSize: 12 }}>{TotalWorkedHourse} / {TotalWorkingHourse}</Text>
                                <Text style={{ opacity: 0.5, fontSize: Platform.OS === "ios" ? 11 : 12 }}>Worked Hours</Text>
                            </View>
                        </View>
                        <View style={{ width: "33%", height: "100%", backgroundColor: "#fff", flexDirection: "row" }}>
                            <View style={{ alignItems: "flex-end", width: "36%", justifyContent: "center" }}>
                                <Feather name="user-x" size={25} color="#00ace6" />
                            </View>
                            <View style={{ left: 8, alignSelf: "center" }}>
                                <Text style={{ fontWeight: "bold", left: 11, fontSize: 12 }}>{TotalLeaves}</Text>
                                <Text style={{ opacity: 0.5, fontSize: Platform.OS === "ios" ? 11 : 12 }}>Leaves</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ width: "100%", height: "8%", alignItems: "center", justifyContent: "center" }}>
                        <View style={{ height: "80%", width: "100%", flexDirection: "row" }}>
                            <View style={{ height: "100%", width: "25%", alignItems: "center", justifyContent: "center" }}>
                                <Text>Date</Text>
                            </View>
                            <View style={{ height: "100%", width: "25%", alignItems: "center", justifyContent: "center" }}>
                                <Text>Signed In</Text>
                            </View>
                            <View style={{ height: "100%", width: "25%", alignItems: "center", justifyContent: "center" }}>
                                <Text>Signed Out</Text>
                            </View>
                            <View style={{ height: "100%", width: "25%", alignItems: "center", justifyContent: "center" }}>
                                <Text>Total Hours</Text>
                            </View>
                        </View>
                    </View>

                    {refreshing ? <ActivityIndicator /> : null}
                    <FlatList
                        renderItem={renderItem}
                        data={Data}
                        enableEmptySections={true}
                        // ItemSeparatorComponent={ItemSeparatorView}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                        }
                    />
                </View >
            }

        </View>

    )
}

export default withTheme(Attendance);
const styles = StyleSheet.create({
    parent: {
        top: -80,
        height: '25%',
        width: '100%',
        transform: [{ scaleX: 2 }],
        borderBottomStartRadius: 300,
        borderBottomEndRadius: 300,
        overflow: 'hidden',
    },
    child: {
        flex: 1,
        transform: [{ scaleX: 0.5 }],
        backgroundColor: '#0c9102',
        alignItems: 'center',
        justifyContent: 'center'
    },
    baseBottom: {
        height: 55,
        // height: "45%",
        width: 55,
        backgroundColor: "#660066",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    }
});
