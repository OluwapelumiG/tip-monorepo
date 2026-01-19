import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock Data
const CHAT_USERS = [
  {
    id: "1",
    name: "Username 1",
    lastMessage: "I'll check it for a moment, please wait ...",
    avatar: "https://i.pravatar.cc/150?u=1",
    isOnline: false,
  },
  {
    id: "2",
    name: "Username 2",
    lastMessage: "Ok will talk to you soon.",
    avatar: "https://i.pravatar.cc/150?u=2",
    isOnline: true,
  },
  {
    id: "3",
    name: "Username 3",
    lastMessage: "Thank you, I'll make it up soon",
    avatar: "https://i.pravatar.cc/150?u=3",
    isOnline: true,
  },
  {
    id: "4",
    name: "Username 4",
    lastMessage: "Yes, I'll send it later",
    avatar: "https://i.pravatar.cc/150?u=4",
    isOnline: false,
  },
  {
    id: "5",
    name: "Username 5",
    lastMessage: "No worries, on progress",
    avatar: "https://i.pravatar.cc/150?u=5",
    isOnline: true,
  },
  {
    id: "6",
    name: "Username 6",
    lastMessage: "No worries, on progress",
    avatar: "https://i.pravatar.cc/150?u=6",
    isOnline: true,
  },
  {
    id: "7",
    name: "Username 7",
    lastMessage: "No worries, on progress",
    avatar: "https://i.pravatar.cc/150?u=7",
    isOnline: true,
  },
  {
    id: "8",
    name: "Username 8",
    lastMessage: "No worries, on progress",
    avatar: "https://i.pravatar.cc/150?u=8",
    isOnline: true,
  },
  {
    id: "9",
    name: "Username 9",
    lastMessage: "No worries, on progress",
    avatar: "https://i.pravatar.cc/150?u=9",
    isOnline: true,
  },
  {
    id: "10",
    name: "Username 10",
    lastMessage: "No worries, on progress",
    avatar: "https://i.pravatar.cc/150?u=10",
    isOnline: true,
  },
  {
    id: "11",
    name: "Username 11",
    lastMessage: "No worries, on progress",
    avatar: "https://i.pravatar.cc/150?u=11",
    isOnline: true,
  },
  {
    id: "12",
    name: "Username 12",
    lastMessage: "No worries, on progress",
    avatar: "https://i.pravatar.cc/150?u=12",
    isOnline: true,
  },
  {
    id: "13",
    name: "Username 13",
    lastMessage: "No worries, on progress",
    avatar: "https://i.pravatar.cc/150?u=13",
    isOnline: true,
  },
  {
    id: "14",
    name: "Username 14",
    lastMessage: "No worries, on progress",
    avatar: "https://i.pravatar.cc/150?u=14",
    isOnline: true,
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const renderItem = ({ item }: { item: typeof CHAT_USERS[0] }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/chat/${item.id}`)}
      className="flex-row items-center bg-transparent py-4 border-b border-gray-100 dark:border-gray-800"
    >
      <View className="relative mr-4">
        <Image
          source={{ uri: item.avatar }}
          className="w-14 h-14 rounded-full bg-gray-200"
        />
        {item.isOnline && (
          <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-black" />
        )}
      </View>
      <View className="flex-1">
        <Text className="text-base font-bold text-black dark:text-white mb-1">
          {item.name}
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-sm" numberOfLines={1}>
          {item.isOnline && item.id === "2" ? "✓ " : ""}{item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const filteredUsers = CHAT_USERS.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black" style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" edges={["top"]} style={{ flex: 1 }}>
        {/* Header Section */}
        <View className="px-6 pt-2 pb-4 bg-gray-50 dark:bg-black">
          <Text className="text-4xl font-bold text-black dark:text-white leading-tight">
            Connect with{'\n'}other Users!
          </Text>
        </View>

            {/* Search Bar */}
            {/* <View className="flex-row items-center bg-blue-700 rounded-full px-4 py-3 shadow-md">
                <Ionicons name="search" size={20} color="white" />
                <TextInput 
                    placeholder="Search chat..." 
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    className="flex-1 ml-3 text-white text-base font-medium"
                    value={search}
                    onChangeText={setSearch}
                />
            </View> */}

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

        {/* Content Area - Rounded White Card */}
        <View className="flex-1 bg-white dark:bg-gray-900 rounded-t-[30px] px-6 pt-2 shadow-sm" style={{ flex: 1 }}>
            <FlatList
                className="flex-1"
                data={filteredUsers}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                ListEmptyComponent={() => (
                <View className="flex-1 items-center justify-center mt-4">
                    {/* Empty State Graphics */}
                    <View className="w-32 h-32 bg-blue-800 rounded-full items-center justify-center mb-6 relative overflow-hidden">
                        <View className="absolute top-6 w-20 h-3 bg-blue-300 rounded-full opacity-50" />
                        <View className="absolute top-12 w-24 h-3 bg-blue-300 rounded-full opacity-70" />
                        <View className="absolute top-18 w-20 h-3 bg-blue-300 rounded-full opacity-50" />
                        
                        <View className="bg-blue-600 p-4 rounded-xl items-center justify-center shadow-lg border border-blue-500">
                            <Ionicons name="chatbox-ellipses" size={40} color="white" />
                        </View>
                    </View>

                    <Text className="text-xl font-bold text-black dark:text-white text-center mb-2">
                    No Chat Available{'\n'}To Display Yet
                    </Text>
                    
                    <Text className="text-gray-500 dark:text-gray-400 text-center px-6 mb-8 leading-5">
                    Get in touch with other users to discuss anything, all chats will be displayed here.
                    </Text>

                    <TouchableOpacity 
                    className="bg-blue-600 px-8 py-3 rounded-xl shadow-md w-full"
                    onPress={() => setSearch("")}
                    >
                    <Text className="text-white font-bold text-center text-base">Find Users</Text>
                    </TouchableOpacity>
                </View>
                )}
            />
        </View>
      </SafeAreaView>
    </View>
  );
}
