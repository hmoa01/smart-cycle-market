import { Platform, StatusBar, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import SignIn from "./SignIn";
import { useEffect, useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import Home from "../(dashboard)/Home";
import { Profile, getAuthState, updateAuthState } from "../store/auth";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { runAxiosAsync } from "../api/runAxiosAsync";
import client from "../api/client";

export default function HomeScreen() {
  const navigation = useNavigation();
  const authState = useSelector(getAuthState);
  const dispatch = useDispatch();

  const isLogged = authState.profile ? true : false;

  let headerTitle = !isLogged ? "Sign In" : "Home";

  const fetchAuthState = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (token) {
      const res = await runAxiosAsync<{ profile: Profile }>(
        client.get("/auth/profile", {
          headers: {
            Authorization: "Bearer" + token,
          },
        })
      );

      if (res) {
        dispatch(updateAuthState({ pending: false, profile: res.profile }));
      }
    }
  };

  useEffect(() => {
    fetchAuthState();
  }, []);

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
