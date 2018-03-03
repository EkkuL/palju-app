/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  ImageBackground,
  View
} from 'react-native';

import Swiper from 'react-native-swiper'

import MainView from './components/MainView';
import GraphView from './components/GraphView';

import backgroundImage from './assets/background.jpg';

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      connected: false, // Websocket connected
      values: {}, // Latest values 
      graphValues: [] // Values for the graph view.
    };

    this.socket = new WebSocket('ws://89.106.38.236:3000');

    this.socket.onopen = () => {
      this.setState({
        connected: true,
      });
    }; 

    this.socket.onmessage = this.receive;

    this.socket.onerror = (e) => {
      console.log(e.message);
    };

    this.socket.onclose = (e) => {
      console.log(e.code, e.reason);
    };
  }

  receive = (msg) => {
    if (Array.isArray(msg.data)) { // Array for graph view

    } else {
      // New values
      this.setState({
        values: msg.data,
      });
    }
  }

  emit = (message) => {
    this.socket.send(message);
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.background} source={backgroundImage}>
          <Swiper style={styles.swiper} showButtons={false} showsPagination={false} loop={false}>
            <View style={{flex: 1}}>     
              <MainView values={this.state.values}/>
            </View>
            <View style={{flex: 1}}>     
              <GraphView/>
            </View>
          </Swiper>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swiper: {
    flex: 1,
  },
  background: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
