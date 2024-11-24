import React, { FC, useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { ProfileStackParamList } from "../types/StackProps";
import { useLocalSearchParams, useRouter } from "expo-router";
import useClient from "../hooks/useClient";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { LatestProduct } from "../components/LatestProductList";
import AppHeader from "../components/AppHeader";
import colors from "../utils/colors";
import size from "../utils/size";
import BackButton from "../ui/BackButton";
import EmptyView from "../ui/EmptyView";
import ProductCard from "../ui/ProductCard";

const col = 2;

const ProductList = () => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const { authClient } = useClient();
  const { category } = useLocalSearchParams();
  const router = useRouter();

  const isOdd = products.length % col !== 0;

  const fetchProducts = async (category: string) => {
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get("/product/by-category/" + category)
    );
    if (res) {
      setProducts(res.products);
    }
  };

  useEffect(() => {
    fetchProducts(category as string);
  }, [category]);

  if (!products.length) {
    return (
      <View style={styles.container}>
        <AppHeader
          backButton={<BackButton />}
          center={<Text style={styles.title}>{category}</Text>}
        />

        <EmptyView title="There is no product in this category!" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        backButton={<BackButton />}
        center={<Text style={styles.title}>{category}</Text>}
      />
      <FlatList
        data={products}
        numColumns={col}
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: isOdd && index === products.length - 1 ? 1 / col : 1,
            }}
          >
            <ProductCard
              product={item}
              onPress={({ id }) =>
                router.push({
                  pathname: "views/SingleProduct",
                  params: { productId: id },
                })
              }
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  title: {
    fontWeight: "600",
    color: colors.primary,
    paddingBottom: 5,
  },
});

export default ProductList;
