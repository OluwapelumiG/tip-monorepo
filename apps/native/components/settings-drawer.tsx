import { Ionicons } from "@expo/vector-icons";
import { useRouter, Href } from "expo-router";
import React, { useEffect } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import { Image } from "expo-image";

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
  isDestructive?: boolean;
}

function SettingsItem({ icon, title, description, onPress, isDestructive }: SettingsItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDestructive ? "#EF4444" : (isDark ? "#E5E7EB" : "#1F2937");
  
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center py-4 border-b border-gray-50 dark:border-gray-900"
    >
      <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${isDestructive ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className={`text-base font-bold ${isDestructive ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{title}</Text>
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" numberOfLines={1}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );
}

interface SettingsDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsDrawer({ visible, onClose }: SettingsDrawerProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    onClose();
    router.replace("/(auth)/login");
  };

  const navigateTo = (path: string) => {
    onClose();
    router.push(path as Href);
  };

  const SETTINGS_ITEMS: Array<{
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    path: string;
  }> = [
    {
      icon: "settings-outline",
      title: "Customization",
      description: "Control theme, layout, and visual behavior of the app",
      path: "/settings/customization"
    },
    {
      icon: "globe-outline",
      title: "Language",
      description: "Select the language used throughout the app",
      path: "/settings/language"
    },
    {
      icon: "cash-outline",
      title: "Finance",
      description: "Configure financial options, payments, and more",
      path: "/settings/finance"
    },
    {
      icon: "repeat-outline",
      title: "Subscription",
      description: "View, upgrade, or change your current plan",
      path: "/settings/subscription"
    },
    {
      icon: "help-buoy-outline",
      title: "Help",
      description: "Find answers, get support, or contact our team",
      path: "/settings/help"
    },
    {
      icon: "information-circle-outline",
      title: "About",
      description: "Learn more about the app and legal information",
      path: "/settings/about"
    }
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <Pressable 
          style={StyleSheet.absoluteFill} 
          onPress={onClose} 
        >
            <View style={styles.backdrop} />
        </Pressable>
        
        <View style={styles.drawerContent} className="bg-white dark:bg-black shadow-2xl">
          <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
            <View className="flex-row items-center px-6 pt-12 pb-4 border-b border-gray-50 dark:border-gray-900 justify-between">
              <TouchableOpacity onPress={onClose} className="p-2 -ml-2">
                <Ionicons name="arrow-back" size={24} color={isDark ? "#FFFFFF" : "#1F2937"} />
              </TouchableOpacity>
              <Text className="text-lg font-bold text-gray-900 dark:text-white">Profile</Text>
              <View style={{ width: 32 }} />
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false} 
              className="flex-1"
              contentContainerStyle={{ paddingBottom: 60 }}
            >
              <View className="items-center py-8 px-6">
                <View className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4 overflow-hidden border border-gray-100 dark:border-gray-800">
                  {user?.image ? (
                    <Image 
                      source={{ uri: user.image }} 
                      style={{ width: 80, height: 80 }} 
                      contentFit="cover"
                    />
                  ) : (
                    <Ionicons name="person" size={40} color="#9CA3AF" />
                  )}
                </View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white">{user?.name || "Username"}</Text>
                <Text className="text-gray-500 text-sm mb-6">{user?.email || "user@email.com"}</Text>
                
                <TouchableOpacity 
                    className="border border-gray-200 dark:border-gray-800 rounded-xl px-10 py-2.5"
                    onPress={() => console.log("Edit Profile Pressed")}
                >
                  <Text className="font-bold text-gray-900 dark:text-white">Edit Profile</Text>
                </TouchableOpacity>
              </View>

              <View className="px-6 border-t border-gray-100 dark:border-gray-900 pt-4">
                {SETTINGS_ITEMS.map((item) => (
                  <SettingsItem 
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    onPress={() => navigateTo(item.path)}
                  />
                ))}

                <View className="mt-4">
                  <SettingsItem 
                    icon="log-out-outline"
                    title="Log Out"
                    description="Securely sign out of your account"
                    onPress={handleLogout}
                    isDestructive={true}
                  />
                </View>
              </View>
            </ScrollView>

            <View className="p-6 border-t border-gray-50 dark:border-gray-900 items-center">
                <Text className="text-gray-400 text-[10px] font-medium tracking-widest uppercase">i'll Tip • Version 2.0.0</Text>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  drawerContent: {
    width: '85%',
    height: '100%',
  },
});
