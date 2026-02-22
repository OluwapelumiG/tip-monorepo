import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Modal, FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { orpc, queryClient } from "@/utils/orpc";
import { env } from "@illtip/env/native";
import { authClient } from "@/lib/auth-client";
import type { User } from "@illtip/api";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

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
  const { data: session } = authClient.useSession();
  const user = session?.user as User | undefined;
  const isEmployer = user?.role === "employer" || user?.role === "customer" || user?.role === "admin";

  const { width } = Dimensions.get("window");
  const scrollViewRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState<"post" | "job">(isEmployer ? "job" : "post");

  useEffect(() => {
    if (user && !isEmployer && activeTab === "job") {
      setActiveTab("post");
    }
  }, [user, isEmployer]);
  
  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationText, setLocationText] = useState("");
  const [isRemote, setIsRemote] = useState(false);
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
    setIsRemote(false);
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
    let finalUri = mediaItem.url;
    
    // Convert all images to JPEG to ensure compatibility and consistency
    if (mediaItem.type === "image") {
      try {
        const manipResult = await ImageManipulator.manipulateAsync(
          mediaItem.url,
          [],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        finalUri = manipResult.uri;
      } catch (e) {
        console.warn("Failed to manipulate image, using original", e);
      }
    }

    const formData = new FormData();
    const type = mediaItem.type === "image" ? "image/jpeg" : "video/mp4";
    
    const fileName = mediaItem.fileName || "upload.jpg";
    
    formData.append("file", {
      uri: finalUri,
      name: mediaItem.type === "image" && !fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg') ? `${fileName}.jpg` : fileName,
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

      const finalLocation = isRemote ? "Remote" : (locationText || undefined);

      if (activeTab === "post") {
        createPost({
          title,
          description,
          location: finalLocation,
          media: uploadedMedia,
        });
      } else {
        createJob({
          title,
          description,
          company: "My Company",
          location: finalLocation,
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

  const indicatorStyle = useAnimatedStyle(() => {
    const offset = (width - 56) / 2;
    return {
      transform: [
        { translateX: withTiming(activeTab === "job" ? 0 : offset, { duration: 250 }) }
      ]
    };
  });

  const renderFormContent = (type: "job" | "post") => (
    <View className="pb-10 pt-2">
      <Text className="text-base font-bold text-black dark:text-white mb-2">{type === "post" ? "Post Title" : "Job Title"}</Text>
      <TextInput 
          placeholder={type === "post" ? "Enter post title" : "e.g. Car Repair Needed"} 
          placeholderTextColor="#9CA3AF"
          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 mb-1 text-base text-black dark:text-white bg-white dark:bg-gray-900"
          value={title}
          onChangeText={setTitle}
      />
      <Text className="text-gray-400 text-xs mb-6">Keep it concise and descriptive.</Text>

      {type === "job" && (
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
          placeholder={type === "post" ? "Describe your post" : "Detailed description of the job..."} 
          placeholderTextColor="#9CA3AF"
          multiline
          textAlignVertical="top"
          className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 mb-1 text-base text-black dark:text-white bg-white dark:bg-gray-900 h-32"
          value={description}
          onChangeText={setDescription}
      />
      <Text className="text-gray-400 text-xs mb-6">Provide all necessary information.</Text>

      <Text className="text-base font-bold text-black dark:text-white mb-2">Images & Videos</Text>
      <View
          className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-3xl items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 overflow-hidden mb-6 relative"
      >
          {media.length > 0 ? (
              <View className="flex-row flex-wrap justify-center gap-2 p-4 w-full h-full">
                  {media.map((m, i) => (
                      <View key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 relative">
                          <Image source={{ uri: m.url }} className="w-full h-full" />
                          <TouchableOpacity 
                              onPress={() => setMedia(media.filter((_, index) => index !== i))}
                              className="absolute top-1 right-1 bg-black/50 w-6 h-6 rounded-full items-center justify-center"
                          >
                              <Ionicons name="close" size={14} color="white" />
                          </TouchableOpacity>
                      </View>
                  ))}
                  <TouchableOpacity onPress={pickImage} className="w-20 h-20 rounded-lg bg-blue-100 items-center justify-center">
                      <Ionicons name="add" size={32} color="#2563eb" />
                  </TouchableOpacity>
              </View>
          ) : (
              <TouchableOpacity onPress={pickImage} className="w-full h-full items-center justify-center">
                  <Ionicons name="images-outline" size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 font-bold text-lg mt-2">Upload photos</Text>
              </TouchableOpacity>
          )}
      </View>

      <Text className="text-base font-bold text-black dark:text-white mb-2">Location</Text>
      <TouchableOpacity 
          className="flex-row items-center mb-4"
          onPress={() => setIsRemote(!isRemote)}
          activeOpacity={0.7}
      >
          <View className={`w-6 h-6 rounded-md border items-center justify-center mr-3 ${isRemote ? "bg-blue-600 border-blue-600" : "border-gray-300 dark:border-gray-600"}`}>
              {isRemote && <Ionicons name="checkmark" size={16} color="white" />}
          </View>
          <Text className="text-base text-black dark:text-white">This role is completely remote</Text>
      </TouchableOpacity>

      {!isRemote && (
          <TextInput 
              placeholder="Enter location (e.g. Ikeja, Lagos)" 
              placeholderTextColor="#9CA3AF"
              className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 mb-10 text-base text-black dark:text-white bg-white dark:bg-gray-900"
              value={locationText}
              onChangeText={setLocationText}
          />
      )}
      {isRemote && <View className="mb-10" />}
    </View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-black" style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" edges={["top"]} style={{ flex: 1 }}>
        <View className="px-6 py-4">
            <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1 relative">
                {isEmployer && (
                    <Animated.View 
                        className="absolute top-1 bottom-1 left-1 w-1/2 bg-blue-600 rounded-lg shadow-sm"
                        style={indicatorStyle}
                    />
                )}
                {isEmployer && (
                    <TouchableOpacity 
                        className="flex-1 py-2 rounded-lg items-center z-10"
                        onPress={() => {
                            setActiveTab("job");
                            scrollViewRef.current?.scrollTo({ x: 0, animated: true });
                        }}
                    >
                        <Text className={`font-bold ${activeTab === "job" ? "text-white" : "text-gray-500"}`}>Create Job</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity 
                    className={`flex-1 py-2 rounded-lg items-center z-10 ${!isEmployer && activeTab === "post" ? "bg-blue-600 shadow-sm" : ""}`}
                    onPress={() => {
                        setActiveTab("post");
                        if (isEmployer) {
                            scrollViewRef.current?.scrollTo({ x: width, animated: true });
                        }
                    }}
                >
                    <Text className={`font-bold ${activeTab === "post" ? "text-white" : "text-gray-500"}`}>Create Post</Text>
                </TouchableOpacity>
            </View>
        </View>

        <ScrollView 
            ref={scrollViewRef}
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            scrollEnabled={isEmployer}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => {
                if (!isEmployer) return;
                const page = Math.round(e.nativeEvent.contentOffset.x / width);
                setActiveTab(page === 0 ? "job" : "post");
            }}
            className="flex-1"
        >
            {isEmployer && (
                <View style={{ width }} className="px-6 h-full">
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {renderFormContent("job")}
                    </ScrollView>
                </View>
            )}
            <View style={{ width }} className="px-6 h-full">
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderFormContent("post")}
                </ScrollView>
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
