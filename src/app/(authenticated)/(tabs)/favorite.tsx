import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/src/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFavoritesStore } from "~/src/store/use-favorites-store";
import { ProductCard } from "~/src/components/product-card";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

export default function FavoriteScreen() {
  const insets = useSafeAreaInsets();
  const { favorites, isLoading } = useFavoritesStore();

  if (favorites.length === 0) {
    return (
      <View
        style={{ paddingTop: insets.top }}
        className="flex-1 bg-[#F9F9F9] items-center justify-center px-4"
      >
        <Animated.View entering={FadeIn} className="items-center">
          <Ionicons name="heart" size={64} color="#9B9B9B" />
          <Text className="text-[#2F2D2C] font-sora text-xl mt-4">
            No favorites yet
          </Text>
          <Text className="text-[#9B9B9B] font-sora text-base text-center mt-2">
            Start adding your favorite coffee to the list
          </Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-[#F9F9F9]">
      {/* Header */}
      <View className="p-4 border-b border-[#EAEAEA]">
        <Text className="text-[#2F2D2C] font-sora text-xl text-center">
          Favorites
        </Text>
      </View>

      {/* Favorites List */}
      <View className="flex-1 px-5">
        <FlashList
          data={favorites}
          numColumns={2}
          estimatedItemSize={200}
          ItemSeparatorComponent={() => <View className="h-5" />}
          renderItem={({ item }) => <ProductCard product={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-[#9B9B9B] font-sora text-base">
                Loading favorites...
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
