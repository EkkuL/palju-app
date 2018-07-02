import React, { Component } from 'react';
import { Text } from 'react-native';

import Api from '../actions/Api'

export default class GraphView extends Component {
    
    constructor(props) {
        super(props)
    
        this.state = {
          values: []
        }
    }

    componentWillMount(){

        const { params } = this.props.navigation.state;
        const dates = params ? params.dates : [];
        Api.fetchInstances(dates, (values) => {
            console.log(values)
            this.setState({values: values});
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
    }

    render(){
        return (
            <Text> Moi </Text>
        )
    }
}