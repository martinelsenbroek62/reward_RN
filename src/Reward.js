/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  AlertIOS,
  Alert,
  Linking,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import DialogProgress from 'react-native-dialog-progress';
import Send from './Send';
import Receive from './Receive';
import Login from './Login';
import RNExitApp from 'react-native-exit-app';
import { StackNavigator,NavigationActions} from 'react-navigation';
const GLOBAL = require('./Global');
const options = {
    message:GLOBAL.Wait,
    isCancelable:true
}
export default class Reward extends Component {
  static navigationOptions = {
    headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 },
    headerLeft: null,
  }

  constructor(props) {
    super(props);
    this.state = {
       uid : '',
       token : '',
       reward : '',
       isLoading : true,
     }
     this._loadInitialState().done();
  }
  _loadInitialState = async()=>{
    const _uid = await AsyncStorage.getItem('uid');
    this.setState({isLoading : false});
    this.setState({uid : _uid});
    const _token = await AsyncStorage.getItem('token');
    this.setState({token : _token});
    const _reward = await AsyncStorage.getItem('reward');
    this.setState({reward : _reward});

  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    this.props.navigation.addListener('focus', this._fetchData);
   }
   componentWillUnmount() {
     BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    this.props.navigation.removeListener('focus', this._fetchData);
   }
   _fetchData = () => {
    alert('Refresh');
   };

   backPressed = async() => {

       Alert.alert(
         GLOBAL.Exit,
         GLOBAL.Click,
         [
           {text: GLOBAL.Cancel, onPress: () => {console.log('Cancel pressed')}, style: 'cancel'},
           {text: GLOBAL.Ok, onPress: () => RNExitApp.exitApp()},
         ],
        { cancelable: false }
       )
       return true;
   }
  render() {
    return (
      <ImageBackground style={styles.container} source={require('./images/asset_bg.jpg')} resizeMode = 'cover'>
        <View style={{flexDirection : 'row', alignSelf : 'stretch',justifyContent: 'space-between'}}>
          <TouchableOpacity activeOpacity = { .5 } onPress={this.logout}>
            <Image source={require('./images/logout.png')} style={styles.logout}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 } onPress={this.openQr}>
            <Image source={require('./images/qrcode.png')} style={styles.qrcode}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity = { .5 }
            onPress={this.refresh}>
            <Image source={require('./images/refresh.png')} style={styles.refresh}/>
          </TouchableOpacity>
        </View>

        <View style={{ alignSelf : 'stretch', alignItems : 'center'}}>
          <Text style={{fontWeight : 'bold',fontSize : 30}}>{GLOBAL.Rewards}</Text>
        </View>
        <View style={{flexDirection : 'row', top : 100,alignSelf : 'stretch',justifyContent: 'space-between', paddingLeft : 30,paddingRight : 50}}>
          <View style={{alignSelf : 'flex-start', top : 10,flexDirection : 'row'}}>
            <Image style={styles.logo} source={require('./images/logo.png')} resizeMode="stretch"></Image>
            <Text style={{fontWeight : 'bold', fontSize : 30}}>&nbsp;&nbsp;RWD</Text>
          </View>
          <Text style={{fontWeight : 'bold', fontSize : 30, color : '#00AC41', alignSelf : 'flex-end'}}>{this.state.reward}</Text>
        </View>
        <ActivityIndicator size='large' color="#0000FF" style={{top : 150}} animating={this.state.isLoading}/>
        <View style={{flexDirection : 'row',  top : 200}}>
          <TouchableOpacity
            style={styles.btn_send}
            onPress={this.send}>
            <Text style={{fontWeight : 'bold', color : 'white'}}>{GLOBAL.Send}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn_receive}
            onPress={()=>this.props.navigation.navigate('Receive')}>
            <Text style={{fontWeight : 'bold', color : 'white'}}>{GLOBAL.Receive}</Text>
          </TouchableOpacity>
          </View>

      </ImageBackground>
    );
  }

  logout = () => {
      Alert.alert(
      GLOBAL.Logout,
      GLOBAL.Wantlogout,
      [
        {text: GLOBAL.No, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: GLOBAL.Yes, onPress: () => {
          fetch("https://br.sgbas.com/api/v2/logout?uid="+this.state.uid+"&token="+this.state.token,{
            method: "GET"
          })
          .then((response) => response.json())
          .then(res => {
            if (res.status){
              AsyncStorage.setItem("email" , '');
              AsyncStorage.setItem("password" , '');
              this.props.navigation.goBack(null);
            } else {
              Alert.alert(
                GLOBAL.Error,
                GLOBAL.InvalidCode
              )
            }
          })
          .done();
        }},
      ],
      { cancelable: false }
    )
  }
  refresh = () => {

    DialogProgress.show(options);
    fetch("https://br.sgbas.com/api/v2/asset?uid="+this.state.uid+"&token="+this.state.token,{
      method: "GET"
    })
    .then((response) => response.json())
    .then(res => {
      if (res.status === '1'){
        let  _reward = res.asset.MICL;
        this.setState({reward:_reward});

        DialogProgress.hide();
      } else {
        Alert.alert(
          GLOBAL.Alert,
          GLOBAL.NoConnection
        )
        DialogProgress.hide();
      }
    })
    .done();

  }
  openQr = () => {
    console.log('open Qr scanner');
  }
  send = () => {
    this.props.navigation.navigate('Send');
  }
  receive = () =>{
    this.props.navigation.navigate('Receive');
  }
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    paddingLeft : 10,
    paddingRight : 10,
  },
  refresh:
  {
    alignSelf: 'flex-end',
    margin : 10,
    width: 30,
    height: 30
  },
  logout :{
   alignSelf: 'flex-start',
   margin : 10,
   width: 30,
   height: 30
  },
  qrcode : {
   alignSelf: 'center',
   margin : 10,
    width: 30,
    height: 30,
  },
  logo : {
    width :50,
    height : 50,
  },
  btn_send : {
    flex : 1,
    backgroundColor : '#FFC507',
    borderRadius : 10,
    padding : 15,
    alignItems:'center'
  },
  btn_receive : {
    flex : 1,
    backgroundColor : '#00AC41',
    padding : 15,
    borderRadius : 10,
    marginLeft : 50,
    alignItems:'center'
  },

});
