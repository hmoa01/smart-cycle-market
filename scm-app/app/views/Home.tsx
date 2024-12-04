import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import ChatNotification from "../ui/ChatNotification";
import size from "../utils/size";
import { NavigationProp } from "@react-navigation/native";
import { ProfileStackParamList } from "../types/StackProps";
import SearchBar from "../components/SearchBar";
import CategoryList from "../components/CategoryList";
import LatestProductList, {
  LatestProduct,
} from "../components/LatestProductList";
import { runAxiosAsync } from "../api/runAxiosAsync";
import useClient from "../hooks/useClient";
import socket, { handleSocketConnection } from "../socket";
import useAuth from "../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  ActiveChat,
  addNewActiveChat,
  getUnreadChatsCount,
} from "../store/chats";
import { useNavigation } from "expo-router";
import SearchModal from "../components/SearchModal";

interface Props {}

const Home: FC<Props> = (props) => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();

  const { authClient } = useClient();
  const { authState } = useAuth();
  const dispatch = useDispatch();
  const totalUnreadMessages = useSelector(getUnreadChatsCount);

  const fetchLatestProduct = async () => {
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get("/product/latest")
    );

    if (res?.products) {
      setProducts(res.products);
    }
  };

  const fetchLastChats = async () => {
    const res = await runAxiosAsync<{
      chats: ActiveChat[];
    }>(authClient("/conversation/last-chats"));

    if (res) {
      dispatch(addNewActiveChat(res.chats));
    }
  };

  useEffect(() => {
    const handleApiRequest = async () => {
      await fetchLatestProduct();
      await fetchLastChats();
    };

    handleApiRequest();
  }, []);

  useEffect(() => {
    if (authState.profile) handleSocketConnection(authState.profile, dispatch);
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.padding}>
      <ChatNotification
        onPress={() => navigate("views/Chats")}
        indicate={totalUnreadMessages > 0}
      />
      <ScrollView style={styles.container}>
        <SearchBar asButton onPress={() => setShowSearchModal(true)} />
        <CategoryList
          onPress={(category) => navigate("views/ProductList", { category })}
        />
        <LatestProductList
          onPress={({ id }) =>
            navigate("views/SingleProduct", { productId: id })
          }
          data={products}
        />
      </ScrollView>
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
    height: "100%",
  },
  padding: {
    marginTop: Platform.OS === "ios" ? 0 : size.padding,
    paddingTop: 15,
    height: "auto",
    flex: 1,
  },
});

export default Home;
