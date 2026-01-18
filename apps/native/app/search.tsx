import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48) / 3; // Grid item width

type SearchTab = "Posts" | "Users" | "Jobs";

// Mock Data
const SUGGESTIONS = ["Place A", "Place B", "Place C", "Place D", "Place E", "Place F"];

const POSTS_DATA = Array(9).fill({ id: "post" });

const USERS_DATA = [
  { id: "1", name: "Username", rating: 4.7 },
  { id: "2", name: "Username", rating: 4.7 },
  { id: "3", name: "Username", rating: 4.7 },
  { id: "4", name: "Username", rating: 4.7 },
  { id: "5", name: "Username", rating: 4.7 },
  { id: "6", name: "Username", rating: 4.7 },
  { id: "7", name: "Username", rating: 4.7 },
  { id: "8", name: "Username", rating: 4.7 },
];

const JOBS_DATA = [
  { id: "1", title: "Delivery Services", icon: "cube-outline" },
  { id: "2", title: "Insurance Coordination", icon: "document-text-outline" },
  { id: "3", title: "Moving & Packaging Services", icon: "car-outline" },
  { id: "4", title: "Replace Name of Service", icon: "construct-outline" },
  { id: "5", title: "Replace Name of Service", icon: "construct-outline" },
  { id: "6", title: "Replace Name of Service", icon: "construct-outline" },
  { id: "7", title: "Replace Name of Service", icon: "construct-outline" },
  { id: "8", title: "Replace Name of Service", icon: "construct-outline" },
  { id: "9", title: "Replace Name of Service", icon: "construct-outline" },
];

export default function SearchScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchTab>("Posts");
  const [searchText, setSearchText] = useState("");

  const renderContent = () => {
    switch (activeTab) {
      case "Posts":
        return (
          <View className="flex-row flex-wrap gap-2 px-1">
            {POSTS_DATA.map((_, index) => (
              <View
                key={index}
                style={{ width: ITEM_WIDTH, height: ITEM_WIDTH }}
                className="bg-gray-200 dark:bg-gray-800 rounded-lg mb-2"
              />
            ))}
          </View>
        );
      case "Users":
        return (
          <View>
            {USERS_DATA.map((user, index) => (
              <View key={index} className="flex-row items-center mb-4">
                <View className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800 border dark:border-gray-700 mr-3" />
                <View>
                  <Text className="text-gray-900 dark:text-white font-bold text-base">
                    {user.name}
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={14} color="#FBBF24" />
                    <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                      {user.rating}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        );
      case "Jobs":
        return (
           <View className="flex-row flex-wrap gap-2 px-1">
            {JOBS_DATA.map((job, index) => (
                <View key={index} style={{ width: ITEM_WIDTH }} className="mb-4 items-center">
                     <View className="h-20 w-full bg-gray-200 dark:bg-gray-800 rounded-lg mb-2 items-center justify-center">
                         {/* Placeholder Icon */}
                     </View>
                     <Text className="text-center text-xs font-bold text-gray-900 dark:text-white">
                        {job.title}
                     </Text>
                </View>
            ))}
           </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="flex-1 bg-white dark:bg-black px-4"
    >
      {/* Header */}
      <View className="py-4">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
          Search for users,
        </Text>
        <Text className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
          posts or job offerings
        </Text>
      </View>

      {/* Search Input */}
      <View className="flex-row items-center mb-6 space-x-3">
        <View className="flex-1 flex-row items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full px-4 py-3 shadow-sm">
          <Ionicons name="search-outline" size={20} className="text-gray-400" />
          <TextInput
            placeholder="Search for Sector or Area..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-2 text-gray-900 dark:text-white text-base"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
          <Ionicons name="options-outline" size={20} className="text-gray-900 dark:text-white" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row mb-6 space-x-3">
        {(["Jobs", "Posts", "Users"] as SearchTab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl border ${
              activeTab === tab
                ? "bg-blue-600 border-blue-600"
                : "bg-transparent border-gray-200 dark:border-gray-800"
            }`}
          >
            <Text
              className={`font-semibold ${
                activeTab === tab
                  ? "text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
          {renderContent()}
      </ScrollView>
       {/* Bottom spacing for tab bar */}
       <View className="h-20" />
    </SafeAreaView>
  );
}
