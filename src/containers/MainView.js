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
  Animated,
  Image,
  ScrollView
} from 'react-native';


import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../../config'
import EntypoIcon from 'react-native-vector-icons/Entypo';

import backgroundImage from '../assets/background.jpg';

import GraphSelectionView from './GraphSelectionView';

import InformationRow from '../components/InformationRow';
//import WheelPickerEdit from '../components/WheelPickerEdit';
//import BurnerIndicator from '../components/BurnerIndicator';
//import {ImageHeader} from '../components/ImageHeader';

const minHeight = 90;
const maxHeight = 500;
const confirm = (<Icon name="ios-arrow-round-forward" size={30} color="#7caad0" />);
const cancel = (<Icon name="ios-close" size={30} color="#7caad0" />);
const graphIcon = (<EntypoIcon name="line-graph" size={25} color="#ddd" />);
const infoIcon = (<EntypoIcon name="info-with-circle" size={25} color="#ddd" />);
//const sad = (<EntypoIcon name="emoji-sad" size={26} color="#8ea8be" elevation={4}/>);

/*const pickerValues = {
  warming_phase: [ ['ON', 'FOFF'] ], 
  target: [ Array.from({length:25},(v,k)=>k+20), Array.from({length:10},(v,k)=>k) ], 
  low_limit: [ Array.from({length:25},(v,k)=>k+20), Array.from({length:10},(v,k)=>k) ], 
};*/


const labels = {
  temp_low: 'LOW', 
  temp_high: 'TEMP HIGH', 
  temp_ambient: 'AMBIENT', 
  warming_phase: 'WARMING PHASE', 
  target: 'TARGET', 
  low_limit: 'LIMIT',
  egt: 'EGT'
};

const editable = {
  temp_low: false, 
  temp_high: false, 
  temp_ambient: false, 
  warming_phase: true, 
  target: true, 
  low_limit: true
};


/* const { UIManager } = NativeModules;
 */
//sconst sync = (<Icon name="ios-sync" size={30} color="#7caad0" />);

/* UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
 */

const CONNECTION_STATUSES = {
  connecting: 'CONNECTING',
  connected: 'CONNECTED',
  reconnecting: 'RECONNECTING'
}

const STATUS_LABELS = {
  FOFF: 'TURNING OFF',
  OFF: 'SHUTDOWN',
  ON: 'WARMING UP',
  UPKEEP: 'UPKEEP'
}

export default class MainView extends Component {

  constructor(props) {
    super(props);

    this._socket = undefined;

    this.state = {
      connectionStatus: CONNECTION_STATUSES.connecting,
      connectionAnimationDone: false,
      values: {}
    };

  }

  
  connect = () => {
    this._socket = new WebSocket('ws://' + config.websocketAddress, 'mobile');

    this._socket.onopen = () => {
      this.setState({ connectionStatus: CONNECTION_STATUSES.connected });
    };

    this._socket.onmessage = this.receive;

    this._socket.onerror = (e) => {
      console.log(e.message);
    };

    this._socket.onclose = (e) => {
      this.reconnectTimeoutId = setTimeout(this.connect, 10000) // Try to reconnect in 10 seconds
      this.setState({
        connectionStatus: CONNECTION_STATUSES.reconnecting,
      });
    };
  }

  componentWillMount() {
    this.connect();
  }
  
  componentWillUnmount() {
    this._socket.close();
    clearTimeout(this.reconnectTimeoutId);
  }

  render() {
    const { connected, connectionAnimationDone } = this.state;
    console.log(this.state)

    return (
      <ImageBackground style={styles.background} source={backgroundImage}>
        <ScrollView style={{flex: 1}}>
          { this.renderButtons() }
          { (connected == CONNECTION_STATUSES.connecting || !connectionAnimationDone) ? this.renderConnecting() : this.renderInformationRows() }
        </ScrollView>
      </ImageBackground>

    )
    
  }


  renderConnecting = () => {
    return (
      <InformationRow 
        label={'CONNECTING...'} 
        animated={true}
        value={' '}
        style={{flex: 1, marginTop: 0, marginLeft: 20, marginRight: 20}}
        labelTextStyle={{fontSize: 22}}
        valueTextStyle={{fontSize: 52}}
        finishedCallback={() => {
          console.log("Callback")
          this.setState({connectionAnimationDone: true})
        }}
      />
    )
  }

