import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { logo } from "@illtip/assets";
import { Image } from "expo-image";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-white dark:bg-black" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-50 dark:border-gray-900">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} className="text-gray-900 dark:text-gray-300" />
        </TouchableOpacity>
        <Ionicons name="information-circle-outline" size={20} className="text-gray-900 dark:text-gray-300 ml-3" />
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-300 ml-2">About</Text>
      </View>

      <ScrollView className="flex-1 px-6 mt-10">
        <View className="items-center mb-10">
           <Image source={logo} className="w-24 h-24 rounded-3xl" contentFit="contain" />
           <Text className="text-2xl font-black text-gray-900 dark:text-white mt-4">i'll Tip</Text>
           <Text className="text-gray-500">Version 1.0.0 (Beta)</Text>
        </View>

        <View className="space-y-6">
           <View>
              <Text className="text-lg font-bold text-gray-900 dark:text-white">Our Mission</Text>
              <Text className="text-gray-600 dark:text-gray-400 mt-2 leading-6">
                Connecting local talent with people who need things done. i'll Tip is built to empower freelancers and simplify life for everyone.
              </Text>
           </View>

           <View>
              <Text className="text-lg font-bold text-gray-900 dark:text-white">Terms of Service</Text>
              <Text className="text-gray-600 dark:text-gray-400 mt-2 leading-6">
                By using i'll Tip, you agree to our terms of service and community guidelines.
              </Text>
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
