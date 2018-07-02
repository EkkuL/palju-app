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
import { StackNavigator } from 'react-navigation';
import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons';

import Api from '../actions/Api';
import backgroundImage from '../assets/background.jpg';
import GraphView from './GraphView'

const checkIcon = (<Icon name="md-checkmark" size={30} color="#299BFF" />);

export default class GraphSelectionView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      values: [],
      multiSelect: false
    }
  }

  componentWillMount(){
    this.setState({loading: true});

    Api.fetchInstanceList((data) => { 
      this.setState({
        values: data.map((value, index) => { return {...value, selected: false, loading: false}})
      });
    });
  }

  render() {
    const { values, multiSelect } = this.state;

    return (
      <ImageBackground style={styles.background} source={backgroundImage}>
        <View style={styles.container}>
          <FlatList 
            data={values}
            renderItem={this.renderListItem}
            keyExtractor={(item, index) => (index).toString()}
          />
          { multiSelect && 
            <TouchableNativeFeedback onPress={() => { this.props.navigation.navigate('Graph') }}>
              <Text style={styles.bottomButtonText}> Show </Text>
            </TouchableNativeFeedback>
          }
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
      const selectedItem = values[index];
      this.props.navigation.navigate('Graph', {dates: [{start: selectedItem.start, end: selectedItem.end}]})
    }
  }

  handleItemLongPress = (index) => {
    let values = [...this.state.values];
    values[index].selected = !values[index].selected;
    console.log(values.map(v => v.selected).some(Boolean))
    this.setState({values: values, multiSelect: values.map(v => v.selected).some(Boolean)});
  }
}
/* 
 StackNavigator({
  GraphSelection: {
    screen: GraphSelectionView,
  },
  Graph: {
    screen: GraphView
  },
},
{
  headerMode: 'none',
}); */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  item: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom: 3
  },
  dateText: {
    fontSize: 22,
    color: '#FFF',
    textAlign: 'center',
  },
  hourText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
  checkIcon: {
    position: 'absolute',
    left: 30,
    top: 20,
  },
  bottomButtonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 20,
    padding: 10,
    backgroundColor: '#299BFF',
    margin: 10,
  },
  background: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
})