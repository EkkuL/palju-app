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
  ScrollView,
  Picker,
  AsyncStorage
} from 'react-native';


import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../../config'
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import backgroundImage from '../assets/background.jpg';

import GraphSelectionView from './GraphSelectionView';

import InformationRow from '../components/InformationRow';

const minHeight = 90;
const maxHeight = 500;
const confirm = (<Icon name="ios-arrow-round-forward" size={30} color="#7caad0" />);
const cancel = (<Icon name="ios-close" size={30} color="#7caad0" />);
const graphIcon = (<EntypoIcon name="line-graph" size={25} color="#ddd" />);
const infoIcon = (<EntypoIcon name="info-with-circle" size={25} color="#ddd" />);

const labels = {
  temp_low: 'LOW', 
  temp_high: 'TEMP HIGH', 
  temp_ambient: 'AMBIENT', 
  warming_phase: 'WARMING PHASE', 
  target: 'TARGET', 
  low_limit: 'LIMIT',
  egt: 'EGT',
  water_level: 'WATER LEVEL',
  water_level_target: 'WATER TARGET'
};

const editable = {
  temp_low: false, 
  temp_high: false, 
  temp_ambient: false, 
  warming_phase: true, 
  target: true, 
  low_limit: true
};

const CONNECTION_STATUSES = {
  connecting: 'CONNECTING',
  connected: 'CONNECTING',
  reconnecting: 'RECONNECTING',
  failed: 'FAILED'
}

const STATUS_LABELS = {
  FOFF: 'TURN OFF',
  OFF: 'BURNER OFF',
  ON: 'BURNER ON',
  UPKEEP: 'UPKEEP'
}

Object.filter = (obj, predicate) => {
  var filtered = Object.keys(obj)
    .filter( key => predicate(key, obj[key]) )
    .map( key => ({ [key]: obj[key] }) );
  return filtered.length > 0 ? Object.assign(...filtered ) : {};
}
  
Object.isEquivalent = (a, b) => {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  if (aProps.length != bProps.length) {
      return false;
  }
  for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      if (a[propName] !== b[propName]) {
          return false;
      }
  }

  return true;
}

export default class MainView extends Component {

