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
    <View className="flex-1 bg-gray-50 dark:bg-black">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header Area with customized background */}
        <View className="px-6 pt-2 pb-6 bg-gray-50 dark:bg-black">
            <View className="flex-row justify-between items-start mb-6">
                <View className="flex-row items-center">
                    <TouchableOpacity 
                        className="mr-3 p-1 rounded-full bg-blue-600 items-center justify-center"
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-2xl font-bold text-blue-800 dark:text-blue-400 leading-tight">
                            Connect With{'\n'}Other Users!
                        </Text>
                    </View>
                </View>
                {/* Profile Placeholder */}
                <View className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700" />
            </View>

            {/* Search Bar */}
            <View className="flex-row items-center bg-blue-700 rounded-full px-4 py-3 shadow-md">
                <Ionicons name="search" size={20} color="white" />
                <TextInput 
                    placeholder="Search chat..." 
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    className="flex-1 ml-3 text-white text-base font-medium"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
        </View>

        {/* Content Area - Rounded White Card */}
        <View className="flex-1 bg-white dark:bg-gray-900 rounded-t-[30px] px-6 pt-6 shadow-sm">
            <FlatList
                className="flex-1"
                data={filteredUsers}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
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
