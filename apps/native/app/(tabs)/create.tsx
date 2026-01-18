import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} className="items-center justify-center bg-white dark:bg-black">
      <Text className="text-xl font-bold text-gray-900 dark:text-white">Create Screen</Text>
    </SafeAreaView>
  );
}
