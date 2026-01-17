import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Kept for functionality, though design hides it? 
  // Design only shows "Phone Number" and "Sign in". 
  // Maybe it's Passwordless (OTP)? Or Password field is hidden/next step?
  // Assuming minimal standard login for now: Email + Password.
  // I will show Email Input styled as "Email" (replacing Phone Number from design visually for functionality).
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
      if (error) throw error;
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Login Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-6 justify-center items-center">
      <View className="w-full max-w-sm">
        <Text className="text-3xl font-bold text-blue-700 text-center mb-2">Login here</Text>
        <Text className="text-gray-800 text-center text-lg font-bold mb-10">
          Welcome back you've{"\n"}been missed!
        </Text>

        <View className="space-y-6">
            <TextInput
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-base text-gray-800"
            placeholder="Email Address" // Changed from Phone Number for functionality
            placeholderTextColor="#6b7280"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            />
             <TextInput
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-base text-gray-800"
            placeholder="Password"
            placeholderTextColor="#6b7280"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            />
        </View>

        <Button
          className="w-full mt-8 bg-blue-700 rounded-xl"
          size="lg"
          isLoading={loading}
          onPress={handleLogin}
        >
          <Text className="text-white font-bold text-lg">Sign in</Text>
        </Button>

        <TouchableOpacity onPress={() => router.push("/(auth)/register")} className="mt-6">
            <Text className="text-gray-600 text-center font-bold">Create new account</Text>
        </TouchableOpacity>

        <View className="mt-14 items-center">
            <Text className="text-blue-600 font-bold mb-6">Or continue with</Text>
            
            <View className="flex-row space-x-4 gap-4">
                <TouchableOpacity className="bg-gray-100 p-3 rounded-xl px-6">
                    <Ionicons name="logo-google" size={24} color="black" />
                </TouchableOpacity>
                 <TouchableOpacity className="bg-gray-100 p-3 rounded-xl px-6">
                    <Ionicons name="logo-facebook" size={24} color="black" />
                </TouchableOpacity>
                 <TouchableOpacity className="bg-gray-100 p-3 rounded-xl px-6">
                    <Ionicons name="logo-apple" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
