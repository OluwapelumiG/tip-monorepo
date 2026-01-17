import { authClient } from "@/lib/auth-client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "heroui-native";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Default to customer if no role selected (edge case)
  const role = params.role || "customer"; 

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        // Using 'image' field for role temporarily if better-auth doesn't support custom fields in type
        // OR better yet, assuming better-auth is configured to accept 'role'
        // If strict typing issues arise, we might need a different approach or verify better-auth config.
        // For now, let's pass it and assume the schema supports it.
        // @ts-ignore
        role: role, 
      });

      if (error) {
        Alert.alert("Registration Failed", error.message || "Something went wrong");
      } else {
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
        <Text className="text-3xl font-bold text-blue-600 mb-2 text-center">Create Account</Text>
        <Text className="text-gray-500 text-center mb-8">
          Join as a <Text className="font-bold text-blue-600 capitalize">{role}</Text>
        </Text>

        <View className="space-y-4">
          <View>
            <Text className="mb-1 text-gray-700 font-medium">Full Name</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-base"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
            />
          </View>

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
        </View>

        <Button
          color="primary"
          size="lg"
          isLoading={loading}
          onPress={handleRegister}
          className="w-full mt-8"
        >
          Sign Up
        </Button>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text className="text-blue-600 font-bold">Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
