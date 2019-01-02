import React, { Component } from 'react';
import { Text, View, StyleSheet, Button, Alert, ListView, Dimensions, ScrollView, Linking, AppState } from 'react-native';
import {
    StackNavigator,
    TabNavigator,
    SwitchNavigator,
    NavigationActions
  } from "react-navigation";
  import Auth0 from 'react-native-auth0';
  //import SignedIn from '../index'
  import Main from '../components/Main';
  import { LineChart } from 'react-native-charts-wrapper';
  import ChartView from 'react-native-highcharts';
  import { VictoryLine, VictoryChart, VictoryTheme, VictoryScatter } from "victory-native";



var credentials = require('./auth0-credentials');
const auth0 = new Auth0(credentials);
//const url = "http://10.50.130.42:8000/api/public"
//const url = "http://sac-prdgminiapi:8000/api/public
//const url = "http://10.50.130.42:8000/api/get-patient-data"
const url = "http://10.50.130.42:8000/api/get-callbacks-data"
const url2 = "http://10.50.130.42:8000/api/get-callbacks-provider-summary-data"

token = '';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [{
    data: [
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100,
      Math.random() * 100
    ]
  }]
}
const width = Dimensions.get('window').width

export default class Login extends React.Component {

    // static navigationOptions = ({ navigation }) => ({
    //     title: 'Login',
    //   });

    constructor(props) {
        super(props);
        this.state = { 
            accessToken: null,
            idToken: null,
            logInSuccess: false,
            data: [],
            refreshToken: null
        };
    }

    api_call(token, expiresIn) {
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

          temp = new Date();
          loginTime = temp;
          console.log(loginTime)
          this.setToken_Main(response, response2, expiresIn, loginTime);
          this.setToken_HighRisks(response, response2, expiresIn, loginTime);
          this.setToken_Analytics(response, response2, expiresIn, loginTime);
  
          const navigateAction = NavigationActions.navigate({
            routeName: 'Main',
            //params: {token: "dsfsdfsd"},
            action: NavigationActions.navigate({ routeName: "Main" }),
          });
          this.props.navigation.dispatch(navigateAction);


        })     

      })
      .catch((error) => {
          console.error(error);
      });
      console.log(this.state.data)
  } 

//   api_call(token) {
//     //console.log(token)
//     fetch(url, {
//         method: 'GET',
//         headers: new Headers({
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + token,        
//       }) 
//     })
//     .then(response => response.json())
//     .then(response => {
//       console.log(response)

//       this.setToken_Main(response);
//       this.setToken_HighRisks(response);
//       this.setToken_Analytics(response);

