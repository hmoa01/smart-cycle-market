import { Product } from "../store/listings";

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
  "views/SingleProduct": { product?: Product; productId?: string };
  "views/EditProduct": { product?: Product };
  "views/ChatWindow": {
    conversationId: string;
    peerProfile: {
      id: string;
      name: string;
      avatar?: {
        id: string;
        url: string;
      };
    };
  };
  "views/ProductList": { category: string };
};
