import axios from "axios";
import { Platform } from "react-native";

const androidApi = process.env.EXPO_PUBLIC_ANDROID_EMULATOR_API;
const iosApi = process.env.EXPO_PUBLIC_IOS_SIMULATOR_API;

const apiUrl = Platform.OS === "android" ? androidApi : iosApi;

const client = axios.create({
  baseURL: apiUrl,
});

export default client;