  renderInformationRows = () => {
    const { values } = this.state;

    return (
      <View style={{flexDirection: 'column'}}>
        < InformationRow
          label={STATUS_LABELS[values.warming_phase]}
          style={{marginTop: 0, marginLeft: 20, marginRight: 20}}
          labelTextStyle={{fontSize: 22}}
          value={values.temp_high + '°C'}
          valueTextStyle={{fontSize: 52}}
        />
        <InformationRow
          label={'LOW'}
          style={styles.smallInfo}
          labelTextStyle={styles.smallInfoLabel}
          value={values.temp_low + '°C'}
          valueTextStyle={styles.smallInfoValue}
        />
        <InformationRow
          label={'AMBIENT'}
          style={styles.smallInfo}
          labelTextStyle={styles.smallInfoLabel}
          value={values.temp_ambient + '°C'}
          valueTextStyle={styles.smallInfoValue}
        />
        <InformationRow
          label={'ESTIMATE'}
          style={styles.smallInfo}
          labelTextStyle={styles.smallInfoLabel}
          value={moment(values.estimation, 'X').format('HH:mm')}
          valueTextStyle={styles.smallInfoValue}
        />
        <InformationRow
          label={'EGT'}
          style={styles.smallInfo}
          labelTextStyle={styles.smallInfoLabel}
          value={values.egt + ( values.egt ? '°C' : '' ) }
          valueTextStyle={styles.smallInfoValue}
        />
        <InformationRow
          label={'LIMIT'}
          style={styles.smallInfo}
          labelTextStyle={styles.smallInfoLabel}
          value={values.low_limit + '°C'}
          valueTextStyle={styles.smallInfoValue}
        />
        <InformationRow
          label={'TARGET'}
          style={styles.smallInfo}
          labelTextStyle={styles.smallInfoLabel}
          value={values.target  + '°C'}
          valueTextStyle={styles.smallInfoValue}
        />
      </View>
    )
  }


  renderButtons = () => {

    return (
      <View style={{height: 50, marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end'}}>
        <TouchableNativeFeedback onPress={() => {this.props.navigation.navigate('GraphSelection')}}>
          <View style={styles.navButton}>
            {graphIcon}
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={() => {this.props.navigation.navigate('GraphSelection')}}>
          <View style={styles.navButton} >
            {infoIcon}
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }


  checkDataValidity = (values) => {
    if(values.timestamp + 180 > moment().unix()) {
      console.log("asdsad")
      this.setState({
        active: true
      });
    } else if (Object.keys(values).length > 0) {
       if (this.state.active) {
      //   this.setState({
      //     active: false
      //   });
       } 
    }
  }

  receive = (msg) => {
    console.log("Got message: " + msg)
    console.log(msg.data)
    
    const data =  JSON.parse(msg.data);

    if (Object.keys(data).length > 0){
      this.setState({
        values: data
      });
    }
  }

  // Expects string
  emit = (message) => {
    console.log("Emitting message (App.js): " + message )
    this._socket.send(message);
  }

  handleSend = () => {
    const { updateData, data } = this.state;
    const newData = {...data, ...updateData};

    this.emit(JSON.stringify(newData));

    this.setState({data: {...newData}, updateData: {}})
  }

  handleCancel = () => {
     this.setState({updateData: {}})
  }

  updateValue = (key, value) => {
   /*  if (this.state.data[key] != value) {
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
    } */
  };

}


const styles = StyleSheet.create({  
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#CCC'
  },

  navButton: {
    width: 50, 
    height: 50, 
    marginRight: 10, 
    backgroundColor: 'rgba(0,0,0,0.6)',
    opacity: 1, 
    borderRadius: 3, 
    borderColor: '#000', 
    borderWidth: 2,
    paddingTop: 10,
    paddingLeft: 10,
    opacity: 0.9
  },

  smallInfoLabel: {
    fontSize: 14
  },
  
  smallInfoValue: {
    fontSize: 26
  },

  smallInfo: {
    width: '45%',
    marginTop: 10,
    marginLeft: 20
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