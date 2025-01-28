import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function SearchBar() {
  return (
    <View className="flex-row px-4 py-2 items-center gap-2">
      <View className="flex-1 flex-row items-center bg-[#242424] rounded-xl px-4 py-2">
        <Ionicons name="search" size={20} color="#989898" />
        <TextInput
          className="flex-1 ml-2 text-[#989898] font-sora"
          placeholder="Search coffee"
          placeholderTextColor="#989898"
        />
      </View>
      <TouchableOpacity className="bg-[#C67C4E] p-3 rounded-xl">
        <Ionicons name="options" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}
