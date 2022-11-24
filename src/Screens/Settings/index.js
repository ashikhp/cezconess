import { View, Text, TouchableOpacity, Platform, Alert, Image } from 'react-native'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { Card, List, Avatar, IconButton, Title, Button, TextInput, ActivityIndicator, withTheme } from 'react-native-paper'
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Constants from "expo-constants";
import * as Notifications from 'expo-notifications';
import { LinearGradient } from 'expo-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import Lightbox from "react-native-lightbox";
import DialogWithLoadingIndicator from "../../components/progressIndicator";
import { Context } from "../../store";
import { Logout } from '../../apis';
import { ChangeUserName } from '../../apis';

var Message = require("../../utils/message.js");

const Settings = (props) => {

    const { colors } = props.theme;
    const changeUserName = useRef('');
    const [state, dispatch] = useContext(Context)
    const [expoPushToken, setExpoPushToken] = useState("");
    const [isloading, SetIsLoading] = useState(false);
    const [userName, setuserName] = useState();
    const [currentUserName, setCurrentUserName] = useState();
    const [userImage, setuserImage] = useState()
    const [baseUrl, setbaseUrl] = useState()


    useEffect(() => {
        AsyncStorage.getItem("sessionData", (err, result) => {
            const ses_data = JSON.parse(result);
            setCurrentUserName(ses_data.userName)
            setuserImage(ses_data.userImage)
            setbaseUrl(ses_data.uploads_folder_name)
        });
    }, [])


    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => {
            setExpoPushToken(token);
        });
    }, []);


    async function registerForPushNotificationsAsync() {
        let token;
        if (Constants.isDevice) {
            const {
                status: existingStatus,
            } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
        }
        return token;
    }

    const userLogout = async () => {
        try {
            await AsyncStorage.removeItem("sessionData");
        } catch (error) {
        }
    };

    const logout = () => {
        SetIsLoading(true);
        const logoutData = {
            "token": expoPushToken
        }
        Logout(logoutData).then((res) => {
            userLogout();
            SetIsLoading(false);
            dispatch({ type: 'SET_SESSION', payload: null })
        })
            .catch(() => {
                SetIsLoading(false);
                dispatch({ type: 'SET_SESSION', payload: null });
            });

    }


    const updateUserName = () => {
        changeUserName.current.close()
        SetIsLoading(true)
        AsyncStorage.getItem("sessionData", (err, result) => {
            const ses_data = JSON.parse(result);
            const updateNameData = {
                "userName": userName,
            }
            ChangeUserName(updateNameData).then((data) => {
                SetIsLoading(false)
                if (data.status === "1" && data.user_data != "") {
                    dispatch({ type: 'SET_SESSION', payload: data.user_data });
                    setCurrentUserName(data.user_data && data.user_data.userName)
                    Message.message("Success!", data.msg, "success")
                    try {
                        AsyncStorage.setItem('sessionData', JSON.stringify(data.user_data));
                    } catch (error) {
                        console.error('AsyncStorage error: ' + error.message);
                    }
                }
                else {
                    Message.message("Error!", "Something Went Wrong", "danger")
                }
            })
        })
    }


    return (


        <View style={{ flex: 1 }}>

            <LinearGradient
                colors={[colors.primary, "#fff"]}

                style={{ width: "100%", height: "30%", justifyContent: "center", alignItems: "center" }}>

                <Lightbox underlayColor="white"
                    renderContent={() => {
                        return (
                            <Image
                                style={{ height: "100%", width: "100%", alignSelf: 'center' }}
                                resizeMode="contain"
                                source={{
                                    uri: `${baseUrl}User/${userImage}`
                                }}
                            />
                        )
                    }}
                >
                    <View style={{ alignSelf: "center", backgroundColor: "#fff", borderRadius: 50, height: 100 }}>
                        <Image
                            style={{ height: 80, width: 100, top: 5 }}
                            resizeMode={"contain"}
                            source={{
                                uri: `${baseUrl}User/${userImage}`
                            }}
                        />
                    </View>
                </Lightbox>
                <View style={{ marginBottom: Platform.OS === "ios" ? 25 : 50, marginTop: 5 }}>

                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>{currentUserName}</Text>
                </View>
            </LinearGradient>
            <View style={{ alignItems: 'center' }}>
                <Card style={{ marginTop: -60, width: "90%", borderRadius: 30 }}>

                    <Card.Content style={{ backgroundColor: '#fff', borderRadius: 30 }}>
                        <List.Item
                            onPress={() => {
                                setuserName(currentUserName)
                                changeUserName.current.open();
                            }}
                            title={"Change Name"}
                            left={(props) => (
                                <List.Icon
                                    {...props}
                                    icon="account-edit-outline"
                                    color={colors.primary}
                                />
                            )}
                            right={(props1) => <IconButton {...props1} icon="arrow-right" />}
                        />
                    </Card.Content>
                </Card>


                <Card style={{
                    marginTop: 10,
                    width: "90%",
                    borderRadius: 30
                }}>
                    <Card.Content style={{ backgroundColor: '#fff', borderRadius: 30 }}>
                        <List.Item
                            onPress={() => { props.navigation.navigate("ChangePassword", { title: "change password" }) }}
                            title={"Change Password"}
                            left={(props) => (
                                <List.Icon
                                    {...props}
                                    icon="account-lock-outline"
                                    color={colors.primary}
                                />
                            )}
                            right={(props1) => <IconButton {...props1} icon="arrow-right" />}
                        />
                    </Card.Content>
                </Card>

                <Card style={{
                    marginTop: 10,
                    width: "90%",
                    borderRadius: 30
                }}>
                    <Card.Content style={{ backgroundColor: '#fff', borderRadius: 30 }}>
                        <List.Item
                            onPress={() => { props.navigation.navigate("Signature", { title: "change signature" }) }}
                            title={"Upload Signature"}
                            left={(props) => (
                                <List.Icon
                                    {...props}
                                    icon="fingerprint"
                                    color={colors.primary}
                                />
                            )}
                            right={(props1) => <IconButton {...props1} icon="arrow-right" />}
                        />
                    </Card.Content>
                </Card>
            </View>


            <RBSheet
                ref={changeUserName}
                height={200}
                openDuration={250}
                customStyles={{
                    container: {},
                }}
                closeOnDragDown={true}
            >
                <View
                    style={{
                        height: 450,
                        backgroundColor: "white",
                        borderTopEndRadius: 12,
                        borderTopLeftRadius: 12,
                        padding: 10,
                    }}
                >
                    <Title>Enter your name</Title>
                    <TextInput
                        autoFocus={true}
                        selectTextOnFocus
                        value={userName}
                        theme={{ colors: { primary: colors.primary, underlineColor: 'transparent' } }}
                        onChangeText={(value) => {
                            setuserName(value)
                        }}
                        style={{
                            width: '100%',
                            backgroundColor: "#fff",
                        }}
                    />
                    <View style={{ flexDirection: 'row', marginLeft: '50%' }}>
                        <Button
                            mode="text"
                            onPress={() => changeUserName.current.close()}
                        >

                            <Text style={{ color: colors.primary }}>Cancel</Text>
                        </Button>
                        <Button
                            mode="text"
                            disabled={userName === '' ? true : false}
                            onPress={updateUserName}

                        >
                            <Text style={{ color: userName === "" ? "grey" : colors.primary }}>Update</Text>
                        </Button>
                    </View>
                </View>

            </RBSheet>



            <View style={{ flex: 1 }}>

            </View>
            <TouchableOpacity
                style={{
                    alignSelf: 'baseline',
                    width: '100%',
                    backgroundColor: colors.primary,
                    padding: Platform.OS === "ios" ? 20 : 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
                onPress={() => {
                    logout()
                }}
            >
                <FontAwesome
                    name="sign-out"
                    color={"#fff"}
                    size={15}
                    style={{ transform: [{ rotateY: '180deg' }], marginRight: 15, marginTop: 5 }}
                />
                <Text style={{
                    fontSize: 18,
                    color: "#fff",
                    marginRight: 10,
                    fontWeight: 'bold'
                }}>Sign out</Text>
            </TouchableOpacity>

            {isloading && (
                <View >
                    <DialogWithLoadingIndicator visible title="Wait..." />
                </View>
            )}
        </View>
    )
}
export default withTheme(Settings);