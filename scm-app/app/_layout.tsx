import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="(auth)/SignIn">
        <Stack.Screen
          name="(auth)/SignIn"
          options={{
            headerTitle: "Sign In",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="(auth)/SignUp"
          options={{
            headerTitle: "Sign Up",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="(auth)/ForgetPassword"
          options={{
            headerTitle: "Forget Password",
            headerTitleAlign: "center",
          }}
        />
        {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
        {/* <Stack.Screen name="+not-found" /> */}
      </Stack>
    </ThemeProvider>
  );
}
