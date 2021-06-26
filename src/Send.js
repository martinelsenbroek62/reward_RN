/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Image,
  AsyncStorage,
  Alert
} from 'react-native';
import DialogProgress from 'react-native-dialog-progress';
const GLOBAL = require('./Global');
const options = {
    message:GLOBAL.Wait,
    isCancelable:true
}
export default class Send extends Component {
  static navigationOptions = {
    headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 },
    headerLeft: null,
  }
  constructor(props) {
    super(props);

    this.state = {
      uid : '',
      token : '',
      receiver : '',
      amount : '',
      memo : '',
    };
    this._loadInitialState().done();
  }
  _loadInitialState = async()=>{
    const _uid = await AsyncStorage.getItem('uid');
    this.setState({uid : _uid});
    const _token = await AsyncStorage.getItem('token');
    this.setState({token : _token});
  }

  render() {
    return (
      <ImageBackground style={styles.container} source={require('./images/send_bg.jpg')} resizeMode = "cover">
        <TouchableOpacity activeOpacity = { .5 } onPress={ ()=>this.props.navigation.goBack() }>
          <Image source={require('./images/close.png')} style={styles.ImageClass}/>
        </TouchableOpacity>
        <View style={{ alignSelf : 'stretch', alignItems : 'center'}}>
          <Text style={{fontWeight : 'bold',fontSize : 30}}>{GLOBAL.Send}</Text>
        </View>
        <View style={{flexDirection : 'column', alignSelf : 'stretch', padding : 40, alignItems :'center'}}>
          <TextInput
            style={styles.textInput} placeholder={GLOBAL.Receiver}
            onChangeText={ (receiver) => this.setState({receiver})}
            />
          <TextInput
            style={styles.textInput} placeholder={GLOBAL.Amount}
            onChangeText={ (amount) => this.setState({amount})}
            />
          <TextInput
            style={styles.textInput} placeholder={GLOBAL.Memo}
            onChangeText={ (memo) => this.setState({memo})}
            />
          <TouchableOpacity
            style={styles.btn}
            onPress={this.send}>
            <Text style={{fontWeight : 'bold', color : 'white'}}>{GLOBAL.Send}</Text>
          </TouchableOpacity>
        </View>

      </ImageBackground>
    );
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
  send = () => {
    if (this.state.receiver === "" || this.state.amount === "")
    {
      Alert.alert(
        GLOBAL.Alert,
        GLOBAL.FillAll
      )
    } else {
      fetch("https://br.sgbas.com/api/v2/transfercheck?uid="+this.state.uid+"&token="+this.state.token+"&receiver="+this.state.receiver+"&symbol=1&amount="+this.state.amount+"&lang="+GLOBAL.Lang,{
        method: "GET",
      })
      .then(response => response.json())
      .then(res=>{
        if(res.status === '1'){
          Alert.alert(
            GLOBAL.Alert,
            "Confirm transfer to " + res.message,
            [
              {text: GLOBAL.Cancel, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: GLOBAL.Confirm, onPress: () => {
                DialogProgress.show(options);
               fetch("https://br.sgbas.com/api/v2/transferexecute?uid="+this.state.uid+"&token="+this.state.token+"&receiver="+this.state.receiver+"&symbol=1&amount="+this.state.amount+"&lang="+GLOBAL.Lang,{
                  method: "GET",
                })
                .then(response => response.json())
                .then(res=>{
                  DialogProgress.hide();
                  if(res.status === '1'){
                    this.props.navigation.goBack();
                  } else {
                    Alert.alert(
                      GLOBAL.Alert,
                      res.message
                    )
                  }
                })
                .done();
              }},
            ],
            { cancelable: false }
          )

        } else {
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
  container: {
    flex : 1,
    height : '100%',
  },
  textInput : {
    alignSelf : 'stretch',
  },
  ImageClass:
  {
    margin : 20,
    alignSelf: 'flex-end',
    width: 20,
    height: 20
 },
 btn : {
   backgroundColor : '#00AC41',
   padding : 15,
   width : 200,
   borderRadius : 10,
   alignItems:'center'
 }
});
