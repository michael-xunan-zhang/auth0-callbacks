import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, Picker, FlatList, ListView, Button, Dimensions, ScrollView, Alert, Linking, AppState } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
//import api_call from '../api/api';
import Login from '../auth/Login';
import _ from "lodash";
import LineChart from 'react-native-chart-kit';
import ChartView from 'react-native-highcharts';

//const url = "http://10.50.130.42:8000/api/get-patient-data"
const url = "http://10.50.130.42:8000/api/get-callbacks-data"
const url2 = "http://10.50.130.42:8000/api/get-callbacks-provider-summary-data"

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
      data: [ 20, 45, 28, 80, 99, 43 ]
    }]
  }

const screenWidth = Dimensions.get('window').width

export default class Main extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        //title: 'Msss',
      });

    constructor() {
        super();
        //const { params } = this.props.navigation.state;
        this.state = {
            AttendingProvider: null,
            OtherAttendingProviders: [],
            OtherAttendingProvidersInfo: [],
            token: '',
            expiresIn: null,
            data: [],
            data2: [],
            selected_data: [],
            hospital_sites: [],
            //
            Total_Shifts: 81,
            Target_Callbacks: 240,
            Callback_Completion: "4.58%",
            month: "MAY", // for testing purpose but should be new Date().getMonth()
            //
            graph_data: [],
            //
            selected_dropdown_value: null

        };

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
        if (site == row) {
          return true;
        }
        return false;
      };
    
    //past 6 months
    get_totalShifts_and_TargetCallacks_past_6_months(data2, AttendingProvider, hospital_site) {
        var i = 0;
        var count = 0;
        data = [0, 0, 0, 0, 0]
        months = ["JAN", "FEB", "MAR", "APR", "MAY"]
        check = [false, false, false, false, false]
        data2.forEach(row => {
            months.forEach(month => {
                if (row.AttendingProvider == AttendingProvider
                    && row.dischargemonth == month && check[i] == false ) {
                    if (row.SiteName == hospital_site || hospital_site == "All") {
                        check[i] = true;

                        console.log("1111111111111111")
                        console.log(row.dischargeyearmonth)
                        console.log(row.SiteName)
                        console.log(row.Shifts)
                        console.log(row.TargetCallbacks)
                        console.log(row.TotalCallbacks)
                        var Total_Shifts = row.Shifts;
                        var callbacks = parseInt(row.TargetCallbacks)
                        var totalCallbacks = parseInt(row.TotalCallbacks)
                        count = count + callbacks
                        temp = (totalCallbacks/count*100).toString().substring(0, 5)
                        temp = temp+"%"
                        //data.push(totalCallbacks/count*100)
                        data[i] = totalCallbacks/count*100
                    }
                }
                i = i + 1;
            })
            i = 0;
        })
        console.log(data)
        return data
    }

    // current month  
    get_totalShifts_and_TargetCallacks(data2, AttendingProvider, hospital_site) {
        console.log("get total shifts and target callbacks....")
        console.log(AttendingProvider)
        console.log(data2)
        var count = 0;
        data2.forEach(row => {
            if (row.AttendingProvider == AttendingProvider
                && row.dischargemonth == this.state.month ) {
                if (row.SiteName == hospital_site || hospital_site == "All") {
                    var Total_Shifts = row.Shifts;
                    var callbacks = parseInt(row.TargetCallbacks)
                    var totalCallbacks = parseInt(row.TotalCallbacks)
                    console.log(callbacks)
                    count = count + callbacks
                    temp = (totalCallbacks/count*100).toString().substring(0, 5)
                    temp = temp+"%"
                    this.setState({
                        Total_Shifts: Total_Shifts,
                        Target_Callbacks: count,
                        Callback_Completion: temp,
                    })
                }
            }

            return;
        })
    }

    other_provider_get_totalShifts_and_TargetCallacks(data2, AttendingProvider, hospital_site) {
        console.log(AttendingProvider)
        var Target_Callbacks = 0;
        var Total_Shifts = "N/A";
        //var Target_Callbacks = "N/A";
        var Callback_Completion = "N/A";
        data2.forEach(row => {
            if (row.AttendingProvider == AttendingProvider
                && row.dischargemonth == this.state.month ) {
                if (row.SiteName == hospital_site || hospital_site == "All") {
                    console.log(row.SiteName)
                    var total_shifts = row.Shifts;
                    var callbacks = parseInt(row.TargetCallbacks)
                    var totalCallbacks = parseInt(row.TotalCallbacks)
                    Target_Callbacks = Target_Callbacks + callbacks
                    temp = (totalCallbacks/Target_Callbacks*100).toString().substring(0, 5)
                    temp = temp+"%"

                    Total_Shifts = total_shifts
                    Callback_Completion = temp
                }
            }
        })
        console.log(Total_Shifts)
        console.log(Target_Callbacks)
        console.log(Callback_Completion)
        if (Target_Callbacks == 0) {
            Target_Callbacks = "N/A"
        }
        return {AttendingProvider, Total_Shifts, Target_Callbacks, Callback_Completion}
    }

    get_other_attending_providers(data2, AttendingProvider) {
        OtherAttendingProviders = []
        data2.forEach(row => {
            if (row.AttendingProvider != AttendingProvider) {
                const f = _.filter(OtherAttendingProviders, provider=> {
                    return this.includes(provider, row.AttendingProvider)
                })
                if (f.length == 0) {
                    OtherAttendingProviders.push(row.AttendingProvider)
                }             
            }
        })
        return OtherAttendingProviders;
    }

    includes = (provider, AttendingProvider) => {
        if (provider == AttendingProvider) {
            return true
        }
        return false
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
        console.log("componentDidMount..........")
        var token = this.props.navigation.state.params.accessToken;
        var data = this.props.navigation.state.params.data;
        var data2 = this.props.navigation.state.params.data2;
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
            data2: data2,
            selected_data: data, 
            AttendingProvider: AttendingProvider,
            expiresIn: expiresIn
        })
        //generate hospital sites
        hospital_sites = this.createHospitalSites(data);
        this.setState({
            hospital_sites: hospital_sites

        })
        //console.log(this.state.data2)
        //Total Shifts & Target Callbacks:
        this.get_totalShifts_and_TargetCallacks(data2, AttendingProvider, "All");
        OtherAttendingProviders = this.get_other_attending_providers(data2, AttendingProvider);
        this.setState({
            OtherAttendingProviders: OtherAttendingProviders,
        })
        //data for the past 6 months for graph:
        graph_data = this.get_totalShifts_and_TargetCallacks_past_6_months(data2, AttendingProvider, "All");
        this.setState({ graph_data: graph_data })
        //other provider data get:
        OtherAttendingProvidersInfo = []
        OtherAttendingProviders.forEach(provider => {
            OtherAttendingProvidersInfo.push(this.other_provider_get_totalShifts_and_TargetCallacks(data2, provider, "All"))
        })
        this.setState({
            OtherAttendingProvidersInfo: OtherAttendingProvidersInfo,
        })
    }

    componentWillUnmount() {
        console.log("component will unmount?")
        Linking.removeEventListener('url', this.handleOpenURL)
        AppState.removeEventListener('change', this.handleAppStateChange);
    }    

    render() {
        console.log("rendering...............")
        console.log(this.state.hospital_sites)
        console.log(this.state.AttendingProvider)
        console.log(this.state.OtherAttendingProviders)
        console.log(this.state.OtherAttendingProvidersInfo)
        console.log(this.state.token)
        console.log(this.state.data)
        console.log(this.state.data2)
        console.log(this.state.graph_data)
        console.log(this.state.expiresIn)

        var Highcharts='Highcharts';
        var conf={
                chart: {
                    type: 'spline',
                    animation: Highcharts.svg, // don't animate in old IE
                    marginRight: 10,
                    events: {
                        load: function () {
     
                            // set up the updating of the chart each second
                            var series = this.series[0];
                            // setInterval(function () {
                            //     var x = (new Date()).getTime(), // current time
                            //         y = Math.random();
                            //     series.addPoint([x, y], true, true);
                            // }, 1000);
                        }
                    }
                },
                title: {
                    text: 'past months completion by %'
                },
                xAxis: {
                    // type: 'datetime',
                    // tickPixelInterval: 150
                    categories: [1, 2, 3, 4, 5]
                },
                yAxis: {
                    title: {
                        text: 'Value'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        //color: '#808080'
                        color: "black"
                    }]
                },
                // tooltip: {
                //     formatter: function () {
                //         return '<b>' + this.series.name + '</b><br/>' +
                //             Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                //             Highcharts.numberFormat(this.y, 2);
                //     }
                // },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: 'Random data',
                    // data: (function () {
                    //     // generate an array of random data
                    //     var data = [],
                    //         time = (new Date()).getTime(),
                    //         i;
     
                    //     for (i = -19; i <= 0; i += 1) {
                    //         data.push({
                    //             x: time + i * 1000,
                    //             y: Math.random()
                    //         });
                    //     }
                    //     return data;
                    // }())
                    // data: [
                    //   Math.random() * 100,
                    //   Math.random() * 100,
                    //   Math.random() * 100,
                    //   Math.random() * 100,
                    //   Math.random() * 100,
                    //   Math.random() * 100
                    // ]
                    data: this.state.graph_data
                }]
            };
     
        const options = {
            global: {
                useUTC: false
            },
            lang: {
                decimalPoint: ',',
                thousandsSep: '.'
            }
        };





        return(
            <View>
                {/* provider name and dropdown view */}
                <View style={{marginTop:30}}>
                <Text style={styles.name}>{this.state.AttendingProvider}</Text>
                <ModalDropdown
                style={{marginTop:10}}
                options={this.state.hospital_sites}
                defaultValue = {this.props.navigation.state.params.default_dropdown_value}
                onSelect = {(index,value)=> {
                    console.log("on change hospital site......")
                    this.get_totalShifts_and_TargetCallacks(this.state.data2, this.state.AttendingProvider, value);
                    //other providers update:
                    OtherAttendingProvidersInfo = []
                    OtherAttendingProviders.forEach(provider => {
                        OtherAttendingProvidersInfo.push(this.other_provider_get_totalShifts_and_TargetCallacks(this.state.data2, provider, value))
                    })
                    this.setState({
                        OtherAttendingProvidersInfo: OtherAttendingProvidersInfo,
                    })
                    //graph data update
                    g_d = this.get_totalShifts_and_TargetCallacks_past_6_months(this.state.data2, this.state.AttendingProvider, value)
                    this.setState({ graph_data: g_d })
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
                </View>




                {/* shifts callbacks completion View */}
                <View style={{justifyContent: 'center', flexDirection: "row", marginTop: 10, marginLeft: 5}}>
                    <TouchableHighlight
                    style={styles.buttonContainer}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 11}}>
                            Total Shifts
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 11}}>
                            Target Callbacks
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 11}}>
                            Callback Completion
                        </Text>
                    </TouchableHighlight>                                        
                </View>

                <View style={{justifyContent: 'center', flexDirection: "row", marginTop: 1, marginLeft: 5}}>
                    <TouchableHighlight
                    style={styles.buttonContainer2}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 25}}>
                            {this.state.Total_Shifts}
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer2}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 25}}>
                            {this.state.Target_Callbacks}
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer2}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 25}}>
                            {this.state.Callback_Completion}
                        </Text>
                    </TouchableHighlight>                                        
                </View>






                {/* chartview here */}
                <ChartView style={{justifyContent: 'center', height:200}} config={conf} options={options}></ChartView>                




                {/* other providers view */}
                <View style={{justifyContent: 'center', flexDirection: "row", marginTop: 5, marginBottom: 1 }}>
                    <TouchableHighlight
                        style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            Provider Name
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            Total Shifts
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            Target   Callbacks
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            Callback Completion
                        </Text>
                    </TouchableHighlight>                                        
                </View>


                <View style={{justifyContent: 'center'}}>
                <FlatList
                    styles = {styles.container}
                    data = {this.state.OtherAttendingProvidersInfo}
                    //keyExtractor={(x, i => i)}
                    keyExtractor={(item, index) => item.AttendingProvider}
                    renderItem={({ item }) => 
                        <View style={{justifyContent: 'center', flexDirection: "row"}}> 
            
                    <TouchableHighlight
                        style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            {item.AttendingProvider}
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            {item.Total_Shifts} 
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            {item.Target_Callbacks}
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={styles.buttonContainer3}
                    >
                        <Text style={{color: "black", textAlign: "center", fontSize: 16}}>
                            {item.Callback_Completion}
                        </Text>
                    </TouchableHighlight> 


                        </View>
                }
                    //renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                />
                </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 1,
        justifyContent: 'center'
      },
    dropdown_3: {
        width: 300,
        //height: 50,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 1,
        alignItems: "center",
        marginLeft: 30
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
        fontWeight: "bold"
      },
      name: {
        marginTop: 20,
        marginBottom:10,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold"
      },
      buttonContainer: {
        backgroundColor:'#d3d3d3',
        width: 115,
        height: 20,
        marginLeft: 1,
        marginRight: 1,
        //flexDirection: "row",
        //height: 20,
      },
      buttonContainer2: {
        backgroundColor:'#d3d3d3',
        width: 115,
        height: 30,
        marginLeft: 1,
        marginRight: 1,
        //flexDirection: "row",
        //height: 20,
      },
      buttonContainer3: {
        backgroundColor:'#d3d3d3',
        width: 90,
        height: 40,
        marginLeft: 1,
        marginRight: 1,
        marginBottom: 1
        //flexDirection: "row",
        //height: 20,
      },
      textContainer: {      
        fontSize: 50,
        color: "red",
      }
})