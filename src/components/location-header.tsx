import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "./ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useLocationStore } from "~/src/store/use-location-store";
import { LocationPicker } from "./location-picker";

export function LocationHeader() {
  const { currentLocation, setPickerOpen } = useLocationStore();

  return (
    <>
      <View className="px-4 py-2">
        <TouchableOpacity
          className="flex-row items-center justify-center"
          onPress={() => setPickerOpen(true)}
        >
          <Text className="text-white font-sora text-sm">Deliver to</Text>
          <Ionicons name="chevron-down" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-center mt-1"
          onPress={() => setPickerOpen(true)}
        >
          <Ionicons name="location" size={20} color="#C67C4E" />
          <Text className="text-white font-sora text-base ml-1">
            {currentLocation.name}
          </Text>
        </TouchableOpacity>
      </View>
      <LocationPicker />
    </>
  );
}