  constructor(props) {
    super(props);

    this._socket = undefined;
    this.input = undefined;

    this.state = {
      connectionStatus: CONNECTION_STATUSES.connecting,
      connectionAnimationDone: false,
      values: {},
      editedValues : {},
      sentValues: {},
      disconnected: false
    };

  }

  
  connect = (ip) => {
    this._socket = new WebSocket('ws://' + ip, 'mobile');

    this._socket.onopen = () => {
      console.log("Open")
      this.setState({ connectionStatus: CONNECTION_STATUSES.connected });
    };

    this._socket.onmessage = this.receive;

    this._socket.onerror = (e) => {
      console.log("Error")

      console.log(e.message);
      this.setState({ connectionStatus: CONNECTION_STATUSES.failed });
    };

    this._socket.onclose = (e) => {
      console.log("Closing")

      this.reconnectTimeoutId = setTimeout(() => {
        AsyncStorage.getItem('serverIp').then(ip => {
          this.connect(ip);
        }).catch(error => {
          ToastAndroid.show('No server ip set', ToastAndroid.SHORT)
        })
        this.setState({
          connectionStatus: CONNECTION_STATUSES.reconnecting
        });
      }, 10000) // Try to reconnect in 10 seconds
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('serverIp').then(ip => {
      this.connect(ip);
    }).catch(error => {
      ToastAndroid.show('No server ip set', ToastAndroid.SHORT)
    })
  }
  
  componentWillUnmount() {
    this._socket.close();
    clearTimeout(this.reconnectTimeoutId);
  }

  render() {
    const { connectionStatus, connectionAnimationDone, editedValues, sentValues } = this.state;
    console.log(this.state)

    return (
      <ImageBackground style={styles.background} source={backgroundImage}>
        <ScrollView style={{flex: 1}}>
          { this.renderButtons() }
          { (connectionStatus != CONNECTION_STATUSES.connected || !connectionAnimationDone) ? this.renderConnecting() : this.renderInformationRows() }
        </ScrollView>

        {Object.keys(editedValues).length > 0 && (
          <TouchableNativeFeedback onPress={this.handleSend}>
            <Text style={styles.bottomButtonText}> {Object.keys(sentValues).length > 0 ? 'Sending...' : 'Send'} </Text>    
          </TouchableNativeFeedback>
        )}
      </ImageBackground>

    )
    
  }


  renderConnecting = () => {
    const { connectionStatus, connectionAnimationDone } = this.state;

    return (
      <InformationRow 
        label={`${connectionStatus}...`} 
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
    const { values, disconnected } = this.state;
    const currentValues = {...this.state.values, ...this.state.editedValues}

    return (
      <View style={{flexDirection: 'column'}}>
        < InformationRow
          label={STATUS_LABELS[currentValues.warming_phase]}
          unit={'°C'}
          style={{marginTop: 0, marginLeft: 20, marginRight: 20}}
          labelTextStyle={{fontSize: 22}}
          value={values.temp_high}
          progress={Math.min(parseFloat(values.water_level,10) / parseFloat(values.water_level_target,10) * 100, 100)}
          valueTextStyle={{fontSize: 52}}
          onPress={this.onMainRowPress} 
          decorator={
            disconnected ? (<View style={styles.offSync}><MaterialIcon name="sync-problem" size={40} color="#299BFF" onPress={ () => {ToastAndroid.show('Data shown is older than 3 minutes', ToastAndroid.SHORT)}} /></View>)
             : null }
        />
 
        <InformationRow
          label={'LOW'}
          unit={'°C'}
          style={styles.smallInfo}
          labelTextStyle={styles.smallInfoLabel}
          value={values.temp_low}
          valueTextStyle={styles.smallInfoValue}
        />
        <InformationRow
          label={'AMBIENT'}
          unit={'°C'}
          style={styles.smallInfo}
          labelTextStyle={styles.smallInfoLabel}
          value={values.temp_ambient}
          valueTextStyle={styles.smallInfoValue}
        />
        <InformationRow
          label={'ESTIMATE'}
          style={styles.smallInfo}
          labelTextStyle={styles.smallInfoLabel}
          value={moment(values.estimation, 'X').format('HH:mm')}
          valueTextStyle={styles.smallInfoValue}
        />
        {values.egt && <InformationRow
          label={'EGT'}
          unit={'°C'}
          style={styles.smallInfo}
          labelTextStyle={styles.smallInfoLabel}
          value={values.egt}
          valueTextStyle={styles.smallInfoValue}
        />}
        {values.fuel_level && <InformationRow
          label={'EGT'}
          unit={'°C'}
          style={styles.smallInfo}
          labelTextStyle={styles.smallInfoLabel}
          value={values.fuel_level}
          valueTextStyle={styles.smallInfoValue}
        />}
        <InformationRow
          label={'LIMIT'}
          unit={'°C'}
          style={styles.smallInfo}
          labelTextStyle={styles.smallInfoLabel}
          value={values.low_limit}
          valueTextStyle={styles.smallInfoValue}
          editable={true}
          onEndEditing={(value) => {this.onEndEditing({low_limit: value})}}
        />
        <InformationRow
          label={'TARGET'}
          unit={'°C'}
          style={styles.smallInfo}
          labelTextStyle={styles.smallInfoLabel}
          value={values.target}
          valueTextStyle={styles.smallInfoValue}
          editable={true}
          onEndEditing={(value) => {this.onEndEditing({target: value})}}
        />
        <InformationRow
          label={'WATER TARGET'}
          unit={'cm'}
          style={[styles.smallInfo, {paddingBottom: 20}]}
          labelTextStyle={styles.smallInfoLabel}
          value={values.water_level_target}
          valueTextStyle={styles.smallInfoValue}
          editable={true}
          onEndEditing={(value) => {this.onEndEditing({water_level_target: value})}}
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
        <TouchableNativeFeedback onPress={() => {this.props.navigation.navigate('Info')}}>
          <View style={styles.navButton} >
            {infoIcon}
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  onMainRowPress = () => {
    const currentValues = {...this.state.values, ...this.state.editedValues}
    const value = (currentValues.warming_phase == 'OFF' || currentValues.warming_phase == 'FOFF') ? 'ON' : 'FOFF'
    this.onEndEditing({warming_phase: this.state.values.warming_phase == value ? null : value});
  }

  onEndEditing = (newValue) => {
    let newValues = {...this.state.editedValues, ...newValue }
    // Filter null values (undo)
    newValues = Object.filter(newValues, (key, value) => value !== null); 
    this.setState({editedValues: Object.keys(newValues).length > 0 ? newValues : {} });
  }


  checkDataValidity = () => {
    const {values} = this.state;
    console.log([values.timestamp + 180, moment().unix()])
    this.setState({
      disconnected: values.timestamp + 180 < moment().unix()
    });
  }

  receive = (msg) => {
    const {sentValues, editedValues} = this.state;

    console.log("Got message: " + msg)
    console.log(msg.data)
    
    const data =  JSON.parse(msg.data);

    // Some test data until socket returns these
    //data.egt = "140.2";   
    //data.fuel_level = "5.2";

    if (Object.keys(data).length > 0){
      this.setState({
        values: data
      }, this.checkDataValidity);
      if (Object.keys(editedValues).length === 0 || Object.isEquivalent(Object.filter(data, (key,value) => Object.keys(editedValues).indexOf(key) !== -1), editedValues)){
        // Got the same response as sentValues
        this.setState({
          sentValues: {},
          editedValues: {}
        });
      }
    }

  }

  // Expects string
  emit = (message) => {
    console.log("Emitting message (App.js): " + message )
    this._socket.send(message);
  }

  handleSend = () => {
    const { values, editedValues } = this.state;
    const newData = {...values, ...editedValues};

    this.emit(JSON.stringify(newData));

    this.setState({sentValues: newData})
  }
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

  offSync: {
    width: 40, 
    height: 40
  },

  smallInfo: {
    width: '45%',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },

  background: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  bottomButtonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 20,
    padding: 10,
    backgroundColor: '#299BFF',
    margin: 10,
  },
});