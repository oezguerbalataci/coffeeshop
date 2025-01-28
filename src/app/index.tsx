import React, { useEffect, useState } from "react";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import { Text } from "../components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { Redirect, router } from "expo-router";
import { supabase } from "~/lib/supabase";
import { Session } from "@supabase/supabase-js";

export default function Screen() {
  const insets = useSafeAreaInsets();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, [session]);

  return session ? (
    <Redirect href="/(authenticated)" />
  ) : (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      {/* Image Background with Blur */}
      <View className="h-[70%]">
        <ImageBackground
          source={require("../../assets/images/onboard.png")}
          className="w-full h-full"
          resizeMethod="resize"
          resizeMode="cover"
        >
          <View className="flex-1 justify-end">
            <BlurView
              intensity={3}
              className="-mb-20 w-full rounded-full  bg-black/50 px-6 py-4"
            >
              <Text className="text-white font-sora-semibold text-5xl text-center leading-relaxed">
                Fall in Love with{"\n"}Coffee in Blissful{"\n"}Delight!
              </Text>
            </BlurView>
          </View>
        </ImageBackground>
      </View>

      {/* Text and Button Section */}
      <View className="flex-1 items-center px-6 justify-between py-8 mt-10">
        <Text className="text-[#A2A2A2] text-center text-base">
          Welcome to our cozy coffee corner, where every cup is a delight for
          you.
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="bg-[#C67C4E] rounded-3xl mb-8 w-[90%] py-4"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
