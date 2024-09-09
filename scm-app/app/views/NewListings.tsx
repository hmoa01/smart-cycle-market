import React, { FC } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import FormInput from "../ui/FormInput";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import colors from "../utils/colors";
import DatePicker from "../ui/DatePicker";

interface Props {}

const NewListings: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.fileSelector}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="images" size={24} color="black" />
        </View>
        <Text style={styles.btnTitle}>Add Images</Text>
      </Pressable>
      <FormInput placeholder="Product name" />
      <FormInput placeholder="Price" />
      <DatePicker
        title="Purchasing Date:"
        value={new Date()}
        onChange={() => {}}
      />
      <FormInput placeholder="Description" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  fileSelector: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  btnTitle: {
    color: colors.primary,
    marginBottom: 5,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 7,
  },
});

export default NewListings;
