import React, { useContext, useState, useEffect } from 'react';
import SignatureScreen from 'react-native-signature-canvas';
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import { withTheme, Card, Title, Snackbar } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DialogWithLoadingIndicator from "../../components/progressIndicator";
import { UserSignature } from '../../apis';
import { UpdateSignature } from '../../apis';
import { Context } from "../../store";

var Message = require("../../utils/message.js");

const Signature = (props) => {


    const { colors } = props.theme;
    const [state, dispatch] = useContext(Context)
    const [signature, setsignature] = useState(null)
    const [baseUrl, setbaseUrl] = useState()
    const [isloading, setisloading] = useState(false)


    useEffect(() => {
        AsyncStorage.getItem("sessionData", (err, result) => {
            const ses_data = JSON.parse(result);
            setbaseUrl(ses_data.uploads_folder_name)
        });
    }, [])

    useEffect(() => {
        setisloading(true)
        UserSignature().then((data) => {
            setisloading(false)
            setsignature(data.signature)
        })
    }, [])



    const handleSignature = (signature) => {
        setisloading(true);
        UpdateSignature({ userSignature: signature })
            .then((res) => {
                UserSignature().then((data) => {
                    setsignature(data.signature)
                    if (res.status === "1") {
                        Message.message("Success!", res.msg, "success")
                    } else {
                        Message.message("Error!", "Something Went Wrong", "danger")
                    }
                })
                setisloading(false);
            })
            .catch((err) => {
                setisloading(false);
                console.log(err);
            });
    };

    const handleEmpty = () => {
        console.log('Empty');
    };

    const style = `.m-signature-pad--footer
    .button {
      background-color: ${colors.primary};;
      color: ${"#fff"};
      font-size: 13px;
      font-weight: 600;
    }`;

    return (
        <View style={{ flex: 1 }}>

            {signature ? (
                <Card style={{ marginBottom: 10 }}>
                    <Card.Title titleStyle={{ color: colors.primary, fontSize: 16 }} title="Current Signature" />

                    <Card.Content>
                        <Image
                            resizeMode={'contain'}
                            style={{ width: 335, height: 120 }}
                            source={{
                                uri: `${baseUrl}User_Signature/${signature}`
                            }}
                        />
                    </Card.Content>
                </Card>
            ) : null}
            <View style={{ width: "100%", backgroundColor: "#fff", height: 45, padding: 10 }}>

                <Text style={{ color: colors.primary, fontSize: 16 }}>To upload new signature sign here</Text>
            </View>
            <SignatureScreen
            onOK={handleSignature}
            onEmpty={handleEmpty}
            descriptionText=""
            clearText={"CLEAR"}
            confirmText={"UPDATE"}
            webStyle={style}
        />
            {isloading && (
                <View >
                    <DialogWithLoadingIndicator visible title="Wait..." />
                </View>
            )}
        </View>

    )
}


export default withTheme(Signature);
