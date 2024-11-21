import React, { FC } from "react";
import { View, StyleSheet, Text, Pressable, Image } from "react-native";
import { LatestProduct } from "./LatestProductList";
import GridView from "../ui/GridView";
import { formatPrice } from "../utils/helper";
import colors from "../utils/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  data: LatestProduct[];
  onPress(item: LatestProduct): void;
}

const ProductGridView: FC<Props> = ({ data, onPress }) => {
  return (
    <GridView
      data={data}
      renderItem={(item) => {
        return (
          <Pressable
            onPress={() => onPress(item)}
            style={styles.productContainer}
          >
            {item.thumbnail ? (
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
              />
            ) : (
              <View style={[styles.thumbnail, styles.noImageView]}>
                <MaterialCommunityIcons
                  name="image-off"
                  size={35}
                  color={colors.primary}
                />
              </View>
            )}
            <Text style={styles.price}>{formatPrice(item.price)}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        );
      }}
    ></GridView>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    padding: 7,
  },
  thumbnail: {
    width: "100%",
    height: 100,
    borderRadius: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.active,
    paddingTop: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  noImageView: {
    backgroundColor: colors.deActive,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductGridView;