//       const navigateAction = NavigationActions.navigate({
//         routeName: 'Analytics',
//         //params: {token: "dsfsdfsd"},
//         action: NavigationActions.navigate({ routeName: "Analytics" }),
//       });
//       this.props.navigation.dispatch(navigateAction);
//     })
//     .catch((error) => {
//         console.error(error);
//     });
//     console.log(this.state.data)
// } 

  // api_call2(token) {
  //   //console.log(token)
  //   fetch(url2, {
  //       method: 'GET',
  //       headers: new Headers({
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + token,        
  //     }) 
  //   })
  //   .then(response => response.json())
  //   .then(response => {
  //     console.log(response)
  //     this.setToken_Analytics2(response)
  //     const navigateAction = NavigationActions.navigate({
  //       routeName: 'Analytics',
  //       //params: {token: "dsfsdfsd"},
  //       action: NavigationActions.navigate({ routeName: "Analytics" }),
  //     });
  //     this.props.navigation.dispatch(navigateAction);
  //   })
  //   .catch((error) => {
  //       console.error(error);
  //   });
  // } 


    setToken_Main(response, response2, expiresIn, loginTime) {
      console.log(this.state.data)
      const setParamsAction = NavigationActions.setParams({
        params: {
                accessToken: this.state.accessToken,
                data: response,
                data2: response2,
                AttendingProvider: "SARKAR, SARIKA",
                expiresIn: expiresIn,
                loginTime: loginTime,
                default_dropdown_value: "All"

              },
        key: "Main"
      })
      this.props.navigation.dispatch(setParamsAction)
    }

    setToken_HighRisks(response, response2, expiresIn, loginTime) {
      const setParamsAction = NavigationActions.setParams({
        params: {
            accessToken: this.state.accessToken,
            data: response,
            data2: response2,
            AttendingProvider: "SARKAR, SARIKA",
            expiresIn: expiresIn,
            loginTime: loginTime,
            default_dropdown_value: "All"
        },
        key: "HighRisks"
      })
      this.props.navigation.dispatch(setParamsAction)
    }    

    setToken_Analytics(response, response2, expiresIn, loginTime) {
      const setParamsAction = NavigationActions.setParams({
        params: {
            accessToken: this.state.accessToken,
            data: response,
            data2: response2,
            AttendingProvider: "SARKAR, SARIKA",
            expiresIn: expiresIn,
            loginTime: loginTime,
            default_dropdown_value: "All"
        },
        key: "Analytics"
      })
      this.props.navigation.dispatch(setParamsAction)
    }


    _onLogin = () => {
        console.log("on log in....")
        // this.props.navigation.navigate("SignedIn")
    
        auth0.webAuth
          .authorize({
            //scope: 'openid profile',    
            scope: 'openid profile email offline_access',
            audience: 'djangotest'
          })
        // auth0.auth.passwordRealm({
        //   username: "michael.zhang@vituity.com",
        //   password: "MedAmerica2100!",
        //   scope: 'openid profile email offline_access',
        //   realm: 'Username-Password-Authentication',
        //   audience: 'https://' + credentials.domain + '/userInfo'
        // })
          .then(credentials => {
            console.log("for testing purposes")
            console.log(credentials); 
            // Alert.alert(
            //   'Success',
            //   'AccessToken: ' + credentials.accessToken,
            //   [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
            //   { cancelable: false }
            // );
            this.setState({ 
              accessToken: credentials.accessToken,
              idToken: credentials.idToken,
              logInSuccess: true,
              refreshToken: credentials.refreshToken
            });
            this.api_call(credentials.accessToken, credentials.expiresIn)
            //this.api_call2(credentials.accessToken)
            //token = credentials.accessToken;
            //this.props.navigation.setParams({ accessToken : token })
            
            // this.props.navigation.navigate("SignedIn", {
            //   accessToken: token
            // })

            // this.props.navigator.push({
            //   name: Main
            // })


            // const setParamsAction = NavigationActions.setParams({
            //   params: {accessToken: credentials.accessToken},
            //   key: "SignedIn"
            // })
            // this.props.navigation.dispatch(setParamsAction)

            //this.setToken_Main();
            //this.setToken_HighRisks();
            //this.setToken_Analytics();
            

            // const navigateAction = NavigationActions.navigate({
            //   routeName: 'Main',
            //   //params: {token: "dsfsdfsd"},
            //   action: NavigationActions.navigate({ routeName: credentials.accessToken }),
            // });
            // this.props.navigation.dispatch(navigateAction);

          })
          .catch(error => console.log(error));
          console.log("ha???")
        
      };

      handleOpenURL = (event) => {
        console.log("handleOpenUrl??????")
        url = event.url
        console.log(url)
        const route = url.replace(/.*?:\/\//g, '');
        console.log(route)
      }
  
      handleAppStateChange = (nextAppState) => {
        console.log("handle app state change???")
        Linking.addEventListener('url', this.handleOpenURL);
      }


      componentDidMount() {
        console.log("componentDidMount???")
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
      }

      componentWillUnmount() {
        console.log("componentWillUnount???")
        Linking.removeEventListener('url', this.handleOpenURL)
        AppState.removeEventListener('change', this.handleAppStateChange);
      }


    render() {

        return (
          <View style={styles.container}>
            <Text style={styles.header}>CallBacks</Text>
            <Button
              onPress={this._onLogin}
              title={'Log In'}
            />
            <Button
              onPress={() => this._onTest('510-350-2600')}
              title={'Demo: Call 5103502600'}
            />
            <Button
              onPress={() => this.refreshToken()}
              title={'refresh token'}
            />
          </View>
        );
    }

    refreshToken() {
      console.log(this.state.refreshToken)
      auth0
      .auth
      .refreshToken({refreshToken: this.state.refreshToken})
      .then(credentials => {console.log(credentials)})
      .catch(err => {console.log(err)});

    }


    _onTest = (phoneNumber) => {
      var a = "+#0+"
      var b = '5103502600'
      var c = '+'
      console.log("hhhhheeeerrrrreeee")
      Linking.canOpenURL('DoximityDialer:').then(supported => {

        console.log(`Open url works`)
        //Linking.openURL('DoximityDialer://call?targetNumber=#0 5103502600'
        Linking.openURL('DoximityDialer:///call?targetNumber='+phoneNumber
      )}).catch(error => {
        console.log(`An error has occured: ${error}`)
      })
    }

  //   render() {

  //     return (
  //       <View style={styles.container}>
  //         <Text style={styles.header}>CB</Text>
  //         <Button
  //           onPress={this._onTest}
  //           title={'Log In'}
  //         />
  //       </View>
  //     );
  // }    






  //   render() {

  //     return (
  //       <View>
  //       <Text>
  //           Bezier Line Chart
  //       </Text>
  //       <LineChart
  //           data={data}
  //           width={width}
  //           height={220}
  //           chartConfig={{
  //               backgroundColor: '#000000',
  //               backgroundGradientFrom: '#1E2923',
  //               backgroundGradientTo: '#08130D',
  //               color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  //               style: {
  //                 borderRadius: 16
  //               }
  //           }}
  //           bezier
  //           style={{
  //             borderRadius: 16
  //           }}
  //       />
  //       </View>
  //     );
  // }





  //   render() {
  //     var Highcharts='Highcharts';
  //     var conf={
  //             chart: {
  //                 type: 'spline',
  //                 animation: Highcharts.svg, // don't animate in old IE
  //                 marginRight: 10,
  //                 events: {
  //                     load: function () {
   
  //                         // set up the updating of the chart each second
  //                         var series = this.series[0];
  //                         // setInterval(function () {
  //                         //     var x = (new Date()).getTime(), // current time
  //                         //         y = Math.random();
  //                         //     series.addPoint([x, y], true, true);
  //                         // }, 1000);
  //                     }
  //                 }
  //             },
  //             title: {
  //                 text: 'Live random data'
  //             },
  //             xAxis: {
  //                 type: 'datetime',
  //                 tickPixelInterval: 150
  //             },
  //             yAxis: {
  //                 title: {
  //                     text: 'Value'
  //                 },
  //                 plotLines: [{
  //                     value: 0,
  //                     width: 1,
  //                     color: '#808080'
  //                 }]
  //             },
  //             tooltip: {
  //                 formatter: function () {
  //                     return '<b>' + this.series.name + '</b><br/>' +
  //                         Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
  //                         Highcharts.numberFormat(this.y, 2);
  //                 }
  //             },
  //             legend: {
  //                 enabled: false
  //             },
  //             exporting: {
  //                 enabled: false
  //             },
  //             series: [{
  //                 name: 'Random data',
  //                 // data: (function () {
  //                 //     // generate an array of random data
  //                 //     var data = [],
  //                 //         time = (new Date()).getTime(),
  //                 //         i;
   
  //                 //     for (i = -19; i <= 0; i += 1) {
  //                 //         data.push({
  //                 //             x: time + i * 1000,
  //                 //             y: Math.random()
  //                 //         });
  //                 //     }
  //                 //     return data;
  //                 // }())
  //                 data: [
  //                   Math.random() * 100,
  //                   Math.random() * 100,
  //                   Math.random() * 100,
  //                   Math.random() * 100,
  //                   Math.random() * 100,
  //                   Math.random() * 100
  //                 ]
  //             }]
  //         };
   
  //     const options = {
  //         global: {
  //             useUTC: false
  //         },
  //         lang: {
  //             decimalPoint: ',',
  //             thousandsSep: '.'
  //         }
  //     };
   
  //     return (
  //       <ChartView style={{height:300}} config={conf} options={options}></ChartView>
  //     );
  // }






  // render() {
  //   return (
  //     <ScrollView contentContainerStyle={styles.container2}>
  //       <Text>Hello world!</Text>
  //       <VictoryChart>
  //         <VictoryScatter
  //           data={[
  //             {
  //               x: 1, y: 3, fill: "red",
  //               symbol: "plus", size: 6, label: "Red"
  //             },
  //             {
  //               x: 2, y: 5, fill: "magenta",
  //               size: 9, opacity: 0.4, label: "Magenta"
  //             },
  //             {
  //               x: 3, y: 4, fill: "orange",
  //               size: 5, label: "Orange"
  //             },
  //             {
  //               x: 4, y: 2, fill: "brown",
  //               symbol: "square", size: 6, label: "Brown"
  //             },
  //             {
  //               x: 5, y: 5, fill: "black",
  //               symbol: "triangleUp", size: 5, label: "Black"
  //             }
  //           ]}
  //         />
  //       </VictoryChart>
  //     </ScrollView>
  //   );
  // }





}
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
      },
      header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
      },
      container2: {
        alignItems: "center",
        backgroundColor: "#e1d7cd",
        justifyContent: "center",
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 50
      },
    });