import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View
  } from 'react-native';
  

export default class GraphView extends Component<Props> {
    render() {
      return (
        <View style={{flex: 1}}>
          <Text style={{color: '#FFF'}}> Moi </Text>
        </View>
      );
    }
  }