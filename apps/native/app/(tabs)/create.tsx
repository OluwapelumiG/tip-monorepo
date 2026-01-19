import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

                    {/* Media Upload Placeholder */}
                    <TouchableOpacity className="w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-3xl mb-6 items-center justify-center border border-dashed border-gray-300 dark:border-gray-700">
                        <Text className="text-black dark:text-white font-bold text-lg">Upload photos and videos here</Text>
                    </TouchableOpacity>

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
            <TouchableOpacity className="flex-1 py-4 rounded-xl bg-blue-600 justify-center items-center shadow-lg shadow-blue-200 dark:shadow-none">
                <Text className="text-white font-bold text-lg">Post</Text>
            </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}
