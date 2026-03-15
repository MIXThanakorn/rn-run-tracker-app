import { supabase } from "@/services/supabase";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function Rundetail() {
  const { id } = useLocalSearchParams();
  const [image, setImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<string | null>(null);
  const [imageUrl, setImage_url] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleopenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("ขออนุญาตเข้าถึงกล้องเพื่อถ่ายภาพหน่อยนะคร๊าบบบบบ");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setBase64Image(result.assets[0].base64 || null);
    }
  };

  useEffect(() => {
    FetchRun();
  }, []);

  const FetchRun = async () => {
    const { data, error } = await supabase
      .from("runs")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching run:", error);
    } else {
      setLocation(data.location);
      setDistance(data.distance.toString());
      setTimeOfDay(data.time_of_day);
      setImage_url(data.image_url);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);

    try {
      let newImageUrl = imageUrl;

      if (image && base64Image) {
        // ลบรูปเก่า
        if (imageUrl) {
          const oldFile = imageUrl.split("/").pop() || "";
          await supabase.storage.from("run_bk").remove([oldFile]);
        }

        // แปลง base64
        const fileName = `run_${Date.now()}.jpg`;

        const byteCharacters = atob(base64Image);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        // upload
        const { error: uploadError } = await supabase.storage
          .from("run_bk")
          .upload(fileName, byteArray, {
            contentType: "image/jpeg",
          });

        if (uploadError) {
          console.error(uploadError);
          return;
        }

        // get public url
        const { data } = supabase.storage.from("run_bk").getPublicUrl(fileName);

        newImageUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("runs")
        .update({
          location,
          distance,
          time_of_day: timeOfDay,
          image_url: newImageUrl,
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating run:", error);
      } else {
        Alert.alert("อัพเดตสำเร็จ");
        router.back();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    // ส่วนลบข้อมูล
    // แสดงการยืนยันก่อนลบ
    Alert.alert("ยืนยันการลบ", "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบ",
        style: "destructive",
        onPress: async () => {
          await handleDeleteRun();
        },
      },
    ]);
  };

  const handleDeleteRun = async () => {
    // ลบข้อมูลที่มี id ที่ระบุ
    try {
      const { error } = await supabase.from("runs").delete().eq("id", id);
      //ลบรูปภาพจาก storage ด้วย
      if (imageUrl) {
        const fileName = imageUrl.split("/").pop() || "";
        await supabase.storage.from("run_bk").remove([fileName]);
      }
      if (error) {
        console.error("Error deleting run:", error);
      } else {
        console.log("Run deleted successfully!");
        Alert.alert("ลบสำเร็จ");
        // หลังจากลบสําเร็จ หน้าจอจะกลับไปที่หน้าหลัก
        router.back();
      }
    } catch (error) {
      console.error("Error deleting run:", error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ส่วนแสดงรูปภาพ */}
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handleopenCamera}>
          {image ? (
            <Image source={{ uri: image }} style={styles.mainImage} />
          ) : imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.mainImage} />
          ) : (
            <View style={[styles.mainImage, styles.noImage]}>
              <Ionicons name="camera-outline" size={60} color="#DDD" />
              <Text style={styles.noImageText}>กดเพื่อถ่ายภาพ</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ฟอร์มแก้ไขข้อมูล */}
      <View style={styles.formCard}>
        <Text style={styles.label}>สถานที่</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>ระยะทาง (กม.)</Text>
        <TextInput
          style={styles.input}
          value={distance}
          onChangeText={setDistance}
          keyboardType="numeric"
        />

        <Text style={styles.label}>ช่วงเวลา</Text>
        <View style={styles.row}>
          {(["เช้า", "เย็น"] as const).map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.chip, timeOfDay === time && styles.chipActive]}
              onPress={() => setTimeOfDay(time)}
            >
              <Text
                style={[
                  styles.chipText,
                  timeOfDay === time && styles.chipTextActive,
                ]}
              >
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.updateButton, updating && styles.buttonDisabled]}
          disabled={updating}
          onPress={handleUpdate}
        >
          {updating ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.updateButtonText}>บันทึกการแก้ไข</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          <Text style={styles.deleteButtonText}>ลบรายการนี้</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#EEE",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  noImageText: {
    fontFamily: "Kanit_400Regular",
    color: "#AAA",
    marginTop: 10,
  },
  formCard: {
    backgroundColor: "#FFF",
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontFamily: "Kanit_700Bold",
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
    textTransform: "uppercase",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingVertical: 10,
    fontFamily: "Kanit_400Regular",
    fontSize: 18,
    color: "#007AFF",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
  },
  chipActive: {
    backgroundColor: "#007AFF",
  },
  chipText: {
    fontFamily: "Kanit_400Regular",
    color: "#666",
  },
  chipTextActive: {
    color: "#FFF",
  },
  updateButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  updateButtonText: {
    color: "#FFF",
    fontFamily: "Kanit_700Bold",
    fontSize: 16,
  },
  deleteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    padding: 10,
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontFamily: "Kanit_400Regular",
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
