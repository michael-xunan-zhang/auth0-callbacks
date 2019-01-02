import Auth0Sample from './app/index';



// import Login from './app/auth/Login';
// import Main from './app/components/Main';
// import { AppRegistry, Platform } from 'react-native';
// import React, { Component } from 'react';

// import { 
//     createStackNavigator, 
//     createBottomTabNavigator,
//     createSwitchNavigator
//   } from 'react-navigation';


// const createRootNavigator = (loggedIn = false) => {
//     return createSwitchNavigator(
//         {
//             SignedOut: {
//                 Login
//             },
//             // SignedIn: {
//             //     SignedIn
//             // }            // SignedIn: {
//             //     SignedIn
//             // }
//         },
//         {
//             initialRouteName: loggedIn ? "SignedIn" : "SignedOut"
//         }
//     )
// } 

// const SignedIn = createBottomTabNavigator(
//     {
//         Main: {
//             screen: Main,
//             navigationOptions: {
//                 tabBarLabel: "Home",
//                 // tabBarIcon: ({ tintColor }) => (
//                 //   <FontAwesome name="home" size={30} color={tintColor} />
//                 // )
//               }        
//         }
//     },
//     {
//       tabBarOptions: {
//         style: {
//           paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
//         }
//       }
//     }  
//   );


// export default class App extends React.Component {

//     state = {
//         loggedIn : false
//     }

//     render() {
//         //const Layout = createRootNavigator(this.state.loggedIn)
//         //return <Layout />
//         return createRootNavigator(false);
//     }
// }



//AppRegistry.registerComponent('Auth0Sample', () => App);