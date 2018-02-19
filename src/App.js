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

import Display from './components/Display';
import Details from './components/Display';
import Swipe from './components/Display';

const backgroundImage = require('./assets/background.jpg');

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      connected: false, // Websocket connected
      values: {}, // Latest values 
      graphValues: [] // Values for the graph view.
    };

    this.emit = this.emit.bind(this);
    this.receive = this.receive.bind(this);

    this.socket = new WebSocket('ws://89.106.38.236:3000');
    this.socket.onopen = () => {
      this.setState({connected:true})
    }; 

    this.socket.onmessage = this.receive;

    this.socket.onerror = (e) => {
      console.log(e.message);
    };

    this.socket.onclose = (e) => {
      console.log(e.code, e.reason);
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.background} source={backgroundImage}>
          <Swipe/>
        </ImageBackground>
      </View>
    );
  }

  receive(msg) {
    if (Array.isArray(msg.data)) { // Array for graph view

  
    } else { // New values
      this.setState({values: msg.data})
    }
  }

  emit(message) {
    this.socket.send(message)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  background: {
    backgroundColor: '#ccc',
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
