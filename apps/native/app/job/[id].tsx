import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { Linking } from "react-native";

export default function JobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Fetch Job Details
  const { data: job, isLoading } = useQuery(orpc.job.getById.queryOptions({ input: id }));

  // Lead Purchase (Application)
  const { mutate: apply, isPending: isApplying } = useMutation(
    orpc.job.apply.mutationOptions({
      onSuccess: () => {
        Alert.alert("Success", "You have successfully applied for this job! The employer will be notified.");
      },
      onError: (error: any) => {
        if (error.message.includes("Insufficient credits")) {
          Alert.alert(
            "Insufficient Credits",
            "You need credits to apply for this job. Would you like to buy some?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Buy Credits", onPress: () => router.push("/settings/finance") }
            ]
          );
        } else {
          Alert.alert("Error", error.message);
        }
      }
    })
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-white dark:bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!job) {
    return (
      <View className="flex-1 bg-white dark:bg-black items-center justify-center">
        <Text className="text-gray-500">Job not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black" style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Blue Header Background */}
      <View className="absolute top-0 left-0 right-0 h-[45%] bg-blue-600 rounded-b-[40px] z-0" />

      <SafeAreaView className="flex-1" edges={["top", "bottom"]} style={{ flex: 1 }}>
        
        {/* Header Navigation */}
        <View className="px-6 pt-2 pb-6 flex-row justify-between items-center z-10">
           <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="white" />
           </TouchableOpacity>
           <Text className="text-white text-lg font-bold">Detail</Text>
           <TouchableOpacity>
                <Ionicons name="share-outline" size={24} color="white" />
           </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 z-10" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
            
            {/* Main Image Card */}
            <View className="px-6">
                <View className="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded-3xl shadow-lg border-4 border-white dark:border-gray-900 overflow-hidden relative">
                    {job.media?.[0] ? (
                        <Image source={{ uri: job.media[0].url }} className="flex-1" />
                    ) : (
                        <View className="flex-1 bg-gray-200 dark:bg-gray-800 items-center justify-center">
                            <Ionicons name="image-outline" size={80} color="#9CA3AF" />
                        </View>
                    )}
                </View>
            </View>

            {/* Content Body */}
            <View className="px-6 mt-6 pb-24">
                <Text className="text-3xl font-bold text-black dark:text-white leading-tight mb-2">
                    {job.title}
                </Text>
                
                <View className="flex-row items-center gap-4 mb-6">
                    <Text className="text-blue-600 font-bold text-xl">{job.salaryRange || "Negotiable"}</Text>
                    <View className="flex-row items-center">
                        <Ionicons name="briefcase-outline" size={18} color="#4b5563" />
                        <Text className="text-gray-600 dark:text-gray-400 ml-1.5 font-medium">{job.category}</Text>
                    </View>
                </View>

                {/* Info Cards */}
                <View className="flex-row gap-4 mb-8">
                     <View className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                         <Text className="text-gray-400 text-xs mb-1">Employer</Text>
                         <Text className="text-black dark:text-white font-bold">{job.employer.name}</Text>
                     </View>
                     <View className="flex-1 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                         <Text className="text-gray-400 text-xs mb-1">Location</Text>
                         <Text className="text-black dark:text-white font-bold">{job.location || "Remote"}</Text>
                     </View>
                </View>

                {/* Description Section */}
                <View>
                    <Text className="text-lg font-bold text-black dark:text-white mb-2">Job Description</Text>
                    <Text className="text-gray-500 dark:text-gray-400 leading-6">
                        {job.description}
                    </Text>
                </View>

                {/* Media Gallery if any */}
                {job.media && job.media.length > 1 && (
                    <View className="mt-8">
                        <Text className="text-lg font-bold text-black dark:text-white mb-4">Gallery</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                            {job.media.slice(1).map((m, i) => (
                                <Image key={i} source={{ uri: m.url }} className="w-40 h-40 rounded-2xl" />
                            ))}
                        </ScrollView>
                    </View>
                )}

            </View>
        </ScrollView>

        {/* Footer */}
        <View className="px-6 py-4 flex-row items-center justify-between bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900">
             <TouchableOpacity 
                className="flex-1 bg-blue-600 rounded-full py-4 flex-row items-center justify-center shadow-blue-300 shadow-md h-16"
                onPress={() => apply({ jobId: job.id })}
                disabled={isApplying}
             >
                 {isApplying ? (
                    <ActivityIndicator color="white" />
                 ) : (
                    <>
                        <Text className="text-white font-bold text-lg mr-2">Apply for Lead</Text>
                        <View className="bg-yellow-400 px-2 py-0.5 rounded-md">
                            <Text className="text-blue-900 font-bold text-xs">1 CREDIT</Text>
                        </View>
                    </>
                 )}
             </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}
