import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock Data for Categories
const CATEGORIES = ["All", "Vehicle Services", "Financial & Legal", "Technology", "Home Services"];

// Mock Data for Jobs
const JOBS = [
  {
    id: "1",
    title: "Car Maintenance & Repairs",
    price: "$ 50,00",
    time: "3 Days",
    image: "https://placehold.co/400x300/e2e8f0/e2e8f0.png", // Gray placeholder
  },
  {
    id: "2",
    title: "Legal Consultation for SMBs",
    price: "$ 120,00",
    time: "1 Day",
    image: "https://placehold.co/400x300/e2e8f0/e2e8f0.png",
  },
  {
    id: "3",
    title: "Financial Audit & Planning",
    price: "$ 200,00",
    time: "5 Days",
    image: "https://placehold.co/400x300/e2e8f0/e2e8f0.png",
  },
  {
    id: "4",
    title: "Car Maintenance & Repairs",
    price: "$ 50,00",
    time: "3 Days",
    image: "https://placehold.co/400x300/e2e8f0/e2e8f0.png", // Gray placeholder
  },
  {
    id: "5",
    title: "Legal Consultation for SMBs",
    price: "$ 120,00",
    time: "1 Day",
    image: "https://placehold.co/400x300/e2e8f0/e2e8f0.png",
  },
  {
    id: "6",
    title: "Financial Audit & Planning",
    price: "$ 200,00",
    time: "5 Days",
    image: "https://placehold.co/400x300/e2e8f0/e2e8f0.png",
  },
];

export default function JobsScreen() {
  const [activeCategory, setActiveCategory] = useState("Vehicle Services");
  const router = useRouter(); // Import useRouter

  return (
    <View className="flex-1 bg-white dark:bg-black" style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" edges={["top"]} style={{ flex: 1 }}>
        
          
        {/* Header Section */}
        <View className="px-6 pt-2 pb-4">
            <Text className="text-4xl font-bold text-black dark:text-white leading-tight">
                Search for an{'\n'}open job offering!
            </Text>
        </View>

        {/* Search Bar */}
        <View className="px-6 mb-2 flex-row items-center space-x-3 gap-3">
            <View className="flex-1 flex-row items-center bg-transparent border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3.5">
                <Ionicons name="search-outline" size={24} color="#9ca3af" />
                <TextInput 
                placeholder="Search for Sector or Area..." 
                placeholderTextColor="#9ca3af"
                className="flex-1 ml-3 text-base text-black dark:text-white"
                />
            </View>
            <TouchableOpacity className="w-14 h-14 border border-gray-200 dark:border-gray-800 rounded-2xl items-center justify-center">
                    <Ionicons name="options-outline" size={24} color="black" className="dark:text-white" />
            </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="mb-2">
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}
            >
                {CATEGORIES.map((cat) => (
                    <TouchableOpacity 
                        key={cat}
                        onPress={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-full border ${
                            activeCategory === cat 
                                ? "bg-blue-600 border-blue-600" 
                                : "bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                        }`}
                    >
                        <Text className={`font-medium ${
                            activeCategory === cat 
                                ? "text-white" 
                                : "text-gray-500 dark:text-gray-400"
                        }`}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        {/* Most Urgent Section */}
        <View className="px-6 mb-4 flex-row justify-between items-center">
            <Text className="text-xl font-bold text-black dark:text-white">Most Urgent</Text>
            <TouchableOpacity>
                <Text className="text-blue-600 font-medium">See All</Text>
            </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

          {/* Job Cards */}
          <View className="px-6 pb-20 gap-6">
            {JOBS.map((job) => (
                <TouchableOpacity 
                  key={job.id} 
                  className="bg-transparent mb-2"
                  onPress={() => router.push(`/job/${job.id}`)}
                >
                    {/* Card Image Placeholder */}
                    <View className="w-full h-44 bg-gray-100 dark:bg-gray-800 rounded-3xl mb-4 overflow-hidden relative">
                        {/* Optionally use real images or gradients if available, sticking to gray block for design match */}
                        <View className="flex-1 bg-gray-200 dark:bg-gray-800" />
                    </View>

                    {/* Card Details */}
                    <Text className="text-lg font-bold text-black dark:text-white mb-2">{job.title}</Text>
                    <View className="flex-row items-center gap-4">
                        <Text className="text-blue-600 font-bold text-base">{job.price}</Text>
                        <View className="flex-row items-center">
                            <Ionicons name="time" size={16} color="#4b5563" />
                            <Text className="text-gray-600 dark:text-gray-400 ml-1.5 font-medium">{job.time}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
