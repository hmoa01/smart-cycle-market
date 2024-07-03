import { NavigationProp } from "@react-navigation/native";
import AppButton from "@ui/AppButton";
import CustomKeyAvoidingView from "@ui/CustomKeyAvoidingView";
import FormDivider from "@ui/FormDivider";
import FormInput from "@ui/FormInput";
import FormNavigator from "@ui/FormNavigator";
import WelcomeHeader from "@ui/WelcomeHeader";
import { useNavigation } from "expo-router";
import { FC, useState } from "react";
import { View, StyleSheet } from "react-native";
import { emailRegex } from "../utils/validator";
import { showMessage } from "react-native-flash-message";
import { runAxiosAsync } from "../api/runAxiosAsync";
import client from "../api/client";

interface Props {}

const ForgetPassword: FC<Props> = (props) => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();

  const handleSubmit = async () => {
    if (!emailRegex.test(email)) {
      return showMessage({
        message: "Invalid email address",
        type: "danger",
      });
    }
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      client.post("/auth/forget-password", { email })
    );
    setBusy(false);
    if (res) {
      showMessage({
        message: res.message,
        type: "success",
      });
    }
  };

  return (
    <CustomKeyAvoidingView>
      <View style={styles.innerContainer}>
        <WelcomeHeader />

        <View style={styles.formContainer}>
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <AppButton
            active={!busy}
            onPress={handleSubmit}
            title={busy ? "Please Wait..." : "Request Link"}
          />

          <FormDivider />

          <FormNavigator
            onLeftPress={() => navigate("(auth)/SignUp")}
            onRightPress={() => navigate("(auth)/SignIn")}
            leftTitle="Sign Up"
            rightTitle="Sign In"
          />
        </View>
      </View>
    </CustomKeyAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 15,
    flex: 1,
  },
  formContainer: {
    marginTop: 30,
  },
});

export default ForgetPassword;
