import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Text } from "../components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TextInput } from "react-native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { supabase } from "~/lib/supabase";

type AuthMode = "login" | "signup";

// Add this type for Supabase errors
type SupabaseError = {
  message: string;
  status?: number;
};

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (mode === "signup" && !name) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        console.log("Attempting signup...");
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: "coffeeshop://", // Add your app's deep link
            },
          });

        if (signUpError) {
          console.error("Signup error:", signUpError);
          throw signUpError;
        }

        console.log("Signup successful:", signUpData);

        if (signUpData.user) {
          console.log("Creating profile...");
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert({
              id: signUpData.user.id,
              name: name,
              updated_at: new Date().toISOString(),
            });

          if (profileError) {
            console.error("Profile creation error:", profileError);
            throw profileError;
          }
        }

        Alert.alert(
          "Success",
          "Please check your email to verify your account",
          [{ text: "OK", onPress: () => setMode("login") }]
        );
      } else {
        console.log("Attempting login...");
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.error("Login error:", signInError);
          throw signInError;
        }

        router.replace("/(authenticated)");
      }
    } catch (err: unknown) {
      console.error("Full error object:", err);

      // Type guard for error handling
      const error = err as SupabaseError;
      Alert.alert(
        "Error",
        error?.message ||
          "An unexpected error occurred. Please check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-[#0C0F14]"
        style={{ paddingTop: insets.top }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="px-6 py-8 flex-1">
          {/* Header */}
          <View className="mb-12">
            <Text className="text-white font-sora-bold text-4xl mb-3">
              {mode === "login" ? "Welcome Back!" : "Create Account"}
            </Text>
            <Text className="text-[#A2A2A2] font-sora text-base">
              {mode === "login"
                ? "Please sign in to continue"
                : "Please fill in the form to continue"}
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {mode === "signup" && (
              <View>
                <Text className="text-[#A2A2A2] font-sora-medium mb-2 text-base">
                  Name
                </Text>
                <TextInput
                  className="bg-[#171A1F] text-white px-4 mb-2 py-3 rounded-xl font-sora"
                  placeholderTextColor="#A2A2A2"
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View className="mb-2">
              <Text className="text-[#A2A2A2] font-sora-medium  text-base">
                Email
              </Text>
              <TextInput
                className="bg-[#171A1F] text-white px-4 py-3 rounded-xl font-sora"
                placeholderTextColor="#A2A2A2"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text className="text-[#A2A2A2] font-sora-medium mb-2 text-base">
                Password
              </Text>
              <TextInput
                className="bg-[#171A1F] text-white px-4 py-3 rounded-xl font-sora"
                placeholderTextColor="#A2A2A2"
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`${
              loading ? "opacity-50" : ""
            } bg-[#C67C4E] rounded-xl mt-8 py-4`}
          >
            <Text className="text-white text-center font-sora-bold text-lg">
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Sign Up"}
            </Text>
          </TouchableOpacity>

          {/* Toggle Mode */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-[#A2A2A2] font-sora">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
            </Text>
            <TouchableOpacity
              onPress={() => setMode(mode === "login" ? "signup" : "login")}
            >
              <Text className="text-[#C67C4E] font-sora-bold">
                {mode === "login" ? "Sign Up" : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
