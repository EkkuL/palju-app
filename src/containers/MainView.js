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
  Picker
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
  connected: 'CONNECTING',
  reconnecting: 'RECONNECTING',
  failed: 'FAILED'
}

const STATUS_LABELS = {
  FOFF: 'TURNING OFF',
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

    this.state = {
      connectionStatus: CONNECTION_STATUSES.connecting,
      connectionAnimationDone: false,
      values: {},
      editedValues : {},
      sentValues: {},
      disconnected: false
    };

  }

  
  connect = () => {
    this._socket = new WebSocket('ws://' + config.websocketAddress, 'mobile');

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
        this.connect();
        this.setState({
          connectionStatus: CONNECTION_STATUSES.reconnecting
        });
      }, 10000) // Try to reconnect in 10 seconds
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
    const { connectionStatus, connectionAnimationDone, editedValues, sentValues, renderBurnerDialog } = this.state;
    console.log(this.state)

    return (
      <ImageBackground style={styles.background} source={backgroundImage}>
        {renderBurnerDialog && this.renderBurnerDialog()}
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

    return (
      <View style={{flexDirection: 'column'}}>
        < InformationRow
          label={STATUS_LABELS[values.warming_phase]}
          unit={'°C'}
          style={{marginTop: 0, marginLeft: 20, marginRight: 20}}
          labelTextStyle={{fontSize: 22}}
          value={values.temp_high}
          progress={Math.min(parseFloat(values.water_level,10) / parseFloat(values.water_level_target,10) * 100, 100)}
          valueTextStyle={{fontSize: 52}}
          editable={true} 
          decorator={disconnected ? (<View style={styles.offSync}><MaterialIcon name="sync-problem" size={40} color="#299BFF" onPress={ () => {ToastAndroid.show('Data shown is older than 3 minutes', ToastAndroid.SHORT)}} /></View>) : null}
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
        <InformationRow
          label={'EGT'}
          unit={'°C'}
          style={styles.smallInfo}
          labelTextStyle={styles.smallInfoLabel}
          value={values.egt}
          valueTextStyle={styles.smallInfoValue}
        />
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
    data.egt = "140.2";   

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
  //  alignSelf: 'flex-end'
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

  bottomButtonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 20,
    padding: 10,
    backgroundColor: '#299BFF',
    margin: 10,
  },
});