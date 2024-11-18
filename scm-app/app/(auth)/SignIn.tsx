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
import { showMessage } from "react-native-flash-message";
import { signInSchema, yupValidate } from "../utils/validator";
import useAuth from "../hooks/useAuth";
import { AuthStackParamList } from "../types/StackProps";

interface Props {}

export interface SignInResponse {
  profile: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    avatar?: string;
  };
  tokens: {
    refresh: string;
    access: string;
  };
}

const SignIn: FC<Props> = (props) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const { navigate } = useNavigation<NavigationProp<AuthStackParamList>>();
  const { signIn } = useAuth();

  const handleChange = (name: string) => (text: string) =>
    setUserInfo({ ...userInfo, [name]: text });

  const handleSubmit = async () => {
    const { values, error } = await yupValidate(signInSchema, userInfo);

    if (error) {
      return showMessage({
        message: error,
        type: "danger",
      });
    }

    if (values) signIn(values);
  };
  const { email, password } = userInfo;

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
            onChangeText={handleChange("email")}
          />
          <FormInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={handleChange("password")}
          />

          <AppButton active={!busy} onPress={handleSubmit} title="Sign in" />

          <FormDivider />

          <FormNavigator
            onLeftPress={() => navigate("(auth)/ForgetPassword")}
            onRightPress={() => navigate("(auth)/SignUp")}
            leftTitle="Forget Password"
            rightTitle="Sign Up"
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

export default SignIn;
