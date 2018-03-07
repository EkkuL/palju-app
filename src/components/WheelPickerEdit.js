import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
} from 'react-native';

import {WheelPicker} from 'react-native-wheel-picker-android';
import Icon from 'react-native-vector-icons/Ionicons';

const confirm = (<Icon name="ios-checkmark" size={30} color="#7caad0" />);
const cancel = (<Icon name="ios-close" size={30} color="#7caad0" />);

const pickerValues = {
  warming_phase: [['ON', 'FOFF']], 
  target: [Array.from({length:25},(v,k)=>k+20), Array.from({length:10},(v,k)=>k)], 
  low_limit: [Array.from({length:25},(v,k)=>k+20), Array.from({length:10},(v,k)=>k)], 
};

export default class MainView extends Component {

    constructor(props) {
      super(props);

      this.state = {
        values: [null, null],
      };
    }

    render() {

      // pickerValues[this.props.editKey].forEach

      let pickers = (
          <View style={{flex: 2, flexDirection: 'row', paddingLeft: 50, paddingRight: 50}}>
          <WheelPicker
            onItemSelected={(event)=>{this.setState((prevState) => ( {values: [event.data, prevState.values[1]]} )) }}
            isCurved
            renderIndicator
            indicatorColor={'#7caad0'}
            itemTextColor={'#7caad0'}
            itemSpace={20}
            data={Array.from({length:25},(v,k)=>k+20)}
            style={{width:50, height: 300, flex: 1}}/>
          <Text style={{color: '#7caad0', paddingTop:125, fontSize: 35}}>.</Text>
          <WheelPicker
            onItemSelected={(event)=>{ this.setState((prevState) => ( {values: [prevState.values[0], event.data]} )) }}
            isCurved
            renderIndicator
            indicatorColor={'#7caad0'}
            itemTextColor={'#7caad0'}
            itemSpace={20}
            data={Array.from({length:10},(v,k)=>k)}
            style={{width:50, height: 300, flex: 1}}/>
        </View>
      )

      return (
          <View style={[styles.screenContentWrapper, {flexDirection: 'column'}]}>
              {pickers}
            <View style={{flex: 1, flexDirection: 'row', paddingLeft: 20, paddingRight: 20, alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={styles.editButton}>
                <TouchableNativeFeedback style={styles.editButton}  onPress={this.props.onCancel}>
                  <View style={styles.editTextWrapper}><Text style={styles.editText}>{cancel}</Text></View>
                </TouchableNativeFeedback>
              </View>
              <View style={styles.editButton}>
                <TouchableNativeFeedback style={styles.editButton}  onPress={()=>{this.props.onSave(this.props.editKey, this.state.values.join('.'))}}>
                  <View style={styles.editTextWrapper}><Text style={styles.editText}>{confirm}</Text></View>
                </TouchableNativeFeedback>
              </View>
            </View>
          </View>
        )  
  }
}

const styles = StyleSheet.create({

    wheelPicker: {
      width: 50,
      height: 100
    },
    editButton: {
      margin: 10,
      height: 30,
      flex: 1,
      borderColor: '#7caad0',
      borderWidth: 1
    },
    editTextWrapper: {
        alignItems: 'center', 
        justifyContent: 'center'
    },
    editText: {
        color: '#7caad0',
        textAlign: 'center'
    },
    screenContentWrapper: {
        width: '100%',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        height: 500
      },

});  