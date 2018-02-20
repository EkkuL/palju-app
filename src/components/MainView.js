import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableWithoutFeedback
} from 'react-native';


export default class MainView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      extended: false, // Is the screen extended.
    }
  }

  render() {

    return (
      <View style={styles.wrapper}>
        <View style={[styles.screen, {height: this.state.extended ? 500 : 60}]}>
          <TouchableWithoutFeedback style={{width: '100%'}} onPress={this.handleExtend}>
            <View style={styles.screenContentWrapper}>
              <Text> Moi </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }

  handleExtend = () => {
    console.log("handle")
    this.setState({extended: !this.state.extended})
  }
}

const styles = StyleSheet.create({

  wrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20
  },

  screen: {
    flex: 1,
    backgroundColor: 'rgba(13, 52, 84, 1)',
    borderStyle: 'solid',
    borderWidth: 8,
    borderColor: 'rgba(0,0,0,0.8)'
  },

  screenContentWrapper: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15
  },

  screenText: {
    color: 'rgba(124, 170, 208, 0.7)',
    flex: 1,
    fontSize: 20
  }
})

