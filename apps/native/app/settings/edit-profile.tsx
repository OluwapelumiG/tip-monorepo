import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { authClient } from "@/lib/auth-client";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { env } from "@illtip/env/native";

export default function EditProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const user = session?.user;

  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setProfileImage(user.image || null);
    }
  }, [user]);

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation(
    orpc.user.updateProfile.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(orpc.user.getUserProfile.queryOptions({ input: { userId: user?.id || "" } }));
        Alert.alert("Success", "Profile updated successfully!");
        router.back();
      },
      onError: (error: any) => {
        Alert.alert("Error", error.message || "Failed to update profile");
      },
    })
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    const formData = new FormData();
    const fileName = uri.split("/").pop() || "profile-photo.jpg";
    
    formData.append("file", {
      uri,
      name: fileName,
      type: "image/jpeg",
    } as any);
    formData.append("folder", "avatars");

    try {
      const response = await fetch(`${env.EXPO_PUBLIC_SERVER_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload Error:", error);
      throw error;
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    try {
      setIsUploading(true);
      let finalImageUrl = profileImage;

      if (profileImage && (profileImage.startsWith("file://") || profileImage.includes("ExponentExperienceData"))) {
        finalImageUrl = await uploadImage(profileImage);
      }

      updateProfile({
        name: name.trim(),
        image: finalImageUrl || "",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
        Alert.alert("Error", "Password must be at least 8 characters");
        return;
    }

    try {
      setIsChangingPassword(true);
      const { error } = await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        throw new Error(error.message || "Failed to change password");
      }

      Alert.alert("Success", "Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isSessionLoading && !user) {
    return (
      <View style={{ flex: 1 }} className="flex-1 bg-white dark:bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} className="flex-1 bg-white dark:bg-black">
      <SafeAreaView style={{ flex: 1 }} className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-gray-50 dark:border-gray-900 justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} color={isDark ? "#FFFFFF" : "#1F2937"} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">Edit Profile</Text>
          <TouchableOpacity 
            onPress={handleSaveProfile}
            disabled={isUpdatingProfile || isUploading}
          >
            {isUpdatingProfile || isUploading ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <Text className="text-blue-600 font-bold text-base">Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          className="flex-1"
        >
          <ScrollView 
            style={{ flex: 1 }}
            className="flex-1 px-6" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
          >
            {/* Avatar Section */}
            <View className="items-center py-10">
              <TouchableOpacity onPress={pickImage} className="relative">
                <View className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center overflow-hidden border-4 border-white dark:border-gray-900 shadow-sm">
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={{ width: 128, height: 128 }} contentFit="cover" />
                  ) : (
                    <Ionicons name="person" size={64} color="#9CA3AF" />
                  )}
                </View>
                <View className="absolute bottom-0 right-0 bg-blue-600 w-10 h-10 rounded-full items-center justify-center border-2 border-white dark:border-gray-900">
                  <Ionicons name="camera" size={20} color="white" />
                </View>
              </TouchableOpacity>
              <Text className="text-gray-400 text-sm mt-4">Tap to change profile photo</Text>
            </View>

            {/* General Info */}
            <View style={{ gap: 24 }}>
              <View>
                <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Display Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Your Name"
                  placeholderTextColor="#9CA3AF"
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-4 text-base text-gray-900 dark:text-white"
                />
              </View>

              <View>
                <Text className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Email Address</Text>
                <TextInput
                  value={user?.email}
                  editable={false}
                  className="bg-gray-50 dark:bg-gray-900 border border-transparent rounded-xl px-4 py-4 text-base text-gray-400 dark:text-gray-600"
                />
                <Text className="text-gray-400 text-xs mt-2 px-1">Email cannot be changed yet.</Text>
              </View>
            </View>

            {/* Password Section */}
            <View className="mt-12 mb-10">
              <View className="flex-row items-center mb-6">
                <View className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800" />
                <Text className="mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Update Password</Text>
                <View className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800" />
              </View>

              <View style={{ gap: 16 }}>
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Current Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-4 text-base text-gray-900 dark:text-white"
                />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-4 text-base text-gray-900 dark:text-white"
                />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm New Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-4 text-base text-gray-900 dark:text-white"
                />

                <TouchableOpacity 
                    onPress={handleChangePassword}
                    className="bg-blue-600 rounded-xl py-4 items-center mt-2"
                    disabled={isChangingPassword}
                >
                    {isChangingPassword ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-base">Update Password</Text>
                    )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
