import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import React, { useState } from "react";
import { 
    ActivityIndicator, 
    Alert, 
    FlatList, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View 
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { orpc, queryClient } from "@/utils/orpc";
import { MediaCarousel } from "@/components/media-carousel";
import { Dimensions } from "react-native";
import { authClient } from "@/lib/auth-client";

const { width } = Dimensions.get("window");

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [commentText, setCommentText] = useState("");
    const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
    const { data: session } = authClient.useSession();

    const handleUserPress = (userId: string) => {
        if (userId === session?.user?.id) {
            router.push("/profile");
        } else {
            router.push(`/user/${userId}`);
        }
    };

    const { data: post, isLoading, refetch, error } = useQuery(orpc.post.getPostById.queryOptions({ input: { id: id as string } }));

    React.useEffect(() => {
        console.log("PostDetailScreen:", { id, isLoading, hasPost: !!post, hasError: !!error });
        if (error) console.error("PostDetailScreen Error:", error);
    }, [id, isLoading, post, error]);

    const { mutate: addComment, isPending: isCommenting } = useMutation(
        orpc.post.addComment.mutationOptions({
            onSuccess: () => {
                setCommentText("");
                setReplyTo(null);
                refetch();
            },
            onError: (error: any) => {
                Alert.alert("Error", error.message);
            },
        })
    );

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

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black">
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black p-4">
                <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
                <Text className="text-gray-500 mt-2 text-center">{(error as any).message || "An error occurred"}</Text>
                <TouchableOpacity onPress={() => refetch()} className="mt-4 bg-blue-600 px-6 py-2 rounded-full">
                    <Text className="text-white font-bold">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!post) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black">
                <Text className="text-gray-500">Post not found</Text>
            </View>
        );
    }

    const handleSendComment = () => {
        if (!commentText.trim()) return;
        addComment({
            postId: post.id,
            content: commentText,
            parentId: replyTo?.id,
        });
    };

    const renderComment = ({ item }: { item: any }) => (
        <View className="mb-4">
            <View className="flex-row">
                <TouchableOpacity 
                    onPress={() => handleUserPress(item.user.id)}
                    className="h-8 w-8 rounded-full bg-blue-100 overflow-hidden mr-2"
                >
                    {item.user.image ? (
                        <Image source={{ uri: item.user.image }} className="h-full w-full" />
                    ) : (
                        <View className="h-full w-full bg-blue-200" />
                    )}
                </TouchableOpacity>
                <View className="flex-1">
                    <View className="bg-gray-100 dark:bg-gray-800 p-2 rounded-2xl">
                        <TouchableOpacity onPress={() => handleUserPress(item.user.id)}>
                            <Text className="font-bold text-xs dark:text-white">{item.user.name}</Text>
                        </TouchableOpacity>
                        <Text className="text-gray-800 dark:text-gray-200 text-sm">{item.content}</Text>
                    </View>
                    <View className="flex-row items-center mt-1 ml-1">
                        <Text className="text-gray-500 text-xs mr-4">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        <TouchableOpacity onPress={() => setReplyTo({ id: item.id, name: item.user.name })}>
                            <Text className="text-blue-600 font-bold text-xs">Reply</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Replies */}
                    {item.replies && item.replies.length > 0 && (
                        <View className="mt-2">
                            {item.replies.map((reply: any) => (
                                <View key={reply.id} className="flex-row mt-2">
                                    <View className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden mr-2">
                                        {reply.user.image ? (
                                            <Image source={{ uri: reply.user.image }} className="h-full w-full" />
                                        ) : (
                                            <View className="h-full w-full bg-gray-300" />
                                        )}
                                    </View>
                                    <View className="flex-1 bg-gray-50 dark:bg-gray-900 p-2 rounded-xl">
                                        <Text className="font-bold text-[10px] dark:text-white">{reply.user.name}</Text>
                                        <Text className="text-gray-700 dark:text-gray-300 text-xs">{reply.content}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1 }} className="flex-1 bg-white dark:bg-black">
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView className="flex-1" edges={["top"]} style={{ flex: 1 }}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                    style={{ flex: 1 }}
                >
                    {/* Floating Back Button */}
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/30 items-center justify-center"
                    >
                        <Ionicons name="chevron-back" size={28} color="white" />
                    </TouchableOpacity>

                    <ScrollView className="flex-1" style={{ flex: 1 }}>
                    {/* User Info */}
                    <View className="flex-row items-center px-4 py-4">
                        <TouchableOpacity 
                            onPress={() => handleUserPress(post.user.id)}
                            className="h-10 w-10 rounded-full bg-blue-100 overflow-hidden mr-3"
                        >
                            {post.user.image ? (
                                <Image source={{ uri: post.user.image }} className="h-full w-full" />
                            ) : (
                                <View className="h-full w-full bg-blue-200" />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleUserPress(post.user.id)}>
                            <Text className="font-bold dark:text-white">{post.user.name}</Text>
                            <Text className="text-gray-500 text-xs">{post.location || "General"}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Post Content */}
                    <View className="px-4 mb-4">
                        <Text className="font-bold text-xl mb-2 dark:text-white">{post.title}</Text>
                        <Text className={`text-gray-800 dark:text-gray-200 leading-6 ${post.media?.length === 0 ? "text-lg" : "text-base"}`}>
                            {post.description}
                        </Text>
                    </View>

                    {/* Media Carousel */}
                    {post.media && post.media.length > 0 && (
                        <View className="mb-4">
                            <MediaCarousel 
                                media={post.media as any} 
                                height={width} 
                                width={width}
                                onLike={() => toggleLike({ postId: post.id })}
                            />
                        </View>
                    )}

                    {/* Stats & Actions */}
                    <View className="px-4 flex-row items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                        <TouchableOpacity onPress={() => toggleLike({ postId: post.id })} className="flex-row items-center mr-6">
                            <Ionicons 
                                name={post.isLiked ? "heart" : "heart-outline"} 
                                size={22} 
                                color={post.isLiked ? "#ef4444" : "#6b7280"} 
                            />
                            <Text className="ml-1 font-medium dark:text-gray-300">{post._count.likes}</Text>
                        </TouchableOpacity>
                        <View className="flex-row items-center mr-6">
                            <Ionicons name="chatbubble-outline" size={20} className="text-gray-600 dark:text-gray-400" />
                            <Text className="ml-1 font-medium dark:text-gray-300">{post._count.comments}</Text>
                        </View>
                        <View className="flex-row items-center mr-6">
                            <Ionicons name="eye-outline" size={22} className="text-gray-600 dark:text-gray-400" />
                            <Text className="ml-1 font-medium dark:text-gray-300">{post.viewCount}</Text>
                        </View>
                        <TouchableOpacity onPress={() => toggleBookmark({ postId: post.id })} className="flex-row items-center ml-auto">
                            <Ionicons 
                                name={post.isBookmarked ? "bookmark" : "bookmark-outline"} 
                                size={22} 
                                color={post.isBookmarked ? "#2563eb" : "#6b7280"} 
                            />
                            <Text className="ml-1 font-medium dark:text-gray-300">{post._count.bookmarks}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Comments Section */}
                    <View className="px-4 py-4">
                        <Text className="font-bold text-lg mb-4 dark:text-white">Comments ({post._count.comments})</Text>
                        <FlatList
                            data={post.comments}
                            renderItem={renderComment}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            ListEmptyComponent={() => (
                                <Text className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</Text>
                            )}
                        />
                    </View>
                    <View className="h-24" /> 
                </ScrollView>

                {/* Floating Comment Input */}
                <View className="absolute bottom-6 left-4 right-4 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2">
                    {replyTo && (
                        <View className="flex-row items-center justify-between bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-t-2xl mb-1">
                            <Text className="text-blue-600 dark:text-blue-400 text-xs">Replying to {replyTo.name}</Text>
                            <TouchableOpacity onPress={() => setReplyTo(null)}>
                                <Ionicons name="close-circle" size={16} color="#2563eb" />
                            </TouchableOpacity>
                        </View>
                    )}
                    <View className="flex-row items-center px-4 py-1">
                        <TextInput
                            placeholder="Add a comment..."
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 py-1 text-black dark:text-white text-base max-h-32"
                            multiline
                            value={commentText}
                            onChangeText={setCommentText}
                        />
                        <TouchableOpacity 
                            onPress={handleSendComment}
                            disabled={isCommenting || !commentText.trim()}
                            className={`ml-2 w-10 h-10 rounded-full items-center justify-center ${commentText.trim() ? "bg-blue-600" : "bg-gray-100 dark:bg-gray-800"}`}
                        >
                            {isCommenting ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Ionicons 
                                    name="send" 
                                    size={20} 
                                    color={commentText.trim() ? "white" : "#9CA3AF"} 
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
        </View>
    );
}
