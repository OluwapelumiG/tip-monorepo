import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { authClient } from "@/lib/auth-client";
import { CustomLoader } from "@/components/custom-loader";

export default function Index() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure splash screen shows for at least 1.5 seconds to enjoy the animation
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady && !isPending) {
      if (session) {
        console.log("Session found, Redirecting to (tabs)...");
        router.replace("/(tabs)");
      } else {
        console.log("No session, Redirecting to onboarding...");
        router.replace("/onboarding");
      }
    }
  }, [isReady, isPending, session, router]);

  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      <CustomLoader />
    </View>
  );
}
