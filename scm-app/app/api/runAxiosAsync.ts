import axios, { AxiosError, AxiosResponse } from "axios";

type SuccessResponse<T> = {
  data: T;
  error: null;
};
type ErrorResponse<E> = {
  data: null;
  error: E;
};

export const runAxiosAsync = async <T>(
  promise: Promise<AxiosResponse<T>>
): Promise<SuccessResponse<T> | ErrorResponse<string>> => {
  try {
    const { data } = await promise;
    return { data, error: null };
  } catch (error) {
    if (error instanceof AxiosError) {
      const response = error.response;

      if (response) {
        return { error: response.data.message, data: null };
      }
    }
    return { error: (error as any).message, data: null };
  }
};
