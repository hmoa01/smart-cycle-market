import React, { FC } from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";
import AppHeader from "../components/AppHeader";
import BackButton from "../ui/BackButton";

interface Props {}

const ChatWindow: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <AppHeader style={styles.header} backButton={<BackButton />} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {},
});

export default ChatWindow;
