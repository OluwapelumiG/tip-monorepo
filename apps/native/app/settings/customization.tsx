import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeToggle } from "@/components/theme-toggle";

export default function CustomizationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-white dark:bg-black" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-50 dark:border-gray-900">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} className="text-gray-900 dark:text-gray-300" />
        </TouchableOpacity>
        <Ionicons name="settings-outline" size={20} className="text-gray-900 dark:text-gray-300 ml-3" />
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-300 ml-2">Customization</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="py-6 border-b border-gray-100 dark:border-gray-800">
           <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">Light Mode/Dark Mode</Text>
           <Text className="text-gray-500 dark:text-gray-400 text-sm mb-4">Control theme, layout, and visual behavior of the app</Text>
           <View className="flex-row justify-between items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
              <Text className="text-gray-900 dark:text-white font-medium">Appearance</Text>
              <ThemeToggle />
           </View>
        </View>

        <View className="py-6 border-b border-gray-100 dark:border-gray-800">
           <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">Accessibility</Text>
           <Text className="text-gray-500 dark:text-gray-400 text-sm mb-4">Control theme, layout, and visual behavior of the app</Text>
           {/* Placeholder for more customization options */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
