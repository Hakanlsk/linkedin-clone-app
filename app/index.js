import { StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Redirect } from "expo-router";

const index = () => {
  // return <Redirect href="/(authenticate)/login" />;
  return <Redirect href="/(tabs)/post" />;
};

export default index;

const styles = StyleSheet.create({});
