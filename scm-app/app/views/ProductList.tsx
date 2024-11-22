import React, { FC, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { ProfileStackParamList } from "../types/StackProps";
import { useLocalSearchParams } from "expo-router";
import useClient from "../hooks/useClient";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { LatestProduct } from "../components/LatestProductList";

type Props = NativeStackScreenProps<ProfileStackParamList, "views/ProductList">;

const ProductList: FC<Props> = () => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const { authClient } = useClient();
  const { category } = useLocalSearchParams();

  const fetchProducts = async () => {
    const res = runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get("/product/by-category/" + category)
    );
    if (res) {
      console.log(res);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {},
});

export default ProductList;
