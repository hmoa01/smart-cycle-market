import { Product } from "../store/listings";

export type AuthStackParamList = {
  "(auth)": undefined;
  "(auth)/SignIn": undefined;
  "(auth)/SignUp": undefined;
  "(auth)/ForgetPassword": undefined;
  "views/SingleProduct": { product?: Product; id?: string };

  "(tabs)": undefined;
};

export type ProfileStackParamList = {
  "views/Chats": undefined;
  "views/Listings": undefined;
  "views/SingleProduct": { product?: Product; id?: string };
  "views/EditProduct": { product?: Product };
  "views/ChatWindow": undefined;
  "views/ProductList": { category: string };
};
