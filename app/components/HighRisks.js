import React, { Component } from 'react';
import { Text, View, StyleSheet, Picker, FlatList, ListView, TouchableHighlight, Alert, Linking, AppState } from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    SwitchNavigator,
    NavigationActions
  } from "react-navigation";
import ModalDropdown from 'react-native-modal-dropdown';
//import api_call from '../api/api';
import Login from '../auth/Login';
import _ from "lodash";

//const url = "http://10.50.130.42:8000/api/get-patient-data"
const url = "http://10.50.130.42:8000/api/get-callbacks-data"

export default class HighRisks extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        //title: 'Msss',
      });

    constructor() {
        super();
        //const { params } = this.props.navigation.state;
        this.state = {
            AttendingProvider: null,
            token: '',
            expiresIn: null,
            data: [],
            selected_data: [],
            hospital_sites: [],
            //
            highrisk_data:[],
            nonhighrisk_data: [],
            //
            selected_dropdown_value: null
        };


    }

    api_call(token) {
        console.log(token)
        const response = fetch(url, {
            method: 'GET',
            headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,        
          }) 
        })
        .then(res => {
            console.log("we have a res")
            console.log(res)
            console.log(res.json())
        })
        .then(data => {
            console.log(data);
            this.setState({ data: data })
        })
        .catch((error) => {
            console.error(error);
        });
    }    

    createHospitalSites(data) {
        //hospital_sites_ref = [{"a": 1}, {"b": 2}, {"c": 3}]
        hospital_sites = []
        hospital_sites.push("All")
        
        data.forEach(row => {
            const filtered = _.filter(hospital_sites, site=> {
                return this.contains(site, row.SiteName)
            })
            // if (hospital_site == []) {
                
            // }
            if (filtered.length == 0) {
                hospital_sites.push(row.SiteName)
            }
        });
        console.log(hospital_sites)
        return hospital_sites
    }

    contains = (site, row) => {
        console.log(site)
        console.log(row)
        //const { first, last } = name;
        if (site == row) {
          return true;
        }
        return false;
      };

    updateSelectedHospitalSiteData(hospital_site) {
        console.log(hospital_site)
        highrisk = []
        nonhighrisk = []
        if (hospital_site == "All") {
            this.props.navigation.state.params.data.forEach(row => {
                if (row.HighRiskFlag == "True") {
                    highrisk.push(row)
                } else {
                    nonhighrisk.push(row)
                }
            })
            this.setState({ highrisk_data: highrisk, nonhighrisk_data: nonhighrisk })            
        }
        else {
            
        //old logic
        //     console.log("selected sth else")
        //     this.state.data.forEach(row => {
        //         if (row.SiteName == hospital_site) {
        //             selected_data.push(row)
        //         }
        //     })
        //     this.setState({selected_data: selected_data})

        //new logic:
        this.props.navigation.state.params.data.forEach(row => {
                if (row.SiteName == hospital_site) {
                    if (row.HighRiskFlag == "True") {
                        highrisk.push(row)
                    } else {
                        nonhighrisk.push(row)
                    }
                }
            })
            this.setState({ highrisk_data: highrisk, nonhighrisk_data: nonhighrisk })    
        }
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

    goToPatientDetailPage(patientData) {
        var token = this.props.navigation.state.params.accessToken;
        var data = this.props.navigation.state.params.data;
        var data2 = this.props.navigation.state.params.data2;
        var AttendingProvider = this.props.navigation.state.params.AttendingProvider;
        var view = "HighRisks";
        var expiresIn = this.props.navigation.state.params.expiresIn;
        var loginTime = this.props.navigation.state.params.loginTime;
        const setParamsAction = NavigationActions.setParams({
            params: {
                    accessToken: token,
                    data: data,
                    data2: data2,
                    AttendingProvider: AttendingProvider,
                    view: view,
                    expiresIn: expiresIn,
                    loginTime: loginTime,
                    selected_dropdown_value: this.state.selected_dropdown_value
                  },
            key: "PatientDetail"
          })
        this.props.navigation.dispatch(setParamsAction)

        this.props.navigation.navigate("PatientDetail", {
            patientData: patientData
        })
    }

    checkIfTokenHasExpired() {
        var expiresIn = this.props.navigation.state.params.expiresIn;
        var loginTime = this.props.navigation.state.params.loginTime;
        diff = (new Date().getTime() - loginTime.getTime())/1000
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
        var token = this.props.navigation.state.params.accessToken;
        var data = this.props.navigation.state.params.data;
        var AttendingProvider = this.props.navigation.state.params.AttendingProvider;
        var expiresIn = this.props.navigation.state.params.expiresIn;
        var loginTime = this.props.navigation.state.params.loginTime;

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

        this.setState({ 
            token: token, 
            data: data, 
            selected_data: data,
            AttendingProvider: AttendingProvider,
            expiresIn: expiresIn
        })
        
        //this.api_call(this.state.token)
        //var data = api_call(token)
        hospital_sites = this.createHospitalSites(data);
        this.setState({
            hospital_sites: hospital_sites
        })
        //handle highrisk and non-highrisk data:
        var highrisk = []
        var nonhighrisk = []
        data.forEach(item => {
            if (item.HighRiskFlag == "True") {
                highrisk.push(item)
            } else {
                nonhighrisk.push(item)
            }
        })
        console.log(highrisk)
        console.log(nonhighrisk)
        this.setState({
            highrisk_data: highrisk,
            nonhighrisk_data: nonhighrisk
        })
        //update dropdown value anyway
        this.updateSelectedHospitalSiteData(this.props.navigation.state.params.default_dropdown_value);
    }

    componentWillUnmount() {
        console.log("component will unmount?")
        Linking.removeEventListener('url', this.handleOpenURL)
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    render() {
        console.log(this.state.hospital_sites)
        console.log(this.state.expiresIn)
        return(
            <View style={{marginTop:30}}>
            <Text style={styles.name}>{this.state.AttendingProvider}</Text>

            {/* <Picker
                selectedValue={this.state.language}
                style={{ height: 50, width: 100 }}
                //onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}
            >
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
                <Picker.Item label="abc" value="abc" />
                <Picker.Item label="def" value="def" />
            </Picker> */}
            <ModalDropdown 
            options={this.state.hospital_sites}
            defaultValue = {this.props.navigation.state.params.default_dropdown_value}
            onSelect = {(index,value)=> {
                console.log("updateSelectedHospitalSiteData")
                this.updateSelectedHospitalSiteData(value);
                //update selected value
                this.setState({
                    selected_dropdown_value: value
                })
            }}
            style = {styles.dropdown_3}
            textStyle = {{fontWeight:'bold', textAlign: 'center', fontSize: 20}}
            dropdownStyle = {styles.dropdown_2_dropdown}
            >
            </ModalDropdown>

            <FlatList
                styles = {styles.container}
                data = {this.state.highrisk_data}
                //keyExtractor={(x, i => i)}
                keyExtractor={(item, index) => item.FIN}
                renderItem={({ item }) => 



                <View style={{justifyContent: 'center', flexDirection: "row", marginBottom: 1}}> 
            
                    <TouchableHighlight
                        style={styles.buttonContainer3}
                    >
                        <Text style={{color: item.HighRiskFlag == "True"? "red": "black", textAlign: "center", fontSize: 16}}
                                onPress={() => {
                                    this.checkIfTokenHasExpired()
                                    this.goToPatientDetailPage(item)
                                }}
                        >
                            {item.PatientNameAge}
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: item.HighRiskFlag == "True"? "red": "black", textAlign: "center", fontSize: 16}}
                                onPress={() => {
                                    this.checkIfTokenHasExpired()
                                    this.goToPatientDetailPage(item)
                                }}
                        >
                            {item.dischargeDateTime}
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: item.HighRiskFlag == "True"? "red": "black", textAlign: "center", fontSize: 16}}
                                onPress={() => {
                                    this.checkIfTokenHasExpired()
                                    this.goToPatientDetailPage(item)
                                }}
                        >
                            {item.chiefComplaintShort}
                        </Text>
                    </TouchableHighlight>


                        </View>
                }
            />
            <FlatList
                styles = {styles.container}
                data = {this.state.nonhighrisk_data}
                //keyExtractor={(x, i => i)}
                keyExtractor={(item, index) => item.FIN}
                renderItem={({ item }) => 



                <View style={{justifyContent: 'center', flexDirection: "row", marginBottom: 1}}> 
            
                    <TouchableHighlight
                        style={styles.buttonContainer3}
                    >
                        <Text style={{color: item.HighRiskFlag == "True"? "red": "black", textAlign: "center", fontSize: 16}}
                                onPress={() => {
                                    this.checkIfTokenHasExpired()
                                    this.goToPatientDetailPage(item)
                                }}
                        >
                            {item.PatientNameAge}
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: item.HighRiskFlag == "True"? "red": "black", textAlign: "center", fontSize: 16}}
                                onPress={() => {
                                    this.checkIfTokenHasExpired()
                                    this.goToPatientDetailPage(item)
                                }}
                        >
                            {item.dischargeDateTime}
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: item.HighRiskFlag == "True"? "red": "black", textAlign: "center", fontSize: 16}}
                                onPress={() => {
                                    this.checkIfTokenHasExpired()
                                    this.goToPatientDetailPage(item)
                                }}
                        >
                            {item.chiefComplaintShort}
                        </Text>
                    </TouchableHighlight>


                        </View>
                }
            />
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
        fontWeight: "bold",

      },
      text2: {
        textAlign: "left",
        fontSize: 9,
        fontWeight: "bold",
        color: "red"
      },      
      name: {
        marginTop: 20,
        marginBottom:10,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold"
      },
      buttonContainer3: {
        backgroundColor:'#d3d3d3',
        width: 120,
        height: 40,
        marginLeft: 1,
        marginRight: 1,
        //flexDirection: "row",
        //height: 20,
      },
})