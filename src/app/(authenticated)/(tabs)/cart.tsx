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

function CartItem({
  item,
  index,
}: {
  item: ReturnType<typeof useCartStore>["items"][0];
  index: number;
}) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.product.id, item.size);
    } else {
      updateQuantity(item.product.id, newQuantity);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)}
      className="flex-row items-center bg-white rounded-2xl p-3 mb-4"
    >
      <Image
        source={{ uri: item.product.image_url }}
        className="w-16 h-16 rounded-xl"
      />
      <View className="flex-1 ml-4">
        <Text className="text-[#2F2D2C] font-sora text-base">
          {item.product.name}
        </Text>
        <Text className="text-[#9B9B9B] font-sora text-sm">
          {item.size} Size
        </Text>
      </View>
      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          onPress={() => handleQuantityChange(item.quantity - 1)}
          className="bg-white w-8 h-8 rounded-lg items-center justify-center border border-[#DEDEDE]"
        >
          <Ionicons name="remove" size={20} color="#2F2D2C" />
        </TouchableOpacity>
        <Text className="font-sora text-base min-w-[20px] text-center">
          {item.quantity}
        </Text>
        <TouchableOpacity
          onPress={() => handleQuantityChange(item.quantity + 1)}
          className="bg-white w-8 h-8 rounded-lg items-center justify-center border border-[#DEDEDE]"
        >
          <Ionicons name="add" size={20} color="#2F2D2C" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, getTotalPrice, getTotalItems } = useCartStore();

  if (items.length === 0) {
    return (
      <View
        style={{ paddingTop: insets.top }}
        className="flex-1 bg-[#F9F9F9] items-center justify-center px-4"
      >
        <Ionicons name="cart-outline" size={64} color="#9B9B9B" />
        <Text className="text-[#2F2D2C] font-sora text-xl mt-4">
          Your cart is empty
        </Text>
        <Text className="text-[#9B9B9B] font-sora text-base text-center mt-2">
          Looks like you haven't added any items to your cart yet
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/")}
          className="bg-[#C67C4E] px-8 py-4 rounded-xl mt-6"
        >
          <Text className="text-white font-sora">Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-[#F9F9F9]">
      <StatusBar barStyle="dark-content" />

      {/* Cart Items */}
      <ScrollView className="flex-1 px-4">
        {items.map((item, index) => (
          <CartItem
            key={item.product.id + item.size}
            item={item}
            index={index}
          />
        ))}
      </ScrollView>

      {/* Total and Checkout */}
      <View className="p-4 bg-white rounded-t-[24px]">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-[#2F2D2C] font-sora">
              Total ({getTotalItems()} items)
            </Text>
            <Text className="text-[#C67C4E] font-sora text-xl">
              $ {getTotalPrice().toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(authenticated)/order")}
            className="bg-[#C67C4E] px-16 py-4 rounded-xl"
            style={{
              shadowColor: "#C67C4E",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text className="text-white font-sora">Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
