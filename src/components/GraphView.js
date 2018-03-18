import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableNativeFeedback
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { LineChart, XAxis, YAxis, Path } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import dateFns from 'date-fns'

// This will be fetched from the server
const data = [
  {
      temp: 10.6,
      target: 41,
      timestamp: 1514764800,
  },
  {
      temp: 20.8,
      target: 41,
      timestamp: 1514765000,
  },
  {
      temp: 25.1,
      target: 40,
      timestamp: 1514765800,
  },
  {
      temp: 29.2,
      target: 40,
      timestamp: 1514766600,
  },
  {
      temp: 35,
      target: 38,
      timestamp: 1514767400,
  },
  {
      temp: 38,
      target: 38,
      timestamp: 1514768200,
  },
]



const yAxisLables = [0, 5, 10, 15, 20, 26, 30, 35, 40, 45]


export default class GraphView extends Component<Props> {

  constructor(props) {
    super(props)

    this.state = {
    //  values: this.props.values // Receive the latest as prop
      values: data
    }
  }

  // New graph data incoming
  componentWillReceiveProps(nextProps) {

    let {values} = this.state;
    if (nextProps.values && nextProps.values.last.timestamp < values.first.timestamp) { // Load older values; Show new graph
      this.setState({values: nextProps.values});
    } else if(nextProps.values) { // Load new values into current data; Extend the current graph
      const updatedValues = [...values, ...nextProps.values];
      this.setState({values: updatedValues});
    }
  }

  render() {

    const DashedLine = ({ line }) => (
      <Path
          key={'line-1'}
          d={line}
          stroke={'rgb(134, 65, 244)'}
          strokeWidth={2}
          fill={'none'}
          strokeDasharray={[ 4, 4 ]}
          clipPath={'url(#clip-path-2)'}
      />
    )


    return (
      <View style={{flex: 1, backgroundColor: '#FFF', padding: 10, margin: 20}}>
        <View style={{flex: 1, height: 400}}>
          <ScrollView horizontal={true}>
            <LineChart
                style={ { height: 400, width: 1000 } }
                data={ data }
                yAccessor={({ item }) => item.temp}
                xAccessor={({ item }) => item.timestamp}
                xScale={scale.scaleTime}
                contentInset={{ top: 10, bottom: 10 }}
            //    curve={shape.curveLinear}
                gridMin={0}
                gridMax={45}
                svg={{ stroke: 'rgb(134, 65, 244)' }}
            />

            <LineChart
                style={ { height: 400, width: 1000, position: 'absolute' } }
                data={ data }
                yAccessor={({ item }) => item.target}
                xAccessor={({ item }) => item.timestamp}
                contentInset={{ top: 10, bottom: 10 }}
          //     curve={shape.curveLinear}
                showGrid={false}
                gridMin={0}
                gridMax={45}
                svg={{ stroke: 'rgb(134, 65, 244)', strokeDasharray: [ 4, 4 ] }}
            />

            <XAxis
              data={data}
              svg={{
                  fill: 'black',
                  fontSize: 12,
                  fontWeight: 'bold',
                  originY: 30,
                  y: 5,
              }}
              xAccessor={({ item }) => item.date}
              scale={scale.scaleTime}
              numberOfTicks={6}
              style={{ position: 'absolute', left: 0, right: 0, top: 390 }}
              formatLabel={(value) => dateFns.format(value, 'HH:mm')}
            />
          </ScrollView>
          <YAxis
            style={ { position: 'absolute', top: 10, bottom: 10, height: 400 }}
            data={ yAxisLables }
            contentInset={ { top: 10, bottom: 10 } }
            svg={ {
                fontSize: 12,
                fill: 'black',
                alignmentBaseline: 'baseline',
            } }
        />
        </View>
        <View style={{height: 60, width: '100%'}}>
          {this.renderButtons()}
        </View>
      </View>
    )
  }


  renderButtons = () => {
    return (
      <View style={{flex: 1, flexDirection: 'row', paddingLeft: 20, paddingRight: 20, alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={styles.editButton}>
          <TouchableNativeFeedback onPress={this.handleCancel}>
            <View style={styles.editTextWrapper}>
              <Text style={styles.editText}>
                <Icon name="ios-arrow-back" size={30} color="#7caad0" />
              </Text>
            </View>
          </TouchableNativeFeedback> 
        </View>
        <View style={styles.editButton}>
          <TouchableNativeFeedback>
            <View style={styles.editTextWrapper}>
              <Text style={styles.editText}>
                <Icon name="ios-arrow-forward" size={30} color="#7caad0" />
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
  }
})