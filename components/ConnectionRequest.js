import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
const ConnectionRequest = ({
  item,
  connectionRequests,
  setConnectionRequests,
  userId,
}) => {
  const acceptConnection = async (requestId) => {
    try {
      const response = await fetch(
        "http://192.168.130.184:8000/connection-request/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: requestId,
            recepientId: userId,
          }),
        }
      );

      if (response.ok) {
        setConnectionRequests(
          connectionRequests.filter((request) => request._id !== requestId)
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <Image style={styles.image} source={{ uri: item?.image }} />
        <Text style={styles.name}>{item?.name} is Inviting you to Connect</Text>

        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.IconView}>
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => acceptConnection(item._id)}
            style={styles.IconView}
          >
            <Ionicons name="checkmark" size={24} color="#0072b1" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ConnectionRequest;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 5,
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  name: {
    width: 200,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  IconView: {
    width: 32,
    height: 32,
    borderRadius: 18,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
});
