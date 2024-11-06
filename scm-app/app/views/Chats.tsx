import React, { FC } from "react";
import { View, StyleSheet, Text, Platform, StatusBar } from "react-native";
import AppHeader from "../components/AppHeader";
import BackButton from "../ui/BackButton";

interface Props {}

const Chats: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <AppHeader backButton={<BackButton />} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default Chats;
