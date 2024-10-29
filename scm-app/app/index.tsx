import React, { useEffect, useLayoutEffect } from "react";
import { Platform, StatusBar, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useNavigation } from "expo-router";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from "./hooks/useAuth";
import { Profile, updateAuthState } from "./store/auth";
import client from "./api/client";
import { runAxiosAsync } from "./api/runAxiosAsync";
import LoadingSpinner from "./ui/LoadingSpinner";
import SignIn from "./(auth)/SignIn";
import { NavigationProp } from "@react-navigation/native";
import useClient from "@/hooks/useClient";
import asyncStorage, { Keys } from "./utils/asyncStorage";

export default function Home() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

  const { isLogged, authState } = useAuth();
  const { authClient } = useClient();

  const headerTitle = isLogged ? "Home" : "Sign In";

  const fetchAuthState = async () => {
    const token = await asyncStorage.get(Keys.AUTH_TOKEN);
    if (token) {
      dispatch(updateAuthState({ pending: true, profile: null }));

      const res = await runAxiosAsync<{ profile: Profile }>(
        authClient.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      if (res) {
        dispatch(updateAuthState({ pending: false, profile: res.profile }));
      } else {
        dispatch(updateAuthState({ pending: false, profile: null }));
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
  }, [navigation, headerTitle]);

  return (
    <SafeAreaView style={styles.container}>
      <LoadingSpinner visible={authState.pending} />
      {!isLogged ? <SignIn /> : <Redirect href={"(tabs)"} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
