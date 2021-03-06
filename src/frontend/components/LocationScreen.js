// @flow

import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Constants } from "@unimodules/core";

import { withLocation } from "../context/Location";
import type { LocationType } from "../context/Location";

export default withLocation(({ location }: { location: LocationType }) => {
  let text = JSON.stringify(location, null, 2);

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
});

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
