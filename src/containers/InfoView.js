import backgroundImage from '../assets/background.jpg';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
  AsyncStorage,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';

import InformationRow from '../components/InformationRow';

export default class InfoView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ip: null,
      finishedLoading: false
    }
  }

  componentDidMount(){
    console.log("Did mount")
    AsyncStorage.getItem('serverIp').then(value => {
      console.log("Did load " + value)

      this.setState({ip: value, finishedLoading: true})
    }).catch(error => {
      ToastAndroid.show('Error in retrieving the ip', ToastAndroid.SHORT)
    });
  }

  render() {
    const {ip, finishedLoading} = this.state;
    return (
      <ImageBackground style={styles.background} source={backgroundImage}>
        <View style={{flex: 1, marginTop: 60, marginLeft: 20, marginRight: 20}}>
        {finishedLoading ? 
          <InformationRow
            label={'SERVER IP'}
            style={styles.smallInfo}
            labelTextStyle={styles.smallInfoLabel}
            value={ip}
            unit={''}
            keyboardType={'default'}
            valueTextStyle={styles.smallInfoValue}
            editable={true}
            onEndEditing={this.onIpChange}
          />
        :
        (<ActivityIndicator size={40} color="#299BFF" />)  

        }
        </View>
      </ImageBackground>
    )
  }

  onIpChange = (newIp) => {
    console.log("onIpChange " + newIp)

    AsyncStorage.setItem('serverIp', newIp).then(() => {
      this.setState({ip: newIp})
      console.log("Set new ip " + newIp)

    }).catch(error => {
      // Error retrieving data
      ToastAndroid.show('Error storing the ip', ToastAndroid.SHORT)
    });
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  smallInfoLabel: {
    fontSize: 14
  },
  
  smallInfoValue: {
    fontSize: 26
  },
  smallInfo: {
    width: '100%',
    marginTop: 10
  },
})