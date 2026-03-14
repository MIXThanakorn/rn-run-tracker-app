import { AuthProvider } from "@/contexts/AuthContext";
import {
  Kanit_400Regular,
  Kanit_700Bold,
  useFonts,
} from "@expo-google-fonts/kanit";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Kanit_700Bold,
  });
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#00ff62",
          },
          headerTintColor: "#fff",
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Kanit_700Bold",
            fontSize: 20,
            color: "#fff",
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="add" options={{ title: "Add Run" }} />
        <Stack.Screen name="[id]" options={{ title: "Run Details" }} />
        <Stack.Screen name="run" options={{ title: "Run Tracker" }} />
      </Stack>
    </AuthProvider>
  );
}
