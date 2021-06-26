import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Navigator,
  BackHandler
} from 'react-native';
import { StackNavigator} from 'react-navigation';
import Login from './Login'
import Register from './Register'
import Main from './Main'
import Send from './Send'
import Receive from './Receive'

export default class App extends Component {
  constructor(){
    super();
    this.state={
      isVisible : true,
    }
  }
  Hide_Splash_Screen=()=>{
    this.setState({
      isVisible : false
    });
  }
  componentDidMount(){
    var that = this;
    setTimeout(function(){
      that.Hide_Splash_Screen();
    }, 2000);

  
  }
  render() {
    // const { navigate} = this.props.navigation;
    return (
      (this.state.isVisible === true) ? <Splash/> : <RootStack/>
    );
  }
}

class Splash extends Component {
  render(){

    return (
      <ImageBackground style={styles.container} source={require('./images/background.jpg')}>
          <Image style={styles.logo} source={require('./images/logo.png')} resizeMode="stretch"></Image>
      </ImageBackground>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    justifyContent: 'center',
    alignItems:'center',
    width: null,
    height: null,
  },
  logo : {
    position : 'absolute',
    bottom  : 30,
    width :50,
    height : 50
  }
});
const RootStack = StackNavigator(
  {
    Login: {
      screen: Login,
      overrideBackPress: true
    },
    Register: {
      screen: Register,
    },
    Main : {
      screen : Main,
      overrideBackPress: true
    }
  },
  {
    initialRouteName: 'Login',
  }
);
