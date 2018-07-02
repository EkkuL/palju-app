import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Animated
} from 'react-native';

import PropTypes from 'prop-types';


export default class InformationRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progressAnim: new Animated.Value(0)
    }
  }

  componentDidMount() {
    let { progressAnim } = this.state;
    const { animated, finishedCallback } = this.props;


    if (animated) {
      Animated.timing(progressAnim, {
        toValue: 100,
        duration: 2000,
        delay: 500
      }).start(() => { finishedCallback() })
    }
  }

  render() {
    const { value, label, animated, style, labelTextStyle, valueTextStyle } = this.props;
    let { progressAnim } = this.state;

    return (
      <View style={style}>
        <Text style={[styles.valueText, valueTextStyle]}>{value}</Text>
        <View style={styles.progressWrapper}>
          <View style ={[styles.progressBarBg, {opacity: (animated ? 0.4 : 0.8) }]}>
          </View>
          <Animated.View style={[styles.progressBar, { width: progressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '1%'],
          }) }]}></Animated.View>
        </View>
        <Text style={[styles.labelText, labelTextStyle]}>{label}</Text>
      </View>
    )
  }
}

InformationRow.defaultProps = {
  value: '', 
  label: '', 
  animated: false,
  finishedCallback: () => {},
  style: {},
  labelTextStyle: {}, 
  valueTextStyle: {}
}

InformationRow.propTypes = {
  value: PropTypes.string, 
  label: PropTypes.string, 
  animated: PropTypes.bool,
  finishedCallback: PropTypes.func
}


const styles = StyleSheet.create({
  progressBarBg: {
    height: 4,
    backgroundColor: '#299BFF',
    width: '100%',
    opacity: 0.4,
    position: 'absolute'
  },
  progressBar: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#299BFF',
    opacity: 0.8
  },
  progressWrapper: {
    marginBottom: 5
  },
  valueText: {
    fontSize: 24,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'left'
  },
  labelText: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'right'
  }
});