import React, { FC } from "react";
import { StyleSheet, Image, Dimensions } from "react-native";
import size from "../utils/size";

interface Props {
  uri: string;
}

const { width } = Dimensions.get("screen");
const imageWidth = width - size.padding * 2;
const aspect = 16 / 9;

const ProductImage: FC<Props> = ({ uri }) => {
  {
    return (
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMethod="resize"
        resizeMode="cover"
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {},
  image: {
    width: imageWidth,
    height: imageWidth / aspect,
    borderRadius: 7,
  },
});

export default ProductImage;
