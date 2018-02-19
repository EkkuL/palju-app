import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

import Swiper from 'react-native-swiper'

class Display extends Component<Props> {
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.wrapper}>
          <View style={styles.padding}/>
          <View style={styles.screen}>
            <View style={styles.padding}/>
            <Text style={styles.screenText}>20:13</Text>
            <Text style={[styles.screenText, {textAlign: "right"}]}>35.7</Text>
            <View style={styles.padding}/>
          </View>
          <View style={styles.padding}/>
        </View>
        <View style={styles.wrapper}></View>
      </View>
    );
  }
}

  export default class Swipe extends Component<Props> {

    render(){

      return(
        <Swiper style={styles.swiper} hidesButtons>
        <View>     
          <Display/>
        </View>
        <View>     
          <Details/>
        </View>
        </Swiper>
      );
    }
  }

class Details extends Component<Props> {
  render() {
    return (
      <View style={{flex: 1}}>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  swiper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  wrapper: {
    flex: 1, 
    justifyContent: 'center', 
    flexDirection: 'row',
    alignItems: 'center'
  },

  screen: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 52, 84, 1)',
    borderStyle: 'solid',
    borderWidth: 8,
    borderColor: 'rgba(0,0,0,0.8)',
    height: 60,
  },

  screenText: {
    color: 'rgba(124, 170, 208, 0.7)',
    flex: 14,
    fontSize: 20,
  },

  padding: {
    flex: 1,
    height: 10
  }
})

//AppRegistry.registerComponent('PaljuApp', () => Component);
