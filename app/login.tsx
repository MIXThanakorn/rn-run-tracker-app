import { supabase } from "@/services/supabase";
import { Ionicons } from "@expo/vector-icons";
import { makeRedirectUri } from "expo-auth-session";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as QueryString from "query-string";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const handleGoogleSignIn = async () => {
    try {
      const redirectUri = makeRedirectUri({
        scheme: "rnruntrackerapp",
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) console.log("Error:", error.message);

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUri,
        );

        if (result.type === "success") {
          const { url } = result;
          const params = url.split("#")[1];
          const formData = QueryString.parse(params);

          const access_token = formData.access_token as string;
          const refresh_token = formData.refresh_token as string;

          if (access_token && refresh_token) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (sessionError) throw sessionError;

            const {
              data: { user },
            } = await supabase.auth.getUser();

            if (user) {
              router.replace({
                pathname: "/run",
                params: { uid: user.id },
              });
            }
          }
        }
      }
    } catch (error) {
      console.log("Error details:", error);
      Alert.alert(
        "เกิดข้อผิดพลาด",
        "ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาลองอีกครั้ง",
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Ionicons name="walk" size={70} color="#00ff62" />
        <Text style={styles.title}>Run Tracker</Text>
        <Text style={styles.subtitle}>Track your runs and stay healthy</Text>
      </View>

      {/* Login Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>เข้าสู่ระบบ</Text>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
        >
          <Ionicons name="logo-google" size={20} color="#000" />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        Start tracking your running journey today
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 50,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 5,
  },

  card: {
    width: "100%",
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },

  cardTitle: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "600",
    marginBottom: 20,
  },

  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#00ff62",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },

  googleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  footer: {
    marginTop: 40,
    color: "#64748b",
    fontSize: 12,
  },
});
