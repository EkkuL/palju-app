import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableWithoutFeedback
} from 'react-native';

import Swiper from 'react-native-swiper'

export default class Display extends Component {

  constructor(props) {
    super(props);

    this.state = {
      extended: false, // Is the screen extended.
    }
  }

  render() {
    console.log(this.state.extended)
    let screenContent = (
      <View style={{flex: 14, flexDirection: 'row'}}>
        <View style={styles.padding}/>
        <Text style={styles.screenText}>20:13</Text>
        <Text style={[styles.screenText, {textAlign: "right"}]}>35.7</Text>
        <View style={styles.padding}/>
      </View>
    )
    return (
      <TouchableWithoutFeedback style={{flex: 1}} onPress={this.handleExtend}>
        <View style={{flex: 1}}>
          <View style={styles.wrapper}>
              <View style={styles.padding} />
              <View style={[styles.screen,  this.state.extended ? {height: 500} : {height: 60}]}>
                <View style={styles.padding}/>
                {screenContent}
                <View style={styles.padding}/>
              </View>
              <View style={styles.padding}/>
          </View>
          <View style={styles.wrapper}></View>
        </View>
      </TouchableWithoutFeedback>

    );
  }

  handleExtend = () => {
    console.log("handle")
    this.setState({extended: !this.state.extended})
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
  },

  screen: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: 'rgba(13, 52, 84, 1)',
    borderStyle: 'solid',
    borderWidth: 8,
    borderColor: 'rgba(0,0,0,0.8)',
  },

  extendedScreen: {
    height: 500
  },

  screenText: {
    color: 'rgba(124, 170, 208, 0.7)',
    flex: 1,
    fontSize: 20,
  },

  padding: {
    flex: 1,
    height: 10
  }
})

//AppRegistry.registerComponent('PaljuApp', () => Component);
