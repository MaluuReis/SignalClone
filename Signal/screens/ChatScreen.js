import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Avatar } from "@rneui/base";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TextInput } from "react-native";
import {
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import { ScrollResponderEvent } from "react-native";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const sendMessage = async () => {
    Keyboard.dismiss();
    await addDoc(collection(db, `chats/${route.params.id}/messages`), {
      timestamp: serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoUrl: auth.currentUser.photoURL,
    }).catch((error) => alert(error));
    setInput("");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerTileAlign: "left",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            rounded
            source={{
              uri:
                messages[0]?.data.photoUrl ||
                "https://e7.pngegg.com/pngimages/674/558/png-clipart-avatar-computer-icons-my-account-icon-angle-text.png",
            }}
          />
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  useLayoutEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `chats/${route.params.id}/messages`),
        orderBy("timestamp", "asc"),
      ),
      (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          })),
        );
      },
    );
    return unsubscribe;
  }, [route]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={-1000}
      >
        <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
          {messages.map(({ id, data }) =>
            data.email === auth.currentUser.email ? (
              <View key={id} style={styles.receiver}>
                <Avatar
                  containerStyle={{
                    position: "absolute",
                    bottom: -15,
                    right: -5,
                  }}
                  source={{ uri: data.photoUrl }}
                  rounded
                  size={30}
                  position="absolute"
                  bottom={-15}
                  right={-5}
                />

                <Text style={styles.receiverText}>{data.message}</Text>
              </View>
            ) : (
              <View key={id} style={styles.sender}>
                <Avatar
                  containerStyle={{
                    position: "absolute",
                    bottom: -15,
                    left: -5,
                  }}
                  source={{ uri: data.photoUrl }}
                  rounded
                  size={30}
                  position="absolute"
                  bottom={-15}
                  left={-5}
                />
                <Text style={styles.senderText}>{data.message}</Text>
                <Text style={styles.senderName}>{data.displayName}</Text>
              </View>
            ),
          )}
        </ScrollView>
        <View style={styles.footer}>
          <TextInput
            placeholder="Enter a message"
            value={input}
            onChangeText={(text) => setInput(text)}
            style={styles.input}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            disabled={input === ""}
            onPress={sendMessage}
            activeOpacity={0.5}
          >
            <Ionicons name="send" color="#2E8B57" size={24} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    bottom: 0,
    height: 40,
    flex: 1,
    color: "grey",
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    borderRadius: 30,
    padding: 10,
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "cesnter",
    padding: 15,
  },
  receiver: {
    maxWidth: "80%",
    position: "relative",
    alignSelf: "flex-end",
    marginRight: 15,
    marginBottom: 20,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    borderRadius: 20,
    padding: 15,
  },
  sender: {
    maxWidth: "80%",
    position: "relative",
    alignSelf: "flex-start",
    marginRight: 15,
    marginBottom: 20,
    borderColor: "transparent",
    backgroundColor: "#2E8B57",
    borderRadius: 20,
    padding: 15,
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },
});
