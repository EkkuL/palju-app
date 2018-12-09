import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableNativeFeedback,
  Animated,
  ToastAndroid
} from 'react-native';

import EntypoIcon from 'react-native-vector-icons/Entypo';
import PropTypes from 'prop-types';


export default class InformationRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progressAnim: new Animated.Value(0),
      value: props.value,
      displayUnit: props.unit ? true : false
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.value == this.state.value || !this.props.editable) {
      this.setState({value: nextProps.value});
    }
  }

  render() {
    const { label, animated, style, labelTextStyle, valueTextStyle, progress, editable, onFocus, onEndEditing, unit, decorator, onPress } = this.props;
    const { progressAnim, value, displayUnit } = this.state;

    return (
      <TouchableNativeFeedback onPress={() => {editable ? this.input.focus() : (typeof onPress == 'function' ? onPress() : ToastAndroid.show('This is not editable', ToastAndroid.SHORT))}}>
        <View style={style}>
            <View style={styles.rowWrapper}>
              { editable ? 
                <TextInput 
                  keyboardAppearance={'dark'} 
                  keyboardType={'numeric'} 
                  underlineColorAndroid='rgba(0,0,0,0)' 
                  style={[styles.valueTextInput,valueTextStyle]} 
                  value={`${value}${displayUnit ? unit : ''}`}
                  onFocus={this.onFocus}
                  onEndEditing={this.onEndEditing}
                  onChangeText={this.onChangeText}
                  ref={(input) => { this.input = input; }}
                />
                : 
                <Text style={[styles.valueText, valueTextStyle]}>{`${value}${displayUnit ? unit : ''}`}</Text>
              }
                {this.renderUndoIcon()}
                {decorator}
            </View>
              <View style={styles.progressWrapper}>
              <View style ={[styles.progressBarBg, {opacity: 0.4 }]}>
              </View>
              { 
                animated ? 
                  (<Animated.View style={[styles.progressBar, { width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '1%'],
                  }) }]}></Animated.View>) 
                : 
                  (<View style={[styles.progressBar, { width: `${progress}%` }]}></View>)
              }
            </View>

            <Text style={[styles.labelText, labelTextStyle]}>{label}</Text>
        </View>
      </TouchableNativeFeedback>

    )
  }

  renderUndoIcon = () => {
    const {editable} = this.props;
    const {value} = this.state;

    return (editable && value != this.props.value) ? (
      <View style={styles.undoIcon}>
        <EntypoIcon name="ccw" size={20} color="#299BFF" onPress={this.onUndo} />
      </View>
    ) : null
  }

  onFocus = () => {
    this.setState({displayUnit: false})
  }
  
  onEndEditing = () => {
    this.setState({displayUnit: true})
    if (this.state.value != this.props.value){
      this.props.onEndEditing(this.state.value);
    }
  }

  onChangeText = (value) => {
    this.setState({value});
  }

  onUndo = () => {
    this.setState({value: this.props.value}, () => {
      this.props.onEndEditing(null);
    });
  }
}

InformationRow.defaultProps = {
  value: '', 
  label: '',
  progress: 100, 
  animated: false,
  finishedCallback: () => {},
  style: {},
  labelTextStyle: {}, 
  valueTextStyle: {}
}

InformationRow.propTypes = {
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
    textAlign: 'left',
  },
  valueTextInput: {
    fontSize: 24,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'left',
    borderWidth: 0,
    paddingBottom: 0
  },
  labelText: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'right'
  },
  undoIcon: {
    width: 20, 
    height: 20
  },
  rowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
