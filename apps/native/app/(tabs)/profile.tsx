import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingsDrawer } from "@/components/settings-drawer";
import { authClient } from "@/lib/auth-client";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 50) / 3; // 3 items per row with padding

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("All Post");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data: session } = authClient.useSession();

  // Mock data for grid items
  const GRID_ITEMS = Array(9).fill(null);

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-white dark:bg-black" edges={['top']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-2">
        <View style={{ width: 24 }} /> 
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-300">Profile</Text>
         <View className="flex-row items-center space-x-4">
             <Link href="/search" asChild>
                <TouchableOpacity className="mr-4">
                    <Ionicons name="search-outline" size={24} className="text-gray-700 dark:text-gray-400" />
                </TouchableOpacity>
             </Link>
             <TouchableOpacity onPress={() => setIsSettingsOpen(true)}>
                 <Ionicons name="options-outline" size={24} className="text-gray-700 dark:text-gray-400" />
             </TouchableOpacity>
         </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {/* User Info */}
          <View className="items-center mt-6">
              <View className="h-28 w-28 rounded-full bg-gray-200 dark:bg-gray-800 mb-4 overflow-hidden items-center justify-center border-4 border-white dark:border-gray-900 shadow-sm">
                   {session?.user?.image ? (
                       <Image 
                            source={{ uri: session.user.image }} 
                            className="h-full w-full"
                            resizeMode="cover"
                       />
                   ) : (
                       <Ionicons name="person" size={48} className="text-gray-400 dark:text-gray-500" />
                   )}
              </View>
              <View className="flex-row items-center mb-1">
                  <Text className="text-xl font-bold text-gray-900 dark:text-gray-300 mr-1">
                    {session?.user?.name || "User"}
                  </Text>
                  <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
              </View>
              <Text className="text-gray-400 text-sm">
                {session?.user?.email || "No email"}
              </Text>
          </View>

          {/* Stats Buttons */}
          <View className="flex-row px-6 mt-6 space-x-4 justify-between">
               <TouchableOpacity className="flex-1 border border-blue-600 rounded-xl py-3 mx-2 items-center">
                   <Text className="text-gray-900 dark:text-gray-300 font-bold text-base">4.5K Friends</Text>
               </TouchableOpacity>
               <TouchableOpacity className="flex-1 border border-blue-600 rounded-xl py-3 mx-2 items-center flex-row justify-center">
                   <Ionicons name="star" size={18} color="#FBBF24" style={{ marginRight: 6 }} />
                   <Text className="text-gray-900 dark:text-gray-300 font-bold text-base">4.2K Reviews</Text>
               </TouchableOpacity>
          </View>

          {/* Profile Tabs */}
          <View className="flex-row px-6 mt-8 mb-4 space-x-6">
              {["All Post", "Photos", "Videos"].map((tab) => (
                  <TouchableOpacity 
                    key={tab} 
                    onPress={() => setActiveTab(tab)}
                    className={`pb-2 px-4 ${activeTab === tab ? "border-b-2 border-blue-600" : ""}`}
                  >
                      <Text className={`font-bold text-base ${activeTab === tab ? "text-blue-600" : "text-gray-400"}`}>
                          {tab}
                      </Text>
                  </TouchableOpacity>
              ))}
          </View>

          {/* Content Grid */}
          <View className="flex-row flex-wrap px-4 gap-2">
               {GRID_ITEMS.map((_, index) => (
                   <View 
                        key={index} 
                        style={{ width: ITEM_WIDTH, height: ITEM_WIDTH }} 
                        className="bg-gray-200 dark:bg-gray-800 rounded-xl mb-2"
                   />
               ))}
          </View>
      </ScrollView>

      {/* Settings Drawer */}
      <SettingsDrawer 
        visible={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </SafeAreaView>
  );
}
