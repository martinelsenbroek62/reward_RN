/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  AsyncStorage,
  Alert
} from 'react-native';

import DialogProgress from 'react-native-dialog-progress';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
const GLOBAL = require('./Global');
const tabBarIcon = name => ({ tintColor }) => (
  <Ionicons name={name} color={tintColor} size={24} />
);
const options = {
    message:GLOBAL.Wait,
    isCancelable:true
}
export default class History extends Component {
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
      tableData : [ ],
    }
    this._loadInitialState().done();
  }
  _loadInitialState = async()=>{
    DialogProgress.show(options);

    const _uid = await AsyncStorage.getItem('uid');
    this.setState({uid : _uid});
    const _token = await AsyncStorage.getItem('token');
    this.setState({token : _token});

    fetch("https://br.sgbas.com/api/v2/transferlogs?uid="+this.state.uid+"&token="+this.state.token+"&lang="+GLOBAL.Lang,{
      method: "GET"
    })
    .then((response) => response.json())
    .then(res => {

      DialogProgress.hide();
      if (res.status === '1'){
        var i = 0, result = [];

        while(i < res.logs.length){
            result.push([])
            for(var key in res.logs[i]){
                result[result.length-1].push(res.logs[i][key])
            }
            i++;
        }
        this.setState({tableData:result});

        // this.setState({tableData:res.logs.datetime});
      } else {
        Alert.alert(
          GLOBAL.Alert,
          res.message
        )
      }
    })
    .done();
  }
  render() {
    return (
      <ImageBackground style={styles.container} source={require('./images/send_bg.jpg')} resizeMode = "cover">
        <View style={{ alignSelf : 'stretch', alignItems : 'center', marginTop : 30}}>
          <Text style={{fontWeight : 'bold',fontSize : 30}}>{GLOBAL.Logs}</Text>
        </View>
        <ScrollView style={{ flex: 1, marginTop : 30}}>
        {this.state.tableData.length?(
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
            <Rows data={this.state.tableData} textStyle={styles.text} flexArr={[1,2]}/>
          </Table>
        ):(
          <View style={{ alignSelf : 'stretch', alignItems : 'center'}}>
            <Text>{GLOBAL.Norecords}</Text>
          </View>
        )}

        </ScrollView>
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
  text: { margin: 6 }
});
