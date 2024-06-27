import { Platform, StatusBar, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import SignIn from "./SignIn";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";

export default function HomeScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Sign In",
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <SignIn />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
