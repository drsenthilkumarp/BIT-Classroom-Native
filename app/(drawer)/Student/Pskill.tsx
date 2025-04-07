import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Pskill() {
  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header
      title: "Skill Page",
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#3b82f6",
        fontSize: 20,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ marginLeft: 15 }}
        >
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={{ marginRight: 15 }}
        >
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: 17.5,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=16" }} // Optional: update image URL
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Skill Page Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
});
