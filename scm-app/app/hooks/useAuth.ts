import { useDispatch, useSelector } from "react-redux";
import { runAxiosAsync } from "../api/runAxiosAsync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuthState, updateAuthState } from "../store/auth";
import { SignInResponse } from "../(auth)/SignIn";
import client from "../api/client";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import asyncStorage, { Keys } from "../utils/asyncStorage";

type UserInfo = {
  email: string;
  password: string;
};

const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector(getAuthState);
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

  const signIn = async (userInfo: UserInfo) => {
    dispatch(updateAuthState({ pending: true, profile: null }));

    const res = await runAxiosAsync<SignInResponse>(
      client.post("/auth/sign-in", userInfo)
    );
    if (res) {
      await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access);
      await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh);

      // await AsyncStorage.setItem("access_token", res.tokens.access);
      // await AsyncStorage.setItem("refresh_token", res.tokens.refresh);
      dispatch(
        updateAuthState({
          pending: false,
          profile: { ...res.profile, accessToken: res.tokens.access },
        })
      );
      navigate("(tabs)");
    } else {
      dispatch(updateAuthState({ pending: true, profile: null }));
    }
  };

  const isLogged = !!authState.profile;

  return {
    signIn,
    authState,
    isLogged,
  };
};

export default useAuth;
