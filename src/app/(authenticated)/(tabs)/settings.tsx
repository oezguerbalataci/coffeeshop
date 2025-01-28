import React from "react";
import {
  View,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { Text } from "~/src/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { supabase } from "~/lib/supabase";

interface SettingItemProps {
  icon: string;
  title: string;
  value?: string;
  onPress?: () => void;
  isSwitch?: boolean;
  isOn?: boolean;
  onToggle?: (value: boolean) => void;
}

function SettingItem({
  icon,
  title,
  value,
  onPress,
  isSwitch,
  isOn,
  onToggle,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 px-4 border-b border-[#F4F4F4]"
    >
      <View className="flex-row items-center">
        <View className="bg-[#F6F6F6] p-2 rounded-xl">
          <Ionicons name={icon as any} size={24} color="#C67C4E" />
        </View>
        <Text className="text-[#2F2D2C] font-sora ml-3">{title}</Text>
      </View>
      {isSwitch ? (
        <Switch
          value={isOn}
          onValueChange={onToggle}
          trackColor={{ false: "#F4F4F4", true: "#C67C4E" }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <View className="flex-row items-center">
          {value && (
            <Text className="text-[#808080] font-sora mr-2">{value}</Text>
          )}
          <Ionicons name="chevron-forward" size={24} color="#2F2D2C" />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Navigate to the root route
      router.replace("/");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-[#F9F9F9]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="p-4">
        <Text className="text-[#2F2D2C] text-xl font-sora text-center">
          Settings
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Profile Section */}
        <Animated.View
          entering={FadeInDown.delay(100)}
          className="bg-white mx-4 rounded-2xl mb-4"
        >
          <View className="p-4 flex-row items-center">
            <View className="bg-[#C67C4E] w-16 h-16 rounded-full items-center justify-center">
              <Text className="text-white font-sora text-2xl">JD</Text>
            </View>
            <View className="ml-4">
              <Text className="text-[#2F2D2C] font-sora text-lg">John Doe</Text>
              <Text className="text-[#808080] font-sora">
                john.doe@example.com
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Account Settings */}
        <Animated.View
          entering={FadeInDown.delay(200)}
          className="bg-white mx-4 rounded-2xl mb-4"
        >
          <Text className="text-[#2F2D2C] font-sora text-lg p-4 pb-2">
            Account Settings
          </Text>
          <SettingItem
            icon="notifications-outline"
            title="Notifications"
            isSwitch
            isOn={notificationsEnabled}
            onToggle={setNotificationsEnabled}
          />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            isSwitch
            isOn={darkMode}
            onToggle={setDarkMode}
          />
          <SettingItem
            icon="language-outline"
            title="Language"
            value="English"
            onPress={() => {}}
          />
        </Animated.View>

        {/* Delivery Settings */}
        <Animated.View
          entering={FadeInDown.delay(300)}
          className="bg-white mx-4 rounded-2xl mb-4"
        >
          <Text className="text-[#2F2D2C] font-sora text-lg p-4 pb-2">
            Delivery Settings
          </Text>
          <SettingItem
            icon="location-outline"
            title="Saved Addresses"
            onPress={() => router.push("/(authenticated)/location")}
          />
          <SettingItem
            icon="bicycle-outline"
            title="Default Delivery Type"
            value="Deliver"
            onPress={() => {}}
          />
        </Animated.View>

        {/* App Settings */}
        <Animated.View
          entering={FadeInDown.delay(400)}
          className="bg-white mx-4 rounded-2xl mb-4"
        >
          <Text className="text-[#2F2D2C] font-sora text-lg p-4 pb-2">
            App Settings
          </Text>
          <SettingItem
            icon="information-circle-outline"
            title="App Version"
            value="1.0.0"
          />
          <SettingItem
            icon="trash-outline"
            title="Clear Cache"
            onPress={() => {}}
          />
        </Animated.View>

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.delay(500)} className="mx-4 mb-8">
          <TouchableOpacity
            onPress={handleLogout}
            disabled={isLoading}
            className="bg-white p-4 rounded-2xl flex-row items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF4B55" />
            <Text className="text-[#FF4B55] font-sora ml-2">
              {isLoading ? "Logging out..." : "Logout"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
