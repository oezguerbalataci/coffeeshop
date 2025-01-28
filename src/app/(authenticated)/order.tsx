import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import { Text } from "~/src/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCartStore } from "~/src/store/use-cart-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useLocationStore } from "~/src/store/use-location-store";

function DeliveryTypeSelector() {
  const { deliveryType, setDeliveryType } = useCartStore();

  return (
    <View className="flex-row bg-[#F2F2F2] rounded-xl p-1">
      <TouchableOpacity
        onPress={() => setDeliveryType("Deliver")}
        className={`flex-1 py-3 rounded-lg items-center ${
          deliveryType === "Deliver" ? "bg-[#C67C4E]" : "bg-transparent"
        }`}
      >
        <Text
          className={`font-sora ${
            deliveryType === "Deliver" ? "text-white" : "text-[#2F2D2C]"
          }`}
        >
          Deliver
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setDeliveryType("Pick Up")}
        className={`flex-1 py-3 rounded-lg items-center ${
          deliveryType === "Pick Up" ? "bg-[#C67C4E]" : "bg-transparent"
        }`}
      >
        <Text
          className={`font-sora ${
            deliveryType === "Pick Up" ? "text-white" : "text-[#2F2D2C]"
          }`}
        >
          Pick Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function AddressSection() {
  const router = useRouter();
  const { currentLocation } = useLocationStore();
  const { deliveryType } = useCartStore();

  if (deliveryType === "Pick Up") {
    return null;
  }

  return (
    <View className="mt-5">
      <Text className="text-[#2F2D2C] text-xl font-sora mb-3">
        Delivery Address
      </Text>
      {currentLocation ? (
        <>
          <Text className="text-[#2F2D2C] font-sora text-base">
            {currentLocation.name}
          </Text>
          <Text className="text-[#808080] font-sora text-sm mt-1">
            {currentLocation.address}
          </Text>
          <View className="flex-row gap-3 mt-3">
            <TouchableOpacity
              onPress={() => router.push("/(authenticated)/location")}
              className="flex-row items-center border border-[#DEDEDE] px-4 py-2 rounded-xl"
            >
              <Ionicons name="location-outline" size={20} color="#303336" />
              <Text className="text-[#303336] font-sora ml-2">
                Change Location
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center border border-[#DEDEDE] px-4 py-2 rounded-xl">
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#303336"
              />
              <Text className="text-[#303336] font-sora ml-2">Add Note</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <TouchableOpacity
          onPress={() => router.push("/(authenticated)/location")}
          className="flex-row items-center border border-[#DEDEDE] px-4 py-2 rounded-xl"
        >
          <Ionicons name="location-outline" size={20} color="#303336" />
          <Text className="text-[#303336] font-sora ml-2">
            Select Delivery Location
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function OrderItem({
  item,
}: {
  item: ReturnType<typeof useCartStore>["items"][0];
}) {
  const { updateQuantity } = useCartStore();

  return (
    <View className="flex-row items-center py-4">
      <Image
        source={{ uri: item.product.image_url }}
        className="w-14 h-14 rounded-xl"
      />
      <View className="flex-1 ml-4">
        <Text className="text-[#2F2D2C] font-sora text-base">
          {item.product.name}
        </Text>
        <Text className="text-[#9B9B9B] font-sora text-sm">Deep Foam</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          onPress={() =>
            updateQuantity(item.product.id, Math.max(0, item.quantity - 1))
          }
          className="bg-white w-7 h-7 rounded-lg items-center justify-center border border-[#DEDEDE]"
        >
          <Ionicons name="remove" size={18} color="#2F2D2C" />
        </TouchableOpacity>
        <Text className="font-sora text-base min-w-[20px] text-center">
          {item.quantity}
        </Text>
        <TouchableOpacity
          onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="bg-white w-7 h-7 rounded-lg items-center justify-center border border-[#DEDEDE]"
        >
          <Ionicons name="add" size={18} color="#2F2D2C" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function OrderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, getTotalPrice, deliveryFee } = useCartStore();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-[#F9F9F9]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="p-4 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-white rounded-xl p-2"
        >
          <Ionicons name="arrow-back" size={24} color="#2F2D2C" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-[#2F2D2C] text-xl font-sora">
          Order
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Delivery Type */}
        <DeliveryTypeSelector />

        {/* Address */}
        <AddressSection />

        {/* Order Items */}
        <View className="mt-5">
          {items.map((item) => (
            <OrderItem key={item.product.id + item.size} item={item} />
          ))}
        </View>

        {/* Discount */}
        <TouchableOpacity className="flex-row items-center justify-between bg-white p-4 rounded-xl mt-5">
          <View className="flex-row items-center">
            <View className="bg-[#F6F6F6] p-2 rounded-xl">
              <Ionicons name="pricetag-outline" size={24} color="#C67C4E" />
            </View>
            <Text className="text-[#2F2D2C] font-sora ml-3">
              1 Discount is Applied
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#2F2D2C" />
        </TouchableOpacity>

        {/* Payment Summary */}
        <View className="mt-5">
          <Text className="text-[#2F2D2C] text-xl font-sora mb-3">
            Payment Summary
          </Text>
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-[#2F2D2C] font-sora">Price</Text>
              <Text className="text-[#2F2D2C] font-sora">
                $ {getTotalPrice().toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[#2F2D2C] font-sora">Delivery Fee</Text>
              <View className="flex-row items-center">
                <Text className="text-[#2F2D2C] font-sora line-through mr-2">
                  ${deliveryFee.original.toFixed(2)}
                </Text>
                <Text className="text-[#2F2D2C] font-sora">
                  ${deliveryFee.discounted.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <TouchableOpacity className="flex-row items-center justify-between bg-white p-4 rounded-xl mt-5">
          <View className="flex-row items-center">
            <View className="bg-[#F6F6F6] p-2 rounded-xl">
              <Ionicons name="wallet-outline" size={24} color="#C67C4E" />
            </View>
            <View className="ml-3">
              <Text className="text-[#2F2D2C] font-sora">Cash/Wallet</Text>
              <Text className="text-[#2F2D2C] font-sora">
                $ {(getTotalPrice() + deliveryFee.discounted).toFixed(2)}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-down" size={24} color="#2F2D2C" />
        </TouchableOpacity>
      </ScrollView>

      {/* Order Button */}
      <View className="p-4">
        <TouchableOpacity
          className="bg-[#C67C4E] w-full py-4 rounded-xl items-center"
          style={{
            shadowColor: "#C67C4E",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text className="text-white font-sora text-base">Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
