import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator, Alert, useWindowDimensions, Share, Modal } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import { useQuery, useMutation } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import * as Linking from "expo-linking";
import { authClient } from "@/lib/auth-client";
import type { User } from "@illtip/api";

export default function JobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  
  const { data: session } = authClient.useSession();
  const currentUser = session?.user as User | undefined;
  
  // Fetch Job Details
  const { data: job, isLoading } = useQuery(orpc.job.getById.queryOptions({ input: id }));

  // Payment Modal State
  const [isSubToOpen, setIsSubToOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "NGN">("USD");
  const [selectedPack, setSelectedPack] = useState<number>(1);

  // Fetch Payment Plans
  const { data: plans = [] } = useQuery(orpc.payment.getPlans.queryOptions());

  // Create Checkout Session
  const { mutate: createCheckout, isPending: isCreatingCheckout } = useMutation(
      orpc.payment.createCheckoutSession.mutationOptions({
          onSuccess: async (data: any) => {
              if (data?.url || data?.authorization_url) {
                  const url = data.url || data.authorization_url; // Stripe vs Paystack response
                  const redirectUrl = Linking.createURL(`/job/${job?.id}`);
                  
                  // openAuthSessionAsync automatically listens for the redirectUrl
                  // to intercept and close the WebBrowser when payment redirects back to the app!
                  const result = await WebBrowser.openAuthSessionAsync(url, redirectUrl);
                  
                  // Refresh auth session / credits silently in background if successful
                  setIsSubToOpen(false);
              }
          },
          onError: (error: any) => {
              Alert.alert("Checkout Error", error.message);
          }
      })
  );

  // Lead Purchase (Application)
  const { mutate: apply, isPending: isApplying } = useMutation(
    orpc.job.apply.mutationOptions({
      onSuccess: () => {
        Alert.alert("Success", "You have successfully applied for this job! The employer will be notified.");
      },
      onError: (error: any) => {
        if (error.message.includes("Insufficient credits")) {
           setIsSubToOpen(true);
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

  const hasImage = !!job.media?.[0];
  const isEmployerOrCustomer = currentUser?.role === "employer" || currentUser?.role === "customer";
  const isJobOwner = currentUser?.id === job.employerId;
  const isAdmin = currentUser?.role === "admin";
  const showApplyButton = (!isEmployerOrCustomer || isAdmin) && !isJobOwner;

  // Calculate background height to be 75% of the image size + top safe area spacing
  const topSpacing = Math.max(insets.top, 20) + 8 + 44 + 24; // insets + pt-2 + headerHeight + pb-6
  const imageSize = width - 48; // aspect square, padding horiz 24px each side
  const bgHeight = topSpacing + (imageSize * 0.75);

  return (
    <View className="flex-1 bg-white dark:bg-black" style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
        
        {/* Blue Header Background (scrolls with content) */}
        {hasImage && (
            <View 
                className="absolute top-0 left-0 right-0 bg-blue-600 rounded-b-[40px] z-0" 
                style={{ height: bgHeight }}
            />
        )}
        
        <View style={{ paddingTop: Math.max(insets.top, 20) }} className="flex-1 pb-10">
            {/* Header Navigation */}
            <View className="px-6 pt-2 pb-6 flex-row justify-between items-center z-10">
               <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color={hasImage ? "white" : "black"} />
               </TouchableOpacity>
               <Text className={`text-lg font-bold ${hasImage ? "text-white" : "text-black dark:text-white"}`}>Detail</Text>
               <TouchableOpacity onPress={async () => {
                   try {
                     await Share.share({
                       message: `Check out this job: ${job.title} at ${job.employer.name}!`,
                     });
                   } catch (error: any) {
                     Alert.alert("Error sharing:", error.message);
                   }
               }}>
                    <Ionicons name="share-outline" size={24} color={hasImage ? "white" : "black"} />
               </TouchableOpacity>
            </View>

            {/* Main Image Card */}
            {hasImage && (
                <View className="px-6 z-10 mb-6 relative">
                    <View className="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded-3xl shadow-lg border-4 border-white dark:border-gray-900 overflow-hidden relative">
                        <Image source={{ uri: job.media[0].url }} className="flex-1" />
                    </View>
                </View>
            )}

            {/* Content Body */}
            <View className="px-6 z-10">
                <Text className="text-3xl font-bold text-black dark:text-white leading-tight mb-2 mt-2">
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
        </View>
      </ScrollView>

      {/* Footer */}
      {(showApplyButton || isJobOwner) && (
          <View className="px-6 py-4 flex-row items-center justify-between bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900">
               {showApplyButton && (
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
               )}

               {isJobOwner && (
                   <TouchableOpacity 
                      className="flex-1 bg-gray-900 dark:bg-white rounded-full py-4 flex-row items-center justify-center shadow-gray-300 dark:shadow-none shadow-md h-16"
                      onPress={() => router.push(`/job/${job.id}/applications` as any)}
                   >
                        <Text className="text-white dark:text-black font-bold text-lg">See Applications</Text>
                   </TouchableOpacity>
               )}
          </View>
      )}

      {/* Subscription Modal */}
      <Modal visible={isSubToOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setIsSubToOpen(false)}>
          <View className="flex-1 bg-white dark:bg-gray-900 pt-6 px-6">
              <View className="flex-row justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <Text className="text-2xl font-bold text-black dark:text-white">Get Credits</Text>
                  <TouchableOpacity onPress={() => setIsSubToOpen(false)}>
                      <Ionicons name="close-circle" size={32} color="#9ca3af" />
                  </TouchableOpacity>
              </View>

              <Text className="text-base text-gray-500 dark:text-gray-400 mb-6 font-medium">
                  Applying for a lead requires 1 credit per application. Choose a pack that works best for you.
              </Text>

              {/* Currency Selector */}
              <View className="flex-row mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                  {['USD', 'NGN'].map((curr) => (
                      <TouchableOpacity
                          key={curr}
                          className={`flex-1 py-3 rounded-lg items-center ${selectedCurrency === curr ? 'bg-white dark:bg-black shadow-sm' : 'bg-transparent'}`}
                          onPress={() => setSelectedCurrency(curr as never)}
                      >
                          <Text className={`font-bold ${selectedCurrency === curr ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>{curr}</Text>
                      </TouchableOpacity>
                  ))}
              </View>

              {/* Packs */}
              <ScrollView showsVerticalScrollIndicator={false}>
                  {[1, 3, 5].map((pack) => {
                      const id = `${selectedCurrency.toLowerCase()}-${pack}`;
                      const plan = plans?.find((p: any) => p.id === id);
                      const isSelected = selectedPack === pack;

                      if (!plan) return null;

                      return (
                          <TouchableOpacity
                              key={pack}
                              onPress={() => setSelectedPack(pack)}
                              className={`mb-4 p-5 rounded-3xl border-2 flex-row items-center justify-between ${isSelected ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-800 bg-transparent'}`}
                          >
                              <View>
                                  <Text className={`text-xl font-bold ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-black dark:text-white'}`}>{pack} Credit{pack > 1 && 's'}</Text>
                                  <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pack} job application{pack > 1 && 's'}</Text>
                              </View>
                              <View className="items-end">
                                  <Text className={`text-2xl font-black ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-black dark:text-white'}`}>
                                      {plan.currency === 'USD' ? '$' : '₦'}{plan.price}
                                  </Text>
                              </View>
                          </TouchableOpacity>
                      )
                  })}
              </ScrollView>

              {/* Pay Button */}
              <View className="py-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 pb-10">
                  <TouchableOpacity
                      disabled={isCreatingCheckout}
                      onPress={() => {
                         const planId = `${selectedCurrency.toLowerCase()}-${selectedPack}`;
                         createCheckout({
                             planId,
                             successUrl: Linking.createURL(`/job/${job.id}`, { queryParams: { act: 'paid' } }),
                             cancelUrl: Linking.createURL(`/job/${job.id}`, { queryParams: { act: 'cancel' } })
                         });
                      }}
                      className="bg-blue-600 w-full h-16 rounded-full items-center justify-center shadow-md shadow-blue-300"
                  >
                      {isCreatingCheckout ? (
                          <ActivityIndicator color="white" />
                      ) : (
                          <Text className="text-white font-bold text-lg">Checkout & Pay</Text>
                      )}
                  </TouchableOpacity>
              </View>

          </View>
      </Modal>

    </View>
  );
}
