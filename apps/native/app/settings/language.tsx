import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LanguageScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-white dark:bg-black" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-50 dark:border-gray-900">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} className="text-gray-900 dark:text-gray-300" />
        </TouchableOpacity>
        <Ionicons name="globe-outline" size={20} className="text-gray-900 dark:text-gray-300 ml-3" />
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-300 ml-2">Language</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {["English (US)", "Spanish", "French", "German", "Chinese"].map((lang, index) => (
           <TouchableOpacity 
             key={lang} 
             className={`flex-row justify-between items-center py-5 ${index !== 4 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}
            >
              <Text className="text-gray-900 dark:text-white text-base font-medium">{lang}</Text>
              {index === 0 && <Ionicons name="checkmark-circle" size={20} color="#2563EB" />}
           </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
