/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image
} from 'react-native';
import {TabNavigator} from 'react-navigation';
import Reward from './Reward'
import CustomeNavigator from './index'
import Referral from './Referral'
import History from './History'
import Send from './Send'
import Receive from './Receive'
import GLOBAL from './Global'
import Icon from "react-native-vector-icons/FontAwesome";
  var myTabs = TabNavigator({
    Reward : {
      screen : CustomeNavigator,
      navigationOptions: {
          tabBarLabel:GLOBAL.Rewards,
          tabBarIcon: ({ focused }) => {
            if (focused){
              return <Image source={require("./images/reward_red.png")} style={{width : 20, height : 20}} />
            } else return <Image source={require("./images/reward_grey.png")} style={{width : 20, height : 20}} />
          }
      }
    },
    Referral : {
      screen : Referral,
      navigationOptions: {
          tabBarLabel:GLOBAL.Referral,
          tabBarIcon: ({ focused }) => {
            if (focused){
              return <Image source={require("./images/referral_red.png")} style={{width : 20, height : 20}} />
            } else return <Image source={require("./images/referral_grey.png")} style={{width : 20, height : 20}} />
          }
      }

    },
    History : {
      screen : History,
      navigationOptions: {
          tabBarLabel:GLOBAL.History,
          tabBarIcon: ({ focused }) => {
            if (focused){
              return <Image source={require("./images/history_red.png")} style={{width : 20, height : 20}} />
            } else return <Image source={require("./images/history_grey.png")} style={{width : 20, height : 20}} />
          }
      }
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled : true,
    swipeEnabled: false,
    tabBarOptions : {
      activeTintColor : 'red',
      showIcon  : true,
      inactiveTintColor: '#222222',
      style : {
        backgroundColor : '#EEEEEE'
      }
    }
  });
export default myTabs;
