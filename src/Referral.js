/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  AsyncStorage,
  TouchableOpacity,
  Alert,
  Clipboard
} from 'react-native';
const GLOBAL = require('./Global');
import Ionicons from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode';

const tabBarIcon = name => ({ tintColor }) => (
  <Ionicons name={name} color={tintColor} size={24} />
);
export default class Referral extends Component {
  static navigationOptions = {
    headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 },
    headerLeft: null,
    tabBarIcon: tabBarIcon('ios-information-circle'),
  }

  constructor(props) {
    super(props);
   this.state = {
     uid : '',
     token : '',
     idhash : '',
   }
    this._loadInitialState().done();
  }
  _loadInitialState = async()=>{
    const _uid = await AsyncStorage.getItem('uid');
    this.setState({uid : _uid});
    const _token = await AsyncStorage.getItem('token');
    this.setState({token : _token});
    const _idhash = await AsyncStorage.getItem('idhash');
    this.setState({idhash : 'https://br.sgbas.com/register?r='+_idhash});
  }
  render() {
    return (
      <ImageBackground style={styles.container} source={require('./images/qr_bg.jpg')} resizeMode = "cover">
        <View style={{ alignSelf : 'stretch', alignItems : 'center', marginTop : 30}}>
          <Text style={{fontWeight : 'bold',fontSize : 30}}>{GLOBAL.Referral}</Text>
        </View>
        <View
          style={{alignSelf : 'stretch', alignItems : 'center', top : 50, flex : 1}}>
          <QRCode
            value={this.state.idhash}
            size={200}
            bgColor='black'
            fgColor='white'/>
          <Text style={{width : 150, color : '#3f51b5', top : 30}}>{this.state.idhash}</Text>
          <TouchableOpacity activeOpacity = { .5 } style={styles.copy} onPress={()=>Clipboard.setString(this.state.idhash)}>
            <Text style={{fontWeight : 'bold',color : 'white'}}>{GLOBAL.Copy}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    paddingLeft : 10,
    paddingRight : 10
  },
  logout :{
   alignSelf: 'flex-start',
   margin : 10,
   width: 30,
   height: 30
  },
  copy : {
    backgroundColor : '#00bcd4',
    width : 100,
    borderRadius : 10,
    alignItems: 'center',
    padding : 15,
    top : 30
  }
});
