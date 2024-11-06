import { Product } from "../views/SingleProduct";

export type AuthStackParamList = {
  "(auth)": undefined;
  "(auth)/SignIn": undefined;
  "(auth)/SignUp": undefined;
  "(auth)/ForgetPassword": undefined;
  "(tabs)": undefined;
};

export type ProfileStackParamList = {
  "views/Chats": undefined;
  "views/Listings": undefined;
  "views/SingleProduct": undefined;
  // { product?: Product };
};
