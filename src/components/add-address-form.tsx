import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Text } from "./ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useLocationStore } from "~/src/store/use-location-store";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AddAddressForm() {
  const insets = useSafeAreaInsets();
  const { isAddingAddress, setAddingAddress, addSavedLocation, formError } =
    useLocationStore();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !address.trim()) {
      return;
    }

    await addSavedLocation({
      name: name.trim(),
      address: address.trim(),
    });

    // Form will be closed by the store if successful
    // Fields will be cleared when the form is reopened
  };

  // Reset fields when form is opened
  useEffect(() => {
    if (isAddingAddress) {
      setName("");
      setAddress("");
    }
  }, [isAddingAddress]);

  return (
    <Modal
      visible={isAddingAddress}
      transparent
      animationType="fade"
      onRequestClose={() => setAddingAddress(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity
            className="flex-1"
            onPress={() => setAddingAddress(false)}
          />
          <Animated.View
            entering={SlideInDown}
            className="bg-white rounded-t-[24px]"
          >
            <View
              className="p-4 border-b border-[#EAEAEA]"
              style={{ paddingTop: 20 }}
            >
              <View className="w-12 h-1 bg-[#EAEAEA] rounded-full self-center mb-4" />
              <Text className="text-[#2F2D2C] font-sora text-xl">
                Add New Address
              </Text>
            </View>

            <ScrollView className="p-4">
              {formError && (
                <Text className="text-red-500 font-sora mb-4">{formError}</Text>
              )}

              <View className="mb-4">
                <Text className="text-[#2F2D2C] font-sora mb-2">
                  Location Name
                </Text>
                <TextInput
                  className="bg-[#F6F6F6] p-4 rounded-xl font-sora"
                  placeholder="e.g. Home, Office, etc."
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View className="mb-4">
                <Text className="text-[#2F2D2C] font-sora mb-2">
                  Complete Address
                </Text>
                <TextInput
                  className="bg-[#F6F6F6] p-4 rounded-xl font-sora"
                  placeholder="Enter your address"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View
              className="p-4 border-t border-[#EAEAEA]"
              style={{
                paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
              }}
            >
              <TouchableOpacity
                className="bg-[#C67C4E] p-4 rounded-xl items-center"
                onPress={handleSubmit}
              >
                <Text className="text-white font-sora">Save Address</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
