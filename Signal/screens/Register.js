import React, { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Input, Image } from "@rneui/base";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView } from "react-native";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, SetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        return updateProfile(auth.currentUser, {
          displayName: name,
          photoURL:
            pic ||
            "https://e7.pngegg.com/pngimages/674/558/png-clipart-avatar-computer-icons-my-account-icon-angle-text.png",
        });
      })
      .then(() => {
        return addDoc(collection(db, "usuarios"), {
          email: email,
          displayName: name,
          photoURL:
            pic ||
            "https://e7.pngegg.com/pngimages/674/558/png-clipart-avatar-computer-icons-my-account-icon-angle-text.png",
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.container}>
        <Text h2 style={{ marginBottom: 40 }}>
          {" "}
          Create a Bola de Cristal account
        </Text>
        <Input
          containerStyle={styles.input}
          placeholder="Full name"
          autoFocus
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          containerStyle={styles.input}
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(text) => SetEmail(text)}
        />
        <Input
          containerStyle={styles.input}
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Input
          containerStyle={styles.input}
          placeholder="Profile Picture URL"
          type="text"
          value={pic}
          onChangeText={(text) => setPic(text)}
          onSubmitEditing={register}
        />
        <Button
          containerStyle={styles.button}
          title="Register"
          raised
          onPress={register}
          color={"#2E8B57"}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  form: {},
  button: {
    marginTop: 10,
    width: 200,
  },
  input: {
    marginTop: 8,
    marginBottom: 8,
    borderColor: "grey",
    height: 45,
    width: 300,
  },
});
