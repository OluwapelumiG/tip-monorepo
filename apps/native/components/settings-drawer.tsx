import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Modal, Pressable, Text, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import { ThemeToggle } from "./theme-toggle";

interface SettingsDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsDrawer({ visible, onClose }: SettingsDrawerProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    onClose();
    router.replace("/(auth)/login");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 flex-row justify-end">
          <TouchableWithoutFeedback>
            <View className="w-[70%] h-full bg-white dark:bg-gray-900 shadow-xl">
              <SafeAreaView className="flex-1">
                <View className="p-4 border-b border-gray-100 dark:border-gray-800 flex-row justify-between items-center">
                  <Text className="text-xl font-bold text-gray-900 dark:text-white">Settings</Text>
                  <TouchableOpacity onPress={onClose} className="p-2">
                    <Ionicons name="close" size={24} className="text-gray-700 dark:text-gray-300" />
                  </TouchableOpacity>
                </View>

                <View className="p-4 space-y-4">
                  {/* Theme Toggle Row */}
                  <View className="flex-row justify-between items-center py-3 border-b border-gray-50 dark:border-gray-800">
                    <View className="flex-row items-center">
                        <View className="w-8 items-center mr-3">
                             <Ionicons name="color-palette-outline" size={22} className="text-gray-600 dark:text-gray-400" />
                        </View>
                        <Text className="text-gray-700 dark:text-gray-300 text-base font-medium">Appearance</Text>
                    </View>
                    <ThemeToggle />
                  </View>

                  {/* Logout Row */}
                   <TouchableOpacity 
                        onPress={handleLogout}
                        className="flex-row items-center py-3"
                    >
                         <View className="w-8 items-center mr-3">
                             <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                        </View>
                        <Text className="text-red-500 text-base font-medium">Log out</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
