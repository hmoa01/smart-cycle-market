import { useDispatch, useSelector } from "react-redux";
import { runAxiosAsync } from "../api/runAxiosAsync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuthState, updateAuthState } from "../store/auth";
import { SignInResponse } from "../(auth)/SignIn";
import client from "../api/client";

type UserInfo = {
  email: string;
  password: string;
};

const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector(getAuthState);

  const signIn = async (userInfo: UserInfo) => {
    dispatch(updateAuthState({ pending: true, profile: null }));

    const res = await runAxiosAsync<SignInResponse>(
      client.post("/auth/sign-in", userInfo)
    );
    if (res) {
      console.log(res);
      await AsyncStorage.setItem("access_token", res.tokens.access);
      await AsyncStorage.setItem("refresh_token", res.tokens.refresh);
      dispatch(updateAuthState({ pending: false, profile: res.profile }));
    } else {
      dispatch(updateAuthState({ pending: true, profile: null }));
    }
  };

  const isLogged = authState.profile ? true : false;

  return {
    signIn,
    authState,
    isLogged,
  };
};

export default useAuth;
