import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatDate } from "../utils/date";
import size from "../utils/size";
import AvatarView from "../ui/AvatarView";
import colors from "../utils/colors";
import { formatPrice } from "../utils/helper";
import ImageSlider from "./ImageSlider";
import { ScrollView } from "react-native-gesture-handler";
import { Product } from "../store/listings";

interface Props {
  product: Product;
}

const ProductDetail: FC<Props> = ({ product }) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <ImageSlider images={product.image} />

        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.date}>
          Purchased on: {formatDate(product.date, "dd LLL yyyy")}
        </Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.profileContainer}>
          <AvatarView uri={product.seller.avatar} size={60} />
          <Text style={styles.profileName}>{product.seller.name}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
  },
  category: {
    marginTop: 15,
    color: colors.primary,
    fontWeight: "700",
  },
  price: {
    marginTop: 5,
    color: colors.active,
    fontWeight: "700",
    fontSize: 20,
  },
  date: {
    marginTop: 5,
    color: colors.active,
    fontWeight: "700",
  },
  name: {
    marginTop: 15,
    color: colors.primary,
    letterSpacing: 1,
    fontWeight: "700",
    fontSize: 20,
  },
  description: {
    marginTop: 15,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  profileName: {
    paddingLeft: 15,
    color: colors.primary,
    letterSpacing: 0.5,
    fontWeight: "700",
    fontSize: 20,
  },
});

export default ProductDetail;
