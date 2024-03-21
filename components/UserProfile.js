import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import localhost from "../localhost";

const UserProfile = ({ item, userId }) => {
  const [connectionSent, setConnectionSent] = useState(false);
  const sendConnectionRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch(`http://localhost:8000/connection-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });

      if (response.ok) {
        setConnectionSent(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View style={styles.profileBox}>
      <View style={styles.profileImageView}>
        <Image
          style={styles.profileImage}
          source={{ uri: item?.profileImage }}
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.textName}>{item?.name}</Text>
        <Text style={styles.textInfo}>Engineer Graduate | Linkedin Member</Text>
      </View>

      <TouchableOpacity
        onPress={() => sendConnectionRequest(userId, item._id)}
        style={[
          styles.connectButton,
          {
            borderColor:
              connectionSent || item?.connectionRequests?.includes(userId)
                ? "gray"
                : "#0072B1",
          },
        ]}
      >
        <Text
          style={[
            styles.connectText,
            {
              color:
                connectionSent || item?.connectionRequests?.includes(userId)
                  ? "gray"
                  : "#0072B1",
            },
          ]}
        >
          {connectionSent || item?.connectionRequests?.includes(userId)
            ? "Pending"
            : "Connect"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  profileBox: {
    borderRadius: 9,
    marginHorizontal: 16,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    marginVertical: 10,
    justifyContent: "center",
    height: Dimensions.get("window").height / 3.3,
    width: (Dimensions.get("window").width - 60) / 2,
  },
  profileImageView: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    resizeMode: "cover",
  },
  textName: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  textInfo: {
    textAlign: "center",
    marginLeft: 1,
    marginTop: 2,
  },
  connectButton: {
    marginLeft: "auto",
    marginRight: "auto",
    borderWidth: 1,
    borderRadius: 25,
    marginTop: 7,
    paddingHorizontal: 15,
    paddingVertical: 4,
  },
  connectText: {
    fontWeight: "600",
    color: "#0072B1",
  },
});
