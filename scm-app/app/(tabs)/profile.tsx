import React, { FC } from "react";
import { View, StyleSheet, Platform } from "react-native";
import Profile from "../views/Profile";

interface Props {}

const profile: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Profile />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
});

export default profile;
