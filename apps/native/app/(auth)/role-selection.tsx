import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

// Local assets
import hireBg from "@/assets/images/hire-bg.png";
import serviceBg from "@/assets/images/service-bg.png";
import rolePlaceholder from "@/assets/images/role-placeholder.png";

const FREELANCER_IMG = hireBg;
const CLIENT_IMG = serviceBg;
const PLACEHOLDER_IMG = rolePlaceholder;

const { width } = Dimensions.get("window");

// Removed StyledImage to debug rendering issues. Using Image directly.

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"freelancer" | "customer" | null>(null);

  const handleContinue = () => {
    router.push({
      pathname: "/(auth)/register",
      params: { role: selectedRole },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} className="relative">
        {/* Header Section */}
        <View className="px-6 mt-8 z-10 shrink-0">
            <Text className="text-4xl font-extrabold text-blue-700 tracking-tight">
                {!selectedRole ? "Choose Your Role" : (selectedRole === "freelancer" ? "Service Provider" : "Service Seeker")}
            </Text>
            <Text className="text-gray-900 text-lg font-medium mt-2">
                {!selectedRole 
                    ? "How do you intend to use the app?"
                    : (selectedRole === "freelancer" 
                        ? "Looking for a service or solution."
                        : "Providing services and expertise.")
                }
            </Text>
         </View>

      {/* Main Image Section */}
      <View className="flex-1 w-full mt-8 mb-8 px-4">
         <View className="w-full h-full overflow-hidden rounded-3xl shadow-sm bg-gray-100">
            <Image
                source={!selectedRole ? PLACEHOLDER_IMG : (selectedRole === "freelancer" ? FREELANCER_IMG : CLIENT_IMG)}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
            />
         </View>
      </View>

       {/* Bottom Selection Toggle */}
      <View className="w-full px-8 pb-10 shrink-0">
        <View className="flex-row justify-between items-center px-2 mb-8">
             <Pressable
                className={`py-4 px-10 rounded-xl items-center justify-center ${selectedRole === "freelancer" ? "bg-blue-700 shadow-md shadow-blue-300" : "bg-transparent border-2 border-gray-100"}`}
                onPress={() => setSelectedRole("freelancer")}
            >
                <Text className={`${selectedRole === "freelancer" ? "text-white" : "text-gray-900"} font-bold text-xl`}>Freelancer</Text>
            </Pressable>
            
            <Pressable
                className={`py-4 px-10 rounded-xl items-center justify-center ${selectedRole === "customer" ? "bg-blue-700 shadow-md shadow-blue-300" : "bg-transparent border-2 border-gray-100"}`}
                onPress={() => setSelectedRole("customer")}
            >
                <Text className={`${selectedRole === "customer" ? "text-white" : "text-gray-900"} font-bold text-xl`}>Customer</Text>
            </Pressable>
        </View>

        {selectedRole && (
            <Pressable
                className="w-full bg-blue-700 rounded-xl py-4 items-center justify-center shadow-lg shadow-blue-300 animate-in fade-in slide-in-from-bottom-5 duration-300"
                onPress={handleContinue}
            >
                <Text className="text-white font-bold text-xl tracking-tight">Proceed</Text>
            </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
