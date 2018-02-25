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

import {WheelPicker, DatePicker, TimePicker} from 'react-native-wheel-picker-android'


const minHeight = 90;
const maxHeight = 500;

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class MainView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      extended: false,
      height: minHeight,
      data: {temp_low: 36.7, temp_high: 36.9, temp_ambient: 10.0, warming_phase: 'ON', target: 38.0, low_limit: 36.5, timestamp: 1514764800, estimation: 1514767200},
      edit: null
    }
  }

  render() {

    let data = {...this.state.data};

    let timestamp = new Date(data.timestamp * 1000)

    let basicView = (
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
    
    let extraViewData = {...data};
    // Don't show twice.
    delete extraViewData.timestamp
    delete extraViewData.estimation

    let extraView = Object.keys(extraViewData).map(key => {

      return (
      
        <View key={key} style={styles.extraView}>
          <TouchableWithoutFeedback style={{width: '100%'}} onPress={() => this.editValue(key)}>
            <View>
              <Text style={[styles.textBig]}>{data[key]}</Text>
              <Text style={[styles.textSmall]}>{labels[key]}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )
    });

    let content = (
      <View style={styles.screenContentWrapper}>
        <TouchableWithoutFeedback style={{width: '100%'}} onPress={this.handleExtend}>
          {basicView}
        </TouchableWithoutFeedback>
        {extraView}
      </View>
    )

    if (this.state.edit != null){
      content = this.renderEditMode();
    }

    return (
      <View style={styles.wrapper}>
        <View style={[styles.screen, {height: this.state.height}]}>
              {content}
        </View> 
      </View>
    );
  }

  renderEditMode() {
    return (
      <View style={[styles.screenContentWrapper, {flexDirection: 'column'}]}>
        <View style={{flex: 2, flexDirection: 'row', paddingLeft: 50, paddingRight: 50}}>
          <WheelPicker
            onItemSelected={(event)=>{console.log(event)}}
            isCurved
            renderIndicator
            indicatorColor={'grey'}
            itemSpace={20}
            data={Array.from({length:25},(v,k)=>k+20)}
            style={{width:50, height: 300, flex: 1}}/>
          <Text style={{color: '#CCC', paddingTop:125, fontSize: 35}}>.</Text>
          <WheelPicker
            onItemSelected={(event)=>{console.log(event)}}
            isCurved
            renderIndicator
            indicatorColor={'grey'}
            itemSpace={20}
            data={Array.from({length:10},(v,k)=>k)}
            style={{width:50, height: 300, flex: 1}}/>
        </View>
        <View style={{flex: 1, flexDirection: 'row', paddingLeft: 20, paddingRight: 20, alignItems: 'center', justifyContent: 'space-between'}}>
          <View style={styles.editButton}>
            <TouchableNativeFeedback style={styles.editButton}  onPress={()=>{this.setState({edit: null})}}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}><Text style={{color: '#CCCCCC', textAlign: 'center'}}>Cancel</Text></View>
            </TouchableNativeFeedback>
          </View>
          <View style={styles.editButton}>
            <TouchableNativeFeedback style={styles.editButton}  onPress={()=>{this.setState({edit: null})}}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}><Text style={{color: '#CCCCCC', textAlign: 'center'}}>Confirm</Text></View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
    )
  }

  handleExtend = () => {
    LayoutAnimation.linear();
    this.setState({
      height: this.state.extended ? minHeight : maxHeight, 
      extended: !this.state.extended
    });
  }

  editValue(key){
    if (editable[key] == false)
      ToastAndroid.show("This value is not editable.", ToastAndroid.SHORT);
    else
      this.setState({edit: key})
      return
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
    borderColor: '#CCC',
    borderWidth: 2
  },
  
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
})

const labels = {
  temp_low: 'TEMP LOW', 
  temp_high: 'TEMP HIGH', 
  temp_ambient: 'AMBIENT', 
  warming_phase: 'WARMING PHASE', 
  target: 'TARGET', 
  low_limit: 'LOW LIMIT'
}

const editable = {
  temp_low: false, 
  temp_high: false, 
  temp_ambient: false, 
  warming_phase: true, 
  target: true, 
  low_limit: true
}