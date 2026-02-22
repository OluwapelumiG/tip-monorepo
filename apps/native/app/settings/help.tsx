import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpScreen() {
  const router = useRouter();

  const HELP_OPTIONS = [
    { title: "FAQ", icon: "help-circle-outline" },
    { title: "Contact Support", icon: "mail-outline" },
    { title: "Report a Bug", icon: "bug-outline" },
    { title: "Privacy Policy", icon: "shield-checkmark-outline" },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-white dark:bg-black" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-50 dark:border-gray-900">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} className="text-gray-900 dark:text-gray-300" />
        </TouchableOpacity>
        <Ionicons name="help-buoy-outline" size={20} className="text-gray-900 dark:text-gray-300 ml-3" />
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-300 ml-2">Help</Text>
      </View>

      <ScrollView className="flex-1 px-4 mt-4">
        {HELP_OPTIONS.map((item) => (
           <TouchableOpacity 
             key={item.title} 
             className="flex-row items-center justify-between py-5 border-b border-gray-50 dark:border-gray-800"
            >
              <View className="flex-row items-center">
                 <Ionicons name={item.icon as any} size={22} className="text-gray-600 dark:text-gray-400 mr-3" />
                 <Text className="text-gray-900 dark:text-white text-base font-medium">{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
           </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
