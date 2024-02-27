import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { getCountFromServer } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import { Input } from "@rneui/base";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";
import { count } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { User } from "firebase/auth";
import { documentId } from "@firebase/firestore";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");

  React.useEffect(() => {
    navigation.setOptions({
      title: "Add a new chat",
    });
  }, [navigation]);

  const creatChat = async () => {
    const pesq = query(collection(db, "usuarios"), where("email", "==", email));
    const snapshot = await getCountFromServer(pesq);
    if (snapshot.data().count > 0) {
      await addDoc(collection(db, `chats`), {
        senderId: auth.currentUser.uid,
        receiverEmail: email,
        chatName: input,
        time: serverTimestamp(),
      })
        .then(() => {
          navigation.goBack();
        })
        .catch((error) => alert(error));
    } else {
      navigation.goBack();
      alert("Não existem usuários com esse email");
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter a chat name"
        value={input}
        autoFocus
        onChangeText={(text) => setInput(text)}
        onSubmitEditing={creatChat}
        leftIcon={<AntDesign name="wechat" size={24} color={"black"} />}
      />
      <Input
        placeholder="Enter a email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        onSubmitEditing={creatChat}
      />
      <Button
        onPress={creatChat}
        title="Create new chat"
        disabled={input === ""}
      />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {},
});
