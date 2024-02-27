import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "@rneui/base";
import { db } from "../firebase";
import { Entypo } from "@expo/vector-icons";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

const CustomListItem = ({ id, chatName, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `chats/${id}/messages`),
        orderBy("timestamp", "desc"),
      ),
      (snapshot) => setChatMessages(snapshot.docs.map((doc) => doc.data())),
    );

    return unsubscribe;
  }, []);
  return (
    <ListItem onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
      <Avatar
        rounded
        source={{
          uri:
            chatMessages?.[0]?.photoUrl ||
            "https://e7.pngegg.com/pngimages/674/558/png-clipart-avatar-computer-icons-my-account-icon-angle-text.png",
        }}
      />
      <ListItem.Content>
        <View style={styles.container}>
          <ListItem.Title style={{ fontWeight: "800" }}>
            {chatName}
          </ListItem.Title>
        </View>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
  },
});
