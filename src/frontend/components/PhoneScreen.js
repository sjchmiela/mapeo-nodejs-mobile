import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default ({ children }) => (
  <View style={styles.container}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    width: 360,
    height: 640,
    borderColor: "#00000",
    borderWidth: 1
  }
});
