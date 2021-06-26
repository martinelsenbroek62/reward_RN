import React, {Component} from 'react';
import {
   StyleSheet,
   View,
   Text,
   ImageBackground,
   Image,
   KeyboardAvoidingView,
   TextInput,
   TouchableOpacity,
   AsyncStorage,
   Alert,
   NetInfo,
   ActivityIndicator,
   BackHandler
 } from 'react-native';
 import DialogProgress from 'react-native-dialog-progress';
import { StackNavigator} from 'react-navigation';
import Main from './Main';
const GLOBAL = require('./Global');
const options = {
    message:GLOBAL.Wait,
    isCancelable:true
}
export default class Login extends Component {

  static navigationOptions = {
    headerStyle:{ position: 'absolute', backgroundColor: 'transparent', zIndex: 100, top: 0, left: 0, right: 0 },
    headerLeft: null
  }
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password : '',
      isConnected : true,
    };
    this._loadInitialState().done();

  }

  _loadInitialState = async()=>{
    const _email = await AsyncStorage.getItem('email');
    const _password = await AsyncStorage.getItem('password');
    if(_email !== '' && _email !== null){
      this.setState({email : _email});
      this.setState({password : _password});
      DialogProgress.show(options);
      fetch("https://br.sgbas.com/api/v2/login?email="+this.state.email+"&password="+this.state.password,{
        method: "GET"
      })
      .then((response) => response.json())
      .then((res) =>{
          DialogProgress.hide();
          if (res.status === "1"){
            AsyncStorage.setItem('uid',res.uid+'');
            AsyncStorage.setItem('token',res.token);
            AsyncStorage.setItem('idhash',res.idhash);
            AsyncStorage.setItem('email',this.state.email);
            AsyncStorage.setItem('password',this.state.password);
            AsyncStorage.setItem('reward',res.asset.MICL);

            this.props.navigation.navigate('Main');
          } else {
            Alert.alert(
              GLOBAL.Alert,
              GLOBAL.Unexpected,
            )
          }

      })
      .done();
    }
  }

  render() {

      return (

          <ImageBackground style={styles.container} source={require('./images/background.jpg')} resizeMode = "cover">
            <TextInput
              style={styles.textInput} placeholder={GLOBAL.Email}
              onChangeText={ (email) => this.setState({email})}
              />
            <View style={{flexDirection : 'row', alignSelf : 'stretch',justifyContent: 'space-between',}}>
              <TextInput
                style={styles.textInput1} placeholder={GLOBAL.Password}
                onChangeText={ (password) => this.setState({password})}
                secureTextEntry={true}
                />
              <TouchableOpacity
                style={{justifyContent: 'center'}}
                onPress={this.forgot}>
                <Text  style={{fontWeight : 'bold'}}>{GLOBAL.Forgot}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.btn}
              onPress={this.login}>
              <Text style={{fontWeight : 'bold',color : 'white'}}>{GLOBAL.Login}</Text>
            </TouchableOpacity>
            <View style={{flexDirection : 'row', paddingTop : 20,}}>
              <Text style={{fontWeight : 'bold'}}>{GLOBAL.NotMember}</Text>
              <TouchableOpacity
                style={{justifyContent: 'center'}}
                onPress={()=>this.props.navigation.navigate('Register')}>
                <Text  style={{color : 'red'}}>{GLOBAL.Register}</Text>
              </TouchableOpacity>
             </View>
          </ImageBackground>
      );
  }
  forgot = () => {
    fetch("https://br.sgbas.com/api/v2/resetpassword?email="+this.state.email+"&lang="+GLOBAL.Lang,{
      method: "GET"
    })
    .then(response => response.json())
    .then(res => {
      Alert.alert(
        GLOBAL.Alert,
        res.message
      )
    })
    .done();
  }
  login = () => {
    // this.props.navigation.navigate('Main');

    if (this.state.email !== "" && this.state.password !== ""){

      DialogProgress.show(options);
      fetch("https://br.sgbas.com/api/v2/login?email="+this.state.email+"&password="+this.state.password,{
        method: "GET"
      })
      .then((response) => response.json())
      .then((res) =>{
          DialogProgress.hide();
          if (res.status === "1"){
            AsyncStorage.setItem('uid',res.uid+'');
            AsyncStorage.setItem('token',res.token);
            AsyncStorage.setItem('idhash',res.idhash);
            AsyncStorage.setItem('email',this.state.email);
            AsyncStorage.setItem('password',this.state.password);
            AsyncStorage.setItem('reward',res.asset.MICL);

            this.props.navigation.navigate('Main');
          } else {
            Alert.alert(
              GLOBAL.Alert,
              GLOBAL.Unexpected,
            )
          }

      })
      .done();
    } else {
      Alert.alert(
        GLOBAL.Alert,
        GLOBAL.FillEmail,
      )
  }
  }

}

const styles = StyleSheet.create({
    container: {
      flex : 1,
      height : '100%',
      justifyContent: 'center',
      alignItems:'center',
      paddingLeft : 40,
      paddingRight : 40
    },
    textInput : {
      alignSelf : 'stretch',
      padding : 16,
    },
    textInput1 : {
      alignSelf : 'stretch',
      width : '80%',
      padding : 16,
    },
    btn : {
      backgroundColor : '#00AC41',
      padding : 15,
      width : 200,
      borderRadius : 10,
      alignItems:'center'
    },
})
