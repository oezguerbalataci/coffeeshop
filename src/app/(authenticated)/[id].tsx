import React from "react";
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
  Platform,
} from "react-native";
import { Text } from "~/src/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, {
  FadeIn,
  FadeInDown,
  Layout,
  SlideInDown,
} from "react-native-reanimated";
import { useCoffeeStore } from "~/src/store/use-coffee-store";
import { Database } from "~/database.types";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCartStore } from "~/src/store/use-cart-store";
import { useFavoritesStore } from "~/src/store/use-favorites-store";

const AnimatedImage = Animated.createAnimatedComponent(Animated.Image);
const sizes = ["S", "M", "L"] as const;

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function ProductDetail() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products } = useCoffeeStore();
  const product = products.find((p: Product) => p.id === id);
  const [selectedSize, setSelectedSize] =
    React.useState<(typeof sizes)[number]>("M");
  const { addItem } = useCartStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  if (!product) {
    return null;
  }

  const addToCart = () => {
    addItem({
      product,
      quantity: 1,
      size: selectedSize,
    });
    router.push("/(authenticated)/(tabs)/cart");
  };

  const handleFavoritePress = async () => {
    if (isFavorite(product.id)) {
      await removeFavorite(product.id);
    } else {
      await addFavorite(product);
    }
  };

  const isFav = isFavorite(product.id);

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className="absolute top-0 left-0 right-0 z-10"
      >
        <View className="p-4 flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#F7F8FB] rounded-xl p-2"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#2F2D2C" />
          </TouchableOpacity>
          <Text className="text-[#2F2D2C] text-xl font-sora">Detail</Text>
          <TouchableOpacity
            className="bg-[#F7F8FB] rounded-xl p-2"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={handleFavoritePress}
          >
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={24}
              color={isFav ? "#C67C4E" : "#2F2D2C"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Section */}
      <View className="relative">
        <AnimatedImage
          source={{ uri: product.image_url }}
          className="w-full aspect-[4/3] rounded-b-[40px]"
          entering={FadeIn.duration(300)}
          layout={Layout.springify()}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.3)"]}
          className="absolute bottom-0 left-0 right-0 h-24 rounded-b-[40px]"
        />
      </View>

      {/* Content Section */}
      <Animated.View
        className="flex-1 bg-white -mt-10 rounded-t-[40px] px-6"
        entering={SlideInDown.springify()}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <Animated.View className="pt-5" entering={FadeInDown.delay(100)}>
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-[#2F2D2C] text-2xl font-sora-semibold mb-1">
                {product.name}
              </Text>
              <Text className="text-[#9B9B9B] font-sora">Ice/Hot</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="star" size={20} color="#FBBE21" />
              <Text className="text-[#2F2D2C] font-sora">{product.rating}</Text>
              <Text className="text-[#808080] font-sora">(230)</Text>
            </View>
          </View>

          <View className="flex-row justify-between mt-5">
            <View className="items-center">
              <View className="bg-[#F9F9F9] p-2 rounded-xl">
                <Ionicons name="bicycle-outline" size={24} color="#C67C4E" />
              </View>
              <Text className="text-xs text-[#2F2D2C] mt-1 font-sora">
                Free delivery
              </Text>
            </View>
            <View className="items-center">
              <View className="bg-[#F9F9F9] p-2 rounded-xl">
                <Ionicons name="cafe-outline" size={24} color="#C67C4E" />
              </View>
              <Text className="text-xs text-[#2F2D2C] mt-1 font-sora">
                Bean
              </Text>
            </View>
            <View className="items-center">
              <View className="bg-[#F9F9F9] p-2 rounded-xl">
                <Ionicons name="gift-outline" size={24} color="#C67C4E" />
              </View>
              <Text className="text-xs text-[#2F2D2C] mt-1 font-sora">
                Points
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View className="mt-5" entering={FadeInDown.delay(200)}>
          <Text className="text-[#2F2D2C] text-xl font-sora mb-3">
            Description
          </Text>
          <Text className="text-[#9B9B9B] font-sora leading-5">
            {product.description ||
              "A cappuccino is an approximately 150 ml (5 oz) beverage, with 25 ml of espresso coffee and 85ml of fresh milk the foam..."}
            <Text className="text-[#C67C4E] font-sora"> Read More</Text>
          </Text>
        </Animated.View>

        <Animated.View className="mt-5" entering={FadeInDown.delay(300)}>
          <Text className="text-[#2F2D2C] text-xl font-sora mb-3">Size</Text>
          <View className="flex-row gap-4">
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(size)}
                className={`flex-1 py-3 rounded-xl border items-center ${
                  selectedSize === size
                    ? "bg-[#FFF5EE] border-[#C67C4E]"
                    : "bg-white border-[#DEDEDE]"
                }`}
              >
                <Text
                  className={`font-sora ${
                    selectedSize === size ? "text-[#C67C4E]" : "text-[#2F2D2C]"
                  }`}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          className="flex-row items-center justify-between mt-6 mb-4"
          entering={FadeInDown.delay(400)}
        >
          <View>
            <Text className="text-[#9B9B9B] text-sm font-sora">Price</Text>
            <Text className="text-[#C67C4E] text-2xl font-sora">
              $ {product.price.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            className="bg-[#C67C4E] px-20 py-4 rounded-2xl"
            style={{
              shadowColor: "#C67C4E",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
            onPress={addToCart}
          >
            <Text className="text-white font-sora">Buy Now</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
