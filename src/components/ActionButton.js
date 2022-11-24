import React, { useState } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Animated,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    LogBox,
    Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


export default function ActionButton(props) {

    const { EmployeeId } = props
    const [open, setOpen] = useState(false)
    const [animation, setAnimation] = useState(new Animated.Value(0))


    LogBox.ignoreAllLogs()

    const toggleOpen = () => {
        const toValue = open ? 0 : 1;

        Animated.timing(animation, {
            toValue,
            duration: 200,
        }).start();

        setOpen(!open)
    };

    const locationInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -70],
    });

    const settingsInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -140],
    });

    const profileInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -210],
    });

    const listInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -280],
    });

    const locationStyle = {
        transform: [
            {
                scale: animation,
            },
            {
                translateY: locationInterpolate,
            },
        ],
    };

    const settingsStyle = {
        transform: [
            {
                scale: animation,
            },
            {
                translateY: settingsInterpolate,
            },
        ],
    };

    const profileStyle = {
        transform: [
            {
                scale: animation,
            },
            {
                translateY: profileInterpolate,
            },
        ],
    };

    const listStyle = {
        transform: [
            {
                scale: animation,
            },
            {
                translateY: listInterpolate,
            },
        ],
    };

    const labelPositionInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-30, -90],
    });

    const opacityInterpolate = animation.interpolate({
        inputRange: [0, 0.8, 1],
        outputRange: [0, 0, 1],
    });

    const labelStyle = {
        opacity: opacityInterpolate,
        transform: [
            {
                translateX: labelPositionInterpolate,
            },
        ],
    };

    const scaleInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 30],
    });

    const bgStyle = {
        transform: [
            {
                scale: scaleInterpolate,
            },
        ],
    };

    return (
        <View style={styles.containerss}>
            <Animated.View style={[styles.background, bgStyle]} />
            <TouchableWithoutFeedback onPress={() => {
                toggleOpen()
                props.navigation.navigate("Attendance",
                    { EmployeeId: EmployeeId }
                )
            }

            }>
                <Animated.View style={[styles.button, styles.other, listStyle, { backgroundColor: "#fff" }]}>
                    <Animated.Text style={[styles.label, labelStyle]}>List</Animated.Text>
                    <Icon name="format-list-checks" size={20} color="#398ff7" />
                </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {
                toggleOpen()
                props.navigation.navigate("Profile",
                    { EmployeeId: EmployeeId }
                )
            }
            }>
                <Animated.View style={[styles.button, styles.other, profileStyle, { backgroundColor: "#fff" }]}>
                    <Animated.Text style={[styles.label, labelStyle]}>Profile</Animated.Text>
                    <Icon name="account" size={20} color="#ae39f7" />
                </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {
                toggleOpen()
                props.navigation.navigate("Settings")
            }}>
                <Animated.View style={[styles.button, styles.other, settingsStyle, { backgroundColor: "#fff" }]}>
                    <Animated.Text style={[styles.label, labelStyle]}>Settings</Animated.Text>
                    <Icon name="cog-outline" size={20} color="#09e095" />
                </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => {
                toggleOpen()
                props.navigation.navigate("EssMapView", { CurrentLocation: true })
            }}>
                <Animated.View style={[styles.button, styles.other, locationStyle, { backgroundColor: "#fff" }]}>
                    <Animated.Text style={[styles.label, labelStyle]}>Location</Animated.Text>
                    <Icon name="map-marker" size={20} color="#fcba03" />
                </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={toggleOpen}>
                <View style={[styles.button, styles.pay]}>
                    {open ?
                        <Icon name="close" size={20} color="#fff" />
                        :
                        <Icon name="menu" size={20} color="#fff" />
                    }
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    containerss: {
        flex: 1,
    },
    label: {
        color: "#FFF",
        position: "absolute",
        fontSize: 18,
        backgroundColor: "transparent",
        width: 70,
        left: 10
    },
    button: {
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#333",
        shadowOpacity: 0.1,
        shadowOffset: { x: 2, y: 0 },
        shadowRadius: 2,
        borderRadius: 30,
        position: "absolute",
        bottom: 20,
        right: 20,
    },
    payText: {
        color: "#FFF",
    },
    pay: {
        backgroundColor: "#00B15E",
    },
    other: {
        backgroundColor: "#FFF",
    },
    background: {
        backgroundColor: "rgba(0,0,0,.2)",
        position: "absolute",
        width: 60,
        height: 60,
        bottom: 20,
        right: 20,
        borderRadius: 30,
    },
});