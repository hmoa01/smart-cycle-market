import { useLocalSearchParams } from "expo-router";
import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  StatusBar,
  ScrollView,
  Pressable,
} from "react-native";
import AppHeader from "../components/AppHeader";
import BackButton from "../ui/BackButton";
import OptionButton from "../ui/OptionButton";
import useAuth from "../hooks/useAuth";
import useClient from "../hooks/useClient";
import { Product } from "../store/listings";
import size from "../utils/size";
import colors from "../utils/colors";
import HorizontalImageList from "../components/HorizontalImageList";
import { FontAwesome5 } from "@expo/vector-icons";
import FormInput from "../ui/FormInput";
import DatePicker from "../ui/DatePicker";
import OptionSelector from "../ui/OptionSelector";
import OptionModal from "../components/OptionModal";
import { runAxiosAsync } from "../api/runAxiosAsync";

interface Props {}

const imageOptions = [
  { value: "Use as Thumbnail", id: "thumb" },
  { value: "Remove Image", id: "remove" },
];

const EditProduct: FC<Props> = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [showImageOptions, setShowImageOptions] = useState(false);
  const { authState } = useAuth();
  const { authClient } = useClient();

  // Get the product as a string from params
  const { product } = useLocalSearchParams();
  //   const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();

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

  const isAdmin = authState.profile?.id === parsedProduct?.seller.id;

  const onLongPress = (image: string) => {
    setSelectedImage(image);
    setShowImageOptions(true);
  };

  const removeSelectedImage = async () => {
    const notLocalImage = selectedImage.startsWith("https://ik.imagekit.io");
    const imageId = selectedImage;
    // const splitedItems = selectedImage.split("/");
    // const imageId = splitedItems[splitedItems.length - 1].split(".")[0];
    console.log(imageId);
    if (notLocalImage) {
      const res = await runAxiosAsync<{ message: string }>(
        authClient.delete(`/product/image/${parsedProduct.id}/${imageId}`)
      );
    }
  };

  return (
    <>
      <AppHeader
        style={styles.header}
        backButton={<BackButton />}
        right={
          <OptionButton onPress={() => setShowMenu(true)} visible={isAdmin} />
        }
      />
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Images</Text>
          <HorizontalImageList
            images={parsedProduct.image || []}
            onLongPress={onLongPress}
          />
          <Pressable style={styles.imageSelector}>
            <FontAwesome5 name="images" size={30} color={colors.primary} />
          </Pressable>
          <FormInput placeholder="Product name" value={parsedProduct.name} />
          <FormInput
            placeholder="Product name"
            value={parsedProduct.price.toString()}
          />
          <DatePicker
            title="Purchasing Date: "
            value={new Date(parsedProduct.date)}
            onChange={(date) => {
              console.log(date);
            }}
          />
          <OptionSelector
            title={parsedProduct.category || "Category"}
            onPress={() => setShowCategoryModal(true)}
          />
          <FormInput
            placeholder="Description"
            value={parsedProduct.description}
          />
        </ScrollView>
      </View>
      <OptionModal
        options={imageOptions}
        visible={showImageOptions}
        onRequestClose={setShowImageOptions}
        renderItem={(option) => {
          return <Text style={styles.option}>{option.value}</Text>;
        }}
        onPress={({ id }) => {
          if (id === "thumb") {
          }
          if (id === "remove") removeSelectedImage();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: size.padding,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 10,
  },
  imageSelector: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.primary,
    marginVertical: 10,
  },
  option: {
    paddingVertical: 10,
    color: colors.primary,
  },
});

export default EditProduct;
