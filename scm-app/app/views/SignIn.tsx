import { FC } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import WelcomeHeader from "../ui/WelcomeHeader";

interface Props {}

const SignIn: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <WelcomeHeader />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
  },
});

export default SignIn;
