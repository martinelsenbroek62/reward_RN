import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { enhance } from 'react-navigation-addons'
import Reward from './Reward'
import Send from './Send'
import Receive from './Receive'

const CustomeNavigator = enhance(StackNavigator)({
  Reward : { screen : Reward,
    overrideBackPress : true},
  Send: { screen: Send ,},
  Receive: { screen: Receive,},
})

export default CustomeNavigator
