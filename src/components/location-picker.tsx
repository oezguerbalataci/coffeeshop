import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  useWindowDimensions,
} from "react-native";
import { Text } from "./ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useLocationStore } from "~/src/store/use-location-store";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddAddressForm } from "./add-address-form";

function LocationItem({ location, isSelected, onSelect }: any) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`flex-row items-center p-4 border-b border-[#EAEAEA] ${
        isSelected ? "bg-[#F6F6F6]" : ""
      }`}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${
          isSelected ? "bg-[#C67C4E]" : "bg-[#F6F6F6]"
        }`}
      >
        <Ionicons
          name="location"
          size={20}
          color={isSelected ? "#FFF" : "#C67C4E"}
        />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-[#2F2D2C] font-sora text-base">
          {location.name}
        </Text>
        <Text className="text-[#808080] font-sora text-sm">
          {location.address}
        </Text>
      </View>
      {isSelected && (
        <Ionicons name="checkmark-circle" size={24} color="#C67C4E" />
      )}
    </TouchableOpacity>
  );
}

export function LocationPicker() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const {
    isPickerOpen,
    setPickerOpen,
    currentLocation,
    savedLocations,
    setCurrentLocation,
    setAddingAddress,
    loadLocations,
  } = useLocationStore();

  // Load locations when picker is opened
  useEffect(() => {
    if (isPickerOpen) {
      loadLocations();
    }
  }, [isPickerOpen]);

  const handleAddAddress = () => {
    setPickerOpen(false);
    // Small delay to avoid modal animation conflicts
    setTimeout(() => {
      setAddingAddress(true);
    }, 100);
  };

  return (
    <>
      <Modal
        visible={isPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity
            className="flex-1"
            onPress={() => setPickerOpen(false)}
          />
          <Animated.View
            entering={SlideInDown}
            className="bg-white rounded-t-[24px]"
            style={{ maxHeight: height * 0.7 }}
          >
            <View
              className="p-4 border-b border-[#EAEAEA]"
              style={{ paddingTop: 20 }}
            >
              <View className="w-12 h-1 bg-[#EAEAEA] rounded-full self-center mb-4" />
              <Text className="text-[#2F2D2C] font-sora text-xl">
                Choose Location
              </Text>
            </View>

            <ScrollView className="flex-1">
              {savedLocations.map((location) => (
                <Animated.View key={location.name} entering={FadeIn}>
                  <LocationItem
                    location={location}
                    isSelected={currentLocation.name === location.name}
                    onSelect={() => {
                      setCurrentLocation(location);
                      setPickerOpen(false);
                    }}
                  />
                </Animated.View>
              ))}
            </ScrollView>

            <TouchableOpacity
              className="m-4 flex-row items-center justify-center bg-[#C67C4E] p-4 rounded-xl"
              style={{
                marginBottom: insets.bottom > 0 ? insets.bottom : 16,
              }}
              onPress={handleAddAddress}
            >
              <Ionicons name="add-circle-outline" size={24} color="#FFF" />
              <Text className="text-white font-sora ml-2">Add New Address</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
      <AddAddressForm />
    </>
  );
}
