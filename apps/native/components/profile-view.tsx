import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, FlatList, useWindowDimensions, useColorScheme } from "react-native";
import { Image } from "expo-image";
import { orpc } from "@/utils/orpc";
import { useRouter, Link } from "expo-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

interface ProfileViewProps {
  userId: string;
  isOwnProfile?: boolean;
  onOpenSettings?: () => void;
}

export function ProfileView({ userId, isOwnProfile = false, onOpenSettings }: ProfileViewProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const ITEM_WIDTH = (width - 48) / 3; // 3 items per row with gaps
  const [activeTab, setActiveTab] = useState<"All Media" | "Photos" | "Videos">("All Media");

  const { data: user, isLoading: isUserLoading } = useQuery(
    orpc.user.getUserProfile.queryOptions({ 
      input: { userId } 
    })
  );

  const {
    data: postData,
    isLoading: isPostsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...orpc.post.getUserPosts.infiniteOptions({
      input: (pageParam) => ({
        userId,
        limit: 12,
        type: activeTab === "Photos" ? "image" : activeTab === "Videos" ? "video" : "all",
        cursor: pageParam,
      }),
      getNextPageParam: (lastPage: any) => lastPage.nextCursor,
      initialPageParam: undefined as string | undefined,
    }),
  });

  const posts = postData?.pages.flatMap((page: any) => page.items) ?? [];

  // Flatten posts into a list of media items with parent post info
  const flattenedMedia = posts.flatMap((post: any) => 
    (post.media || []).map((media: any) => ({
      ...media,
      postId: post.id
    }))
  );

  if (isUserLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
        <Text className="text-xl font-bold text-gray-900 dark:text-gray-300 mt-4 text-center">User not found</Text>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-6 bg-blue-600 px-8 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHeader = () => (
    <View>
      {/* User Info */}
      <View className="items-center mt-8">
        <View className="h-28 w-28 rounded-full bg-gray-200 dark:bg-gray-800 mb-4 overflow-hidden items-center justify-center border-4 border-white dark:border-gray-900 shadow-sm">
          {user.image ? (
            <Image 
              source={{ uri: user.image }} 
              className="h-full w-full"
              contentFit="cover"
              style={{ width: 112, height: 112 }}
            />
          ) : (
            <View className="h-full w-full bg-gray-100 dark:bg-gray-800 items-center justify-center">
                <Ionicons name="person" size={48} className="text-gray-300 dark:text-gray-600" />
            </View>
          )}
        </View>
        <View className="flex-row items-center mb-1">
          <Text className="text-xl font-bold text-gray-900 dark:text-gray-300 mr-1">
            {user.name}
          </Text>
          <Ionicons name="checkmark-circle" size={18} color="#2563EB" />
        </View>
        <Text className="text-gray-400 text-sm">
          {user.email}
        </Text>
      </View>

      {/* Stats Buttons */}
      <View className="flex-row px-6 mt-6 space-x-4 justify-between">
        <TouchableOpacity className="flex-1 border border-blue-600 rounded-xl py-3 mx-2 items-center">
          <Text className="text-gray-900 dark:text-gray-300 font-bold text-base">{user.stats.posts} Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 border border-blue-600 rounded-xl py-3 mx-2 items-center flex-row justify-center">
          <Ionicons name="star" size={18} color="#FBBF24" style={{ marginRight: 6 }} />
          <Text className="text-gray-900 dark:text-gray-300 font-bold text-base">{user.stats.reviews} Reviews</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Tabs */}
      <View className="flex-row px-6 mt-8 mb-4 space-x-6">
        {(["All Media", "Photos", "Videos"] as const).map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            className={`pb-2 px-4 ${activeTab === tab ? "border-b-2 border-blue-600" : ""}`}
          >
            <Text className={`font-bold text-base ${activeTab === tab ? "text-blue-600" : "text-gray-400"}`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      {/* Floating Back Button for other users */}
      {!isOwnProfile && (
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-8 left-4 z-10 w-10 h-10 rounded-full bg-black/30 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
      )}

      {/* Floating Action Buttons for own profile */}
      {isOwnProfile && (
        <View 
          className="flex-row absolute top-12 right-6 space-x-3"
          style={{ zIndex: 100 }}
        >
          <Link href="/search" asChild>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/20 items-center justify-center">
              <Ionicons name="search-outline" size={22} color={isDark ? "#FFFFFF" : "#1F2937"} />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity 
            onPress={() => {
                console.log("[ProfileView] Settings button pressed");
                onOpenSettings?.();
            }}
            className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/20 items-center justify-center"
          >
            <Ionicons name="options-outline" size={22} color={isDark ? "#FFFFFF" : "#1F2937"} />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={flattenedMedia}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ gap: 8, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => router.push(`/post/${item.postId}`)}
            style={{ width: ITEM_WIDTH, height: ITEM_WIDTH }} 
            className="bg-gray-200 dark:bg-gray-800 rounded-xl mb-2 overflow-hidden"
          >
            <Image 
              source={{ uri: item.url }} 
              className="h-full w-full"
              contentFit="cover"
              style={{ width: ITEM_WIDTH, height: ITEM_WIDTH }}
            />
            {item.type === 'video' && (
              <View className="absolute top-1 right-1">
                <Ionicons name="play" size={12} color="white" />
              </View>
            )}
          </TouchableOpacity>
        )}
      ListEmptyComponent={() => (
        !isPostsLoading ? (
            <View className="py-20 items-center">
                <Text className="text-gray-500 dark:text-gray-400">No posts found</Text>
            </View>
        ) : (
            <View className="py-20 items-center">
                <ActivityIndicator size="small" color="#2563EB" />
            </View>
        )
      )}
      ListFooterComponent={() => (
        isFetchingNextPage ? (
          <View className="py-6 items-center">
            <ActivityIndicator size="small" color="#2563EB" />
          </View>
        ) : null
      )}
      />
    </View>
  );
}
