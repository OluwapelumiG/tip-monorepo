import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Placeholder images - using different unsplash images for variety if real assets unavailable
// Or using logo if preferred, but design shows people.
const FREELANCER_IMG = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60";
const CLIENT_IMG = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=60";

const { height } = Dimensions.get("window");

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"freelancer" | "customer">("freelancer");

  const handleContinue = () => {
    router.push({
      pathname: "/(auth)/register",
      params: { role: selectedRole },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      {/* Top Section - Image & Text */}
      <View className="h-3/4 w-full relative">
         {/* Background Arc - simplified with View and border radius or svg if needed. 
             For MVP, just straight image or simple overlay. 
             Design has a curved bottom image. */}
         <View className="absolute top-0 w-full h-full overflow-hidden rounded-b-[40px] bg-gray-50">
            <Image
                source={{ uri: selectedRole === "freelancer" ? FREELANCER_IMG : CLIENT_IMG }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
            />
            {/* Overlay Gradient or Tint could go here */}
         </View>

         {/* Text Overlay */}
         <View className="absolute top-10 left-6 right-6">
            <Text className="text-4xl font-bold text-blue-600 mb-2">
                {selectedRole === "freelancer" ? "Service Provider" : "Service Seeker"}
            </Text>
            <Text className="text-gray-600 text-lg">
                {selectedRole === "freelancer" 
                    ? "Looking for a service or solution." // Wait, Freelancer provides service? Verify text.
                    // Image 2 left side says "Service Provider - Looking for a service or solution" ?? That sounds like Client?
                    // Image 2 right side says "Service Seeker - Providing services and expertise" ?? That sounds backwards?
                    // Let's stick to standard definitions: 
                    // Freedlancer = Service Provider = Providing service
                    // Customer = Service Seeker = Looking for service
                    // The prompt images might have placeholder text or I misread.
                    // Let's use:
                    // Freelancer: Providing services and expertise.
                    // Customer: Looking for a service or solution.
                     "Providing services and expertise."
                    : "Looking for a service or solution."
                }
            </Text>
         </View>
      </View>

      {/* Bottom Selection Toggle */}
      <View className="absolute bottom-10 w-full px-6">
        <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity 
                onPress={() => setSelectedRole("freelancer")}
                className="items-center"
            >
                <Text className={`text-xl font-bold ${selectedRole === "freelancer" ? "text-blue-800" : "text-gray-400"}`}>
                    Freelancer
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => setSelectedRole("customer")}
                className="items-center"
            >
                 <Text className={`text-xl font-bold ${selectedRole === "customer" ? "text-blue-800" : "text-gray-400"}`}>
                    Customer
                </Text>
            </TouchableOpacity>
        </View>

        {/* Floating Button or Bottom Bar? 
            The image shows two buttons "Freelancer" and "Customer" at the bottom.
            Wait, the image shows "Freelancer" button blue when selected, and "Customer" text plain.
            And the other image shows "Customer" button blue when selected. 
            So it's two buttons side-by-side or a toggle?
            Actually looks like two buttons at the bottom.
            Let's implement two buttons side-by-side but style the selected one as Primary.
        */}
        <View className="flex-row gap-4">
             <Button
                className={`flex-1 ${selectedRole === "freelancer" ? "bg-blue-700" : "bg-white"}`}
                variant={selectedRole === "freelancer" ? "solid" : "ghost"}
                color={selectedRole === "freelancer" ? "primary" : "default"}
                onPress={() => setSelectedRole("freelancer")}
            >
                <Text className={`${selectedRole === "freelancer" ? "text-white" : "text-black"} font-bold text-lg`}>Freelancer</Text>
            </Button>
            
            <Button
                className={`flex-1 ${selectedRole === "customer" ? "bg-blue-700" : "bg-white"}`}
                variant={selectedRole === "customer" ? "solid" : "ghost"}
                color={selectedRole === "customer" ? "primary" : "default"}
                onPress={() => setSelectedRole("customer")}
            >
                 <Text className={`${selectedRole === "customer" ? "text-white" : "text-black"} font-bold text-lg`}>Customer</Text>
            </Button>
        </View>

        {/* Continue Button not explicitly in design but needed to proceed? 
            Ah, selecting the role updates the view. Maybe there's a "Next" button or clicking the active one proceeds?
            Use a "Continue" button below or make the role buttons NOT navigation but just selection.
            Let's add a "Continue" listener to the buttons? 
            Or just separate "Continue" button.
            The design has no extra button. It seems users click the role to switch view. 
            So how do they proceed? 
            Maybe clicking the *Selected* one again? Or a separate "Next" hidden in screenshot?
            I'll add a "Continue" button for clarity/usability if not visible. 
            Actually, let's look closely at image 2. It has "Freelancer" (Blue Button) and "Customer" (Text).
            It implies the Bottom Bar IS the selection mechanism.
            I will auto-navigate if they click the *Selected* button, or add a FAB?
            Let's stick to the previous "Continue" button approach BUT styled to match visually if possible.
            Actually, I'll just put a big "Next" arrow or button.
            Re-reading: "Freelancer" button IS the selector. 
            I'll add a minimal "Continue" button at the bottom right or center.
        */}
         <Button 
            className="mt-6 w-full" 
            size="lg" 
            color="primary"
            onPress={handleContinue}
        >
            Continue as {selectedRole === "freelancer" ? "Freelancer" : "Customer"}
        </Button>
      </View>
    </SafeAreaView>
  );
}
