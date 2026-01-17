import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
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
    <SafeAreaView className="flex-1 bg-white p-6 justify-center items-center">
      <View className="w-full max-w-sm">
        <Text className="text-3xl font-bold text-blue-700 text-center mb-4">Create Account</Text>
        <Text className="text-gray-800 text-center font-medium mb-10 px-8">
          Create an account so you can explore all the existing jobs
        </Text>

        <View className="space-y-4">
             <TextInput
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-base text-gray-800"
                placeholder="Full Name"
                placeholderTextColor="#6b7280"
                value={name}
                onChangeText={setName}
            />
             <TextInput
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-base text-gray-800"
                placeholder="Phone Number"
                placeholderTextColor="#6b7280"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />
             <TextInput
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-base text-gray-800"
                placeholder="Email Address"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
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
          onPress={handleRegister}
        >
          <Text className="text-white font-bold text-lg">Sign up</Text>
        </Button>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")} className="mt-6">
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
