import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import CustomListItem from "../components/CustomListItem";
import { Avatar } from "@rneui/base";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { or } from "firebase/firestore";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState("");
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "chats"),
        or(
          where("senderId", "==", auth.currentUser.uid),
          where("receiverEmail", "==", auth.currentUser.email),
        ),
      ),
      (snapshot) => {
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          })),
        );
      },
    );
    return unsubscribe;
  }, []);
  const SignOut = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };
  React.useEffect(() => {
    navigation.setOptions({
      title: "   Signal",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity>
            <Avatar
              rounded
              source={{ uri: auth?.currentUser?.photoURL }}
              onPress={SignOut}
            />
          </TouchableOpacity>
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
            <AntDesign name="camerao" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <SimpleLineIcons
              name="pencil"
              size={24}
              color="black"
              onPress={() => navigation.navigate("AddChat")}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id: id,
      chatName,
    });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {chats.map(({ id, data: { chatName } }) => (
          <CustomListItem
            id={id}
            key={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({});
