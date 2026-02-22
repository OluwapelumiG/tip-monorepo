import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingsDrawer } from "@/components/settings-drawer";
import { authClient } from "@/lib/auth-client";
import { ProfileView } from "@/components/profile-view";

export default function ProfileScreen() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data: session } = authClient.useSession();

  if (!session?.user?.id) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-black items-center justify-center p-6">
        <Text className="text-gray-500 text-center mb-6">Please sign in to view your profile</Text>
        <Link href="/welcome" asChild>
          <TouchableOpacity className="bg-blue-600 px-8 py-3 rounded-xl">
             <Text className="text-white font-bold">Sign In</Text>
          </TouchableOpacity>
        </Link>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-white dark:bg-black" edges={['top']}>
      <ProfileView 
        userId={session.user.id} 
        isOwnProfile={true} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Settings Drawer */}
      <SettingsDrawer 
        visible={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </SafeAreaView>
  );
}
