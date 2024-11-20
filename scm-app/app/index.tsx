import React, { useEffect, useLayoutEffect } from "react";
import { Platform, StatusBar, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useNavigation } from "expo-router";
import { useDispatch } from "react-redux";
import useAuth from "./hooks/useAuth";
import { updateAuthState } from "./store/auth";
import { runAxiosAsync } from "./api/runAxiosAsync";
import LoadingSpinner from "./ui/LoadingSpinner";
import SignIn from "./(auth)/SignIn";
import { NavigationProp } from "@react-navigation/native";

import asyncStorage, { Keys } from "./utils/asyncStorage";
import useClient from "./hooks/useClient";

export type ProfileRes = {
  profile: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    avatar?: { id: string; url: string };
  };
};

export default function Home() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { loggedIn, authState } = useAuth();
  const { authClient } = useClient();

  const headerTitle = loggedIn ? "Home" : "Sign In";

  const fetchAuthState = async () => {
    const token = await asyncStorage.get(Keys.AUTH_TOKEN);
    if (token) {
      dispatch(updateAuthState({ pending: true, profile: null }));

      const res = await runAxiosAsync<ProfileRes>(
        authClient.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      if (res) {
        dispatch(
          updateAuthState({
            pending: false,
            profile: { ...res.profile, accessToken: token },
          })
        );
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
      {!loggedIn ? <SignIn /> : <Redirect href={"(tabs)"} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
