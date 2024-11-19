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
import OptionModal from "../components/OptionModal";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { selectImages } from "../utils/helper";
import CategoryOptions from "../components/CategoryOptions";
import AppButton from "../ui/AppButton";
import { newProductSchema, yupValidate } from "../utils/validator";
import { showMessage } from "react-native-flash-message";
import mime from "mime";
import LoadingSpinner from "../ui/LoadingSpinner";
import deepEqual from "deep-equal";

interface Props {}

type ProductInfo = {
  name: string;
  description: string;
  category: string;
  price: string;
  purchasingDate: Date;
};

const imageOptions = [
  { value: "Use as Thumbnail", id: "thumb" },
  { value: "Remove Image", id: "remove" },
];

const EditProduct: FC<Props> = () => {
  // Get the product as a string from params
  const { product: productFromParams } = useLocalSearchParams();
  //   const { navigate } = useNavigation<NavigationProp<ProfileStackParamList>>();

  // Parse the product string into an object of type Product
  const parsedProduct: Product | null =
    typeof productFromParams === "string"
      ? JSON.parse(productFromParams)
      : null;

  // Ensure parsedProduct is not null
  if (!parsedProduct) {
    return (
      <View>
        <Text>No product found</Text>
      </View>
    );
  }

  const productInfoToUpdate = {
    ...parsedProduct,
    price: parsedProduct.price.toString(),
    date: new Date(parsedProduct.date),
  };

  const [showMenu, setShowMenu] = useState(false);
  const [product, setProduct] = useState({ ...productInfoToUpdate });
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    id?: string;
  }>({ url: "", id: "" });
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [busy, setBusy] = useState(false);
  const { authState } = useAuth();
  const { authClient } = useClient();

  const isAdmin = authState.profile?.id === product?.seller.id;

  const isFormChanged = deepEqual(productInfoToUpdate, product);

  const onLongPress = (image: { url: string; id: string }) => {
    setSelectedImage({ url: image.url, id: image.id });

    setShowImageOptions(true);
  };

  const removeSelectedImage = async () => {
    const notLocalImage = selectedImage.url.startsWith(
      "https://ik.imagekit.io"
    );
    const imageId = selectedImage.id;

    const images = product.image;
    const newImages = images?.filter(({ url }) => url !== selectedImage.url);
    setProduct({ ...product, image: newImages });

    if (notLocalImage) {
      await runAxiosAsync<{ message: string }>(
        authClient.delete(`/product/image/${product.id}/${imageId}`)
      );
    }
  };

  const handleOnImageSelect = async () => {
    const newImages = await selectImages();
    const oldImages = product.image || [];
    const images = oldImages.concat(newImages);
    setProduct({ ...product, image: [...images] });
  };

  const makeSelectedImageAsThumbnail = () => {
    if (selectedImage.url.startsWith("https://ik.imagekit.io")) {
      setProduct({ ...product, thumbnail: selectedImage.url });
      console.log("odabrani thumbanil");
    }
  };

  const handleOnSubmit = async () => {
    const dataToUpdate: ProductInfo = {
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      purchasingDate: product.date,
    };

    const { error } = await yupValidate(newProductSchema, dataToUpdate);
    if (error) return showMessage({ message: error, type: "danger" });

    const formData = new FormData();

    if (product.thumbnail) {
      formData.append("thumbnail", product.thumbnail);
    }

    type productInfoKeys = keyof typeof dataToUpdate;

    for (let key in dataToUpdate) {
      const value = dataToUpdate[key as productInfoKeys];
      if (value instanceof Date) formData.append(key, value.toISOString());
      else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    }
    product.image?.forEach(({ url }, index) => {
      if (!url.startsWith("https://ik.imagekit.io")) {
        const imageData = {
          uri: url,
          name: `image_${index}`,
          type: mime.getType(url) || "image/jpg",
        };
        formData.append("images", imageData as any);
      }
    });

    // send our new data to api
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      authClient.patch(`/product/${product.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );

    setBusy(false);
    if (res) {
      showMessage({ message: res.message, type: "success" });
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
            images={product.image || [{ url: "", id: "" }]}
            onLongPress={onLongPress}
          />
          <Pressable onPress={handleOnImageSelect} style={styles.imageSelector}>
            <FontAwesome5 name="images" size={30} color={colors.primary} />
          </Pressable>
          <FormInput
            placeholder="Product name"
            value={product.name}
            onChangeText={(name) => setProduct({ ...product, name })}
          />
          <FormInput
            placeholder="Product name"
            value={product.price.toString()}
            onChangeText={(price) => setProduct({ ...product, price })}
          />
          <DatePicker
            title="Purchasing Date: "
            value={product.date}
            onChange={(date) => setProduct({ ...product, date })}
          />
          <CategoryOptions
            title={product.category || "Category"}
            onSelect={(category) => setProduct({ ...product, category })}
          />

          <FormInput
            placeholder="Description"
            value={product.description}
            onChangeText={(description) =>
              setProduct({ ...product, description })
            }
          />
          {!isFormChanged && (
            <AppButton title="Update Product" onPress={handleOnSubmit} />
          )}
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
          if (id === "thumb") makeSelectedImageAsThumbnail();
          if (id === "remove") removeSelectedImage();
        }}
      />
      <LoadingSpinner visible={busy} />
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
