/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from 'react-native';
import Login from './Login';

const GLOBAL = require('./Global');
export default class Register extends Component {

  static navigationOptions = {
    headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 },
    headerLeft: null
  }
  constructor(props) {
    super(props);

    this.state = {
      name : '',
      email : '',
      password : '',
      cpassword : '',
    };
  }
  render() {
    return (
      <ImageBackground style={styles.container} source={require('./images/background.jpg')} resizeMode = "cover">
        <TextInput
          style={styles.textInput} placeholder={GLOBAL.Name}
          onChangeText={ (name) => this.setState({name})}
          />
        <TextInput
          style={styles.textInput} placeholder={GLOBAL.Email}
          onChangeText={ (email) => this.setState({email})}
          />
        <TextInput
          style={styles.textInput} placeholder={GLOBAL.Password}
          onChangeText={ (password) => this.setState({password})}
          secureTextEntry={true}
          />
        <TextInput
          style={styles.textInput} placeholder={GLOBAL.Confirm}
          onChangeText={ (cpassword) => this.setState({cpassword})}
          secureTextEntry={true}
          />
        <View style={{flexDirection : 'row', justifyContent : 'center'}}>
          <TouchableOpacity
            style={styles.btn_cancel}
            onPress={()=>this.props.navigation.goBack()}>
            <Text style={{fontWeight : 'bold',color : 'white'}}>{GLOBAL.Cancel}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={this.register}>
            <Text style={{fontWeight : 'bold',color : 'white'}}>{GLOBAL.Register}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
  register = () => {
    if (this.state.name === "" || this.state.email === "" || this.state.password === "" || this.state.cpassword === "")
    {
      Alert.alert(
        GLOBAL.Alert,
        GLOBAL.FillAll
      )
    }
    else if (this.state.password !== this.state.cpassword){
      Alert.alert(
        GLOBAL.Alert,
        GLOBAL.NoMatch
      )
    } else {
      fetch("https://br.sgbas.com/api/v2/register?name="+this.name+"&email="+this.state.email+"&password="+this.state.password+
      "&lang="+GLOBAL.Lang,{
        method: "GET"
      })
      .then((response) => response.json())
      .then((res) =>{
        if( res.status === '1'){
            this.props.navigation.goBack();
        }
        else {
          Alert.alert(
            GLOBAL.Alert,
            res.message
          )
        }
      })
      .done();
      }
    }

}

const styles = StyleSheet.create({
  wrapper : {
    flex :1,
  },
  container: {
    flex : 1,
    width : '100%',
    height : '100%',
    justifyContent: 'center',
    alignItems:'center',
    paddingLeft : 40,
    paddingRight : 40
  },
  textInput : {
    alignSelf : 'stretch',
    padding : 16,
    minWidth : 280,
  },
  btn : {
    backgroundColor : '#00AC41',
    padding : 15,
    width : 100,
    borderRadius : 10,
    marginLeft : 50,
    alignItems:'center'
  },
  btn_cancel : {
    backgroundColor : '#BBBBBB',
    padding : 15,
    width : 100,
    borderRadius : 10,
    alignItems:'center'
  },
  register : {
    justifyContent: 'center',
  }
});
