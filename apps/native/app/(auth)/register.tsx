import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
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
        // @ts-ignore - passing extra data, schema should handle if mapped or ignored
        phoneNumber: phone,
        role: role, 
      });
      if (error) throw error;
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Registration Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View className="flex-1 justify-center w-full px-8">
        <Text className="text-4xl font-extrabold text-blue-700 text-center mb-3 tracking-tight">Create Account</Text>
        <Text className="text-gray-900 text-center text-lg font-bold mb-10 px-4 leading-6">
          Create an account so you can explore all the existing jobs
        </Text>

        <View className="space-y-4">
             <TextInput
                className="bg-blue-50 mt-4 border-2 border-blue-50 focus:border-blue-500 rounded-xl p-4 text-lg text-gray-900 font-medium"
                placeholder="Full Name"
                placeholderTextColor="#6b7280"
                value={name}
                onChangeText={setName}
            />
             <TextInput
                className="bg-blue-50 mt-4 border-2 border-blue-50 focus:border-blue-500 rounded-xl p-4 text-lg text-gray-900 font-medium"
                placeholder="Phone Number"
                placeholderTextColor="#6b7280"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />
             <TextInput
                className="bg-blue-50 mt-4 border-2 border-blue-50 focus:border-blue-500 rounded-xl p-4 text-lg text-gray-900 font-medium"
                placeholder="Email Address"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                className="bg-blue-50 mt-4 border-2 border-blue-50 focus:border-blue-500 rounded-xl p-4 text-lg text-gray-900 font-medium"
                placeholder="Password"
                placeholderTextColor="#6b7280"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
        </View>

        <Pressable
          className={`w-full mt-10 bg-blue-700 rounded-xl py-4 items-center justify-center shadow-lg shadow-blue-300 ${loading ? "opacity-70" : "active:opacity-80"}`}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="white" />
          ) : (
             <Text className="text-white font-bold text-xl">Sign up</Text>
          )}
        </Pressable>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")} className="mt-8">
            <Text className="text-gray-900 font-bold text-center text-base">Already have an account</Text>
        </TouchableOpacity>
      </View>

        <View className="pb-12 items-center">
            <Text className="text-blue-600 font-bold mb-6">Or continue with</Text>
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
