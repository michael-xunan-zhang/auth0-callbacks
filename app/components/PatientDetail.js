import React, { Component } from 'react';
import { Text, View, Image,Button, StyleSheet, Picker, FlatList, ListView, TouchableHighlight, Linking, Alert, AppState } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
//import api_call from '../api/api';
import Login from '../auth/Login';
import _ from "lodash";
import { Card, FormLabel, FormInput, TextInput } from "react-native-elements";
import {
    StackNavigator,
    TabNavigator,
    SwitchNavigator,
    NavigationActions
  } from "react-navigation";
const url = "http://10.50.130.42:8000/api/get-callbacks-data"
const url2 = "http://10.50.130.42:8000/api/get-callbacks-provider-summary-data"


class PatientDetail extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: "PatientDetail",
      });

    constructor() {
        super();
        //const { params } = this.props.navigation.state;
        this.state = {
            patientData: []
        };


    }

    _onDialer = (phoneNumber) => {
        Linking.canOpenURL('DoximityDialer:').then(supported => {
            console.log(`Open url works`)
            //Linking.openURL('DoximityDialer://call?targetNumber=#0 5103502600'
            Linking.openURL('DoximityDialer:///call?targetNumber='+phoneNumber
        )}).catch(error => {
            console.log(`An error has occured: ${error}`)
        })
      }

      api_call(token, expiresIn, view) {
        //console.log(token)
        fetch(url, {
            method: 'GET',
            headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,        
          }) 
        })
        .then(response => response.json())
        .then(response => {
          console.log(response)
          fetch(url2, {
            method: 'GET',
            headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,        
            }) 
          })
          .then(response2 => response2.json())
          .then(response2 => {
            console.log(response2)
  

            const setParamsAction1 = NavigationActions.setParams({
                params: {
                        accessToken: this.props.navigation.state.params.accessToken,
                        data: response,
                        data2: response2,
                        AttendingProvider: this.props.navigation.state.params.AttendingProvider,
                        expiresIn: this.props.navigation.state.params.expiresIn,
                        loginTime: this.props.navigation.state.params.loginTime,
                        //default_dropdown_value: this.props.navigation.state.params.selected_dropdown_value
                        default_dropdown_value: "All"
                      },
                key: "Main"
              })
            this.props.navigation.dispatch(setParamsAction1)

            const setParamsAction2 = NavigationActions.setParams({
                params: {
                        accessToken: this.props.navigation.state.params.accessToken,
                        data: response,
                        data2: response2,
                        AttendingProvider: this.props.navigation.state.params.AttendingProvider,
                        expiresIn: this.props.navigation.state.params.expiresIn,
                        loginTime: this.props.navigation.state.params.loginTime,
                        //default_dropdown_value: this.props.navigation.state.params.selected_dropdown_value
                        default_dropdown_value: "All"
                      },
                key: "HighRisks"
              })
            this.props.navigation.dispatch(setParamsAction2)

            const setParamsAction3 = NavigationActions.setParams({
                params: {
                        accessToken: this.props.navigation.state.params.accessToken,
                        data: response,
                        data2: response2,
                        AttendingProvider: this.props.navigation.state.params.AttendingProvider,
                        expiresIn: this.props.navigation.state.params.expiresIn,
                        loginTime: this.props.navigation.state.params.loginTime,
                        //default_dropdown_value: this.props.navigation.state.params.selected_dropdown_value
                        default_dropdown_value: "All"
                      },
                key: "Analytics"
              })
            this.props.navigation.dispatch(setParamsAction3)

            Alert.alert("Success!")

            const navigateAction = NavigationActions.navigate({
              routeName: view,
              //params: {token: "dsfsdfsd"},
              action: NavigationActions.navigate({ routeName: view }),
            });
            this.props.navigation.dispatch(navigateAction);
  
  
          })     
  
        })
        .catch((error) => {
            console.error(error);
        });
        console.log(this.state.data)
    } 

    checkIfTokenHasExpired() {
        var expiresIn = this.props.navigation.state.params.expiresIn;
        var loginTime = this.props.navigation.state.params.loginTime;
        diff = (new Date().getTime() - loginTime.getTime())/1000
        console.log(expiresIn)
        console.log(loginTime)
        console.log(diff)
        if (diff > expiresIn) {
            //Alert.alert("Your session token has expired! Please log in again!")     
            this.props.navigation.navigate("SignedOut")
        }          
    }

    handleAppStateChange = (nextAppState) => {
        console.log("here...")
        console.log(nextAppState)
        this.checkIfTokenHasExpired();
    }


    componentDidMount() {
        var loginTime = this.props.navigation.state.params.loginTime;
        var expiresIn = this.props.navigation.state.params.expiresIn;

        //check if app state changes:
        AppState.addEventListener('change', this.handleAppStateChange);
        //check if url scheme jump:
        Linking.getInitialURL().then((ev) => {
          console.log(ev)
          if (ev != null) {
            this.handleOpenURL(ev);
          }
        }).catch(err => {
            console.warn('An error occurred', err);
        });

        //check if token has expired
        this.checkIfTokenHasExpired();

        const { params } = this.props.navigation.state;
        console.log(params)
        // var data = this.props.navigation.state.data;
        this.setState({
            patientData: params.patientData
        })
    }

    componentWillUnmount() {
        console.log("component will unmount?")
        Linking.removeEventListener('url', this.handleOpenURL)
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    render() {
        console.log(this.state.patientData.AttendingProvider)
        back = '<Back'
        return (
            // <View>
            // <TouchableHighlight 
            //     style ={{
            //         height: 40,
            //         width: 60,
            //         //borderRadius:10,
            //         backgroundColor : "white",
            //         marginLeft : 0,
            //         //marginRight:50,
            //         marginTop : 0,
            //         //flexDirection: "row"
            //     }}>
            //     <Button 
            //     onPress={() => {
            //         this.props.navigation.navigate("Main")
            //     }}        
            //     title="<Back"
            // /> 
            // </TouchableHighlight> 
            // </View>





            <View style={{marginTop:30}}>
                <View style={{justifyContent: 'center',}}>
                <Text
                    style={{fontSize:20}}
                    onPress={() => {
                        console.log("on press......")
                        console.log(this.props.navigation.state.params.data)
                        console.log(this.props.navigation.state.params.data2)

                        const setParamsAction1 = NavigationActions.setParams({
                            params: {
                                    accessToken: this.props.navigation.state.params.accessToken,
                                    data: this.props.navigation.state.params.data,
                                    data2: this.props.navigation.state.params.data2,
                                    AttendingProvider: this.props.navigation.state.params.AttendingProvider,
                                    expiresIn: this.props.navigation.state.params.expiresIn,
                                    loginTime: this.props.navigation.state.params.loginTime,
                                    //default_dropdown_value: this.props.navigation.state.params.selected_dropdown_value,
                                    default_dropdown_value: "All"
                                  },
                            key: "Main"
                          })
                        this.props.navigation.dispatch(setParamsAction1)

                        const setParamsAction2 = NavigationActions.setParams({
                            params: {
                                    accessToken: this.props.navigation.state.params.accessToken,
                                    data: this.props.navigation.state.params.data,
                                    data2: this.props.navigation.state.params.data2,
                                    AttendingProvider: this.props.navigation.state.params.AttendingProvider,
                                    expiresIn: this.props.navigation.state.params.expiresIn,
                                    loginTime: this.props.navigation.state.params.loginTime,
                                    //default_dropdown_value: this.props.navigation.state.params.selected_dropdown_value,
                                    default_dropdown_value: "All"
                                  },
                            key: "HighRisks"
                          })
                        this.props.navigation.dispatch(setParamsAction2)

                        const setParamsAction3 = NavigationActions.setParams({
                            params: {
                                    accessToken: this.props.navigation.state.params.accessToken,
                                    data: this.props.navigation.state.params.data,
                                    data2: this.props.navigation.state.params.data2,
                                    AttendingProvider: this.props.navigation.state.params.AttendingProvider,
                                    expiresIn: this.props.navigation.state.params.expiresIn,
                                    loginTime: this.props.navigation.state.params.loginTime,
                                    default_dropdown_value: "All"
                                  },
                            key: "Analytics"
                          })
                        this.props.navigation.dispatch(setParamsAction3)
                        
                        this.props.navigation.navigate(this.props.navigation.state.params.view)
                    }}


                >
                {back}
                </Text>
                <Text style={styles.patientDetail}>Patient Detail</Text> 
                </View>


                <View style={{flexDirection: 'row', justifyContent: 'center',}}>  
                <TouchableHighlight
                    onPress={() => {
                    }}
                    style={styles.attendingProvider}
                >
                    <Text style={{color: "white", fontSize: 20, marginLeft: 20, justifyContent: 'center',}}>
                    {this.state.patientData.PatientNameAge}
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => {
                        this._onDialer(this.state.patientData.phoneNumber)
                    }}
                >
                    <Image
                        style={{width: 60, height: 60}}
                        source={require("../images/doximity.png")}
                    />
                </TouchableHighlight>
                </View>


                <View style={{justifyContent: 'center', flexDirection: "row", marginBottom: 1}}> 
                    <TouchableHighlight
                        style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            Discharge Date Time
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            {this.state.patientData.dischargeDateTime}
                        </Text>
                    </TouchableHighlight>
                </View>   

                <View style={{justifyContent: 'center', flexDirection: "row", marginBottom: 1}}> 
                    <TouchableHighlight
                        style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            MRN
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            {this.state.patientData.MRN}
                        </Text>
                    </TouchableHighlight>
                </View>              

                <View style={{justifyContent: 'center', flexDirection: "row", marginBottom: 1}}> 
                    <TouchableHighlight
                        style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            Encounter #
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            {this.state.patientData.FIN}
                        </Text>
                    </TouchableHighlight>
                </View>  

                <View style={{justifyContent: 'center', flexDirection: "row", marginBottom: 1}}> 
                    <TouchableHighlight
                        style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            Payer Type
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            {this.state.patientData.payername}
                        </Text>
                    </TouchableHighlight>
                </View>  

                <View style={{justifyContent: 'center', flexDirection: "row", marginBottom: 1}}> 
                    <TouchableHighlight
                        style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            Reason for Visit
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            {this.state.patientData.chiefComplaintShort}
                        </Text>
                    </TouchableHighlight>
                </View>  

                <View style={{justifyContent: 'center', flexDirection: "row", marginBottom: 1}}> 
                    <TouchableHighlight
                        style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            Phone Number
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            {this.state.patientData.phoneNumber}
                        </Text>
                    </TouchableHighlight>
                </View>  


                <View>
                    <Card>
                        <FormLabel>CallBack Outcome</FormLabel>
                        <FormInput 
                            placeholder="Enter here.." 
                            //onChangeText={}
                        />
                        <FormLabel>Patient Status</FormLabel>
                        <FormInput 
                            placeholder="Enter here.." 
                            //onChangeText={}
                        />
                        <FormLabel>Comments</FormLabel>
                        <FormInput 
                            placeholder="Enter here.." 
                            //onChangeText={}
                        />
                        <Button
                            buttonStyle={{ marginTop: 20 }}
                            backgroundColor="#03A9F4"
                            title="Submit"
                            onPress={() => {
                                console.log("on press......")
                                var token = this.props.navigation.state.params.accessToken;
                                var expiresIn = this.props.navigation.state.params.expiresIn;
                                var view = this.props.navigation.state.params.view;
                                this.api_call(token, expiresIn, view);
                                // console.log(this.props.navigation.state.params.data)
                                // console.log(this.props.navigation.state.params.data2)
        
                                // const setParamsAction1 = NavigationActions.setParams({
                                //     params: {
                                //             accessToken: this.props.navigation.state.params.accessToken,
                                //             data: this.props.navigation.state.params.data,
                                //             data2: this.props.navigation.state.params.data2,
                                //             AttendingProvider: this.props.navigation.state.params.AttendingProvider,
                                //             expiresIn: this.props.navigation.state.params.expiresIn,
                                //             loginTime: this.props.navigation.state.params.loginTime
                                //           },
                                //     key: "Main"
                                //   })
                                // this.props.navigation.dispatch(setParamsAction1)
        
                                // const setParamsAction2 = NavigationActions.setParams({
                                //     params: {
                                //             accessToken: this.props.navigation.state.params.accessToken,
                                //             data: this.props.navigation.state.params.data,
                                //             data2: this.props.navigation.state.params.data2,
                                //             AttendingProvider: this.props.navigation.state.params.AttendingProvider,
                                //             expiresIn: this.props.navigation.state.params.expiresIn,
                                //             loginTime: this.props.navigation.state.params.loginTime
                                //           },
                                //     key: "HighRisks"
                                //   })
                                // this.props.navigation.dispatch(setParamsAction2)
        
                                // const setParamsAction3 = NavigationActions.setParams({
                                //     params: {
                                //             accessToken: this.props.navigation.state.params.accessToken,
                                //             data: this.props.navigation.state.params.data,
                                //             data2: this.props.navigation.state.params.data2,
                                //             AttendingProvider: this.props.navigation.state.params.AttendingProvider,
                                //             expiresIn: this.props.navigation.state.params.expiresIn,
                                //             loginTime: this.props.navigation.state.params.loginTime
                                //           },
                                //     key: "Analytics"
                                //   })
                                // this.props.navigation.dispatch(setParamsAction3)
                                // Alert.alert("Success!")
                                // this.props.navigation.navigate(this.props.navigation.state.params.view)
                            }}
                        />
                    </Card>
                </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
      },
    dropdown_3: {
        justifyContent: 'center',
        width: 300,
        //height: 50,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 1,
        alignItems: "center",
        marginLeft: 30,
        marginBottom: 5
    },
    dropdown_2_dropdown: {
        justifyContent: 'center',
        width: 150,
        height: 100,
        borderColor: 'cornflowerblue',
        borderWidth: 2,
        borderRadius: 3,
        //fontSize: 100
      },
      separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
      },
      rowViewContainer: {
        flex: 1,
        paddingRight: 15,
        paddingTop: 13,
        paddingBottom: 13,
        borderBottomWidth: 0.5,
        borderColor: '#c9c9c9',
        flexDirection: 'row',
        alignItems: 'center',
      },
      text: {
        textAlign: "left",
        fontSize: 9,
        fontWeight: "bold"
      },
      patientDetail: {
        marginTop: 20,
        marginBottom:10,
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold"
      },
      attendingProvider: {
        height: 50,
        backgroundColor: "darkblue",
        alignSelf: "stretch",
        width: 300,
        marginTop: 10,
        justifyContent: "center",
        paddingVertical: 15,
        marginBottom: 10
      },
      buttonContainer3: {
        backgroundColor:'#d3d3d3',
        width: 200,
        height: 40,
        marginLeft: 1,
        marginRight: 1,
        //flexDirection: "row",
        //height: 20,
      },
})

export default PatientDetail;