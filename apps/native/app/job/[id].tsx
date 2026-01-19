import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);

  return (
    <View className="flex-1 bg-white dark:bg-black" style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Blue Header Background */}
      <View className="absolute top-0 left-0 right-0 h-[45%] bg-blue-600 rounded-b-[40px] z-0" />

      <SafeAreaView className="flex-1" edges={["top", "bottom"]} style={{ flex: 1 }}>
        
        {/* Header Navigation */}
        <View className="px-6 pt-2 pb-6 flex-row justify-between items-center z-10">
           <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="white" />
           </TouchableOpacity>
           <Text className="text-white text-lg font-bold">Detail</Text>
           <TouchableOpacity>
                <Ionicons name="bag-outline" size={24} color="white" />
           </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 z-10" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
            
            {/* Main Image Card */}
            <View className="px-6">
                <View className="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded-3xl shadow-lg border-4 border-white dark:border-gray-900 overflow-hidden relative">
                    {/* Placeholder for Job Image */}
                    <View className="flex-1 bg-gray-200 dark:bg-gray-800" />
                </View>
            </View>

            {/* Content Body */}
            <View className="px-6 mt-6 pb-24">
                <Text className="text-3xl font-bold text-black dark:text-white leading-tight mb-2">
                    Car Maintenance & Repairs
                </Text>
                
                <View className="flex-row items-center gap-4 mb-6">
                    <Text className="text-blue-600 font-bold text-xl">$ 50,00</Text>
                    <View className="flex-row items-center">
                        <Ionicons name="time" size={18} color="#4b5563" />
                        <Text className="text-gray-600 dark:text-gray-400 ml-1.5 font-medium">3 Days</Text>
                    </View>
                </View>

                {/* Location Section */}
                <View className="mb-6">
                    <Text className="text-base font-semibold text-black dark:text-white mb-3 text-center">Job Location</Text>
                    <View className="flex-row gap-3">
                        <View className="flex-1 bg-blue-600 rounded-xl py-3 px-4 justify-center items-center">
                             <Text className="text-white font-medium text-xs">Enter Location Here, Address 123</Text>
                        </View>
                        <View className="bg-white border border-gray-200 dark:border-gray-800 rounded-xl py-3 px-4 justify-center items-center">
                             <Text className="text-gray-500 font-medium text-xs">In Person Service</Text>
                        </View>
                    </View>
                </View>

                {/* Description Section */}
                <View>
                    <Text className="text-lg font-bold text-black dark:text-white mb-2">Job Description</Text>
                    <Text className="text-gray-500 dark:text-gray-400 leading-6">
                        The description of the job or service can be read down here ... <Text className="text-gray-300">more</Text>
                    </Text>
                </View>

            </View>
        </ScrollView>

        {/* Footer */}
        <View className="px-6 py-4 flex-row items-center justify-between bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900">
             
             {/* Quantity Stepper */}
             <View className="flex-row items-center gap-4">
                 <TouchableOpacity 
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center"
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                 >
                     <Ionicons name="remove" size={16} color="black" />
                 </TouchableOpacity>
                 <Text className="text-lg font-bold text-black dark:text-white">{quantity.toString().padStart(2, '0')}</Text>
                 <TouchableOpacity 
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 items-center justify-center"
                    onPress={() => setQuantity(quantity + 1)}
                 >
                     <Ionicons name="add" size={16} color="black" />
                 </TouchableOpacity>
             </View>

             {/* Purchase Button */}
             <TouchableOpacity className="flex-1 ml-6 bg-blue-600 rounded-full py-4 flex-row items-center justify-center shadow-blue-300 shadow-md">
                 <Text className="text-white font-bold text-base mr-2">Purchase Lead</Text>
                 <Text className="text-yellow-300 font-bold text-base">$ 1,99</Text>
             </TouchableOpacity>

        </View>

      </SafeAreaView>
    </View>
  );
}
