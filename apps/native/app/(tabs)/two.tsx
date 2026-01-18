import { Card } from "heroui-native";
import { Text, View } from "react-native";

import { Container } from "@/components/container";

export default function TabTwo() {
  return (
    <Container className="p-6 bg-white dark:bg-black">
      <View className="flex-1 justify-center items-center">
        <Card variant="secondary" className="p-8 items-center bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
          <Card.Title className="text-3xl mb-2 text-gray-900 dark:text-white">TabTwo</Card.Title>
        </Card>
      </View>
    </Container>
  );
}
