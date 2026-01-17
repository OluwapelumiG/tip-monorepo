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
    <SafeAreaView className="flex-1 bg-white p-6 justify-center">
      <View className="w-full">
        <Text className="text-3xl font-bold text-blue-700 text-center mb-4">Create Account</Text>
        <Text className="text-gray-900 text-center font-bold text-lg mb-10 px-8 leading-6">
          Create an account so you can explore all the existing jobs
        </Text>

        <View className="space-y-4">
             <TextInput
                className="bg-blue-50 border-2 border-transparent focus:border-blue-500 rounded-xl p-4 text-base text-gray-800 font-medium"
                placeholder="Full Name"
                placeholderTextColor="#6b7280"
                value={name}
                onChangeText={setName}
            />
             <TextInput
                className="bg-blue-50 border-2 border-transparent focus:border-blue-500 rounded-xl p-4 text-base text-gray-800 font-medium"
                placeholder="Phone Number"
                placeholderTextColor="#6b7280"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />
             <TextInput
                className="bg-blue-50 border-2 border-transparent focus:border-blue-500 rounded-xl p-4 text-base text-gray-800 font-medium"
                placeholder="Email Address"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                className="bg-blue-50 border-2 border-transparent focus:border-blue-500 rounded-xl p-4 text-base text-gray-800 font-medium"
                placeholder="Password"
                placeholderTextColor="#6b7280"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
        </View>

        <Pressable
          className={`w-full mt-8 bg-blue-700 rounded-xl py-4 items-center justify-center shadow-lg shadow-blue-200 ${loading ? "opacity-70" : "active:opacity-80"}`}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color="white" />
          ) : (
             <Text className="text-white font-bold text-lg">Sign up</Text>
          )}
        </Pressable>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")} className="mt-8">
            <Text className="text-gray-600 text-center font-bold">Already have an account</Text>
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
