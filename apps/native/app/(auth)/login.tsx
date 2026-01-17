import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        Alert.alert("Login Failed", error.message || "Something went wrong");
      } else {
        // Simple success handling - router usually redirects or state updates
        router.replace("/");
      }
    } catch (err) {
      Alert.alert("Error", "Network or server error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-6 justify-center">
      <View className="w-full max-w-sm mx-auto">
        <Text className="text-3xl font-bold text-blue-600 mb-2 text-center">Welcome Back</Text>
        <Text className="text-gray-500 text-center mb-8">Sign in to continue</Text>

        <View className="space-y-4">
          <View>
            <Text className="mb-1 text-gray-700 font-medium">Email</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-base"
              placeholder="hello@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className="mb-1 text-gray-700 font-medium">Password</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-base"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity className="items-end">
            <Text className="text-blue-600 font-medium">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <Button
          color="primary"
          size="lg"
          isLoading={loading}
          onPress={handleLogin}
          className="w-full mt-8"
        >
          Log In
        </Button>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/role-selection")}>
            <Text className="text-blue-600 font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
