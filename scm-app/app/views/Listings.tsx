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

interface Props {}

type Product = {
  id: string;
  name: string;
  thumbnail?: string;
  category: string;
  price: string;
  image?: string[];
  date: Date;
  description: string;
  seller: {
    id: string;
    name: string;
    avatar?: string;
  };
};

type ListingResponse = { products: Product[] };

const Listings: FC<Props> = (props) => {
  const [listings, setListings] = useState<Product[]>([]);
  const { authClient } = useClient();

  const fetchListings = async () => {
    const res = await runAxiosAsync<ListingResponse>(
      authClient.get("/product/listings")
    );
    if (res) {
      setListings(res.products);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <>
      <AppHeader backButton={<BackButton />} />
      <View style={styles.container}>
        <FlatList
          data={listings}
          contentContainerStyle={styles.flatList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <Pressable style={styles.listItem}>
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    padding: size.padding,
  },
  listItem: {
    padding: size.padding,
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
