

import React, { Component } from 'react';
import { StackNavigator, Header, StackActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';



import {
  ImageBackground,
  View,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import MainView from './containers/MainView';
import GraphSelectionView from './containers/GraphSelectionView';
import GraphView from './containers/GraphView';

//import backgroundImage from './assets/background.jpg';

/*  class App extends Component {
  render() {
    return (
      <ImageBackground style={styles.background} source={backgroundImage}>
        <MainView />
      </ImageBackground>
    )
  }
} */

const backArrow = (<Icon name="md-arrow-back" size={28} color="#fff" />);

export default StackNavigator({
  Main: {
    screen: MainView,
    navigationOptions: {
      header: null
    }
  },
  GraphSelection: {
    screen: GraphSelectionView,
    navigationOptions: ({navigation}) => ({
      title: "Select graphs",
      headerTransparent: true,
      headerTitleStyle: {
        flex: 1,
        color: '#FFF',
        fontSize: 28,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'sans-serif-thin'
      },
      headerLeft: (
        <TouchableHighlight
          onPress={() => navigation.goBack()}
          underlayColor={'#444444'}
          style={{padding: 16, marginLeft: 2, borderRadius: 28}}>
            {backArrow}
        </TouchableHighlight>
      ),
      headerRight: (<View></View>)
    })
  },
  Graph: {
    screen: GraphView,
    navigationOptions: ({navigation}) => ({
      title: '',
      headerTransparent: true,
      headerTitleStyle: {
        flex: 1,
        color: '#FFF',
        fontSize: 28,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: 'sans-serif-thin'
      },
      headerLeft: (
        <TouchableHighlight
          onPress={() => navigation.goBack()}
          underlayColor={'#444444'}
          style={{padding: 16, marginLeft: 2, borderRadius: 28}}>
            {backArrow}
        </TouchableHighlight>
      ),
      headerRight: (<View></View>)
    })
  }
});
