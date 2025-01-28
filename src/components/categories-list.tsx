import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";
import { useCoffeeStore } from "../store/use-coffee-store";

const categories = ["All Coffee", "Cappuccino", "Espresso", "Black Coffee"];

export function CategoriesList() {
  const { selectedCategory, setSelectedCategory } = useCoffeeStore();

  return (
    <View className="h-14">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-5"
        contentContainerStyle={{ gap: 8, alignItems: "center" }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category ? "bg-[#C67C4E]" : "bg-[#313131]"
            }`}
          >
            <Text
              className={`font-sora text-sm ${
                selectedCategory === category ? "text-white" : "text-[#989898]"
              }`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
