import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock Data Store
const MOCK_CHATS: Record<string, { id: string; text: string; time: string; isMe: boolean }[]> = {
  "1": [
    { id: "1", text: "Hi Username 1.", time: "8 Minutes Ago", isMe: true },
    { id: "2", text: "Did you already get the brief?", time: "8 Minutes Ago", isMe: true },
    { id: "3", text: "Sample Text, Sample Text, Sample 12, Sample Text, 8438.", time: "7 Minutes Ago", isMe: false },
    { id: "4", text: "Yes, I just reviewed it.", time: "6 Minutes Ago", isMe: true },
    { id: "5", text: "Great, what do you think?", time: "6 Minutes Ago", isMe: false },
    { id: "6", text: "It looks solid, but we need more details on the budget.", time: "5 Minutes Ago", isMe: true },
    { id: "7", text: "I'll check with the finance team.", time: "5 Minutes Ago", isMe: false },
    { id: "8", text: "Thanks!", time: "4 Minutes Ago", isMe: true },
    { id: "9", text: "Are we still meeting tomorrow?", time: "4 Minutes Ago", isMe: false },
    { id: "10", text: "Yes, same time.", time: "4 Minutes Ago", isMe: true },
    { id: "11", text: "Perfect.", time: "3 Minutes Ago", isMe: false },
    { id: "12", text: "Did you see the new designs?", time: "3 Minutes Ago", isMe: true },
    { id: "13", text: "Not yet, sending them now?", time: "3 Minutes Ago", isMe: false },
    { id: "14", text: "Just sent them over email.", time: "2 Minutes Ago", isMe: true },
    { id: "15", text: "Received. They look amazing!", time: "2 Minutes Ago", isMe: false },
    { id: "16", text: "Glad you like them.", time: "2 Minutes Ago", isMe: true },
    { id: "17", text: "Should we invite Sarah to the call?", time: "1 Minute Ago", isMe: false },
    { id: "18", text: "Definitely, she needs to be in the loop.", time: "1 Minute Ago", isMe: true },
    { id: "19", text: "I'll send her the invite.", time: "1 Minute Ago", isMe: false },
    { id: "20", text: "Okay, talk soon.", time: "Just now", isMe: true },
    { id: "21", text: "Wait, one more thing.", time: "Just now", isMe: false },
    { id: "22", text: "What is it?", time: "Just now", isMe: true },
    { id: "23", text: "Don't forget the presentation deck.", time: "Just now", isMe: false },

  ],
  "2": [
    { id: "1", text: "Meeting at 3 PM?", time: "2 Hours Ago", isMe: false },
    { id: "2", text: "Yes, I'll be there.", time: "1 Hour Ago", isMe: true },
  ],
  "3": [], // Empty Chat
  "4": [
    { id: "1", text: "Hello!", time: "1 Day Ago", isMe: false },
  ],
  "5": [], // Empty Chat
};

export default function ChatRoomScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState("");

  const chatMessages = MOCK_CHATS[id || "1"] || [];

  const renderMessage = ({ item }: { item: typeof chatMessages[0] }) => (
    <View className={`mb-4 w-full ${item.isMe ? "items-end" : "items-start"}`}>
      <View 
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          item.isMe 
            ? "bg-blue-100 dark:bg-blue-900 rounded-tr-none" 
            : "bg-gray-100 dark:bg-gray-800 rounded-tl-none"
        }`}
      >
        <Text className={`text-base ${item.isMe ? "text-blue-900 dark:text-blue-100" : "text-gray-800 dark:text-gray-100"}`}>
            {item.text}
        </Text>
        <Text className={`text-[10px] mt-1 ${item.isMe ? "text-blue-400" : "text-gray-400"}`}>
            {item.time}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-black" style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1" edges={["top", "bottom"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          {/* User Details Header */}
          <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="mr-3 w-10 h-10 bg-blue-600 rounded-full items-center justify-center shadow-sm"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View className="w-10 h-10 rounded-full bg-gray-200 mr-3 border border-gray-300 dark:border-gray-700" />
            
            <View className="flex-1">
                <Text className="font-bold text-lg text-blue-700 dark:text-blue-400">Username {id}</Text>
                <Text className="text-xs text-green-500">Online</Text>
            </View>
    
            <TouchableOpacity className="mr-3 w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full items-center justify-center">
                <Ionicons name="search" size={20} className="text-blue-600 dark:text-blue-400" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full items-center justify-center">
                <Ionicons name="settings-outline" size={20} className="text-blue-600 dark:text-blue-400" />
            </TouchableOpacity>
          </View>
    
          {/* Message List Area */}
          <View className="flex-1 px-4 pt-4" style={{ flex: 1 }}>
            <FlatList
                data={chatMessages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                ListEmptyComponent={() => (
                  <View className="flex-1 items-center justify-center opacity-50">
                      <Ionicons name="chatbubble-ellipses-outline" size={64} color="gray" />
                      <Text className="text-gray-500 mt-4 text-center">No messages yet.{'\n'}Start the conversation!</Text>
                  </View>
                )}
            />
          </View>
    
          {/* Chat Options / Input Area */}
          <View className="flex-row items-center px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-blue-700 rounded-t-[20px] shadow-lg">
              <TouchableOpacity className="mr-3 border border-white/30 rounded-lg p-2">
                  <Ionicons name="attach" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="mr-3 border border-white/30 rounded-lg p-2">
                  <Ionicons name="camera-outline" size={20} color="white" />
              </TouchableOpacity>
              
              <View className="flex-1 bg-blue-800/50 rounded-xl px-4 py-2 mr-3">
                  <TextInput 
                      placeholder="Type a message..." 
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      className="text-white text-base"
                      value={message}
                      onChangeText={setMessage}
                  />
              </View>

              <TouchableOpacity className="bg-white rounded-full p-2">
                  <Ionicons name="send" size={20} color="#1d4ed8" />
              </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
