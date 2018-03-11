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

export default class MainView extends Component {

    constructor(props) {
      super(props);

      // Select the first values from the provided props as selected values.
      const values = this.props.values.map(values => { return values[0] })

      this.state = {
        values: values,
      };

     // this.handleItemSelected = this.handleItemSelected.bind(this);
    }

    render() {

      let pickers = this.props.values.map((values, idx) => {
        return <WheelPicker
            key={idx}
            onItemSelected={(event) => { this.handleItemSelected(event.data, idx) }}
            isCurved
            renderIndicator
            indicatorColor={'#7caad0'}
            itemTextColor={'#7caad0'}
            itemSpace={20}
            data={values}
            style={{width:50, height: 300, flex: 1}}/>
      });
  
      return (
          <View style={[styles.screenContentWrapper, {flexDirection: 'column'}]}>
              <View style={{flex: 2, flexDirection: 'row', paddingLeft: 50, paddingRight: 50}}>
                {pickers}
              </View>
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


  handleItemSelected(value, index) {
    let values = this.state.values;
    values[index] = value;
    this.setState({values: values});
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