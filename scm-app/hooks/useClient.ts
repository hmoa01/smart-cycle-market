import axios from "axios";
import { baseURL } from "app/api/client";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import useAuth from "@/app/hooks/useAuth";
import asyncStorage, { Keys } from "@/app/utils/asyncStorage";
import { runAxiosAsync } from "@/app/api/runAxiosAsync";
import { useDispatch } from "react-redux";
import { updateAuthState } from "@/app/store/auth";

const authClient = axios.create({ baseURL });

type Response = {
  tokens: {
    refresh: string;
    access: string;
  };
};

const useClient = () => {
  const { authState } = useAuth();

  const dispatch = useDispatch();

  const token = authState.profile?.accessToken;

  authClient.interceptors.request.use(
    (config) => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = "Bearer " + token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const refreshAuthLogic = async (failedRequest: any) => {
    //read refresh token from async storage
    const refreshToken = await asyncStorage.get(Keys.REFRESH_TOKEN);
    //send request with refresh token to get new refresh and access token

    const options = {
      method: "POST",
      data: { refreshToken },
      url: `${baseURL}/auth/refresh-token`,
    };
    const res = await runAxiosAsync<Response>(axios(options));

    if (res?.tokens) {
      failedRequest.response.config.headers.Authorization =
        "Bearer " + res.tokens.access;
      await asyncStorage.save(Keys.AUTH_TOKEN, res.tokens.access);
      await asyncStorage.save(Keys.REFRESH_TOKEN, res.tokens.refresh);
      dispatch(
        updateAuthState({
          profile: {
            ...authState.profile!,
            accessToken: res.tokens.access,
          },
          pending: false,
        })
      );
      return Promise.resolve();
    }
  };

  createAuthRefreshInterceptor(authClient, refreshAuthLogic);

  return { authClient };
};

export default useClient;
