import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

export default function Mentor() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [fromSession, setFromSession] = useState("FN");
  const [toSession, setToSession] = useState("FN");
  const [purpose, setPurpose] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide header
    });
  }, [navigation]);

  const handleApply = () => {
    const newLeave = {
      id: Date.now().toString(),
      leaveType,
      fromDate: fromDate.toDateString(),
      fromSession,
      toDate: toDate.toDateString(),
      toSession,
      purpose,
      status: "Pending",
    };
    setLeaves((prev) => [...prev, newLeave]);
    setModalVisible(false);
    // Reset form
    setPurpose("");
    setLeaveType("Casual Leave");
    setFromDate(new Date());
    setToDate(new Date());
    setFromSession("FN");
    setToSession("FN");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this leave?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          setLeaves((prev) => prev.filter((leave) => leave.id !== id));
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={leaves}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
            No leave applications yet.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.leaveItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.leaveType}>{item.leaveType}</Text>
              <Text>
                From: {item.fromDate} ({item.fromSession}){"\n"}To: {item.toDate} ({item.toSession})
              </Text>
              <Text>Purpose: {item.purpose}</Text>
              <Text style={styles.pending}>Status: {item.status}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash" size={22} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Apply for Leave</Text>

          <Text style={styles.label}>Leave Type</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={leaveType}
              onValueChange={(value) => setLeaveType(value)}
              style={Platform.OS === "android" ? {} : { height: 100 }}
            >
              <Picker.Item label="Casual Leave" value="Casual Leave" />
              <Picker.Item label="On Duty" value="On Duty" />
              <Picker.Item label="SP Leave" value="SP Leave" />
            </Picker>
          </View>

          <Text style={styles.label}>From Date</Text>
          <TouchableOpacity onPress={() => setShowFromDatePicker(true)} style={styles.datePickerBtn}>
            <Text>{fromDate.toDateString()}</Text>
          </TouchableOpacity>
          {showFromDatePicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowFromDatePicker(false);
                if (selectedDate) setFromDate(selectedDate);
              }}
            />
          )}
          <Text style={styles.label}>Session</Text>
          <View style={styles.sessionRow}>
            <TouchableOpacity
              onPress={() => setFromSession("FN")}
              style={[styles.sessionBtn, fromSession === "FN" && styles.sessionSelected]}
            >
              <Text style={styles.sessionText}>FN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFromSession("AN")}
              style={[styles.sessionBtn, fromSession === "AN" && styles.sessionSelected]}
            >
              <Text style={styles.sessionText}>AN</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>To Date</Text>
          <TouchableOpacity onPress={() => setShowToDatePicker(true)} style={styles.datePickerBtn}>
            <Text>{toDate.toDateString()}</Text>
          </TouchableOpacity>
          {showToDatePicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowToDatePicker(false);
                if (selectedDate) setToDate(selectedDate);
              }}
            />
          )}
          <Text style={styles.label}>Session</Text>
          <View style={styles.sessionRow}>
            <TouchableOpacity
              onPress={() => setToSession("FN")}
              style={[styles.sessionBtn, toSession === "FN" && styles.sessionSelected]}
            >
              <Text style={styles.sessionText}>FN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setToSession("AN")}
              style={[styles.sessionBtn, toSession === "AN" && styles.sessionSelected]}
            >
              <Text style={styles.sessionText}>AN</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Purpose</Text>
          <TextInput
            value={purpose}
            onChangeText={setPurpose}
            placeholder="Enter purpose of leave"
            style={styles.input}
            multiline
          />

          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    padding: 16,
  },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#3b82f6",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  modalContent: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    marginTop: 10,
    fontWeight: "bold",
  },
  pickerWrapper: {
    backgroundColor: "#eee",
    borderRadius: 8,
    marginVertical: 8,
  },
  datePickerBtn: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginVertical: 8,
  },
  sessionRow: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 6,
  },
  sessionBtn: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ddd",
    alignItems: "center",
    borderRadius: 8,
  },
  sessionSelected: {
    backgroundColor: "#3b82f6",
  },
  sessionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    textAlignVertical: "top",
  },
  applyBtn: {
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  applyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  leaveItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    gap: 10,
  },
  leaveType: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  pending: {
    color: "#f59e0b",
    marginTop: 4,
    fontWeight: "600",
  },
});
