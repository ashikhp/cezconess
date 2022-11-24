import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Button, withTheme, Snackbar, Colors } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as Notifications from 'expo-notifications';
import { Context } from '../../store';
import { Login } from '../../apis';
import DialogWithLoadingIndicator from "../../components/progressIndicator";

const LoginScreen = (props) => {
  const { colors } = props.theme;
  const { navigation } = props;
  const [state, dispatch] = useContext(Context);
  const [isloading, SetIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, SetPassword] = useState('');
  const [secureTextEntry, setsecureTextEntry] = useState(true);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 0;



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


  const login = () => {
    if (email === '' || password === '') {
      setErrorMessage('Enter username and password');
      setSnackbarVisible(true);
    } else {
      SetIsLoading(true);
      const loginData = {
        "username": email,
        "password": password,
        "userpushtoken": expoPushToken
      }
      Login(loginData).then((res) => {
        SetIsLoading(false);
        if (res.data.login_status === 1) {
          setEmail("")
          SetPassword("")
          dispatch({ type: 'SET_SESSION', payload: res.data.login_data });
          props.navigation.navigate('Dashboard');
          try {
            AsyncStorage.setItem('sessionData', JSON.stringify(res.data.login_data)
            );
          } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
          }


        }
        else {
          setErrorMessage("incorrect login details");
          setSnackbarVisible(true);
          SetIsLoading(false);
          dispatch({ type: 'SET_SESSION', payload: null });
          setError(true);
        }
      })
        .catch(() => {
          SetIsLoading(false);
          dispatch({ type: 'SET_SESSION', payload: null });
          setError(true);
        });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <LinearGradient colors={[colors.primary, "#fff", "#fff"]} style={{ flex: 1 }}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <View style={styles.header}>

          <Text style={styles.text_header}>CEZCON HRM ESS</Text>
        </View>

        <Animatable.View animation="fadeInUpBig" style={[styles.footer]}>
          <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../../assets/log.png")}
                style={{
                  width: 150,
                  height: 130,
                  resizeMode: "contain",
                  bottom: 10,
                }}
              ></Image>
            </View>
            <Text
              style={[
                styles.text_footer,
                {
                  color: colors.primary,
                },
              ]}
            >
              Username
            </Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color={colors.primary} size={20} />
              <TextInput
                placeholder="Enter your username"
                placeholderTextColor="#666666"
                style={[
                  styles.textInput,
                  {
                    color: colors.primary,
                  },
                ]}
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
                value={email}
                underlineColorAndroid="transparent"
              />
            </View>

            <Text
              style={[
                styles.text_footer,
                {
                  color: colors.primary,
                  marginTop: 25,
                },
              ]}
            >
              Password
            </Text>
            <View style={styles.action}>
              <Feather name="lock" color={colors.primary} size={20} />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#666666"
                style={[
                  styles.textInput,
                  {
                    color: colors.primary,
                  },
                ]}
                autoCapitalize="none"
                onChangeText={(text) => SetPassword(text)}
                value={password}
                underlineColorAndroid="transparent"
                secureTextEntry={secureTextEntry}
              />

              <TouchableOpacity
                hitSlop={styles.hitSlop}
                onPress={() => {
                  setsecureTextEntry(!secureTextEntry);
                }}
              >
                {secureTextEntry ? (
                  <Feather name="eye-off" color="grey" size={20} />
                ) : (
                  <Feather name="eye" color={colors.primary} size={20} />
                )}
              </TouchableOpacity>
            </View>
            {/* 
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}
            >
              <Text style={{ color: "#002F99", marginTop: 15 }}>
                Forgot Password?
              </Text>
            </TouchableOpacity> */}


            <LinearGradient
              colors={["#b2edc0", colors.primary]}
              style={[styles.button, { flex: 1, borderRadius: 10, bottom: 10 }]}
            >
              <TouchableOpacity
                onPress={() => {
                  login();
                }}
                style={[styles.signIn]}
              >
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: "#fff",
                    },
                  ]}
                >
                  Login
                </Text>

              </TouchableOpacity>
              {isloading && (
                <View style={styles.row}>
                  <DialogWithLoadingIndicator visible title="Wait..." />
                </View>
              )}
            </LinearGradient>
            {/* <TouchableOpacity>
              <Text style={{ textAlign: "center", opacity: 0.5 }}>
                Login with OTP
              </Text>
            </TouchableOpacity> */}

          </ScrollView>
        </Animatable.View>
        <Snackbar
          style={{
            backgroundColor: "white",
            bottom: 20,
            width: "90%",
            alignSelf: "center",
          }}
          visible={snackbarVisible}
          duration={2000}
          onDismiss={() => setSnackbarVisible(false)}
          theme={{
            colors: { accent: "red", surface: colors.primary },
          }}
          action={{
            label: "Retry",
            onPress: () => { },
          }}
        >
          {errorMessage}
        </Snackbar>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default withTheme(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#26af4c"
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
    alignSelf: "center",
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: -10,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    marginTop: 0,
    color: "#05375a",
  },

  button: {
    alignItems: "center",
    marginTop: 35,
  },
  signIn: {
    width: "100%",
    height: 50,
    alignItems: "center",
    borderRadius: 10,
  },
  errorContainer: {
    width: "100%",
    marginTop: 30,
  },
  error: {
    alignSelf: "center",
    textAlign: "left",
    marginLeft: 20,
    paddingLeft: 50,
    paddingRight: 50,
    color: "red",
  },
  hitSlop: {
    top: 20,
    bottom: 20,
    left: 50,
    right: 50,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },
});
