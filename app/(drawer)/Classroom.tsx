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
  TextInput,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Provider as PaperProvider, Menu } from "react-native-paper";

const colorOptions = [
  "#fde68a", "#fbcfe8", "#bfdbfe", "#d9f99d", "#fcd34d",
  "#a5f3fc", "#fca5a5", "#e9d5ff", "#bbf7d0", "#fecdd3",
];

const getRandomLightColor = () =>
  colorOptions[Math.floor(Math.random() * colorOptions.length)];

const Explore = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [semester, setSemester] = useState("Odd");
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [editMode, setEditMode] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [menuVisible, setMenuVisible] = useState({});

  const [classList, setClassList] = useState([
    {
      id: "1",
      name: "Mathematics",
      semester: "Odd",
      academicYear: "2024-25",
      color: "#fef08a",
    },
    {
      id: "2",
      name: "Science",
      semester: "Even",
      academicYear: "2024-25",
      color: "#bbf7d0",
    },
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "BIT Classroom",
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
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=8" }}
            style={{
              width: 35,
              height: 35,
              borderRadius: 17.5,
              borderWidth: 1,
              borderColor: "#ccc",
            }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const toggleMenu = (id) => {
    setMenuVisible((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [id]: !prev[id],
    }));
  };

  const handleEdit = (item) => {
    setTitle(item.name);
    setSemester(item.semester);
    setAcademicYear(item.academicYear);
    setEditingClassId(item.id);
    setEditMode(true);
    setModalVisible(true);
    toggleMenu(item.id);
  };

  const handleDelete = (id) => {
    setClassList((prev) => prev.filter((cls) => cls.id !== id));
    toggleMenu(id);
  };

  const handleCreateOrUpdateClass = () => {
    if (!title) return;

    if (editMode) {
      setClassList((prev) =>
        prev.map((cls) =>
          cls.id === editingClassId
            ? { ...cls, name: title, semester, academicYear }
            : cls
        )
      );
    } else {
      const newClass = {
        id: Date.now().toString(),
        name: title,
        semester,
        academicYear,
        color: getRandomLightColor(),
      };
      setClassList((prev) => [newClass, ...prev]);
    }

    setTitle("");
    setSemester("Odd");
    setAcademicYear("2024-25");
    setModalVisible(false);
    setEditMode(false);
    setEditingClassId(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: item.color || "#fff" }]}
      onPress={() => router.push(`/class/${item.id}/stream`)}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.subText}>Semester: {item.semester}</Text>
          <Text style={styles.subText}>Academic Year: {item.academicYear}</Text>
        </View>
        <Menu
          visible={menuVisible[item.id]}
          onDismiss={() => toggleMenu(item.id)}
          anchor={
            <TouchableOpacity onPress={() => toggleMenu(item.id)}>
              <Ionicons name="ellipsis-vertical" size={20} color="black" />
            </TouchableOpacity>
          }
          contentStyle={{
            maxWidth: 260,
            padding: 5,
          }}
        >
          <Menu.Item onPress={() => handleEdit(item)} title="Edit" />
          <Menu.Item onPress={() => handleDelete(item.id)} title="Delete" />
          <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Select Color</Text>
            <View style={styles.colorGrid}>
              {colorOptions.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setClassList((prev) =>
                      prev.map((cls) =>
                        cls.id === item.id ? { ...cls, color } : cls
                      )
                    );
                    toggleMenu(item.id);
                  }}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color }
                  ]}
                />
              ))}
            </View>
          </View>
        </Menu>
      </View>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <FlatList
          data={classList}
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
              <Text style={styles.modalTitle}>
                {editMode ? "Edit Class" : "Create Class"}
              </Text>

              <TextInput
                placeholder="Enter Class Title"
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.label}>Semester</Text>
              <View style={styles.radioGroup}>
                {["Odd", "Even"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.radioButton,
                      semester === option && styles.radioSelected,
                    ]}
                    onPress={() => setSemester(option)}
                  >
                    <Text
                      style={{
                        color: semester === option ? "white" : "black",
                      }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Academic Year</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={academicYear}
                  onValueChange={(itemValue) => setAcademicYear(itemValue)}
                >
                  <Picker.Item label="2024-25" value="2024-25" />
                  <Picker.Item label="2025-26" value="2025-26" />
                  <Picker.Item label="2026-27" value="2026-27" />
                </Picker>
              </View>

              <TouchableOpacity style={styles.modalButton} onPress={handleCreateOrUpdateClass}>
                <Text style={styles.modalButtonText}>
                  {editMode ? "Update Class" : "Add Class"}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </View>
    </PaperProvider>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f5f5f5",
  },
  item: {
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
    color: "#555",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#3b82f6",
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
    padding: 10,
    marginBottom: 15,
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
  },
  radioGroup: {
    flexDirection: "row",
    marginBottom: 15,
  },
  radioButton: {
    padding: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: "#3b82f6",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
  },
  modalButton: {
    padding: 15,
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
