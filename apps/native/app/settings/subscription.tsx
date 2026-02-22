import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubscriptionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-white dark:bg-black" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-50 dark:border-gray-900">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} className="text-gray-900 dark:text-gray-300" />
        </TouchableOpacity>
        <Ionicons name="repeat-outline" size={20} className="text-gray-900 dark:text-gray-300 ml-3" />
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-300 ml-2">Subscription</Text>
      </View>

      <View className="flex-1 items-center justify-center p-6">
         <View className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-3xl items-center w-full">
            <Ionicons name="diamond" size={48} color="#2563EB" />
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Free Plan</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">Upgrade to Premium for more filters and advanced post insights.</Text>
            <TouchableOpacity className="mt-8 bg-blue-600 w-full py-4 rounded-2xl items-center">
               <Text className="text-white font-bold text-lg">Coming Soon</Text>
            </TouchableOpacity>
         </View>
      </View>
    </SafeAreaView>
  );
}
