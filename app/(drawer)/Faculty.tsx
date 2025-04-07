import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Image,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const FACULTY_SUBJECTS = [
  { id: "1", name: "Class Automation" },
  { id: "2", name: "Robotics" },
  { id: "3", name: "Control System" },
];

const Faculty = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Faculty Portal",
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#10b981", // teal
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
              source={{ uri: "https://i.pravatar.cc/150?img=20" }} // replace with actual faculty image
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handlePress = (id: string) => {
    router.push(`/faculty/${id}`);
  };

  const renderItem = ({ item }) => {
    let backgroundColor = "#fff";

    switch (item.name) {
      case "Class Automation":
        backgroundColor = "#fcd34d"; // amber
        break;
      case "Robotics":
        backgroundColor = "#6ee7b7"; // emerald
        break;
      case "Control System":
        backgroundColor = "#93c5fd"; // blue
        break;
    }

    return (
      <TouchableOpacity
        style={[styles.item, { backgroundColor }]}
        onPress={() => handlePress(item.id)}
      >
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const handleCreateNote = () => {
    setModalVisible(false);
    router.push("/faculty/create-note");
  };

  const handleAddAssignment = () => {
    setModalVisible(false);
    router.push("/faculty/add-assignment");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={FACULTY_SUBJECTS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleCreateNote}>
              <Text style={styles.modalButtonText}>Create Lecture Note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleAddAssignment}>
              <Text style={styles.modalButtonText}>Add Assignment</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Faculty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f9fafb",
  },
  item: {
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#10b981",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalButton: {
    padding: 15,
    backgroundColor: "#10b981",
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
