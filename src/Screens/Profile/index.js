import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Animated, Platform, ScrollView, ImageBackground, TouchableOpacity, StatusBar, ActivityIndicator, Image, StyleSheet, Alert, Linking, AsyncStorage } from 'react-native'
import { withTheme, Chip, Divider, Avatar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getEmployeeDetails } from '../../apis';
import { LinearGradient } from 'expo-linear-gradient';

const Profile = (props) => {
    const { route } = props
    const { colors } = props.theme;
    const { navigation } = props;
    const fadeAnim = useRef(new Animated.Value(0)).current
    const AnImage = Animated.createAnimatedComponent(Image)
    const AnText = Animated.createAnimatedComponent(Text)
    const AnImageBackground = Animated.createAnimatedComponent(ImageBackground)
    const offset = useRef(new Animated.Value(0)).current;
    const Header_Maximum_Height = 220;
    const Header_Minimum_Height = Platform.OS == 'ios' ? 90 : 100;
    const Content_Border_Radius = 30;
    const AnimatedHeaderValue = new Animated.Value(0);
    const [EmployDetails, setEmployDetails] = useState();
    const [isLoading, setIsLoading] = useState(true)

    const AnimatedImageWidth = AnimatedHeaderValue.interpolate({
        inputRange: [0, Header_Maximum_Height - Header_Minimum_Height],
        outputRange: [40, 0],
        extrapolate: 'clamp',
    });
    const AnimatedUserImageAfterScroll = AnimatedHeaderValue.interpolate({
        inputRange: [0, Header_Maximum_Height - Header_Minimum_Height],
        outputRange: [0, 50],
        extrapolate: 'clamp',
    });
    const AnimatedUserImageHeight = AnimatedHeaderValue.interpolate({
        inputRange: [0, Header_Maximum_Height - Header_Minimum_Height],
        outputRange: [70, -20],
        extrapolate: 'clamp',
    });
    const AnimateHeaderHeight = AnimatedHeaderValue.interpolate({
        inputRange: [0, Header_Maximum_Height - Header_Minimum_Height],
        outputRange: [Header_Maximum_Height, Header_Minimum_Height],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 2000,
            }
        ).start();
    }, [fadeAnim])


    const handleRefresh = () => {
        getEmployeeDetails({ employeeId: route && route.params && route.params.EmployeeId }).then((data) => {
            setEmployDetails(data && data.employee)
            setIsLoading(false)
        })
    }

    const {
        employeeId,
        employeeTag,
        employeeName,
        employeeSurname,
        employeeFather,
        employeeMother,
        employeeGender,
        employeeMaritalStatus,
        employeeSpouse,
        employeeCountryid,
        employeeBranchid,
        employeeSectionid,
        employeeGradeid,
        employeeDepartmentid,
        employeeSupervisorid,
        employeeBankid,
        employeeAccount_no,
        employeeDesignation,
        employeeJobDesc,
        employeeSourseHire,
        employeeSourceName,
        employeeJoindate,
        employeeWorkLocation,
        employeeSalary,
        employeeAllowance,
        employeeCode,
        employeePassst,
        employeeEmail,
        employeePersonalEmail,
        employeeDob,
        employeeAddress,
        employeeResiAddress,
        employeePhone,
        employeeHomePhone,
        employeeExtensionNo,
        employeeImage,
        employeeSignature,
        employeeAboutMe,
        employeeRemark,
        employeeAttendanceType,
        employeeImeiNo,
        employeeAttendanceAllowType,
        employeeDelreson,
        employeeDeldate,
        employeeCrdate,
        employeeCreatedUser,
        employeeLastupdate,
        employeeUpdatedUser,
        employeeLeaveflag,
        employeeStatus,
        employeeTrashstatus,
        departmentName,
        countryNationality,
        gradeName,
        branchName,
        sectionName,
        bankName,
        supervisorName,
        supervisorSurname,
        supervisorTag,
        createduser_name,
        updateduser_name,
        employeeImageUrl
    } = EmployDetails || ""


    useEffect(() => {
        handleRefresh()
    }, []);

    const GeneralInformation = ({ title, value }) => {
        return (
            <View style={styles.row}>
                <Text style={styles.propertyTitle}>{title}</Text>
                <Text>:  </Text>
                <Text selectable style={styles.propertyValue}>{value}</Text>
            </View>
        )
    }

    const PersonalInformation = ({ title, value }) => {
        return (
            <View style={styles.row}>
                <Text style={styles.propertyTitle}>{title}</Text>
                <Text>:  </Text>
                <Text selectable style={styles.propertyValue}>{value}</Text>
            </View>
        )
    }

    const CompanyInformation = ({ title, value }) => {
        return (
            <View style={styles.row}>
                <Text style={styles.propertyTitle}>{title}</Text>
                <Text>:  </Text>
                <Text selectable style={styles.propertyValue}>{value}</Text>
            </View>
        )
    }

    const AdditionalInformation = ({ title, value }) => {
        return (
            <View style={styles.row}>
                <Text style={styles.propertyTitle}>{title}</Text>
                <Text>:  </Text>
                <Text selectable style={styles.propertyValue}>{value}</Text>
            </View>
        )
    }

    const OtherInformation = ({ title, value }) => {
        return (
            <View style={styles.row}>
                <Text style={styles.propertyTitle}>{title}</Text>
                <Text>:  </Text>
                <Text selectable style={styles.propertyValue}>{value}</Text>
            </View>
        )
    }
    const BiometricInformation = ({ title, value }) => {
        return (
            <View style={styles.row}>
                <Text style={styles.propertyTitle}>{title}</Text>
                <Text>:  </Text>
                <Text selectable style={styles.propertyValue}>{value}</Text>
            </View>
        )
    }


    return (
        isLoading ?
            <View style={{ alignItems: "center", justifyContent: "center", flex: 1, bottom: "5%" }}>
                <ActivityIndicator color="green" size={45} style={{
                }} />
            </View>
            :
            <View>
                <ScrollView contentContainerStyle={{
                    paddingTop: Header_Maximum_Height - Content_Border_Radius,
                    zIndex: 9,
                    elevation: 3,
                    backgroundColor: '#ceffc9',
                }}
                    onScroll={Animated.event([
                        { nativeEvent: { contentOffset: { y: AnimatedHeaderValue } } },
                    ])}>
                    <View style={{
                        marginTop: 30,
                        backgroundColor: '#e8ffe6',
                        borderWidth: 2,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        borderColor: '#f2f2f2'
                    }}>

                        <View style={styles.sectionView}>

                            <View style={styles.base}>
                                <View style={styles.baseTop} />
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#00e600', '#008000']}
                                    // colors={['#f3f2ff', '#ceffc9']}
                                    style={styles.baseBottom}
                                >
                                    <Text style={styles.HeadlineText}>GENERAL INFORMATION</Text>
                                </LinearGradient>
                            </View>

                            <GeneralInformation
                                title={"Nationality"}
                                value={countryNationality}
                            />
                            <GeneralInformation
                                title={"Join Date"}
                                value={employeeJoindate}
                            />
                        </View>

                        <View style={styles.sectionView}>
                            <View style={styles.base}>
                                <View style={styles.baseTop} />
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#00e600', '#008000']}
                                    // colors={['#f3f2ff', '#ceffc9']}
                                    style={styles.baseBottom}
                                >
                                    <Text style={styles.HeadlineText}>PERSONAL INFORMATION</Text>
                                </LinearGradient>
                            </View>
                            {/* <Text style={styles.HeadlineText}>PERSONAL INFORMATION</Text> */}
                            <View>
                                <PersonalInformation
                                    title={"Gender"}
                                    value={employeeGender}
                                />
                                <PersonalInformation
                                    title={"Marital Status"}
                                    value={employeeMaritalStatus}
                                />
                                <PersonalInformation
                                    title={"Father's Name"}
                                    value={employeeFather}
                                />
                                <PersonalInformation
                                    title={"Mother's Name"}
                                    value={employeeMother}
                                />

                                {employeeMaritalStatus !== "single" ? <View style={styles.row}>
                                    <Text style={styles.propertyTitle}>Spouse</Text>
                                    <Text selectable style={styles.propertyValue}>:  {employeeSpouse}</Text>
                                </View> : <></>}

                                <PersonalInformation
                                    title={"DOB"}
                                    value={employeeDob}
                                />
                                <PersonalInformation
                                    title={"Home Address"}
                                    value={employeeResiAddress}
                                />
                                <PersonalInformation
                                    title={"Address"}
                                    value={employeeAddress}
                                />
                                <PersonalInformation
                                    title={"Bio"}
                                    value={employeeAboutMe}
                                />
                            </View>
                        </View>



                        <View style={styles.sectionView}>
                            <View style={styles.base}>
                                <View style={styles.baseTop} />
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#00e600', '#008000']}
                                    // colors={['#f3f2ff', '#ceffc9']}
                                    style={styles.baseBottom}
                                >
                                    <Text style={styles.HeadlineText}>COMPANY INFORMATION</Text>
                                </LinearGradient>
                            </View>

                            {/* <Text style={styles.HeadlineText}>COMPANY INFORMATION</Text> */}
                            <View>
                                <CompanyInformation
                                    title={"Branch"}
                                    value={branchName}
                                />
                                <CompanyInformation
                                    title={"Department"}
                                    value={departmentName}
                                />
                                <CompanyInformation
                                    title={"Section"}
                                    value={sectionName}
                                />
                                <CompanyInformation
                                    title={"Grade"}
                                    value={gradeName}
                                />
                                <CompanyInformation
                                    title={"Supervisor"}
                                    value={supervisorName}
                                />
                                <CompanyInformation
                                    title={"Designation"}
                                    value={employeeDesignation}
                                />
                                <CompanyInformation
                                    title={"Work Location"}
                                    value={employeeWorkLocation}
                                />
                                <CompanyInformation
                                    title={"Extension No."}
                                    value={employeeExtensionNo}
                                />
                                <CompanyInformation
                                    title={"Passport Status"}
                                    value={employeePassst}
                                />
                                <CompanyInformation
                                    title={"Job Description"}
                                    value={employeeJobDesc}
                                />
                            </View>
                        </View>

                        <View style={styles.sectionView}>
                            <View style={styles.base}>
                                <View style={styles.baseTop} />
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#00e600', '#008000']}
                                    // colors={['#f3f2ff', '#ceffc9']}
                                    style={styles.baseBottom}
                                >
                                    <Text style={styles.HeadlineText}>ADDITIONAL INFORMATION</Text>
                                </LinearGradient>
                            </View>
                            {/* <Text style={styles.HeadlineText}>ADDITIONAL INFORMATION</Text> */}
                            <View>
                                <AdditionalInformation
                                    title={"Created Date"}
                                    value={employeeCrdate}
                                />
                                <AdditionalInformation
                                    title={"Created User"}
                                    value={employeeCreatedUser}
                                />
                                <AdditionalInformation
                                    title={"Last Updated Date"}
                                    value={employeeLastupdate}
                                />
                                <AdditionalInformation
                                    title={"Last Updated User"}
                                    value={employeeUpdatedUser}
                                />

                            </View>
                        </View>

                        <View style={styles.sectionView}>
                            <View style={styles.base}>
                                <View style={styles.baseTop} />
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#00e600', '#008000']}
                                    // colors={['#f3f2ff', '#ceffc9']}
                                    style={styles.baseBottom}
                                >
                                    <Text style={styles.HeadlineText}>OTHER INFORMATION</Text>
                                </LinearGradient>
                            </View>
                            {/* <Text style={styles.HeadlineText}>OTHER INFORMATION</Text> */}
                            <View>
                                <OtherInformation
                                    title={"Source of hire"}
                                    value={employeeSourseHire}
                                />
                                <OtherInformation
                                    title={"Source Name"}
                                    value={employeeSourceName}
                                />

                            </View>
                        </View>

                        <View style={[styles.sectionView, { marginBottom: 20 }]}>
                            <View style={styles.base}>
                                <View style={styles.baseTop} />
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#00e600', '#008000']}
                                    // colors={['#f3f2ff', '#ceffc9']}
                                    style={styles.baseBottom}
                                >
                                    <Text style={styles.HeadlineText}>BIOMETRIC ATTENDANCE INFORMATION</Text>
                                </LinearGradient>
                            </View>
                            {/* <Text style={styles.HeadlineText}>BIOMETRIC ATTENDANCE INFORMATION</Text> */}
                            <View>

                                <BiometricInformation
                                    title={"Attendance Type"}
                                    value={employeeAttendanceType}
                                />
                                <BiometricInformation
                                    title={"IMEI No."}
                                    value={employeeImeiNo}
                                />
                                <BiometricInformation
                                    title={"Biomatric Image"}
                                    value={employeeImage}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Animated.View
                    style={[
                        {
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: '0%',
                            overflow: 'hidden',
                            elevation: 2,
                        },
                        {
                            height: AnimateHeaderHeight,
                        },
                    ]}>
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={['#fff', '#fff']}
                        // colors={['#f3f2ff', '#ceffc9']}
                        style={{
                            height: "100%", width: "100%",
                            borderRadius: 10, borderWidth: 1,
                            borderColor: "#ceffc9"
                        }}

                    >
                        <AnImageBackground
                            blurRadius={100
                            }
                            // source={{ uri: employeeImageUrl }}
                            style={{ height: "100%", width: "100%", resizeMode: 'contain', }} >

                            <View style={{ top: 50, left: 20 }}>
                                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{}} hitSlop={{ right: 20, left: 20, top: 20, bottom: 20 }} >
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignSelf: 'flex-end',
                                    top: -45, alignItems: 'center'
                                }}>
                                    <AnText
                                        style={{
                                            flex: 1,
                                            height: AnimatedUserImageAfterScroll,
                                            width: AnimatedUserImageAfterScroll,
                                            top: 20,
                                            textAlign: "right",
                                            marginRight: 60,
                                            fontSize: 20,
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {employeeName}
                                    </AnText>
                                    <AnImage
                                        source={{ uri: employeeImageUrl }}
                                        style={{ height: AnimatedUserImageAfterScroll, width: AnimatedUserImageAfterScroll, borderRadius: 40, right: 50, }} >
                                    </AnImage>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View>
                                        <AnImage
                                            source={{ uri: employeeImageUrl }}
                                            style={{ height: AnimatedUserImageHeight, width: AnimatedUserImageHeight, borderRadius: 40, left: 10, alignSelf: 'flex-end', marginTop: 20 }} >

                                        </AnImage>
                                        {/* {employeeTag ?
                                            <Text style={{
                                                fontSize: 13,
                                                fontWeight: 'bold',
                                                color: "#000",
                                                textAlign: 'center',
                                                left: 10,
                                                top: 5
                                            }}>ID : {employeeTag}</Text> : <></>} */}
                                    </View>
                                    <Animated.View style={{
                                        width: '70%',
                                        alignSelf: 'center',
                                        left: 25,
                                        transform: [{
                                            translateX: fadeAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [100, 0]
                                            }),
                                        }]
                                    }}>
                                        <Text style={{
                                            padding: 3,
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            color: colors.primary
                                        }}>{employeeName} {employeeSurname}</Text>
                                        {employeeCode ?
                                            <Text style={{
                                                padding: 3,
                                                fontSize: 13,
                                                fontWeight: 'bold',
                                                color: "#000"
                                            }}>
                                                Labour Code : {employeeCode}</Text> : <></>
                                        }
                                        {employeeEmail ?
                                            <TouchableOpacity onPress={() => {
                                                Linking.openURL(`mailto://${employeeEmail}`)
                                            }}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignContent: 'center',
                                                    alignItems: 'center'
                                                }}>

                                                    <MaterialCommunityIcons
                                                        name='email-outline'
                                                        size={13}
                                                        color={"red"}></MaterialCommunityIcons>
                                                    <Text style={{
                                                        paddingVertical: 3,
                                                        fontSize: 15,
                                                        fontWeight: 'bold',
                                                        color: "#991f00"
                                                    }}> :  {employeeEmail}</Text>
                                                </View></TouchableOpacity> : <></>}
                                        {employeePersonalEmail ?
                                            <TouchableOpacity onPress={() => {
                                                Linking.openURL(`mailto://${employeePersonalEmail}`)
                                            }}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    <MaterialCommunityIcons
                                                        name='email-variant'
                                                        size={13}
                                                        color={"red"}
                                                    >
                                                    </MaterialCommunityIcons>
                                                    <Text style={{

                                                        fontSize: 15,
                                                        fontWeight: 'bold',
                                                        color: "#991f00"
                                                    }}> :  {employeePersonalEmail}</Text>
                                                </View></TouchableOpacity> : <></>}
                                        {employeePhone ?
                                            <TouchableOpacity style={{
                                                paddingVertical: 3,
                                                flexDirection: 'row',
                                                alignContent: 'center',
                                                alignItems: 'center'
                                            }}
                                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                onPress={() => {
                                                    Linking.openURL(`tel:${employeePhone}`)
                                                }}>

                                                <Ionicons name='call-outline' size={13} color={"#0059b3"}></Ionicons>
                                                <Text style={{
                                                    fontSize: 15,
                                                    fontWeight: 'bold',
                                                    color: "#0059b3"
                                                }}> :  {employeePhone}</Text>
                                            </TouchableOpacity> : <></>}
                                        {employeeHomePhone ?
                                            <TouchableOpacity style={{
                                                flexDirection: 'row',
                                                alignContent: 'center',
                                                alignItems: 'center'
                                            }}
                                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                onPress={() => {
                                                    Linking.openURL(`tel:${employeeHomePhone}`)
                                                }}>
                                                <MaterialCommunityIcons name='home-circle-outline' size={13} color={"#0059b3"}></MaterialCommunityIcons>
                                                <Text style={{
                                                    fontSize: 15,
                                                    fontWeight: 'bold',
                                                    color: "#0059b3"
                                                }}> :  {employeeHomePhone}</Text>

                                            </TouchableOpacity>
                                            : <></>}
                                    </Animated.View>
                                </View>

                            </View>
                        </AnImageBackground>
                    </LinearGradient>

                </Animated.View>
            </View>

    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        padding: 8,
    },
    propertyTitle: {
        fontSize: 13,
        color: '#000000',
        width: '40%',
    },
    propertyValue: {
        fontSize: 14,
        color: '#000000',
        width: '50%',
    },
    HeadlineText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    sectionView: {
        padding: 10,
        backgroundColor: "#fff",
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 10
    },
    ProfileCircle: {
        width: 200,
        height: 60,
        borderLeftWidth: 5,
        borderLeftColor: "#008a47",
        borderRightWidth: 5,
        borderRightColor: "transparent",
        borderTopWidth: 5,
        borderTopColor: "#008a47",
        borderRadius: 55,
        borderBottomWidth: 5,
        borderBottomColor: "#008a47",
        alignSelf: "center",
        top: "7%"
    },



    base: {
    },

    baseTop: {
        borderLeftWidth: 30,
        borderLeftColor: "#008000",
        borderTopWidth: 20,
        borderBottomWidth: 20,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        left: "64.4%",
        width: 0,
        position: "absolute",
        // top: "-9%"

    },

    baseBottom: {
        height: 40,
        width: "64.5%",
        justifyContent: "center"
    },

})

export default withTheme(Profile)

