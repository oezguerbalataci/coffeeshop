import {
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Text } from "~/src/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { Database } from "~/database.types";
import { useRouter } from "expo-router";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import { useCartStore } from "~/src/store/use-cart-store";
import { useFavoritesStore } from "~/src/store/use-favorites-store";

type Product = Database["public"]["Tables"]["products"]["Row"];

interface ProductCardProps {
  product: Product;
}

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export function ProductCard({ product }: ProductCardProps) {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const { addItem } = useCartStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const cardWidth = (width - 40) / 2; // 40 = padding-left(20) + padding-right(20)

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    addItem({
      product,
      quantity: 1,
      size: "M",
    });
  };

  const handleFavoritePress = async (e: any) => {
    e.stopPropagation();
    if (isFavorite(product.id)) {
      await removeFavorite(product.id);
    } else {
      await addFavorite(product);
    }
  };

  const isFav = isFavorite(product.id);

  return (
    <AnimatedTouchableOpacity
      style={{ width: cardWidth }}
      className="bg-white rounded-2xl p-2"
      onPress={() => router.push(`/${product.id}`)}
      entering={FadeIn}
      layout={Layout.springify()}
    >
      <AnimatedImage
        source={{ uri: product.image_url }}
        className="aspect-square w-full rounded-2xl"
        resizeMode="cover"
        entering={FadeIn}
        layout={Layout.springify()}
      />
      <View className="absolute top-3 right-3 flex-row items-center space-x-2">
        <TouchableOpacity
          className="bg-[#242424]/50 p-2 rounded-full"
          onPress={handleFavoritePress}
        >
          <Ionicons
            name={isFav ? "heart" : "heart-outline"}
            size={16}
            color={isFav ? "#C67C4E" : "#FFF"}
          />
        </TouchableOpacity>
        <View className="bg-[#242424]/50 px-2 py-1 rounded-md flex-row items-center">
          <Ionicons name="star" size={14} color="#FBBE21" />
          <Text className="text-white ml-1 text-sm font-sora">
            {product.rating}
          </Text>
        </View>
      </View>
      <View className="mt-2 px-1">
        <Text className="text-[#2F2D2C] text-base font-sora-semibold">
          {product.name}
        </Text>
        <Text className="text-[#9B9B9B] text-sm font-sora">
          {product.category}
        </Text>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-[#2F2D2C] text-base font-sora-semibold">
            $ {product.price.toFixed(2)}
          </Text>
          <TouchableOpacity
            className="bg-[#C67C4E] p-2 rounded-lg"
            onPress={handleAddToCart}
          >
            <Ionicons name="add" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedTouchableOpacity>
  );
}
