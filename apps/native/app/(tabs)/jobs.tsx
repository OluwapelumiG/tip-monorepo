import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator, RefreshControl, Modal, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { JobSkeleton } from "@/components/job-skeleton";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";

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

  // Filter Modal State
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterLocationText, setFilterLocationText] = useState("");
  const [filterSelectedLocation, setFilterSelectedLocation] = useState<string | null>(null);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [filterMinPay, setFilterMinPay] = useState("");
  const [filterMaxPay, setFilterMaxPay] = useState("");
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  // Date Range state for the picker
  const [dateRange, setDateRange] = useState<{ startDate: any, endDate: any }>({ startDate: null, endDate: null });

  // Applied Filters State (sent to API)
  const [appliedFilters, setAppliedFilters] = useState<{
      location?: string;
      minPay?: number;
      maxPay?: number;
      categories?: string[];
      startDate?: string;
      endDate?: string;
  }>({});

  // Get Categories from API
  const { data: categories = [] } = useQuery(orpc.job.getCategories.queryOptions());
  const displayCategories = categories.length > 0 ? categories : FALLBACK_CATEGORIES;
  const allCategories = ["All", ...displayCategories];

  // Get Locations from API
  const { data: locations = [] } = useQuery(orpc.job.getLocations.queryOptions());

  // Fetch Jobs with Infinite Query
  const { 
    data, 
    isLoading, 
    isRefetching, 
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    ...orpc.job.list.infiniteOptions({
        input: (pageParam) => ({ 
            status: "open", 
            limit: 10, 
            cursor: pageParam,
            ...appliedFilters 
        }),
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: undefined as string | undefined,
    }),
  });

  const allJobs = data?.pages.flatMap((page: any) => page.items) ?? [];

  // Filter Jobs (Client side quick filters, API handles the rest)
  const filteredJobs = allJobs.filter(job => {
    // Quick categories are just UI client-side filter if no deep categories checked in modal
    const matchesCategory = (activeCategory === "All" && appliedFilters.categories === undefined) 
                            || job.category === activeCategory 
                            || (appliedFilters.categories && appliedFilters.categories.includes(job.category!));
                            
    const matchesSearch = !searchQuery || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
        
    return matchesCategory && matchesSearch;
  });

  const handleApplyFilters = () => {
      const filters: any = {};
      if (filterSelectedLocation) filters.location = filterSelectedLocation;
      if (filterMinPay) filters.minPay = parseFloat(filterMinPay);
      if (filterMaxPay) filters.maxPay = parseFloat(filterMaxPay);
      if (filterCategories.length > 0) filters.categories = filterCategories;
      
      if (dateRange.startDate) filters.startDate = dayjs(dateRange.startDate).toISOString();
      if (dateRange.endDate) filters.endDate = dayjs(dateRange.endDate).toISOString();

      setAppliedFilters(filters);
      // Reset the quick category pill if we have modal categories
      if (filterCategories.length > 0) {
          setActiveCategory("All");
      }
      setIsFilterVisible(false);
  };

  const handleResetFilters = () => {
      setFilterSelectedLocation(null);
      setFilterLocationText("");
      setFilterMinPay("");
      setFilterMaxPay("");
      setFilterCategories([]);
      setDateRange({ startDate: null, endDate: null });
      setAppliedFilters({});
      setIsFilterVisible(false);
  };

  const activeFiltersCount = Object.keys(appliedFilters).length;

  const renderJobItem = ({ item: job }: { item: any }) => (
    <TouchableOpacity 
      className="bg-transparent mb-6 px-6"
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
  );

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
            <TouchableOpacity 
                onPress={() => setIsFilterVisible(true)}
                className={`w-14 h-14 border rounded-2xl items-center justify-center relative ${activeFiltersCount > 0 ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-800"}`}
            >
                    <Ionicons name="options-outline" size={24} color={activeFiltersCount > 0 ? "#2563eb" : "black"} className={activeFiltersCount > 0 ? "" : "dark:text-white"} />
                    {activeFiltersCount > 0 && (
                        <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full" />
                    )}
            </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="mb-2">
            <FlatList 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 10, gap: 12 }}
                data={allCategories}
                keyExtractor={(item) => item}
                renderItem={({ item: cat }) => (
                    <TouchableOpacity 
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
                )}
            />
        </View>

        {/* Most Urgent Section */}
        <View className="px-6 mb-4 flex-row justify-between items-center">
            <Text className="text-xl font-bold text-black dark:text-white">Recent Postings</Text>
            <TouchableOpacity onPress={() => refetch()}>
                <Text className="text-blue-600 font-medium">Refresh</Text>
            </TouchableOpacity>
        </View>

        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          onRefresh={refetch}
          refreshing={isRefetching}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            isLoading && !isRefetching ? (
              <View className="flex-1">
                <JobSkeleton />
                <JobSkeleton />
                <JobSkeleton />
              </View>
            ) : (
              <View className="py-20 items-center">
                 <Text className="text-gray-400 text-lg">No jobs found.</Text>
              </View>
            )
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <JobSkeleton />
              </View>
            ) : null
          }
        />

        {/* Filter Modal */}
        <Modal
            visible={isFilterVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setIsFilterVisible(false)}
        >
            <View className="flex-1 bg-white dark:bg-gray-900 pt-4">
                <View className="px-6 pb-4 flex-row justify-between items-center border-b border-gray-100 dark:border-gray-800">
                    <Text className="text-2xl font-bold text-black dark:text-white">Filters</Text>
                    <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
                        <Ionicons name="close" size={28} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                    
                    {/* Location */}
                    <View className="mb-8 z-50">
                        <Text className="text-base font-bold text-black dark:text-white mb-3">Location</Text>
                        <View className="relative z-50">
                            <TextInput
                                placeholder="Search location..."
                                placeholderTextColor="#9CA3AF"
                                className="border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-base text-black dark:text-white bg-gray-50 dark:bg-gray-800"
                                value={filterLocationText}
                                onChangeText={(text) => {
                                    setFilterLocationText(text);
                                    if (!isLocationDropdownOpen) setIsLocationDropdownOpen(true);
                                    if (text === "") setFilterSelectedLocation(null);
                                }}
                                onFocus={() => setIsLocationDropdownOpen(true)}
                            />
                            {isLocationDropdownOpen && locations.length > 0 && (
                                <View className="absolute top-14 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-48 overflow-hidden z-[100]">
                                    <ScrollView nestedScrollEnabled className="w-full">
                                        {locations
                                            .filter(l => l.toLowerCase().includes(filterLocationText.toLowerCase()))
                                            .map((loc, i) => (
                                            <TouchableOpacity
                                                key={i}
                                                className="px-4 py-3 border-b border-gray-100 dark:border-gray-700"
                                                onPress={() => {
                                                    setFilterSelectedLocation(loc);
                                                    setFilterLocationText(loc);
                                                    setIsLocationDropdownOpen(false);
                                                }}
                                            >
                                                <Text className="text-black dark:text-white text-base">{loc}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Pay Range */}
                    <View className="mb-8 -z-10">
                        <Text className="text-base font-bold text-black dark:text-white mb-3">Pay Range ($)</Text>
                        <View className="flex-row items-center gap-4">
                            <TextInput
                                placeholder="Min"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                                className="flex-1 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-base text-black dark:text-white bg-gray-50 dark:bg-gray-800 text-center"
                                value={filterMinPay}
                                onChangeText={setFilterMinPay}
                            />
                            <Text className="text-gray-400 font-bold">-</Text>
                            <TextInput
                                placeholder="Max"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                                className="flex-1 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-base text-black dark:text-white bg-gray-50 dark:bg-gray-800 text-center"
                                value={filterMaxPay}
                                onChangeText={setFilterMaxPay}
                            />
                        </View>
                    </View>

                    {/* Categories Multi-select */}
                    <View className="mb-8 -z-10">
                        <Text className="text-base font-bold text-black dark:text-white mb-3">Categories</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {displayCategories.map(cat => {
                                const isSelected = filterCategories.includes(cat);
                                return (
                                    <TouchableOpacity
                                        key={cat}
                                        onPress={() => {
                                            if (isSelected) {
                                                setFilterCategories(prev => prev.filter(c => c !== cat));
                                            } else {
                                                setFilterCategories(prev => [...prev, cat]);
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-full border ${
                                            isSelected 
                                            ? "bg-blue-100 border-blue-600 dark:bg-blue-900 dark:border-blue-400" 
                                            : "bg-transparent border-gray-200 dark:border-gray-700"
                                        }`}
                                    >
                                        <Text className={`${isSelected ? "text-blue-700 dark:text-blue-300 font-bold" : "text-gray-600 dark:text-gray-400"}`}>
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Date Range Picker */}
                    <View className="mb-12 -z-10">
                        <Text className="text-base font-bold text-black dark:text-white mb-3">Date Posted</Text>
                        <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
                            <DateTimePicker
                                mode="range"
                                startDate={dateRange.startDate}
                                endDate={dateRange.endDate}
                                onChange={(params: any) => setDateRange(params)}
                                selectedItemColor="#2563eb"
                                headerTextStyle={{ color: "#2563eb", fontWeight: "bold" }}
                                calendarTextStyle={{ color: "#4b5563" }}
                                selectedTextStyle={{ color: "white", fontWeight: "bold" }}
                            />
                        </View>
                    </View>

                </ScrollView>

                {/* Filter Footer */}
                <View className="px-6 py-4 flex-row items-center justify-between border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 pb-8">
                    <TouchableOpacity 
                        onPress={handleResetFilters}
                        className="py-4 px-8"
                    >
                        <Text className="text-gray-500 font-bold text-lg">Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        className="flex-1 ml-4 bg-blue-600 rounded-xl py-4 items-center justify-center shadow-md shadow-blue-200"
                        onPress={handleApplyFilters}
                    >
                        <Text className="text-white font-bold text-lg">Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
}
