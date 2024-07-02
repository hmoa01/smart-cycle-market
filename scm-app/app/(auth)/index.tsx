import { Platform, StatusBar, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import SignIn from "./SignIn";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import Home from "../(dashboard)/Home";

export default function HomeScreen() {
  const navigation = useNavigation();
  const isLogged = false;

  let headerTitle = !isLogged ? "Sign In" : "Home";

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: headerTitle,
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {!isLogged ? <SignIn /> : <Home />}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
