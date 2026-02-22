import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Modal, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQuery } from "@tanstack/react-query";
import { orpc, queryClient } from "@/utils/orpc";
import { env } from "@illtip/env/native";

// Category Icons Mapping (based on user image)
const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Health & Wellness": "heart-outline",
  "Financial Services": "wallet-outline",
  "Moving Services": "bus-outline",
  "Tech & Digital Services": "hardware-chip-outline",
  "Vehicle Services": "car-outline",
  "Beauty & Personal Care": "color-palette-outline",
  "Leadership & Academic Coaching": "school-outline",
  "Recruitment": "people-outline",
  "Digital Marketing & Media": "megaphone-outline",
  "Professional Services": "briefcase-outline",
  "Event Planning & Entertainment": "calendar-outline",
  "Home Services & Repairs": "home-outline",
};

const FALLBACK_CATEGORIES = [
  "Health & Wellness",
  "Financial Services",
  "Moving Services",
  "Tech & Digital Services",
  "Vehicle Services",
  "Beauty & Personal Care",
  "Leadership & Academic Coaching",
  "Recruitment",
  "Digital Marketing & Media",
  "Professional Services",
  "Event Planning & Entertainment",
  "Home Services & Repairs",
];

export default function CreateScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"post" | "job">("post");
  
  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationText, setLocationText] = useState("");
  const [media, setMedia] = useState<{ url: string; type: "image" | "video"; fileName?: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Job specific states
  const [jobPrice, setJobPrice] = useState("");
  const [jobDuration, setJobDuration] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

  // Get Categories from API
  const { data: categories = [], isLoading: isLoadingCategories, error: categoriesError } = useQuery(orpc.job.getCategories.queryOptions());

  const displayCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  // Mutations
  const { mutate: createPost, isPending: isPostingPost } = useMutation(
    orpc.post.createPost.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(orpc.post.getPosts.queryOptions());
        Alert.alert("Success", "Post created successfully!");
        resetForm();
        router.replace("/(tabs)");
      },
      onError: (error: any) => {
        Alert.alert("Error", error.message);
      },
    })
  );

  const { mutate: createJob, isPending: isPostingJob } = useMutation(
    orpc.job.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(orpc.job.list.queryOptions({ input: {} }));
        Alert.alert("Success", "Job posted successfully!");
        resetForm();
        router.replace("/(tabs)/jobs");
      },
      onError: (error: any) => {
        Alert.alert("Error", error.message);
      },
    })
  );

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setJobPrice("");
    setJobDuration("");
    setMedia([]);
    setLocationText("");
    setSelectedCategory("");
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
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
    formData.append("folder", activeTab === "post" ? "posts" : "jobs");

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
    // Validation
    if (activeTab === "post") {
      if (!title || !description) {
        Alert.alert("Error", "Please fill in all required fields (Title and Description).");
        return;
      }
    } else {
      if (!title || !description || !jobPrice || !jobDuration || !selectedCategory) {
        Alert.alert("Error", "Please fill in all required fields (Title, Description, Price, Duration, and Category).");
        return;
      }
    }

    try {
      setIsUploading(true);
      
      const uploadedMedia = [];
      for (const item of media) {
        if (item.url.startsWith("file://") || item.url.startsWith("content://")) {
            const remoteUrl = await uploadMedia(item);
            uploadedMedia.push({
              url: remoteUrl,
              type: item.type,
            });
        } else {
            uploadedMedia.push({ url: item.url, type: item.type });
        }
      }

      if (activeTab === "post") {
        createPost({
          title,
          description,
          location: locationText || undefined,
          media: uploadedMedia,
        });
      } else {
        createJob({
          title,
          description,
          company: "My Company",
          location: locationText || undefined,
          category: selectedCategory,
          salaryRange: jobPrice,
          media: uploadedMedia,
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload media. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = isPostingPost || isPostingJob;

  return (
    <View className="flex-1 bg-white dark:bg-black" style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" edges={["top"]} style={{ flex: 1 }}>
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
            <View className="pb-10">
                <Text className="text-base font-bold text-black dark:text-white mb-2">{activeTab === "post" ? "Post Title" : "Job Title"}</Text>
                <TextInput 
                    placeholder={activeTab === "post" ? "Enter post title" : "e.g. Car Repair Needed"} 
                    placeholderTextColor="#9CA3AF"
                    className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 mb-1 text-base text-black dark:text-white bg-white dark:bg-gray-900"
                    value={title}
                    onChangeText={setTitle}
                />
                <Text className="text-gray-400 text-xs mb-6">Keep it concise and descriptive.</Text>

                {activeTab === "job" && (
                    <>
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
                        <TouchableOpacity 
                            onPress={() => setIsCategoryModalVisible(true)}
                            className="bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-4 flex-row justify-between items-center mb-6"
                        >
                            <View className="flex-row items-center gap-3">
                                <Ionicons name={CATEGORY_ICONS[selectedCategory] || "list-outline"} size={20} color="#2563eb" />
                                <Text className="text-base text-black dark:text-white font-medium">{selectedCategory || "Select Category"}</Text>
                            </View>
                            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </>
                )}

                <Text className="text-base font-bold text-black dark:text-white mb-2">Description</Text>
                <TextInput 
                    placeholder={activeTab === "post" ? "Describe your post" : "Detailed description of the job..."} 
                    placeholderTextColor="#9CA3AF"
                    multiline
                    textAlignVertical="top"
                    className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 mb-1 text-base text-black dark:text-white bg-white dark:bg-gray-900 h-32"
                    value={description}
                    onChangeText={setDescription}
                />
                <Text className="text-gray-400 text-xs mb-6">Provide all necessary information.</Text>

                <Text className="text-base font-bold text-black dark:text-white mb-2">Images & Videos</Text>
                <TouchableOpacity 
                    onPress={pickImage}
                    className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-3xl items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 overflow-hidden mb-6"
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

                <Text className="text-base font-bold text-black dark:text-white mb-2">Location</Text>
                <TextInput 
                    placeholder="Enter location (e.g. Ikeja, Lagos)" 
                    placeholderTextColor="#9CA3AF"
                    className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 mb-10 text-base text-black dark:text-white bg-white dark:bg-gray-900"
                    value={locationText}
                    onChangeText={setLocationText}
                />
            </View>
        </ScrollView>

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

        {/* Category Modal */}
        <Modal
            visible={isCategoryModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsCategoryModalVisible(false)}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white dark:bg-gray-900 rounded-t-[40px] p-6 h-[70%]">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-2xl font-bold text-black dark:text-white">Select Category</Text>
                        <TouchableOpacity onPress={() => setIsCategoryModalVisible(false)}>
                            <Ionicons name="close" size={28} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={displayCategories}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                onPress={() => {
                                    setSelectedCategory(item);
                                    setIsCategoryModalVisible(false);
                                }}
                                className={`flex-row items-center p-4 rounded-2xl mb-2 ${selectedCategory === item ? "bg-blue-600" : "bg-gray-50 dark:bg-gray-800"}`}
                            >
                                <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${selectedCategory === item ? "bg-white/20" : "bg-blue-100 dark:bg-blue-900"}`}>
                                    <Ionicons 
                                        name={CATEGORY_ICONS[item] || "list-outline"} 
                                        size={20} 
                                        color={selectedCategory === item ? "white" : "#2563eb"} 
                                    />
                                </View>
                                <Text className={`text-lg font-medium ${selectedCategory === item ? "text-white" : "text-black dark:text-white"}`}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}
