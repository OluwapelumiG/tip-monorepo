import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Button } from "heroui-native";
import { useRef, useState } from "react";
import { Dimensions, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";
import { logo } from "@illtip/assets";

const { width } = Dimensions.get("window");

const StyledSafeAreaView = withUniwind(SafeAreaView);
const StyledImage = withUniwind(Image);

const slides = [
  {
    id: 1,
    title: "Empowering the Workforce",
    description: "Explore all the existing job roles based on your interest and study major.",
    image: logo, // Using logo as placeholder for illustration
  },
  {
    id: 2,
    title: "Connect & Grow",
    description: "Find the perfect match for your skills and take your career to the next level.",
    image: logo, // Using logo as placeholder for illustration
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(index));
  };

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({ x: width * (activeIndex + 1), animated: true });
    } else {
      router.push("/(auth)/role-selection");
    }
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* Skip Button */}
      <View className="absolute top-12 right-6 z-20">
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
           <Text className="text-blue-600 font-bold text-lg">Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
      >
        {slides.map((slide) => (
          <View key={slide.id} style={{ width }} className="items-center justify-center px-6">
            <View className="w-64 h-64 mb-10 items-center justify-center">
              <StyledImage
                source={slide.image}
                style={{ width: "100%", height: "100%" }}
                contentFit="contain"
              />
            </View>
            <Text className="text-3xl font-bold text-center text-blue-600 mb-4">
              {slide.title}
            </Text>
            <Text className="text-center text-gray-500 text-lg px-4">
              {slide.description}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Pagination & Button */}
      <View className="px-6 pb-10 items-center space-y-6">
        {/* Dots */}
        <View className="flex-row space-x-2">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2.5 rounded-full ${
                index === activeIndex ? "w-8 bg-blue-600" : "w-2.5 bg-gray-300"
              }`}
            />
          ))}
        </View>

        <Button
          size="lg"
          onPress={handleNext}
          className="w-full h-16 mt-2 text-white bg-blue-600 rounded"
        >
          <Button.Label className="text-white">
            {activeIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Button.Label>
        </Button>
      </View>
    </StyledSafeAreaView>
  );
}
