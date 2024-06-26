import { FC } from "react";
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colors from "../utils/colors";

interface Props {}

const heading = "OnlineMarketplace for Used Goods";
const subHeading =
  "Buy or sell used goods with trust. Chat directly with sellers, ensuring a seamless, authentic experience.";

const WelcomeHeader: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/hero.png")}
        style={styles.image}
        resizeMode="contain"
        resizeMethod="resize"
      />
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.subHeading}>{subHeading}</Text>
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
  heading: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 5,
    color: colors.primary,
  },
  subHeading: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 14,
    color: colors.primary,
  },
});

export default WelcomeHeader;
