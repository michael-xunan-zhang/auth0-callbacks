/**
 * Auth0Sample 00-Login
 * https://github.com/auth0/react-native-auth0
 * @flow
 */

import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Navigator, 
  StatusBar
} from 'react-native';
//import { FontAwesome } from "react-native-vector-icons";
import Auth0 from 'react-native-auth0';

import { 
    createStackNavigator, 
    createBottomTabNavigator,
    createSwitchNavigator,
    NavigationActions
} from 'react-navigation';

import Login from './auth/Login';
import Main from './components/Main';
import HighRisks from './components/HighRisks';
import Analytics from './components/Analytics';
import PatientDetail from './components/PatientDetail';
//import auth0 from 'auth0-js';

var credentials = require('./auth/auth0-credentials');
const auth0 = new Auth0(credentials);
//const url = "http://10.50.130.42:8000/api/public"
//const url = "http://sac-prdgminiapi:8000/api/public
const url = "http://10.50.130.42:8000/api/get-patient-data"


const createRootNavigator = (loggedIn = false) => {
  return createSwitchNavigator(
      {
          SignedIn: {
              screen: SignedIn
          },
          SignedOut: {
            screen: Login
          }, 
          PatientDetail: {
            screen: PatientDetail
          },       
      },
      {
          initialRouteName: loggedIn ? "SignedIn" : "SignedOut"
      }
  )
} 

export const SignedIn = createBottomTabNavigator(
  {
    Analytics: {
      screen: Analytics,
      navigationOptions: {
          tabBarLabel: "",
          // tabBarIcon: ({ tintColor }) => (
          //   <FontAwesome name="home" size={30} color={tintColor} />
          // )
          tabBarIcon: 
            <Image
            style={{width: 30, height: 30}}
            source={require("./images/analytics.png")}
            />
      },        
    }, 
    Main: {
      screen: Main,
      navigationOptions: {
          tabBarLabel: "",
          // tabBarIcon: ({ tintColor }) => (
          //   <FontAwesome name="home" size={30} color={tintColor} />
          // )
          tabBarIcon: 
            <Image
            style={{width: 30, height: 30}}
            source={require("./images/home.png")}
            />
      }        
    }, 
      HighRisks: {
        screen: HighRisks,
        navigationOptions: {
            tabBarLabel: "",
            // tabBarIcon: ({ tintColor }) => (
            //   <FontAwesome name="home" size={30} color={tintColor} />
            // )
            tabBarIcon: 
              <Image
              style={{width: 30, height: 30}}
              source={require("./images/danger.png")}
              />
        },        
      }, 
  },
  {
    tabBarOptions: {
      scrollEnabled: true,
      style: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      }
    }
  }  
);




export default class Auth0Sample extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      accessToken: null,
      idToken: null,
      data: []
      // auth0 : new auth0.WebAuth({
      //   clientID: credentials.clientId,
      //   domain: credentials.domain,
      //   responseType: 'token id_token',
      //   redirectUri: 'http://10.50.130.42:8000/api/public'
      // })

    };
  }

  _onLogin = () => {
    console.log("on log in....")
    // console.log(this.auth0)
    // this.auth0.client.login({
    //   realm: 'Username-Password-Authentication',
    //   username: "test@vituity.com",
    //   password: "MedAmerica2100!"
    // }, (err, authResult) => {
    //   if (err) {
    //     console.log("Error: " + err)
    //   }
    // })
    // console.log("here?")


    // this.auth0.client.login({
    //   realm: 'Username-Password-Authentication',
    //   username: "test@vituity.com",
    //   password: "MedAmerica2100!"
    // }, (err, authResult) => {
    //   console.log("Error: " + err)
    // })



    // auth0
    // .webAuth
    // .authorize({
    //   scope: 'openid profile email', 
    //   //scope: "openid offline_access profile email",
    //   //scope: 'openid email',
    //   audience: 'https://vituitydemo.auth0.com/userinfo'
    //   //audience: "http://10.50.130.42:8000/api/public"
    // })
    // .then(//credentials =>
    //   console.log("credentials.accessToken")
    //   // Successfully authenticated
    //   // Store the accessToken
    // )
    //.catch(error => console.log(error));

    auth0.webAuth
      .authorize({
        scope: 'openid profile',    
        //scope: 'openid profile email', 
        //   //scope: "openid offline_access profile email",
        //   //scope: 'openid email',
        //audience: 'https://' + credentials.domain + '/userinfo'
        //audience: "https://10.50.130.42:8000/api/login"
        //audience: "https://www.facebook.com"
        audience: 'djangotest'
      })
      .then(credentials => {
        console.log("for testing purposes")
        console.log(credentials);
        this.api_call(credentials.accessToken)  
        Alert.alert(
          'Success',
          'AccessToken: ' + credentials.accessToken,
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
        this.setState({ 
          accessToken: credentials.accessToken,
          idToken: credentials.idToken
        });
      })
      .catch(error => console.log(error));
  };



  // _onLogout = () => {
  //   if (Platform.OS === 'android') {
  //     this.setState({ accessToken: null });
  //   } else {
  //     auth0.webAuth
  //       .clearSession({})
  //       .then(success => {
  //         this.setState({ accessToken: null });
  //       })
  //       .catch(error => console.log(error));
  //   }
  // };

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
    // .then(res => {
    //   console.log("what is res?")
    //   console.log(res.headers)
    //   console.log(res.body)
    //   console.log(res.url)
    //   res.json()
    // })
    // .then(data => {
    //   console.log(data)
    //   this.setState({data: data})
    // })
    .then(res => {
      console.log("we have a res")
      console.log(res.json())
    })
    .then(data => {
      console.log(data);
      this.setState({ data: data })
    })
    .catch((error) => {
      console.error(error);
    });
    console.log(response)
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch(route.id) {
      case "Login":
        return ( <Login navigator={navigator} title="Login" /> )
      case "Main":
        return ( <Main navigator={navigator} title="Main" /> )
    }
  }

  render() {
    // return(
    //   <Navigator
    //     initialRoute = {{
    //       id: "Login"
    //     }}
    //     renderScene = {
    //       this.navigatorRenderScene
    //     } 
    //   />
    // )

    const Layout = createRootNavigator(false)
    return <Layout />
    
    // return (
    //   <View style={styles.container}>
    //     <Text style={styles.header}>Auth0Sample - Login</Text>
    //     <Text>
    //       You are {loggedIn ? '' : 'not '}logged in.
    //     </Text>
    //     <Button
    //       onPress={loggedIn ? this._onLogout : this._onLogin}
    //       title={loggedIn ? 'Log Out' : 'Log In'}
    //     />
    //   </View>
    // );
  }
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
  homeIcon: {
    width: 10,
    height: 10,
    //marginLeft: 135
  },   
  logo: {
    width: 100,
    height: 100,
    marginLeft: 135
  },  
});

AppRegistry.registerComponent('Auth0Sample', () => Auth0Sample);