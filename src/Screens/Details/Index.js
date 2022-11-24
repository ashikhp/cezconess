import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card } from 'react-native-paper'
import Timeline from 'react-native-timeline-flatlist'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Lightbox from "react-native-lightbox";
import { getDetails } from '../../apis';

const Details = (props) => {
  const [attendanceDate, setattendanceDate] = useState()
  const [Data, setdatas] = useState()
  const [TotalHours, setTotalHours] = useState()
  const { route } = props;
  const [AttendanceDate, setAttendanceDate] = useState(route && route.params && route.params.AttendanceDate)
  const [isLoding, setisLoding] = useState(true)
  const [Absent, setAbsent] = useState()

  const { GeoFence } = route.params

  const handleRefresh = () => {
    getDetails({ "attendanceDate": AttendanceDate }).then((data) => {
      setattendanceDate(data && data.attendance_date)
      setdatas(data && data.attendance && data.attendance.log_details)
      setTotalHours(data && data.attendance && data.attendance.total_hours)
      setAbsent(data && data.attendance && data.attendance.leave_name)
      setisLoding(false)
    })
  }

  useEffect(() => {
    handleRefresh()
  }, [])

  const renderDetail = (rowData) => {
    const title = <Text style={[styles.title, { color: (GeoFence === "1" && rowData.attendance_in_geofence === "0") ? "red" : "#000000" }]}>{rowData.title}</Text>
    var desc = null
    if (rowData.description && rowData.imageUrl)
      desc = (
        <View style={styles.descriptionContainer}>
          <TouchableOpacity onPress={() => {
            props.navigation.navigate("EssMapView",

              { DetailsImage: rowData && rowData.imageUrl, DetailsLocation: rowData && rowData.description, Latitude: rowData && rowData.latitude, longitude: rowData && rowData.longitude }

            )
          }}>
            <View style={{ flexDirection: "row" }}>
              <Image style={{ width: 15, height: 15, right: 10, top: "1%" }} source={require('../../../assets/location.png')} />
              <Text style={[styles.textDescription, { color: (GeoFence === "1" && rowData.attendance_in_geofence === "0") ? "red" : "#005ce6" }]}>{rowData.description}</Text>
            </View>
          </TouchableOpacity>
          <Lightbox underlayColor="white"
            renderContent={() => {
              return (
                <Image
                  style={{ height: "100%", width: "100%", alignSelf: 'center' }}
                  resizeMode="contain"
                  source={{ uri: rowData.imageUrl }}
                />
              )
            }}
          >
            <Image source={{ uri: rowData.imageUrl }} style={styles.image} />
          </Lightbox>
        </View>
      )

    return (
      <View style={{ flex: 1 }}>
        {title}
        {desc}
      </View>
    )
  }


  return (
    <View style={{ backgroundColor: "#fff", width: "100%", height: "100%" }}>
      {isLoding ? <View style={{ alignItems: "center", justifyContent: "center", flex: 1, bottom: "5%" }}>
        <ActivityIndicator color="green" size={45} style={{
        }} />
      </View> :
        <>
          <Card style={{
            width: "85%", alignSelf: "center",
            shadowColor: "#171717", shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: -2, height: 4 }, backgroundColor: "#fff", shadowColor: '#171717',
            elevation: 2, borderRadius: 5, height: "30%", top: "4%"
          }}>
            <View style={{ alignContent: "center", alignItems: "center", justifyContent: "center", flex: 1, height: "100%" }} >
              <View style={{ height: "38%", justifyContent: "center" }}>
                <Image style={{ width: 80, height: 80 }} source={require('../../../assets/calendar.png')} />
              </View>
              <View style={{ height: "10%", top: "5%" }}>
                <Text style={{ fontSize: 16 }}>{attendanceDate}</Text>
              </View>
              <View style={{ height: "20%", top: "4%" }}>
                <Text style={{ fontSize: 28, fontWeight: "bold" }}>{TotalHours}<Text style={{ fontSize: 24, top: "1%" }}> HRS</Text></Text>
              </View>
            </View>
          </Card >

          <View style={{ height: 25, top: "12%", flexDirection: "row", left: "4%" }}>
            <FontAwesome name="code-fork" color={"#bababa"} size={25} style={{ left: "10%" }} />
            <Text style={{ color: "#bababa", left: "16%", fontSize: 14 }}>Time Line</Text>
          </View>
          <Card style={{
            width: "85%", alignSelf: "center",
            shadowColor: "#171717", shadowOpacity: 0.1, shadowRadius: 15, shadowOffset: { width: -2, height: 4 }, backgroundColor: "#fff", shadowColor: '#171717',
            elevation: 2, borderRadius: 5, height: "50%", top: "10%"
          }}>

            {Absent ?
              <Text style={{ fontSize: 25, fontWeight: "bold", top: "5%", color: "red", alignSelf: "center" }}>{Absent}</Text>
              :
              <Timeline
                data={Data}
                renderDetail={renderDetail}
                widthLineContainer={65}
                lineColor={"green"}
                showAmPm={true}
                circleColor={"green"}
                style={{ margin: 16, height: 50 }}
                dotSize={1}
                timeStyle={{ backgroundColor: "green", width: 50, height: 25, color: "#fff", borderRadius: 10, paddingRight: "1%", textAlign: "center", fontSize: 10, paddingTop: "1.5%" }}
              />
            }
          </Card >
        </>
      }
    </View >

  )
}

export default Details

const styles = StyleSheet.create({
  swiperCards: {
    borderRadius: 20,
    width: 190,
    height: 50,
    alignItems: "center",
    justifyContent: "center"

  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 5
  },
  title: {
    fontSize: 16,
  },
  textDescription: {
    opacity: 0.4,
    // color: "#005ce6",
    right: 8,
    textDecorationLine: 'underline'
  }
})