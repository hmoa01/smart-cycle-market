import React, { FC } from "react";
import { View, StyleSheet, Platform, StatusBar, Text } from "react-native";
import AppHeader from "../components/AppHeader";
import BackButton from "../ui/BackButton";
import { useLocalSearchParams } from "expo-router";

interface Props {}

export type Product = {
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

const SingleProduct: FC<Props> = () => {
  // Get the product as a string from params
  const { product } = useLocalSearchParams();

  // Parse the product string into an object of type Product
  const parsedProduct: Product | null =
    typeof product === "string" ? JSON.parse(product) : null;

  // Ensure parsedProduct is not null
  if (!parsedProduct) {
    return (
      <View>
        <Text>No product found</Text>
      </View>
    );
  }

  return (
    <>
      <AppHeader style={styles.header} backButton={<BackButton />} />
      <View style={styles.container}>
        <Text>{parsedProduct.name}</Text>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {},
  header: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default SingleProduct;
