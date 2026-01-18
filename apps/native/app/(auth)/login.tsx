import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Pressable, ActivityIndicator } from "react-native";
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
      if (error) throw error;
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Login Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View className="flex-1 justify-center w-full px-8">
        <Text className="text-4xl font-extrabold text-blue-700 text-center mb-3 tracking-tight">Login here</Text>
        <Text className="text-gray-900 text-center text-xl font-bold mb-12 leading-7">
          Welcome back you've{"\n"}been missed!
        </Text>

        <View className="space-y-6">
            <View className="mt-4">
                 <TextInput
                    className="bg-blue-50 border-2 border-blue-50 focus:border-blue-500 rounded-xl p-4 text-lg text-gray-900 font-medium"
                    placeholder="Email"
                    placeholderTextColor="#6b7280"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                 />
            </View>
            <View className="mt-4">
                 <TextInput
                    className="bg-blue-50 border-2 border-blue-50 focus:border-blue-500 rounded-xl p-4 text-lg text-gray-900 font-medium"
                    placeholder="Password"
                    placeholderTextColor="#6b7280"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                 {/* <Text className="text-right text-blue-600 font-bold mt-3">Forgot your password?</Text> */}
            </View>
        </View>

        <Pressable
          className={`w-full mt-10 bg-blue-700 rounded-xl py-4 items-center justify-center shadow-lg shadow-blue-300 ${loading ? "opacity-70" : "active:opacity-80"}`}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="white" />
          ) : (
             <Text className="text-white font-bold text-xl">Sign in</Text>
          )}
        </Pressable>

        <TouchableOpacity onPress={() => router.push("/(auth)/register")} className="mt-8">
            <Text className="text-gray-900 font-bold text-center text-base">Create new account</Text>
        </TouchableOpacity>
      </View>

      <View className="pb-12 items-center">
            <Text className="text-blue-600 font-bold mb-8">Or continue with</Text>
            
            <View className="flex-row gap-6">
                <TouchableOpacity className="bg-gray-100 p-4 rounded-xl px-8 shadow-sm">
                    <Ionicons name="logo-google" size={24} color="black" />
                </TouchableOpacity>
                 <TouchableOpacity className="bg-gray-100 p-4 rounded-xl px-8 shadow-sm">
                    <Ionicons name="logo-facebook" size={24} color="black" />
                </TouchableOpacity>
                 <TouchableOpacity className="bg-gray-100 p-4 rounded-xl px-8 shadow-sm">
                    <Ionicons name="logo-apple" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    </SafeAreaView>
  );
}
