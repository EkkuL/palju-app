import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  FlatList,
  View,
  ImageBackground,
  TouchableNativeFeedback
} from 'react-native';

import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons';

import Api from '../actions/Api';
import backgroundImage from '../assets/background.jpg';

const checkIcon = (<Icon name="md-checkmark" size={30} color="#3F96FF" />);

export default class GraphView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      values: [],
      multiSelect: false
    }
  }

  componentWillMount(){
    Api.fetchInstances((data) => { 
      this.setState({
        values: data.map((value, index) => { return {...value, selected: false}})
      });
    });
  }

  render() {
    const { values } = this.state;

    return (
      <ImageBackground style={styles.background} source={backgroundImage}>
        <View style={styles.container}>
          <FlatList 
            data={values}
            renderItem={this.renderListItem}
            keyExtractor={(item, index) => (index).toString()}
          />
        </View>
      </ImageBackground>
    )
  }

  renderListItem = ({item, index}) => {
    return (
        <TouchableNativeFeedback onLongPress={() => {this.handleItemLongPress(index)}} onPress={() => {this.handleItemPress(index)}}> 
         <View style={styles.item} >
            { item.selected && 
              <View style={styles.checkIcon}>
                {checkIcon}
              </View> 
            }
            <Text style={styles.dateText}>{moment(parseInt(item.start) * 1000).format('DD.MM.YY')}</Text>
            <Text style={styles.hourText}>{moment(parseInt(item.start) * 1000).format('HH:mm') + ' - ' + moment(parseInt(item.end) * 1000).format('HH:mm')}</Text>

          </View>
        </TouchableNativeFeedback>
   )
  }

  handleItemPress = (index) => {
    const { multiSelect } = this.state;
    let values = [...this.state.values];

    // If some value is selected, use single press to select more
    if ( multiSelect ) {
      values[index].selected = !values[index].selected;
      this.setState({values: values, multiSelect: values.map(v => v.selected).some(Boolean)});
    } else { // Show data of single instance

    }
  }

  handleItemLongPress = (index) => {
    let values = [...this.state.values];
    values[index].selected = !values[index].selected;
    console.log(values.map(v => v.selected).some(Boolean))
    this.setState({values: values, multiSelect: values.map(v => v.selected).some(Boolean)});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    backgroundColor: '#E1E1E1',
    borderWidth: 5,
    borderColor: '#0C0C0C'
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#CCC',
  },
  dateText: {
    fontSize: 22,
    color: '#444',
    textAlign: 'center',
  },
  hourText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  checkIcon: {
    position: 'absolute',
    left: 30,
    top: 20,
  },
  background: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
})