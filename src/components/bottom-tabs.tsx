import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useCartStore } from "~/src/store/use-cart-store";
import { Text } from "./ui/text";

export function BottomTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const cartItemCount = useCartStore((state) => state.getTotalItems());

  return (
    <View className="flex-row items-center justify-between px-8 pb-10 pt-4 bg-white">
      <TouchableOpacity
        onPress={() => router.push("/")}
        className="items-center"
      >
        <Ionicons
          name="home"
          size={28}
          color={pathname === "/" ? "#C67C4E" : "#8D8D8D"}
        />
        {pathname === "/" && (
          <View className="h-1.5 w-1.5 rounded-full bg-[#C67C4E] mt-1" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/favorite")}
        className="items-center"
      >
        <Ionicons
          name="heart"
          size={28}
          color={pathname === "/favorite" ? "#C67C4E" : "#8D8D8D"}
        />
        {pathname === "/favorite" && (
          <View className="h-1.5 w-1.5 rounded-full bg-[#C67C4E] mt-1" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/cart")}
        className="items-center"
      >
        <View>
          <Ionicons
            name="bag"
            size={28}
            color={pathname === "/cart" ? "#C67C4E" : "#8D8D8D"}
          />
          {cartItemCount > 0 && (
            <View className="absolute -top-2 -right-2 bg-[#C67C4E] rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-sora">
                {cartItemCount}
              </Text>
            </View>
          )}
        </View>
        {pathname === "/cart" && (
          <View className="h-1.5 w-1.5 rounded-full bg-[#C67C4E] mt-1" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/settings")}
        className="items-center"
      >
        <Ionicons
          name="settings-outline"
          size={28}
          color={pathname === "/settings" ? "#C67C4E" : "#8D8D8D"}
        />
        {pathname === "/settings" && (
          <View className="h-1.5 w-1.5 rounded-full bg-[#C67C4E] mt-1" />
        )}
      </TouchableOpacity>
    </View>
  );
}
