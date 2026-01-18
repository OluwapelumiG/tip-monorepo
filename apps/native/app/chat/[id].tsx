import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MESSAGES = [
  { id: "1", text: "Hi Username.", time: "8 Minutes Ago", isMe: true },
  { id: "2", text: "Did you already get the brief?", time: "8 Minutes Ago", isMe: true },
  { id: "3", text: "Sample Text, Sample Text, Sample 12, Sample Text, 8438.", time: "7 Minutes Ago", isMe: false },
  { id: "4", text: "Sample Text, Sample Text, Sample 41.", time: "2 Minutes Ago", isMe: true },
  { id: "5", text: "Sample Text, Sample Text, Sample 12.", time: "2 Minutes Ago", isMe: true },
  { id: "6", text: "I'll check out, one moment. 24442424", time: "2 Minutes Ago", isMe: false },
];

export default function ChatRoomScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState("");

  const renderMessage = ({ item }: { item: typeof MESSAGES[0] }) => (
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
    <SafeAreaView className="flex-1 bg-white dark:bg-black" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 w-10 h-10 bg-blue-600 rounded-full items-center justify-center">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
        
        <View className="flex-1">
            <Text className="font-bold text-lg text-blue-700 dark:text-blue-400">Username {id}</Text>
        </View>

        <TouchableOpacity className="mr-3 w-10 h-10 bg-blue-600 rounded-full items-center justify-center">
             <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center">
             <Ionicons name="settings-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <View className="flex-1 px-4 pt-4">
         <FlatList
            data={MESSAGES}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
         />
      </View>

      {/* Input Area */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View className="flex-row items-center px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-blue-700">
            <TouchableOpacity className="mr-3 border border-white/30 rounded-lg p-1.5">
                 <Ionicons name="attach" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="mr-3 border border-white/30 rounded-lg p-1.5">
                 <Ionicons name="camera-outline" size={20} color="white" />
            </TouchableOpacity>
            
            <View className="flex-1 bg-transparent">
                 <TextInput 
                    placeholder="Hello" 
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    className="text-white text-base"
                    value={message}
                    onChangeText={setMessage}
                 />
            </View>

            <TouchableOpacity className="ml-3">
                 <Ionicons name="paper-plane-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="ml-3">
                 <Ionicons name="mic-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
