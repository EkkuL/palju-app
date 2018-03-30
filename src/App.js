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

import config from '../config'

import moment from 'moment'

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      connected: false, // Websocket connected
      values: {}, // Latest values 
      graphValues: [], // Values for the graph view.
      active: false, // Is the PALJU online or offline
      graphValues: [], // Values for the graph view.
    };   
  }

  componentDidMount() {

    this.connect();

    // If the received data is not 
    this.connectionCheckIntervalId = setInterval( () => {
      this.checkDataValidity(this.state.values);
    }, 5000)

  }

  componentWillUnmount() {
    clearInterval(this.connectionCheckIntervalId);
    clearTimeout(this.reconnectTimeoutId);
  }

  connect = () => {
    this.socket = new WebSocket('ws://' + config.websocketAddress, 'mobile');

    this.socket.onopen = () => {

      this.setState({
        connected: true,
        active: false,
      });

    }; 

    this.socket.onmessage = this.receive;

    this.socket.onerror = (e) => {
      console.log(e.message);
    };

    this.socket.onclose = (e) => {
      this.reconnectTimeoutId = setTimeout(this.connect, 10000) // Try to reconnect in 10 seconds
      this.setState({
        connected: false,
      });
    };
  }

  checkDataValidity = (values) => {
    if(values.timestamp + 180 > moment().unix()) {
      console.log("asdsad")
      this.setState({
        active: true
      });
    } else if (Object.keys(values).length > 0) {
       if (this.state.active) {
         this.setState({
           active: false
         });
       } 
    }
  }

  receive = (msg) => {
    console.log("Got message: " + msg)
    console.log(msg.data)
    
    const data =  JSON.parse(msg.data);

    if (Array.isArray(data)) { // Array for graph view

    } else if (Object.keys(data).length === 0){
      this.setState({
        values: data,
        active: false,
      });
    } else {
      console.log("Setting state")
      // New values
      this.setState({
        values: data
      });

      this.checkDataValidity(data);
    }
  }

  // Expects string
  emit = (message) => {
    console.log("Emitting message (App.js): " + message )
    this.socket.send(message);
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.background} source={backgroundImage}>
      {/*    <Swiper style={styles.swiper} showButtons={false} showsPagination={false} loop={false}> */}
            <View style={{flex: 1}}>     
              <MainView values={this.state.values} emit={this.emit} connected={this.state.connected} active={this.state.active}/>
            </View>
            <View style={{flex: 1}}>     
              <GraphView/>
            </View>
         {/* </Swiper>*/}
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
