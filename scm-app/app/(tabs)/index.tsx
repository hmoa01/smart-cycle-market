import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import Home from "../views/Home";

interface Props {}

const HomeScreen: FC<Props> = (props) => {
  return <Home />;
};

const styles = StyleSheet.create({
  container: {},
});

export default HomeScreen;
