import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";

export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BAM",
  }).format(amount);
};

export const selectImages = async (
  options?: ImagePicker.ImagePickerOptions
) => {
  let result: { url: string; id: string }[] = [];
  try {
    const { assets } = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.3,
      allowsMultipleSelection: true,
      ...options,
    });

    if (assets) result = assets.map(({ uri }) => ({ url: uri, id: "" }));
  } catch (error) {
    showMessage({ message: (error as any).message, type: "danger" });
  }

  return result;
};

let timeoutId: NodeJS.Timeout;
export const debounce = <T extends any[], R>(
  func: (...args: T) => Promise<R>,
  timeout: number
) => {
  return (...args: T): Promise<R> => {
    return new Promise<R>((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const res = await func(...args);
        resolve(res);
      }, timeout);
    });
  };
};
