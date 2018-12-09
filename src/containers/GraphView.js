import React, { Component } from 'react';
import { Text, ScrollView, View, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import moment from 'moment'

import Api from '../actions/Api'
import backgroundImage from '../assets/background.jpg';

export default class GraphView extends Component {
    
    constructor(props) {
        super(props)
    
        this.state = {
          values: [],
          loading: true
        }
    }

    componentWillMount(){

        const { params } = this.props.navigation.state;
        const dates = params ? params.dates : [];
        Api.fetchInstances(dates, (values) => {
            console.log(values)
            this.setState({values: values, loading: false});
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
    }

    render(){
      console.log("RENDER")
      const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7)
      const axesSvg = { fontSize: 10, fill: 'grey' };
      const xAxisHeight = 30

      const { values, loading } = this.state;

      let data = []
      if (values.length > 0){
        values.forEach(val => {
          normalize = val[0].timestamp
          d = val.filter(v => v.warming_phase == "ON" || v.warming_phase == "UPKEEP")
          console.log(d)
          data.push(d.map((v) => { return {y: parseFloat(v.temp_high), x: v.timestamp - normalize}}).filter(v => v.y > 0 && v.x > 0 && v.y < 45).filter((value, index, array) => index % 20 == 0 || index == 0 ));
        })
      }
      console.log(data)

      var maxTime = Math.max(...data.map(d => d[d.length - 1]).map(v => v.x))
      
        return (
          <ImageBackground style={styles.background} source={backgroundImage}>
            <View horizontal={true} style={styles.container}>

             {!loading && <YAxis
                    data={data[0]}
                    style={{ height: 500, width: 20/*, position: 'absolute', left: 0, top: 0*/ }}
                    svg={axesSvg}
                    numberOfTicks={10}
               //     contentInset={{ top: 20, bottom: 20 }}
                    min={0}
                    max={40}
                />
             }
            { loading ? (<ActivityIndicator size={40} color="#299BFF" />) :
              data.map((d,idx) => (<View><LineChart
                key={idx}
                style={{height: 500, width: (d[d.length - 1].x/25), position: 'absolute', left: 20 }}
                data={ d == undefined ? [] : d }
                svg={{ stroke: randomColor() }}
               // contentInset={{ top: 20, bottom: 20 }}
                yAccessor={({item}) => item.y}
                xAccessor={({item}) => item.x}
                yMin={0}
                yMax={40}
                xMin={0}
                xMax={maxTime}
             //   scale={ scale.scaleTime }
              >
              </LineChart>                    
            </View>
))
            }
            {!loading && <XAxis
                    style={{ paddingLeft: 20, width: (data[0][data[0].length - 1].x/25) }}
                    data={ data[0] }
                    xAccessor={({item}) => item.x}
                    min={0}
                    max={maxTime}
                    formatLabel={ (value, index) => moment(value,'X').format('HH:mm') /*Math.floor(value/60/60) + ':' + Math.round(value/60%60)*/ }
                    numberOfTicks={10}
                 //   scale={ scale.scaleTime }
                 //   contentInset={{ left: 10, right: 10 }}
                    svg={{ fontSize: 10, fill: 'white' }}
                />}
            </View>
          </ImageBackground>
        )
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 60
  },
  background: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
})