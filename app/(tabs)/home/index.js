import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";
global.atob = decode;
import axios from "axios";
import {
  AntDesign,
  Ionicons,
  Entypo,
  Feather,
  FontAwesome,
  SimpleLineIcons,
} from "@expo/vector-icons";
import moment from "moment";
import { useRouter } from "expo-router";

const index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/profile/${userId}`
      );
      const userData = response.data.user;
      setUser(userData);
    } catch (error) {
      console.log("error fetching user profile", error);
    }
  };

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/all");
        setPosts(response.data.posts);
      } catch (error) {
        console.log("error fetching posts", error);
      }
    };
    fetchAllPosts();
  }, [posts]);

  const MAX_LINES = 2;
  const [showFullText, setShowFullText] = useState(false);
  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const [isLiked, setIsLiked] = useState(false);

  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/like/${postId}/${userId}`
      );
      if (response.status === 200) {
        const updatedPost = response.data.post;
        //guncellenmis gonderinin likes dizisi icinde kullanıncın id' sinin olup olmadiginin kontrolu -eger varsa isLiked = true , yoksa = false
        setIsLiked(updatedPost.likes.some((like) => like.user === userId));
        const updatedPosts = posts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        );
        setPosts(updatedPosts);
        console.log("Like atan kullanıcılar : ", updatedPost.likes);
      }
    } catch (error) {
      console.log("Error liking/unliking the post");
    }
  };

  return (
    <ScrollView>
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={() => router.push("/home/profile")}>
          <Image
            style={styles.profileImage}
            source={{ uri: user?.profileImage }}
          />
        </TouchableOpacity>

        <Pressable style={styles.searchButton}>
          <AntDesign
            style={styles.searchIcon}
            name="search1"
            size={20}
            color="black"
          />
          <TextInput placeholder="Search" />
        </Pressable>
        <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
      </View>

      <View>
        {posts?.map((item, index) => (
          <View key={index}>
            <View style={styles.profileContainer}>
              <Image
                style={styles.postProfileImage}
                source={{ uri: item?.user?.profileImage }}
              />
              <View>
                <Text style={styles.userName}>{item?.user?.name}</Text>
                <Text
                  ellipsizeMode="middle"
                  numberOfLines={1}
                  style={styles.userJob}
                >
                  Engineer Graduate | Linkedin
                </Text>
                <Text>{moment(item?.createdAt).format("MMMM Do YYYY")}</Text>
              </View>

              <View style={styles.rightIconContainer}>
                <Entypo name="dots-three-vertical" size={20} color="black" />
                <Feather name="x" size={20} color="black" />
              </View>
            </View>

            <View style={styles.descriptionTextContainer}>
              <Text
                style={styles.descriptionText}
                numberOfLines={showFullText ? undefined : MAX_LINES}
              >
                {item?.description}
              </Text>
              {!showFullText && (
                <Pressable onPress={toggleShowFullText}>
                  <Text style={{ color: "#0072b1" }}>See More </Text>
                </Pressable>
              )}
            </View>

            <Image style={styles.descImage} source={{ uri: item?.imageUrl }} />

            {item?.likes?.length > 0 && (
              <View
                style={{
                  justifyContent: "center",
                  paddingLeft: 35,
                  marginTop: 10,
                }}
              >
                <SimpleLineIcons name="like" size={20} color="#0072b1" />
                <Text style={{ color: "gray", marginLeft: 4 }}>
                  {item?.likes?.length}
                </Text>
              </View>
            )}

            <View
              style={{
                height: 2,
                borderColor: "#E0E0E0",
                borderWidth: 2,
              }}
            />

            <View style={styles.reactionContainer}>
              {/* tıklanılan postun id si parametre olarak alınır */}
              <TouchableOpacity onPress={() => handleLikePost(item?._id)}>
                <AntDesign
                  style={styles.reactionIcon}
                  name="like2"
                  size={isLiked ? 23 : 22}
                  color={"gray"}
                />
                <Text style={styles.reactionText}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome
                  style={styles.reactionIcon}
                  name="comment-o"
                  size={22}
                  color="gray"
                />
                <Text style={styles.reactionText}>Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons
                  style={styles.reactionIcon}
                  name="share-outline"
                  size={22}
                  color="gray"
                />
                <Text style={styles.reactionText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Feather
                  style={styles.reactionIcon}
                  name="send"
                  size={22}
                  color="gray"
                />
                <Text style={styles.reactionText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({
  searchContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 3,
    height: 30,
    flex: 1,
  },
  searchIcon: {
    marginLeft: 10,
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  postProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
  },
  userJob: {
    width: 230,
    color: "gray",
    fontSize: 15,
    fontWeight: "400",
  },
  rightIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginRight: 8,
  },
  descriptionTextContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
  },
  descImage: {
    width: "100%",
    height: 240,
  },
  reactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 15,
  },
  reactionIcon: {
    textAlign: "center",
  },
  reactionText: {
    textAlign: "center",
    marginTop: 2,
    fontSize: 12,
    color: "gray",
  },
});
