import React, { FC } from "react";
import { View, StyleSheet, Text } from "react-native";

interface Props {}

const NewListings: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Text>NEW LISTINGS</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default NewListings;
