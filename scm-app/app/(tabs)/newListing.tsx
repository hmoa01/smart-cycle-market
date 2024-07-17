import React, { FC } from "react";
import { StyleSheet } from "react-native";
import NewListings from "../views/NewListings";

interface Props {}

const newListing: FC<Props> = (props) => {
  return <NewListings />;
};

const styles = StyleSheet.create({
  container: {},
});

export default newListing;
