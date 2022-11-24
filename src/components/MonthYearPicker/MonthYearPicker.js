import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableHighlight, Dimensions, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MonthYearPicker = (props) => {
    const month_data = [
        { key: 1, name: 'January', Abbreviation: "Jan" },
        { key: 2, name: 'February', Abbreviation: "Feb" },
        { key: 3, name: 'March', Abbreviation: "Mar" },
        { key: 4, name: 'April', Abbreviation: "Apr" },
        { key: 5, name: 'May', Abbreviation: "May" },
        { key: 6, name: 'June', Abbreviation: "June" },
        { key: 7, name: 'July', Abbreviation: "July" },
        { key: 8, name: 'August', Abbreviation: "Aug" },
        { key: 9, name: 'September', Abbreviation: "Sep" },
        { key: 10, name: 'October', Abbreviation: "Oct" },
        { key: 11, name: 'November', Abbreviation: "Nov" },
        { key: 12, name: 'December', Abbreviation: "Dec" },
    ]
    const { width, height } = Dimensions.get('window')
    const [month, setMonth] = useState(month_data[new Date().getMonth()])
    const [year, setYear] = useState(new Date().getFullYear())

    useEffect(() => {
        props.onChangeYear(year)
    })

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.isShow}
            onRequestClose={props.close}
            style={{ borderRadius: 14 }}
        >
            <TouchableHighlight style={{ flex: 0.9, backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <View />
            </TouchableHighlight>
            <View style={{ flex: 1 / 2, backgroundColor: '#fff', borderRadius: 14, height: 54, width: "100%" }} >
                <View style={styles.yearContainer}>
                    <View style={styles.year}>
                        <TouchableOpacity style={{ marginLeft: "20%" }} onPress={() => {
                            setYear(year - 1)
                            props.onChangeYear(year - 1)
                        }}>
                            <Ionicons
                                name="chevron-back-sharp"
                                size={25}
                                color="green"
                            />
                        </TouchableOpacity>
                        <Text style={[styles.yearLabel]}>{year}</Text>
                        <TouchableOpacity
                            style={{ marginRight: "20%" }}
                            onPress={() => {
                                setYear(year + 1)
                                props.onChangeYear(year + 1)
                            }}>
                            <Ionicons
                                name="chevron-forward"
                                size={25}
                                color="green"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={{ backgroundColor: "green", height: 30, width: 65, borderRadius: 10, justifyContent: "center" }}
                        onPress={props.close}
                    >
                        <Text style={{ alignSelf: "center", color: "#fff" }}>Done</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.monthContainer}>
                    {month_data.map((item, index) =>
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                setMonth(item)
                                props.onChangeMonth(item)
                            }}
                            style={[styles.month, { width: (width / 3), backgroundColor: item.key == month.key ? "green" : 'white', borderRadius: 30, height: (height / 15) }]}>
                            <Text style={{ color: item.key == month.key ? 'white' : 'black' }}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    )
}

const styles = {
    year: {
        padding: 15,
        height: 54,
        flexDirection: 'row',
        justifyContent: 'space-between',
        left: "15%"
    },
    yearContainer: {
        padding: 15,
        height: 54,
        borderBottomWidth: 1,
        borderBottomColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    monthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    month: {
        height: 54, alignItems: 'center', justifyContent: 'center',
    },

    yearLabel: {
        fontWeight: 'bold', fontSize: 16
    },
}

export default MonthYearPicker