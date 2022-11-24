import React from 'react'
import { View, Text, StyleSheet, Image, Platform } from 'react-native'
import { Badge } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';


const AttendanceHeaderBox = (props) => {
    const { selectedDate, TotalWorkingDays, TotalWorkedDays, TotalLeaves, TotalWorkingHourse, TotalWorkedHourse } = props
    return (
        <Animatable.View
            animation='zoomInDown'
            duration={1500}
            style={{
                backgroundColor: "#fff", margin: 1, height: "12%", width: "95%", marginTop: -130, alignSelf: 'center', borderRadius: 10,
                shadowColor: "#171717", shadowOpacity: 0.1, shadowRadius: 2, shadowOffset: { width: -1, height: 1 }, backgroundColor: "#FFF", shadowColor: '#171717',
                elevation: 2,
            }}
        >
            <View style={{ alignSelf: 'center', padding: 5 }}>
                <Text style={{ opacity: 0.7, margin: 5 }}>{selectedDate}</Text>
            </View>
            <View style={{ flexDirection: 'row', padding: 2 }}>

                <View style={{ padding: 2, flex: 1 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.dateTextStyle}><Image source={require('../../../assets/1.png')} style={{ height: 10, width: 10 }} />  Total Working Days (1)</Text>
                        <Badge size={18} style={styles.badgeStyle}>{TotalWorkingDays}</Badge>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.dateTextStyle}><Image source={require('../../../assets/3.png')} style={{ height: 10, width: 10 }} />  Expected Total Working Hours 3</Text>
                        <Badge size={18} style={styles.badgeStyle}>{TotalWorkingHourse}</Badge>
                    </View>
                </View>

                <View style={{ padding: 2, right: 1 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.dateTextStyle}><Image source={require('../../../assets/2.png')} style={{ height: 10, width: 10 }} />  Total Worked Days / Leaves 2</Text>
                        <Badge size={18} style={styles.badgeStyle}>{TotalWorkedDays}/{TotalLeaves}</Badge>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.dateTextStyle}><Image source={require('../../../assets/4.png')} style={{ height: 10, width: 10 }} />  Total Worked Hours 3</Text>
                        <Badge size={18} style={styles.badgeStyle}>{TotalWorkedHourse}</Badge>
                    </View>
                </View>

            </View>
        </Animatable.View>

    )
}
const styles = StyleSheet.create({
    dateTextStyle: { fontSize: Platform.OS === "ios" ? 9 : 11, margin: 1, color: "#898989" },
    badgeStyle: { backgroundColor: "#bababa", color: "#fff" }
});


export default AttendanceHeaderBox