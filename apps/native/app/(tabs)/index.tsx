import { Card } from "heroui-native";
import { Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "@/assets/logo.png";



const FEED_DATA = [
  {
    id: "1",
    user: {
      name: "Username",
      rating: 4.7,
      time: "21 mins ago",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    tag: "Web Design",
    content: {
      views: "124M",
      likes: "983K",
      comments: "232K",
      shares: "574",
      title: "I will design a modern website UI/UX",
      description: "Professional web design with responsive layouts and modern aesthetics ... more",
    },
  },
  {
    id: "2",
    user: {
      name: "Username 2",
      rating: 3.2,
      time: "2h ago",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    tag: "Tech & Digital Services",
    content: {
        views: "12M",
        likes: "83K",
        comments: "32K",
        shares: "74",
        title: "Cross-platform mobile app development",
        description: "High performance apps built with React Native ... more",
      },
  },
];

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState("Trending");

  const renderItem = ({ item }: { item: any }) => (
    <View className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
       {/* User Header */}
       <View className="flex-row items-center px-4 mb-3">
          <View className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 items-center justify-center border-2 border-blue-500 mr-3 overflow-hidden">
               {/* Use Image if available, else placeholder */}
               <View className="h-full w-full bg-blue-200 dark:bg-blue-800" /> 
          </View>
          <View>
              <Text className="font-bold text-gray-900 dark:text-white text-base">{item.user.name}</Text>
              <View className="flex-row items-center">
                  <Ionicons name="star" size={12} color="#FBBF24" />
                  <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">{item.user.rating} • {item.user.time}</Text>
              </View>
          </View>
       </View>
       
       {/* Tag */}
       <View className="px-4 mb-3">
            <View className="border border-blue-200 dark:border-blue-800 rounded-md px-3 py-1 self-start">
                 <Text className="text-blue-600 dark:text-blue-400 text-xs font-semibold">{item.tag}</Text>
            </View>
       </View>

       {/* Content Placeholder (Gray Box) */}
       <View className="w-full h-64 bg-gray-200 dark:bg-gray-800 mb-3" />

       {/* Stats */}
       <View className="flex-row justify-between px-4 mb-3">
            <View className="flex-row items-center space-x-4">
                <View className="flex-row items-center mr-4">
                     <Ionicons name="eye-outline" size={18} className="text-gray-600 dark:text-gray-400" />
                     <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1 font-medium">{item.content.views}</Text>
                </View>
                 <View className="flex-row items-center mr-4">
                     <Ionicons name="heart-outline" size={18} className="text-gray-600 dark:text-gray-400" />
                     <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1 font-medium">{item.content.likes}</Text>
                </View>
                 <View className="flex-row items-center mr-4">
                     <Ionicons name="chatbubble-outline" size={18} className="text-gray-600 dark:text-gray-400" />
                     <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1 font-medium">{item.content.comments}</Text>
                </View>
                 <View className="flex-row items-center">
                     <Ionicons name="share-social-outline" size={18} className="text-gray-600 dark:text-gray-400" />
                     <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1 font-medium">{item.content.shares}</Text>
                </View>
            </View>
            <View className="flex-row">
                 <View className="h-2 w-2 rounded-full bg-blue-600 mx-0.5" />
                 <View className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700 mx-0.5" />
                 <View className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-700 mx-0.5" />
            </View>
       </View>

       {/* Title & Description */}
       <View className="px-4">
            <Text className="text-gray-900 dark:text-white font-bold text-lg mb-1">{item.content.title}</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-xs leading-4">{item.content.description}</Text>
       </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-white dark:bg-black" edges={['top']}>
       {/* Header */}
       <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-50 dark:border-gray-800">
            {/* <View className="w-8" />  */}
            <View className="flex-row items-center">
                <Image source={logo} style={{ width: 42, height: 42 }} resizeMode="contain" className="mr-2" />
            </View>
            <Text className="text-xl font-bold text-gray-800 dark:text-white">i'll Tip</Text>
           <TouchableOpacity>
               <Ionicons name="notifications-outline" size={26} className="text-gray-900 dark:text-white" />
           </TouchableOpacity>
      </View>

      {/* Top Tabs */}
      <View className="flex-row px-4 mt-4 mb-2">
           <TouchableOpacity 
              onPress={() => setActiveTab("Trending")}
              className={`flex-1 items-center py-2 rounded-lg ${activeTab === "Trending" ? "bg-blue-600" : "bg-transparent"}`}
            >
               <Text className={`font-bold ${activeTab === "Trending" ? "text-white" : "text-gray-900 dark:text-gray-400"}`}>Trending</Text>
           </TouchableOpacity>
           <TouchableOpacity 
              onPress={() => setActiveTab("Explore")}
              className={`flex-1 items-center py-2 rounded-lg ${activeTab === "Explore" ? "bg-blue-600" : "bg-transparent"}`}
            >
               <Text className={`font-bold ${activeTab === "Explore" ? "text-white" : "text-gray-900 dark:text-gray-400"}`}>Explore</Text>
           </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-4 flex-row items-center mb-4 mt-2">
           <Link href="/search" asChild>
              <TouchableOpacity className="flex-1 flex-row items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3 mr-3 shadow-sm">
                    <Ionicons name="search-outline" size={20} color="#9CA3AF" />
                    <Text className="flex-1 ml-2 text-gray-400 text-base">
                        Search for users or jobs...
                    </Text>
              </TouchableOpacity>
           </Link>
           <TouchableOpacity className="border border-gray-200 dark:border-gray-800 rounded-xl p-3 shadow-sm bg-white dark:bg-gray-900">
                <Ionicons name="add" size={24} className="text-black dark:text-white" />
           </TouchableOpacity>
      </View>

      {/* Feed List */}
      <FlatList
        data={FEED_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
