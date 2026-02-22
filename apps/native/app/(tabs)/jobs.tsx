import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

// Category Icons Mapping
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
  "All": "grid-outline"
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

export default function JobsScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Get Categories from API
  const { data: categories = [] } = useQuery(orpc.job.getCategories.queryOptions());
  const displayCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;
  const allCategories = ["All", ...displayCategories];

  // Fetch Jobs
  const { 
    data: jobs = [], 
    isLoading, 
    isRefetching, 
    refetch 
  } = useQuery(orpc.job.list.queryOptions({ input: { status: "open" } }));

  // Filter Jobs
  const filteredJobs = jobs.filter(job => {
    const matchesCategory = activeCategory === "All" || job.category === activeCategory;
    const matchesSearch = !searchQuery || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View className="flex-1 bg-white dark:bg-black" style={{ flex: 1 }}>
      <SafeAreaView className="flex-1" edges={["top"]} style={{ flex: 1 }}>
        
        {/* Header Section */}
        <View className="px-6 pt-2 pb-4">
            <Text className="text-4xl font-bold text-black dark:text-white leading-tight">
                Search for an{'\n'}open job offering!
            </Text>
        </View>

        {/* Search Bar */}
        <View className="px-6 mb-2 flex-row items-center space-x-3 gap-3">
            <View className="flex-1 flex-row items-center bg-transparent border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3.5">
                <Ionicons name="search-outline" size={24} color="#9ca3af" />
                <TextInput 
                  placeholder="Search for Sector or Area..." 
                  placeholderTextColor="#9ca3af"
                  className="flex-1 ml-3 text-base text-black dark:text-white"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
            </View>
            <TouchableOpacity className="w-14 h-14 border border-gray-200 dark:border-gray-800 rounded-2xl items-center justify-center">
                    <Ionicons name="options-outline" size={24} color="black" className="dark:text-white" />
            </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="mb-2">
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 10, gap: 12 }}
            >
                {allCategories.map((cat) => (
                    <TouchableOpacity 
                        key={cat}
                        onPress={() => setActiveCategory(cat)}
                        className={`px-5 py-2.5 rounded-full border flex-row items-center gap-2 ${
                            activeCategory === cat 
                                ? "bg-blue-600 border-blue-600 shadow-md shadow-blue-200" 
                                : "bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                        }`}
                    >
                        <Ionicons 
                            name={CATEGORY_ICONS[cat] || "list-outline"} 
                            size={18} 
                            color={activeCategory === cat ? "white" : "#2563eb"} 
                        />
                        <Text className={`font-semibold ${
                            activeCategory === cat 
                                ? "text-white" 
                                : "text-gray-600 dark:text-gray-400"
                        }`}>
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>

        {/* Most Urgent Section */}
        <View className="px-6 mb-4 flex-row justify-between items-center">
            <Text className="text-xl font-bold text-black dark:text-white">Recent Postings</Text>
            <TouchableOpacity onPress={() => refetch()}>
                <Text className="text-blue-600 font-medium">Refresh</Text>
            </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : (
          <ScrollView 
            className="flex-1" 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
          >
            {/* Job Cards */}
            <View className="px-6 pb-20 gap-6">
              {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                  <TouchableOpacity 
                    key={job.id} 
                    className="bg-transparent mb-2"
                    onPress={() => router.push(`/job/${job.id}`)}
                  >
                      {/* Card Image */}
                      <View className="w-full h-44 bg-gray-100 dark:bg-gray-800 rounded-3xl mb-4 overflow-hidden relative">
                          {job.media?.[0] ? (
                              <Image source={{ uri: job.media[0].url }} className="flex-1" resizeMode="cover" />
                          ) : (
                              <View className="flex-1 bg-gray-200 dark:bg-gray-800 items-center justify-center">
                                  <Ionicons name="image-outline" size={48} color="#9CA3AF" />
                              </View>
                          )}
                          <View className="absolute top-4 right-4 bg-white/80 dark:bg-black/80 px-3 py-1 rounded-full">
                            <Text className="text-xs font-bold text-blue-600">{job.category}</Text>
                          </View>
                      </View>

                      {/* Card Details */}
                      <Text className="text-lg font-bold text-black dark:text-white mb-2">{job.title}</Text>
                      <View className="flex-row items-center gap-4">
                          <Text className="text-blue-600 font-bold text-base">{job.salaryRange || "Negotiable"}</Text>
                          <View className="flex-row items-center">
                              <Ionicons name="person-outline" size={16} color="#4b5563" />
                              <Text className="text-gray-600 dark:text-gray-400 ml-1.5 font-medium">{job.employer.name}</Text>
                          </View>
                      </View>
                  </TouchableOpacity>
              )) : (
                <View className="py-20 items-center">
                   <Text className="text-gray-400 text-lg">No jobs found in this category.</Text>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
