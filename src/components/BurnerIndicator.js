import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';



export default class BurnerIndicator extends Component {

  constructor(props) {
    super(props);
    this.state = {
      blinkingAnim: new Animated.Value(0),
      target: 1
    }
  }

  componentDidMount() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.blinkingAnim, {
          toValue: 0.9,
          duration: 500,
          delay: 500
        }),
        Animated.timing(this.state.blinkingAnim, {
          toValue: 0.1,
          duration: 500,
          delay: 1000
        })
      ])
    ).start()
  }


  render() {
    const innerFlame = (<Icon name="md-flame" size={20} color="#0d3454" style={styles.innerIcon} elevation={5}/>);
    const outerFlame = (<Icon name="md-flame" size={40} color="#8ea8be" style={styles.outerIcon} elevation={4}/>);

    let { blinkingAnim } = this.state;

    return (
      <View style={styles.wrapper}>
        <Animated.View style={{opacity: blinkingAnim, width: 40, height: 40}}>
          {outerFlame}
        </Animated.View>
        {innerFlame}
      </View>
    )
  }
}

const styles = StyleSheet.create({

  wrapper: {
    position: 'relative',
  },
  
  innerIcon: {
    position: 'absolute',
    right: 16,
    top: 15
  },

  outerIcon: {
    opacity: 0.7,
    position: 'absolute',
    right: 10,
    // textShadowColor: 'rgba(255, 255, 255, 0.75)',
    // textShadowOffset: {width: -1, height: 1},
    //textShadowRadius: 10
  }
});