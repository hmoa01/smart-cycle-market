import React, { FC, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
  Text,
  Pressable,
} from "react-native";
import AppHeader from "../components/AppHeader";
import BackButton from "../ui/BackButton";
import useClient from "../hooks/useClient";
import { runAxiosAsync } from "../api/runAxiosAsync";
import size from "../utils/size";
import ProductImage from "../ui/ProductImage";

import { useRouter } from "expo-router";
import { getListings, Product, updateListings } from "../store/listings";
import { useDispatch, useSelector } from "react-redux";

interface Props {}

type ListingResponse = { products: Product[] };

const Listings: FC<Props> = (props) => {
  const router = useRouter();
  // const [listings, setListings] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(false);

  const { authClient } = useClient();
  const dispatch = useDispatch();
  const listings = useSelector(getListings);

  const fetchListings = async () => {
    setFetching(true);
    const res = await runAxiosAsync<ListingResponse>(
      authClient.get("/product/listings")
    );
    setFetching(false);
    if (res) {
      dispatch(updateListings(res.products));
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <>
      <AppHeader style={styles.header} backButton={<BackButton />} />
      <View style={styles.container}>
        <FlatList
          refreshing={fetching}
          onRefresh={fetchListings}
          data={listings}
          contentContainerStyle={styles.flatList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <Pressable
                style={styles.listItem}
                onPress={() => {
                  router.push({
                    pathname: "views/SingleProduct",
                    params: { product: JSON.stringify(item) },
                  });
                }}
              >
                <ProductImage uri={item.thumbnail} />
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  header: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  listItem: {
    paddingBottom: size.padding,
  },
  productName: {
    fontWeight: "700",
    fontSize: 20,
    letterSpacing: 1,
    paddingTop: 10,
  },
  flatList: {
    paddingBottom: 20,
  },
});

export default Listings;
