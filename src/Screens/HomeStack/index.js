import React, { useState, useEffect, useContext } from "react";
import { View, Text, AsyncStorage, Alert, TouchableOpacity } from "react-native";
import { Button, Menu, Divider, Provider, withTheme, ActivityIndicator } from "react-native-paper";
import { NavigationContainer, DrawerActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import _ from "lodash";


import LoginScreen from "../Login";
import Dashboard from "../Dashboard";
import Settings from "../Settings";
import Attendance from "../Attendance/Attendance";
import ChangePassword from "../ChangePassword";
import Signature from "../Signature";
import { Context } from "../../store";
import Details from "../Details/Index";
import Profile from "../Profile";
import EssMapView from "../EssMapView/EssMapView"

const Stack = createStackNavigator();

function App(props) {
  const { colors } = props.theme;
  const { navigation } = props;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [state, dispatch] = useContext(Context);
  const [appLoaded, setAppLoaded] = useState(false);


  function DummyLoader({ navigation }) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View >
    );

  }

  function BackButton({ navigation }) {
    return (
      <View style={{ paddingLeft: 10, flexDirection: "row", alignItems: 'center' }}>
        <Ionicons
          name="chevron-back-sharp"
          size={22}
          color={colors.primary}
          style={{ left: 10 }}
          onPress={() => props.navigation.goBack()}>
        </Ionicons>
      </View>
    )
  }


  useEffect(() => {
    AsyncStorage.getItem('sessionData', (err, result) => {
      if (
        result &&
        _.isEmpty(result) === false &&
        JSON.parse(result) &&
        JSON.parse(result).userId
      ) {
        setIsLoggedin(true);
      } else {
        setIsLoggedin(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!state.sessionData) {
      setIsLoggedin(false);
    } else {
      setIsLoggedin(true);
    }
  }, [state.sessionData]);



  setTimeout(() => {
    setAppLoaded(true);
  }, 2000);

  return (
    <Stack.Navigator>
      <>
        {!appLoaded && (
          <Stack.Screen
            name="DummyLoader"
            options={{ headerShown: false }}
            component={DummyLoader}
          />
        )}

        {!isLoggedin && (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}

        {isLoggedin && (
          <>
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{
                title: "ESS",
                headerShown: false,
                headerStyle: {
                  backgroundColor: "#fff",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  color: colors.primary,
                  fontWeight: "bold",
                  textAlign: "center"
                },
                headerLeft: () => null
              }}
            />
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={({ route }) => ({
                // title: route.params.title,
                headerStyle: {
                  backgroundColor: "#fff",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  color: colors.primary,
                  fontWeight: "bold",
                },
                headerLeft: () => (
                  <BackButton {...props} />
                )
              })}

            />
            <Stack.Screen
              name="Attendance"
              component={Attendance}
              options={({ route }) => ({
                // headerShown: false,
                // title: route.params.title,
                headerStyle: {
                  backgroundColor: "#fff",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  color: colors.primary,
                  fontWeight: "bold",
                },
                headerLeft: () => (
                  <BackButton {...props} />
                )
              })}

            />
            <Stack.Screen
              name="Details"
              component={Details}
              options={({ route }) => ({
                // title: route.params.title,
                headerStyle: {
                  backgroundColor: "#fff",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  color: colors.primary,
                  fontWeight: "bold",
                },
                headerLeft: () => (
                  <BackButton {...props} />
                )
              })}

            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePassword}
              options={({ route }) => ({
                // title: route.params.title,
                headerStyle: {
                  backgroundColor: "#fff",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  color: colors.primary,
                  fontWeight: "bold",
                },
                headerLeft: () => (
                  <BackButton {...props} />
                )
              })}

            />

            <Stack.Screen
              name="Signature"
              component={Signature}
              options={({ route }) => ({
                headerStyle: {
                  backgroundColor: "#fff",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  color: colors.primary,
                  fontWeight: "bold",
                },
                headerLeft: () => (
                  <BackButton {...props} />
                )
              })}

            />

            <Stack.Screen
              name="Profile"
              component={Profile}
              options={({ route }) => ({
                // title: route.params.title,
                headerStyle: {
                  backgroundColor: "#fff",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  color: colors.primary,
                  fontWeight: "bold",
                },
                headerLeft: () => (
                  <BackButton {...props} />
                )
              })}

            />
            <Stack.Screen
              name="EssMapView"
              component={EssMapView}
              options={({ route }) => ({
                title: "Location",
                headerStyle: {
                  backgroundColor: "#fff",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  color: colors.primary,
                  fontWeight: "bold",
                },
                headerLeft: () => (
                  <BackButton {...props} />
                )
              })}

            />

          </>
          )
        }  
      </>
    </Stack.Navigator >
  );
}

export default withTheme(App);

