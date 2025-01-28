import { Stack } from "expo-router";
import { BottomTabs } from "~/src/components/bottom-tabs";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }} />
      <BottomTabs />
    </View>
  );
}
