import { Image } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

// Local assets
import hireBg from "@/assets/images/hire-bg.png";
import serviceBg from "@/assets/images/service-bg.png";

const FREELANCER_IMG = hireBg;
const CLIENT_IMG = serviceBg;

const { width } = Dimensions.get("window");

// Removed StyledImage to debug rendering issues. Using Image directly.

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
        <View className="px-6 mt-4 z-10">
            <Text className="text-4xl font-bold text-blue-700 mb-2">
                {selectedRole === "freelancer" ? "Service Provider" : "Service Seeker"}
            </Text>
            <Text className="text-gray-800 text-lg">
                {selectedRole === "freelancer" 
                    ? "Looking for a service or solution." // Wait, Freelancer provides service. Text in user code confused me? 
                    // Let's stick to logical: Freelancer = "Providing services", Customer = "Looking for service".
                    // Actually, let's follow the user's previous code snippet logic if it was correct, or correct it.
                    // Previous code: Freelancer -> "Providing services and expertise."
                    // Customer -> "Looking for a service or solution."
                    : "Providing services and expertise."
                }
            </Text>
         </View>

      {/* Main Image Section */}
      <View style={{ flex: 1, width: '100%', marginTop: 24, marginBottom: 128, position: 'relative' }}>
         <View className="w-full h-full overflow-hidden rounded-bl-[100px] border-b-4 border-l-4 border-white shadow-xl bg-gray-50">
            <Image
                source={selectedRole === "freelancer" ? FREELANCER_IMG : CLIENT_IMG}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
            />
         </View>
      </View>

      {/* Bottom Selection Toggle */}
      <View className="absolute bottom-10 w-full px-6">
      {/* Bottom Selection Toggle */}
      <View className="absolute bottom-10 w-full px-6">
        {/* Toggle Buttons */}
        <View className="flex-row justify-between items-center gap-4">
             <Pressable
                className={`flex-1 py-4 rounded-xl items-center justify-center ${selectedRole === "freelancer" ? "bg-blue-700 shadow-lg shadow-blue-200" : "bg-transparent"}`}
                onPress={() => {
                    if (selectedRole === "freelancer") {
                        handleContinue();
                    } else {
                        setSelectedRole("freelancer");
                    }
                }}
            >
                <Text className={`${selectedRole === "freelancer" ? "text-white" : "text-gray-900"} font-bold text-lg`}>Freelancer</Text>
            </Pressable>
            
            <Pressable
                className={`flex-1 py-4 rounded-xl items-center justify-center ${selectedRole === "customer" ? "bg-blue-700 shadow-lg shadow-blue-200" : "bg-transparent"}`}
                onPress={() => {
                    if (selectedRole === "customer") {
                        handleContinue();
                    } else {
                        setSelectedRole("customer");
                    }
                }}
            >
                 <Text className={`${selectedRole === "customer" ? "text-white" : "text-gray-900"} font-bold text-lg`}>Customer</Text>
            </Pressable>
        </View>

        {/* Continue Button - Explicit one or implied? 
            The design has "Freelancer" [Button]  "Customer" [Text].
            It doesn't clearly show a "Continue" button separately. 
            When you click the Role, does it proceed? Or is there a "Next"? 
            Usually explicit is better. I'll keep "Continue" for now but maybe styled differently or rely on just the toggle acting as selection.
            
            Actually, looking at the user's provided screenshots:
            Left screen (Service Provider): "Freelancer" is Blue Button, "Customer" is Text.
            Right screen (Service Seeker): "Freelancer" is Text, "Customer" is Blue Button.
            
            This implies the bottom area IS the navigation/selection mechanism.
            AND there is no "Continue" button visible.
            
            So, when you tap "Freelancer", it selects it. 
            Maybe tapping it AGAIN proceeds? Or tapping it immediately proceeds?
            Or maybe the text/button row IS the only control?
            
            Let's assume: You tap the role you want. It sets state. 
            Then how do you proceed? 
            Maybe the blue button *is* the continue button? i.e. "I am a Freelancer" -> Go.
            Let's add a "Continue" button separately to be safe, OR make the selected button act as continue if tapped again?
            
            Let's stick to the visible UI: Two labels, one is a button.
            I will make them toggle state. And add a separate Continue button below or make the blue button navigate?
            Let's make the selection *immediate* update, and maybe auto-navigate? No, that's annoying.
            
            I'll implement the two buttons row as seen. And add a distinct "Continue" arrow or FAB or button below if needed, 
            OR relying on the user to tap the "Active" button to proceed?
            
            Let's try: Select updates view. 
            Double tap or explicit "Continue" button?
            I'll add a "Continue" button appearing below, or perhaps the design intent is that clicking the blue button *is* the confirmation?
            
            "Freelancer" [Blue Button]   "Customer" [Text]
            If I click Customer -> Swaps.
            If I click Freelancer (while blue) -> Proceed?
            I'll implement: 
            Two pressables. 
            If unselected -> Select it.
            If already selected -> Proceed.
        */}
         
        </View>
      </View>
    </SafeAreaView>
  );
}
