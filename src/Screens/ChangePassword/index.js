import React, { useState, useContext } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, withTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from '@rneui/themed';
import DialogWithLoadingIndicator from "../../components/progressIndicator";
import { ResetPassword } from '../../apis';
import { Context } from "../../store";

var Message = require("../../utils/message.js");

const ChangePassword = (props) => {

  const { colors } = props.theme;
  const [state, dispatch] = useContext(Context)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [secureTextEntry, setsecureTextEntry] = useState(true);
  const [secureTextEntry1, setsecureTextEntry1] = useState(true);
  const [secureTextEntry2, setsecureTextEntry2] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  const update_password = () => {

    if (currentPassword === '' || newPassword === '' || confirmNewPassword === '') {
      Message.message("Error!", "Fill all fields", "danger")
    } else if (newPassword != confirmNewPassword) {
      Message.message("Error!", "Password mismatch", "danger")
    }

    else {
      setIsDisabled(true)
      AsyncStorage.getItem("sessionData", (err, result) => {
        const ses_data = JSON.parse(result);
        const passwordData = {
          userCurrentPassword: currentPassword,
          userNewPassword: newPassword
        };
        ResetPassword(passwordData).then((data) => {
          setIsDisabled(false)
          if (data.status === "1") {
            Message.message("Success!", data.msg, "success")
          } else {
            Message.message("Error!", data.msg, "danger")
          }
        });
      });
    }
  }



  return (
    <View style={styles.container}>

      <TextInput
        placeholder={'Enter your current password'}
        selectTextOnFocus
        value={currentPassword}
        secureTextEntry={secureTextEntry}
        theme={{ colors: { primary: colors.primary, underlineColor: 'transparent' } }}
        onChangeText={(value) => {
          setCurrentPassword(value);
        }}
        style={{
          width: '100%',
          backgroundColor: 'white',
          marginTop: 10,
        }}
      />
      <View style={{ marginLeft: 300, marginTop: -35 }}>
        <TouchableOpacity
          hitSlop={styles.hitSlop}
          onPress={() => {
            setsecureTextEntry(!secureTextEntry);
          }}
        >
          {secureTextEntry ? (
            <Ionicons
              style={styles.iconStyle}
              name="ios-eye-off"
              size={25}
              color="grey"
            />
          ) : (
            <Ionicons
              style={styles.iconStyle}
              name="ios-eye"
              size={25}
              color="grey"
            />
          )}
        </TouchableOpacity>

      </View>
      <TextInput
        placeholder={'Enter new password'}
        value={newPassword}
        secureTextEntry={secureTextEntry1}
        theme={{ colors: { primary: colors.primary, underlineColor: 'transparent' } }}
        onChangeText={(value) => {
          setNewPassword(value);
        }}
        style={{
          width: '100%',
          backgroundColor: 'white',
          marginTop: 20,
        }}
      />
      <View style={{ marginLeft: 300, marginTop: -35 }}>
        <TouchableOpacity
          hitSlop={styles.hitSlop}
          onPress={() => {
            setsecureTextEntry1(!secureTextEntry1);
          }}
        >
          {secureTextEntry1 ? (
            <Ionicons
              style={styles.iconStyle}
              name="ios-eye-off"
              size={25}
              color="grey"
            />
          ) : (
            <Ionicons
              style={styles.iconStyle}
              name="ios-eye"
              size={25}
              color="grey"
            />
          )}
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder={'Confirm password'}
        selectTextOnFocus
        secureTextEntry={secureTextEntry2}
        value={confirmNewPassword}
        theme={{ colors: { primary: colors.primary, underlineColor: 'transparent' } }}
        onChangeText={(value) => {
          setConfirmNewPassword(value);
        }}
        style={{
          width: '100%',
          backgroundColor: 'white',
          marginVertical: 20,
        }}
      />
      <View style={{ marginLeft: 300, marginTop: -55 }}>
        <TouchableOpacity
          hitSlop={styles.hitSlop}
          onPress={() => {
            setsecureTextEntry2(!secureTextEntry2);
          }}
        >
          {secureTextEntry2 ? (
            <Ionicons
              style={styles.iconStyle}
              name="ios-eye-off"
              size={25}
              color="grey"
            />
          ) : (
            <Ionicons
              style={styles.iconStyle}
              name="ios-eye"
              size={25}
              color="grey"
            />
          )}
        </TouchableOpacity>

        {isDisabled && (
          <View >
            <DialogWithLoadingIndicator visible title="Wait..." />
          </View>
        )}
      </View>
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Button
          containerStyle={styles.saveButtonContainer}
          onPress={() => { update_password() }}
          color="green">UPDATE</Button>


      </View>
    </View>
  );
}
export default withTheme(ChangePassword);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  errorcontainer: {
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  saveButtonContainer: {
    backgroundColor: "#fff",
    width: 300,
    padding: 10,
    marginBottom: 10,
    marginTop: 30,

  },
  saveButtonText: {
    color: "#fff",
  },

  iconStyle: {
    marginTop: -10,
    textAlign: 'right',
    marginRight: 10,
  },
  hitSlop: {
    top: 20,
    bottom: 20,
    left: 50,
    right: 50,
  },
});

