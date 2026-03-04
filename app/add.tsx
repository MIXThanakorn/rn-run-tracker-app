import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// import { supabase } from "@/services/supabase";

export default function Add() {
  const timeOptions = ["เช้า", "เย็น"];
  const [selectedtimeOptions, setSelectedtimeOptions] = useState<string | null>(
    null,
  );
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const handleopenCamera = async () => {
    //ขออนุญาตเข้าถึงกล้อง
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("ขออนุญาตเข้าถึงกล้องเพื่อถ่ายภาพหน่อยนะคร๊าบบบบบ");
      return;
    }

    //เปิดกล้องเพื่อถ่ายภาพ
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    //หลักจากถ่ายเรียยบร้อยแล้ว เอาไปกับ state ที่เตรียมไว้
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setBase64Image(result.assets[0].base64 || null);
    }
  };
  const handleSave = () => {
    // save data into supabase
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <Text style={styles.labeltext}>สถานที่วิ่ง</Text>
        <TextInput
          style={styles.input}
          placeholder="เช่น สวนลุมพินี"
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.labeltext}>ระยะทาง (กม.)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="เช่น 5.2"
          value={distance}
          onChangeText={setDistance}
        />
        <Text style={styles.labeltext}>ช่วงเวลา</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {timeOptions.map((item) => {
            const isSelected = selectedtimeOptions === item;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => setSelectedtimeOptions(item)}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    isSelected && styles.optionButtonTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.labeltext}>รูปภาพสถานที่วิ่ง</Text>
        <TouchableOpacity style={styles.imageButton} onPress={handleopenCamera}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: 200 }}
            />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Ionicons name="camera-outline" size={30} color="#b6b6b6" />
              <Text
                style={{ fontFamily: "Kanit_400Regular", color: "#b6b6b6" }}
              >
                กดเพื่อถ่ายภาพ
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>บันทึกข้อมูล</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  labeltext: {
    fontSize: 16,
    fontFamily: "Kanit_700Bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 12,
    marginBottom: 10,
    width: 80,
    alignItems: "center",
  },
  optionButtonActive: {
    backgroundColor: "#00ff62",
  },
  optionButtonText: {
    color: "#000",
    fontFamily: "Kanit_400Regular",
  },
  optionButtonTextActive: {
    color: "#fff",
    fontFamily: "Kanit_400Regular",
  },
  imageButton: {
    width: "100%",
    height: 300,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#00ff62",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Kanit_700Bold",
  },
});
