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
  Button,
  ImageBackground,
  Animated
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import backgroundImage from '../assets/background.jpg';

import GraphView from './GraphView';
import WheelPickerEdit from './WheelPickerEdit';
import BurnerIndicator from './BurnerIndicator'

const minHeight = 90;
const maxHeight = 500;
const confirm = (<Icon name="ios-arrow-round-forward" size={30} color="#7caad0" />);
const cancel = (<Icon name="ios-close" size={30} color="#7caad0" />);
const sad = (<EntypoIcon name="emoji-sad" size={26} color="#8ea8be" elevation={4}/>);

const pickerValues = {
  warming_phase: [ ['ON', 'FOFF'] ], 
  target: [ Array.from({length:25},(v,k)=>k+20), Array.from({length:10},(v,k)=>k) ], 
  low_limit: [ Array.from({length:25},(v,k)=>k+20), Array.from({length:10},(v,k)=>k) ], 
};

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


const { UIManager } = NativeModules;

//sconst sync = (<Icon name="ios-sync" size={30} color="#7caad0" />);

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

class MainView extends Component {

  constructor(props) {
    super(props);
    this.animationRunning = false;
    this.state = {
      extended: false,
      height: new Animated.Value(minHeight),
      // Show some random data for development, if no server connection.
      data: typeof someVar !== 'undefined' && this.props.keys.length > 0 ? this.props.values : {temp_low: '36.7', temp_high: '36.9', temp_ambient: '10.0', warming_phase: 'ON', target: '38.0', low_limit: '36.5', timestamp: 1514764800, estimation: 1514767200},
      updateData: {},
      edit: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.values})

    if(!nextProps.active && this.state.extended){
      this.handleExtend()
      console.log("De-extend")
      //this.props.active = false;
    }
  }

  render() {

    const data = { ...this.state.data };
    const timestamp = new Date(data.timestamp * 1000);
    let { height } = this.state;

    let basicView = (this.props.active && this.props.connected) ? this.renderBasicView() : this.renderOffline();


    
    let extraViewData = { ...data };
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
      ? <WheelPickerEdit onSave={this.updateValue} onCancel={this.cancelEdit}
      editKey={this.state.edit} values={pickerValues[this.state.edit]} currentValue={this.state.data[this.state.edit].toString()} />
      : (
        <View style={styles.screenContentWrapper}>
          <TouchableWithoutFeedback style={{width: '100%'}} onPress={this.handleExtend} onLongPress={this.handleLongPress}>
            { basicView }
          </TouchableWithoutFeedback>
          { extraView }
          { Object.keys(this.state.updateData).length > 0 &&
            this.renderButtons()
          }
        </View>

      );

    return (
      <ImageBackground style={styles.background} source={backgroundImage}>
        <View style={styles.wrapper}>
          <Animated.View style={[{height: this.state.height}, styles.screen]}>
            {content}
          </Animated.View> 
        </View>
      </ImageBackground>
    );
  }

  renderButtons = () => {
    return (
      <View style={{flex: 1, flexDirection: 'row', paddingLeft: 20, paddingRight: 20, alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={styles.editButton}>
          <TouchableNativeFeedback onPress={this.handleCancel}>
            <View style={styles.editTextWrapper}>
              <Text style={styles.editText}>{cancel}</Text>
            </View>
          </TouchableNativeFeedback> 
        </View>
        <View style={styles.editButton}>
          <TouchableNativeFeedback onPress={this.handleSend}>
            <View style={styles.editTextWrapper}>
              <Text style={styles.editText}>{confirm}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    )
  }

  renderBasicView = () => {
    const data = { ...this.state.data };
    const timestamp = moment(data.timestamp * 1000);

    console.log(timestamp)
    return (
      <View style={styles.basicView}>
        <View style={{flex: 1}}>
          <Text style={[styles.textBig, {textAlign: 'left'}]}>{timestamp.format('HH:mm')}</Text>
          <Text style={[styles.textSmall, {textAlign: 'left'}]}>{timestamp.format('DD.MM.YY')}</Text> 
        </View> 
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
          { this.state.data['warming_phase'] === 'ON' && <BurnerIndicator /> }
          <Text style={[styles.textBig, {textAlign: 'right', fontSize: 32}]}>{data.temp_high + '°C'}</Text>
        </View>
      </View>
    )
  }

  renderOffline = () => {
    return (
      <View style={styles.basicView}>
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
          {sad}
          <Text style={[styles.textMedium, {textAlign: 'center'}]}>Palju is offline </Text>
        </View>  
      </View>
    )
  }



  handleExtend = () => {
    if(this.props.active){
      if (!this.animationRunning){ 
        this.animationRunning = true;
        console.log("New anim" + this.animationRunning)
        Animated.timing(this.state.height, {
          toValue: this.state.extended ? minHeight : maxHeight,
          duration: 500
        }).start(() => { this.setState({ extended: !this.state.extended}); this.animationRunning = false;})
      }
    }
  };

  handleLongPress = () => {
    console.log("Long press")
    this.props.navigation.navigate('Graph')
  }

  handleSend = () => {
    const { emit } = this.props;
    const { updateData, data} = this.state;
    const newData = {...data, ...updateData};

    emit(JSON.stringify(newData));

    this.setState({data: {...newData}, updateData: {}})
  }

  handleCancel = () => {
    this.setState({updateData: {}})
  }

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
    if (this.state.data[key] != value) {
      this.setState(prevState => ({
        updateData: {
          ...prevState.updateData,
          [key]: value
        },
        edit: null
      }));
    } else {
      let newUpdateData = { ...this.state.updateData };
      delete newUpdateData[key]
      this.setState({updateData: newUpdateData, edit: null })
    }
  };

}


export default StackNavigator({
  Main: {
    screen: MainView,
  },
  Graph: {
    screen: GraphView
  },
},
{
  headerMode: 'none',
});

const styles = StyleSheet.create({  
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20
  },

  background: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
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

  textMedium: {
    fontFamily: 'notoserif',
    fontSize: 16,
    color: 'rgb(82, 124, 161)'
  },

  textSmall: {
    fontFamily: 'notoserif',
    fontSize: 12,
    color: 'rgb(82, 124, 161)'
  },

  editTextWrapper: {
    alignItems: 'center', 
    justifyContent: 'center'
  },
  
  editText: {
      color: '#7caad0',
      textAlign: 'center'
  },

  editButton: {
    margin: 10,
    height: 30,
    flex: 1,
    borderColor: '#7caad0',
    borderWidth: 1
  },
});