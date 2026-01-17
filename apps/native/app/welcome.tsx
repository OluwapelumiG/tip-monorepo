import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import logo from "@/assets/logo.png";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-between p-6">
      <View className="flex-1 items-center justify-center w-full">
        {/* Logo / Illustration */}
        <View className="w-64 h-64 mb-10 items-center justify-center">
             <Image
                source={logo}
                style={{ width: "100%", height: "100%" }}
                contentFit="contain"
            />
        </View>

        {/* Text Content */}
        <View className="items-center space-y-4">
          <Text className="text-3xl font-bold text-center text-blue-600">
            Empowering the{"\n"}Workforce
          </Text>
          <Text className="text-center text-gray-500 px-4 mt-2">
            Explore all the existing job roles based on your interest and study major
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View className="w-full flex-row justify-between items-center mb-10 px-4">
        <Button
            size="lg"
            variant="ghost" 
            onPress={() => router.push("/(auth)/login")}
            className="flex-1 mr-2"
        >
          <Button.Label>Login</Button.Label>
        </Button>
        <Button
          size="lg"
          onPress={() => router.push("/(auth)/register")}
          className="flex-1 ml-2 bg-primary"
        >
          <Button.Label>Register</Button.Label>
        </Button>
      </View>
    </SafeAreaView>
  );
}
