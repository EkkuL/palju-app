import React, { Component } from 'react';
import {
  NativeModules,
  LayoutAnimation,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  ToastAndroid,
  Button
} from 'react-native';

import WheelPickerEdit from './WheelPickerEdit';
import Icon from 'react-native-vector-icons/Ionicons';

const minHeight = 90;
const maxHeight = 500;

const { UIManager } = NativeModules;

//sconst sync = (<Icon name="ios-sync" size={30} color="#7caad0" />);

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const pickerValues = {
  warming_phase: [['ON', 'FOFF']], 
  target: [Array.from({length:25},(v,k)=>k+20), Array.from({length:10},(v,k)=>k)], 
  low_limit: [Array.from({length:25},(v,k)=>k+20), Array.from({length:10},(v,k)=>k)], 
};


export default class MainView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      extended: false,
      height: minHeight,
      data: {temp_low: 36.7, temp_high: 36.9, temp_ambient: 10.0, warming_phase: 'ON', target: 38.0, low_limit: 36.5, timestamp: 1514764800, estimation: 1514767200},
      updateData: {},
      edit: null,
    };
  }

  render() {

    const data = { ...this.state.data };

    const timestamp = new Date(data.timestamp * 1000)

    const basicView = (
      <View style={styles.basicView}>
        <View style={{flex: 1}}>
          <Text style={[styles.textBig, {textAlign: 'left'}]}>{timestamp.toLocaleTimeString('fi-FI', {hour: '2-digit', minute: '2-digit'})}</Text>
          <Text style={[styles.textSmall, {textAlign: 'left'}]}>{timestamp.getDate() + '.' + (timestamp.getMonth() + 1) + '.' + timestamp.getFullYear()}</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={[styles.textBig, {textAlign: 'right', fontSize: 32}]}>{data.temp_high + '°C'}</Text>
        </View>
      </View>
    )
    
    const extraViewData = { ...data };
    // Don't show twice.
    delete extraViewData.timestamp;
    delete extraViewData.estimation;

    const extraView = Object.keys(extraViewData).map(key => (
      <View key={key} style={styles.extraView}>
        <TouchableWithoutFeedback style={{width: '100%'}} onPress={() => this.editValue(key)}>
          <View>
            <View style={{flexDirection: 'row' }}>
              <View><Text style={[styles.textBig]}>{data[key]}</Text></View>
              {this.state.updateData[key] && data[key] !== this.state.updateData[key] && (<View><Text style={[styles.textBig, {color: '#7DA1C2'}]}> {'-> ' + this.state.updateData[key]}</Text></View>)}
            </View>
            <Text style={[styles.textSmall]}>{labels[key]}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    ));

    const content = this.state.edit !== null
      ? <WheelPickerEdit onSave={this.updateValue} onCancel={this.cancelEdit} editKey={this.state.edit} values={pickerValues[this.state.edit]} />
      : (
        <View style={styles.screenContentWrapper}>
          <TouchableWithoutFeedback style={{width: '100%'}} onPress={this.handleExtend}>
            {basicView}
          </TouchableWithoutFeedback>
          {extraView}
        </View>

      );

    return (
      <View style={styles.wrapper}>
        <View style={[styles.screen, {height: this.state.height}]}>
          {content}
        </View> 
      </View>
    );
  }

  handleExtend = () => {
    LayoutAnimation.linear();
    this.setState({
      height: this.state.extended ? minHeight : maxHeight, 
      extended: !this.state.extended
    });
  };

  editValue = (key) => {
    if (!editable[key]) {
      return ToastAndroid.show('This value is not editable.', ToastAndroid.SHORT);
    }
    this.setState({
      edit: key,
    });
  };

  cancelEdit = () => {
    this.setState({
      edit: null,
    });
  };

  updateValue = (key, value) => {
    this.setState((prevState) => {
      const newValue = parseFloat(value) ? parseFloat(value) : value;

      if (prevState.updateData[key] === newValue) {
        return {
          edit: null,
        };
      }
      
      return {
        updateData: {
          ...prevState.updateData,
          [key]: newValue,
       },
        edit: null,
      };
    });
  };

}

const styles = StyleSheet.create({  
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20
  },

  screen: {
    flex: 1,
    backgroundColor: 'rgba(13, 52, 84, 1)',
    borderStyle: 'solid',
    borderWidth: 8,
    borderColor: 'rgba(0,0,0,0.8)',
    overflow: 'hidden'
  },

  screenContentWrapper: {
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    height: 500
  },

  screenText: {
    color: 'rgba(124, 170, 208, 0.7)',
    flex: 1,
    fontSize: 20
  },

  extraView: {
    flex: 1
  },

  basicView: {
    flexDirection: 'row',
    flex: 1
  },

  textBig: {
    fontFamily: 'notoserif',
    fontSize: 20,
    color: 'rgb(82, 124, 161)'
  },
  textSmall: {
    fontFamily: 'notoserif',
    fontSize: 12,
    color: 'rgb(82, 124, 161)'
  }
});

const labels = {
  temp_low: 'TEMP LOW', 
  temp_high: 'TEMP HIGH', 
  temp_ambient: 'AMBIENT', 
  warming_phase: 'WARMING PHASE', 
  target: 'TARGET', 
  low_limit: 'LOW LIMIT'
};

const editable = {
  temp_low: false, 
  temp_high: false, 
  temp_ambient: false, 
  warming_phase: true, 
  target: true, 
  low_limit: true
};
