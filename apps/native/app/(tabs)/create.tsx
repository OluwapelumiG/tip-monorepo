import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useMutation } from "@tanstack/react-query";
import { orpc, queryClient } from "@/utils/orpc";
import { env } from "@illtip/env/native";

// Mock Location Data
const LOCATIONS = ["Select Location", "Location A", "Location B", "Location C", "Location D"];
const CATEGORIES = ["Vehicle Services", "Financial & Legal", "Technology", "Home Services"];

export default function CreateScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"post" | "job">("post");
  
  // Post Form State
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const [media, setMedia] = useState<{ url: string; type: "image" | "video"; fileName?: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Mutations
  const { mutate: createPost, isPending } = useMutation(
    orpc.post.createPost.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(orpc.post.getPosts.queryOptions());
        Alert.alert("Success", "Post created successfully!");
        setPostTitle("");
        setPostDescription("");
        setMedia([]);
        setSelectedLocation("Select Location");
        router.replace("/(tabs)");
      },
      onError: (error: any) => {
        Alert.alert("Error", error.message);
      },
    })
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedMedia = result.assets.map(asset => ({
        url: asset.uri,
        type: (asset.type === 'video' ? 'video' : 'image') as "image" | "video",
        fileName: asset.fileName ?? asset.uri.split('/').pop()
      }));
      setMedia([...media, ...selectedMedia]);
    }
  };

  const uploadMedia = async (mediaItem: typeof media[0]) => {
    const formData = new FormData();
    const type = mediaItem.type === "image" ? "image/jpeg" : "video/mp4";
    
    formData.append("file", {
      uri: mediaItem.url,
      name: mediaItem.fileName || "upload",
      type: type,
    } as any);
    formData.append("folder", "posts");

    try {
      const response = await fetch(`${env.EXPO_PUBLIC_SERVER_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Upload Error:", error);
      throw error;
    }
  };

  const handlePost = async () => {
    if (!postTitle || !postDescription) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      setIsUploading(true);
      
      const uploadedMedia = [];
      for (const item of media) {
        const remoteUrl = await uploadMedia(item);
        uploadedMedia.push({
          url: remoteUrl,
          type: item.type,
        });
      }

      createPost({
        title: postTitle,
        description: postDescription,
        location: selectedLocation === "Select Location" ? undefined : selectedLocation,
        media: uploadedMedia,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to upload media. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Job Form State
  const [jobTitle, setJobTitle] = useState("");
  const [jobPrice, setJobPrice] = useState("");
  const [jobDuration, setJobDuration] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  return (
    <View className="flex-1 bg-white dark:bg-black" style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" edges={["top"]} style={{ flex: 1 }}>
        
        {/* Helper Header for Tab Switching */}
        <View className="px-6 py-4">
            <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <TouchableOpacity 
                    className={`flex-1 py-2 rounded-lg items-center ${activeTab === "post" ? "bg-blue-600 shadow-sm" : ""}`}
                    onPress={() => setActiveTab("post")}
                >
                    <Text className={`font-bold ${activeTab === "post" ? "text-white" : "text-gray-500"}`}>Create Post</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className={`flex-1 py-2 rounded-lg items-center ${activeTab === "job" ? "bg-blue-600 shadow-sm" : ""}`}
                    onPress={() => setActiveTab("job")}
                >
                    <Text className={`font-bold ${activeTab === "job" ? "text-white" : "text-gray-500"}`}>Create Job</Text>
                </TouchableOpacity>
            </View>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            
            {activeTab === "post" ? (
                // === CREATE POST FORM ===
                <View className="pb-10">
                    <Text className="text-base font-bold text-black dark:text-white mb-2">Title</Text>
                    <TextInput 
                        placeholder="Enter post title" 
                        placeholderTextColor="#9CA3AF"
                        className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 mb-1 text-base text-black dark:text-white bg-white dark:bg-gray-900"
                        value={postTitle}
                        onChangeText={setPostTitle}
                    />
                    <Text className="text-gray-400 text-xs mb-6">Keep it concise and descriptive.</Text>

                    <Text className="text-base font-bold text-black dark:text-white mb-2">Description</Text>
                    <TextInput 
                        placeholder="Describe your post" 
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                        className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 mb-1 text-base text-black dark:text-white bg-white dark:bg-gray-900 h-32"
                        value={postDescription}
                        onChangeText={setPostDescription}
                    />
                    <Text className="text-gray-400 text-xs mb-6">Tell us more about your content.</Text>

                    {/* Media Upload */}
                    <View className="mb-6">
                        <TouchableOpacity 
                            onPress={pickImage}
                            className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-3xl items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 overflow-hidden"
                        >
                            {media.length > 0 ? (
                                <View className="flex-row flex-wrap justify-center gap-2 p-4">
                                    {media.map((m, i) => (
                                        <View key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                                            <Image source={{ uri: m.url }} className="w-full h-full" />
                                        </View>
                                    ))}
                                    <View className="w-20 h-20 rounded-lg bg-blue-100 items-center justify-center">
                                        <Ionicons name="add" size={32} color="#2563eb" />
                                    </View>
                                </View>
                            ) : (
                                <View className="items-center">
                                    <Ionicons name="images-outline" size={48} color="#9CA3AF" />
                                    <Text className="text-gray-500 font-bold text-lg mt-2">Upload photos</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text className="text-gray-400 text-xs mt-2">Add up to 5 photos.</Text>
                    </View>

                    {/* Location Selector */}
                    <Text className="text-base font-bold text-black dark:text-white mb-3">Location</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }} className="mb-10">
                        {LOCATIONS.map((loc) => (
                            <TouchableOpacity 
                                key={loc} 
                                onPress={() => setSelectedLocation(loc)}
                                className={`px-4 py-2 rounded-lg ${selectedLocation === loc ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800"}`}
                            >
                                <Text className={`font-medium ${selectedLocation === loc ? "text-blue-700 dark:text-blue-300" : "text-black dark:text-white"}`}>{loc}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            ) : (
                // === CREATE JOB FORM ===
                <View className="pb-10">
                    <Text className="text-base font-bold text-black dark:text-white mb-2">Job Title</Text>
                    <TextInput 
                        placeholder="e.g. Car Repair Needed" 
                        placeholderTextColor="#9CA3AF"
                        className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 mb-6 text-base text-black dark:text-white bg-white dark:bg-gray-900"
                        value={jobTitle}
                        onChangeText={setJobTitle}
                    />

                    <View className="flex-row gap-4 mb-6">
                        <View className="flex-1">
                            <Text className="text-base font-bold text-black dark:text-white mb-2">Price Estimate ($)</Text>
                            <TextInput 
                                placeholder="50.00" 
                                keyboardType="numeric"
                                placeholderTextColor="#9CA3AF"
                                className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-base text-black dark:text-white bg-white dark:bg-gray-900"
                                value={jobPrice}
                                onChangeText={setJobPrice}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-bold text-black dark:text-white mb-2">Duration</Text>
                            <TextInput 
                                placeholder="e.g. 3 Days" 
                                placeholderTextColor="#9CA3AF"
                                className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-base text-black dark:text-white bg-white dark:bg-gray-900"
                                value={jobDuration}
                                onChangeText={setJobDuration}
                            />
                        </View>
                    </View>

                    <Text className="text-base font-bold text-black dark:text-white mb-3">Category</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }} className="mb-6">
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity 
                                key={cat} 
                                onPress={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg ${selectedCategory === cat ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800"}`}
                            >
                                <Text className={`font-medium ${selectedCategory === cat ? "text-blue-700 dark:text-blue-300" : "text-black dark:text-white"}`}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text className="text-base font-bold text-black dark:text-white mb-2">Job Details</Text>
                    <TextInput 
                        placeholder="Detailed description of the job..." 
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                        className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 mb-1 text-base text-black dark:text-white bg-white dark:bg-gray-900 h-32"
                        value={jobDescription}
                        onChangeText={setJobDescription}
                    />
                    <Text className="text-gray-400 text-xs mb-6">Provide all necessary information for applicants.</Text>

                    <Text className="text-base font-bold text-black dark:text-white mb-2">Images (Optional)</Text>
                    <TouchableOpacity className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-3xl mb-6 items-center justify-center border border-dashed border-gray-300 dark:border-gray-700">
                        <Text className="text-black dark:text-white font-bold text-lg">Upload photos</Text>
                    </TouchableOpacity>
                </View>
            )}

        </ScrollView>

        {/* Footer Actions */}
        <View className="px-6 py-4 flex-row gap-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-black">
            <TouchableOpacity 
                className="flex-1 py-4 rounded-xl border border-blue-600 justify-center items-center"
                onPress={() => router.back()}
            >
                <Text className="text-blue-600 font-bold text-lg">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                className={`flex-1 py-4 rounded-xl bg-blue-600 justify-center items-center shadow-lg shadow-blue-200 dark:shadow-none ${isPending || isUploading ? "opacity-70" : ""}`}
                onPress={handlePost}
                disabled={isPending || isUploading}
            >
                {isPending || isUploading ? (
                    <View className="flex-row items-center">
                        <ActivityIndicator color="white" className="mr-2" />
                        <Text className="text-white font-bold">{isUploading ? "Uploading..." : "Posting..."}</Text>
                    </View>
                ) : (
                    <Text className="text-white font-bold text-lg">Post</Text>
                )}
            </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}
