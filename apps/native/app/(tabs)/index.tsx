import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Text, 
  ActivityIndicator, 
  Share, 
  ScrollView, 
  useWindowDimensions 
} from "react-native";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import { SafeAreaView } from "react-native-safe-area-context";
import { logo } from "@illtip/assets";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { orpc, queryClient } from "@/utils/orpc";
import { MediaCarousel } from "@/components/media-carousel";
import { PostSkeleton } from "@/components/post-skeleton";
import { authClient } from "@/lib/auth-client";




const FEED_DATA = [
  {
    id: "1",
    user: {
      name: "Username",
      rating: 4.7,
      time: "21 mins ago",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    tag: "Web Design",
    content: {
      views: "124M",
      likes: "983K",
      comments: "232K",
      shares: "574",
      title: "I will design a modern website UI/UX",
      description: "Professional web design with responsive layouts and modern aesthetics ... more",
    },
  },
  {
    id: "2",
    user: {
      name: "Username 2",
      rating: 3.2,
      time: "2h ago",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    tag: "Tech & Digital Services",
    content: {
        views: "12M",
        likes: "83K",
        comments: "32K",
        shares: "74",
        title: "Cross-platform mobile app development",
        description: "High performance apps built with React Native ... more",
      },
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const { width: windowWidth } = useWindowDimensions();
  const SCREEN_WIDTH = windowWidth;
  const [activeTab, setActiveTab] = useState<"Trending" | "Explore">("Trending");
  const { data: session } = authClient.useSession();

  const handleUserPress = (userId: string) => {
    if (userId === session?.user?.id) {
      router.push("/profile");
    } else {
      router.push(`/user/${userId}`);
    }
  };

  const { 
    data, 
    isLoading, 
    isRefetching,
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch 
  } = useInfiniteQuery({
    ...orpc.post.getPosts.infiniteOptions({
        input: (pageParam) => ({ sortBy: activeTab === "Trending" ? "trending" : "explore", limit: 5, cursor: pageParam }),
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: undefined as string | undefined,
    }),
  });

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [activeTab]);

  const posts = data?.pages.flatMap((page: any) => page.items) ?? [];

  const { mutate: toggleLike } = useMutation(
    orpc.post.toggleLike.mutationOptions({
      onSuccess: () => {
        refetch();
      },
    })
  );

  const { mutate: toggleBookmark } = useMutation(
    orpc.post.toggleBookmark.mutationOptions({
      onSuccess: () => {
        refetch();
      },
    })
  );

  const { mutate: incrementShare } = useMutation(
    orpc.post.incrementShare.mutationOptions({
      onSuccess: () => {
        refetch();
      },
    })
  );

  const handleLike = (postId: string) => {
    toggleLike({ postId });
  };

  const handleBookmark = (postId: string) => {
    toggleBookmark({ postId });
  };

  const handleShare = async (post: any) => {
    try {
      const url = Linking.createURL(`post/${post.id}`);
      await Share.share({
        message: `${post.title}\n\n${post.description}\n\nCheck it out on i'll Tip!\n\n${url}`,
      });
      incrementShare({ postId: post.id });
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
       {/* User Header */}
       <View className="flex-row items-center px-4 mb-3">
          <TouchableOpacity 
            onPress={() => handleUserPress(item.user.id)}
            className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 items-center justify-center border-2 border-blue-500 mr-3 overflow-hidden"
          >
               {item.user.image ? (
                   <Image 
                     source={{ uri: item.user.image }} 
                     className="h-full w-full" 
                     style={{ width: 44, height: 44, borderRadius: 22 }}
                   />
               ) : (
                   <View className="h-full w-full bg-blue-200 dark:bg-blue-800" />
               )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleUserPress(item.user.id)}>
              <Text className="font-bold text-gray-900 dark:text-white text-base">{item.user.name}</Text>
              <View className="flex-row items-center">
                  <Ionicons name="star" size={12} color="#FBBF24" />
                  <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">4.5 • {new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
          </TouchableOpacity>
       </View>
       
       {/* Tag - Use location or a placeholder */}
       <View className="px-4 mb-3">
            <View className="border border-blue-200 dark:border-blue-800 rounded-md px-3 py-1 self-start">
                 <Text className="text-blue-600 dark:text-blue-400 text-xs font-semibold">{item.location || "General"}</Text>
            </View>
       </View>

       {/* Content Media - Only show if present */}
       {item.media && item.media.length > 0 ? (
           <View className="mb-3">
               <MediaCarousel 
                   media={item.media as any} 
                   height={SCREEN_WIDTH * 0.8} 
                   width={SCREEN_WIDTH} 
                   onLike={() => handleLike(item.id)}
               />
           </View>
       ) : null}

       {/* Stats */}
       <View className="flex-row justify-between px-4 mb-3">
            <View className="flex-row items-center space-x-4">
                <View className="flex-row items-center mr-4">
                     <Ionicons name="eye-outline" size={18} className="text-gray-600 dark:text-gray-400" />
                     <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1 font-medium">{item.viewCount}</Text>
                </View>
                  <TouchableOpacity onPress={() => handleLike(item.id)} className="flex-row items-center mr-4">
                     <Ionicons 
                        name={item.isLiked ? "heart" : "heart-outline"} 
                        size={18} 
                        color={item.isLiked ? "#ef4444" : "#6b7280"} 
                     />
                     <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1 font-medium">{item._count.likes}</Text>
                </TouchableOpacity>
                 <TouchableOpacity onPress={() => router.push(`/post/${item.id}`)} className="flex-row items-center mr-4">
                     <Ionicons name="chatbubble-outline" size={18} className="text-gray-600 dark:text-gray-400" />
                     <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1 font-medium">{item._count.comments}</Text>
                </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleShare(item)} className="flex-row items-center mr-4">
                     <Ionicons name="share-social-outline" size={18} className="text-gray-600 dark:text-gray-400" />
                     <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1 font-medium">Share</Text>
                </TouchableOpacity>
                 <TouchableOpacity onPress={() => handleBookmark(item.id)} className="flex-row items-center">
                     <Ionicons 
                        name={item.isBookmarked ? "bookmark" : "bookmark-outline"} 
                        size={18} 
                        color={item.isBookmarked ? "#2563eb" : "#6b7280"} 
                     />
                     <Text className="text-gray-600 dark:text-gray-400 text-xs ml-1 font-medium">{item._count.bookmarks}</Text>
                </TouchableOpacity>
            </View>
       </View>

       {/* Title & Description */}
       <TouchableOpacity onPress={() => router.push(`/post/${item.id}`)} className="px-4">
            <Text className="text-gray-900 dark:text-white font-bold text-lg mb-1">{item.title}</Text>
            <Text 
                className={`text-gray-500 dark:text-gray-400 leading-5 ${item.media?.length === 0 ? "text-lg text-gray-800 dark:text-gray-200" : "text-xs"}`} 
                numberOfLines={item.media?.length === 0 ? 0 : 2}
            >
                {item.description}
            </Text>
       </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-black" style={{ flex: 1 }}>
     <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-white dark:bg-black" edges={['top']}>
          {/* Header */}
          <View className="flex-row justify-between items-center bg-white dark:bg-black px-4 py-3 border-b border-gray-50 dark:border-gray-800">
               {/* <View className="w-8" />  */}
               <View className="flex-row items-center">
                    <Image source={logo} style={{ width: 42, height: 42 }} contentFit="contain" className="mr-2" />
               </View>
               <Text className="text-xl font-bold text-gray-800 dark:text-white">i'll Tip</Text>
               <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={26} className="text-gray-900 dark:text-white" />
               </TouchableOpacity>
          </View>

          {/* Top Tabs */}
          <View className="flex-row px-4 mt-4 mb-2">
               <TouchableOpacity 
               onPress={() => setActiveTab("Trending")}
               className={`flex-1 items-center py-2 rounded-lg ${activeTab === "Trending" ? "bg-blue-600" : "bg-transparent"}`}
               >
                    <Text className={`font-bold ${activeTab === "Trending" ? "text-white" : "text-gray-900 dark:text-gray-400"}`}>Trending</Text>
               </TouchableOpacity>
               <TouchableOpacity 
               onPress={() => setActiveTab("Explore")}
               className={`flex-1 items-center py-2 rounded-lg ${activeTab === "Explore" ? "bg-blue-600" : "bg-transparent"}`}
               >
                    <Text className={`font-bold ${activeTab === "Explore" ? "text-white" : "text-gray-900 dark:text-gray-400"}`}>Explore</Text>
               </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="px-6 mb-2 flex-row items-center space-x-3 gap-3 mt-2">
               <Link href="/search" asChild>
                    <TouchableOpacity className="flex-1 flex-row items-center bg-transparent border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-5">
                         <Ionicons name="search-outline" size={24} color="#9ca3af" />
                         <Text className="flex-1 ml-3 text-base text-gray-400">
                              Search for users or jobs...
                         </Text>
                    </TouchableOpacity>
               </Link>
               <TouchableOpacity className="w-14 h-14 border border-gray-200 dark:border-gray-800 rounded-2xl items-center justify-center bg-transparent">
                    <Ionicons name="add" size={24} className="text-black dark:text-white" />
               </TouchableOpacity>
          </View>

          {/* Feed List */}
          <FlatList
                ref={flatListRef}
                data={posts}
                renderItem={renderItem}
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
                onEndReachedThreshold={0.8}
                ListEmptyComponent={() => (
                    isLoading && !isRefetching ? (
                        <View className="flex-1">
                             <PostSkeleton />
                             <PostSkeleton />
                             <PostSkeleton />
                        </View>
                    ) : (
                        <View className="flex-1 items-center justify-center py-20">
                            <Text className="text-gray-500 dark:text-gray-400 text-lg">
                                {isLoading ? "Loading posts..." : "No posts yet"}
                            </Text>
                        </View>
                    )
                )}
                ListFooterComponent={() => (
                    isFetchingNextPage ? (
                        <View className="py-4">
                            <PostSkeleton />
                            <PostSkeleton />
                        </View>
                    ) : (
                        !hasNextPage && posts.length > 0 ? (
                            <View className="py-2 items-center">
                                <Text className="text-gray-400 dark:text-gray-600 font-medium italic">
                                    More posts coming up shortly, stay tuned! ✨
                                </Text>
                            </View>
                        ) : <View style={{ height: 40 }} />
                    )
                )}
            />
     </SafeAreaView>
    </View>
  );
}
