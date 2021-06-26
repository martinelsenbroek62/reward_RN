/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  AsyncStorage
} from 'react-native';

import QRCode from 'react-native-qrcode';
const GLOBAL = require('./Global');

export default class Receive extends Component {
  static navigationOptions = {
    headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 },
    headerLeft: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      email : '',
    }
    this._loadInitialState().done();
  }
  _loadInitialState = async()=>{
    const _email = await AsyncStorage.getItem('email');
    this.setState({email : _email});
  }
  
  render() {
    return (
      <ImageBackground style={styles.container} source={require('./images/qr_bg.jpg')} resizeMode = "cover">
        <TouchableOpacity activeOpacity = { .5 } onPress={ ()=>this.props.navigation.goBack() }>
          <Image source={require('./images/close.png')} style={styles.ImageClass}/>
        </TouchableOpacity>
        <View style={{ alignSelf : 'stretch', alignItems : 'center'}}>
          <Text style={{fontWeight : 'bold',fontSize : 30}}>{GLOBAL.Receive}</Text>
        </View>

        <View
          style={{alignSelf : 'stretch', alignItems : 'center', top : 50, flex : 1}}>
          <QRCode
            value={this.state.email}
            size={200}
            bgColor='black'
            fgColor='white'/>
        </View>

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
  },
  ImageClass:
  {
    margin : 20,
    alignSelf: 'flex-end',
    width: 20,
    height: 20
 }
});
