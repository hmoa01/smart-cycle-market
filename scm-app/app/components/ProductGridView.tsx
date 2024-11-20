import React, { FC } from "react";
import { View, StyleSheet, Text } from "react-native";
import { LatestProduct } from "./LatestProductList";

interface Props {
  data: LatestProduct[];
}

const column = 2;

const ProductGridView: FC<Props> = ({ data }) => {
  return (
    <View style={styles.container}>
      {data.map((product) => {
        return (
          <View style={{ width: `${100 / column}%` }} key={product.id}>
            <Text>{product.name}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
});

export default ProductGridView;
