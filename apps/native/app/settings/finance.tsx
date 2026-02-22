import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FinanceScreen() {
  const router = useRouter();

  const MENU_ITEMS = [
    { title: "Bank Information", description: "Control theme, layout, and visual behavior of the app" },
    { title: "Reward Wallet", description: "Control theme, layout, and visual behavior of the app" },
    { title: "My Earnings", description: "Control theme, layout, and visual behavior of the app" },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-white dark:bg-black" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-50 dark:border-gray-900">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} className="text-gray-900 dark:text-gray-300" />
        </TouchableOpacity>
        <Ionicons name="cash-outline" size={20} className="text-gray-900 dark:text-gray-300 ml-3" />
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-300 ml-2">Finance</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {MENU_ITEMS.map((item, index) => (
           <TouchableOpacity 
             key={item.title} 
             className="py-6 border-b border-gray-100 dark:border-gray-800"
            >
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">{item.title}</Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">{item.description}</Text>
           </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
