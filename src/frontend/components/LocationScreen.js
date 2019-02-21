import React, { Component } from "react";
import { Platform, Text, View, StyleSheet } from "react-native";
import { Constants, Permissions } from "@unimodules/react-native-platform";
import * as Location from "expo-location";

export default class LocationScreen extends Component {
  state = {
    location: null,
    errorMessage: null
  };

  componentDidMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }
    this.intervalId = setInterval(async () => {
      let provider = await Location.getProviderStatusAsync({});
      this.setState({ provider });
    }, 5000);

    this.watch = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 2000
      },
      location => this.setState({ location })
    );
  };

  componentWillUnmount() {
    clearInterval(this.intervalId);
    if (!this.watch) return;
    this.watch.remove();
  }

  render() {
    let text = "Waiting..";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location, null, 2);
    }
    if (this.state.provider) {
      text += "\n" + JSON.stringify(this.state.provider, null, 2);
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "left"
  }
});
