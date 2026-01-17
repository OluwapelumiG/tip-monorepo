import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"customer" | "freelancer" | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      router.push({
        pathname: "/(auth)/register",
        params: { role: selectedRole },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-6 justify-between">
      <View>
        <Text className="text-3xl font-bold text-blue-600 mb-2">Choose your role</Text>
        <Text className="text-gray-500 text-lg mb-10">
          How do you want to use the app?
        </Text>

        <View className="space-y-4">
          <TouchableOpacity
            onPress={() => setSelectedRole("customer")}
            className={`p-6 rounded-2xl border-2 ${
              selectedRole === "customer" ? "border-blue-600 bg-blue-50" : "border-gray-200"
            }`}
          >
            <Text
              className={`text-xl font-bold mb-1 ${
                selectedRole === "customer" ? "text-blue-600" : "text-gray-800"
              }`}
            >
              Client (Tipper)
            </Text>
            <Text className="text-gray-500">I want to hire people for jobs.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedRole("freelancer")}
            className={`p-6 rounded-2xl border-2 ${
              selectedRole === "freelancer" ? "border-blue-600 bg-blue-50" : "border-gray-200"
            }`}
          >
            <Text
              className={`text-xl font-bold mb-1 ${
                selectedRole === "freelancer" ? "text-blue-600" : "text-gray-800"
              }`}
            >
              Freelancer
            </Text>
            <Text className="text-gray-500">I want to find work and get paid.</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button
        color="primary"
        size="lg"
        isDisabled={!selectedRole}
        onPress={handleContinue}
        className="w-full"
      >
        Continue
      </Button>
      
      <View className="flex-row justify-center mt-4">
          <Text className="text-gray-500">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text className="text-blue-600 font-bold">Log In</Text>
          </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}
