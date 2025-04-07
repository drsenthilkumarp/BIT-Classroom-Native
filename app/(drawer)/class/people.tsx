import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

export default function People() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState<string[]>([]);

  const addStudent = () => {
    if (email.trim()) {
      setStudents((prev) => [...prev, email.trim()]);
      setEmail("");
      setModalVisible(false);
    }
  };

  const deleteStudent = (index: number) => {
    const updated = [...students];
    updated.splice(index, 1);
    setStudents(updated);
  };

  return (
    <View style={styles.container}>
      {students.length === 0 ? (
        <Text style={styles.text}>No students yet</Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => (
            <View style={styles.studentItem}>
              <Ionicons
                name="person-circle-outline"
                size={24}
                color="#10b981"
              />
              <Text style={styles.studentText}>{item}</Text>
              <TouchableOpacity
                onPress={() => deleteStudent(index)}
                style={styles.deleteIcon}
              >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Student</Text>
            <TextInput
              placeholder="Enter student email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.addButton} onPress={addStudent}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#065f46",
    textAlign: "center",
    marginTop: 30,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 10,
  },
  addButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    paddingTop: 10,
  },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1fae5",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  studentText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#065f46",
    flex: 1,
  },
  deleteIcon: {
    marginLeft: 10,
    padding: 5,
  },
});
