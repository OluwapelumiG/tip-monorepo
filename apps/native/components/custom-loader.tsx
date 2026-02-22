import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { logo } from "@illtip/assets";

interface CustomLoaderProps {
  visible?: boolean;
}

const DOT_SIZE = 16;
const RADIUS = 55;
const DURATION = 1200;

export function CustomLoader({ visible = true }: CustomLoaderProps) {
  const rotation = useSharedValue(0);
  const globeScale = useSharedValue(1);
  
  const colors = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

  const startAnimation = () => {
    // Reset first
    cancelAnimation(rotation);
    cancelAnimation(globeScale);
    rotation.value = 0;
    globeScale.value = 1;

    // Start rotation
    rotation.value = withRepeat(
      withTiming(360, {
        duration: DURATION,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Start pulse
    globeScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      cancelAnimation(rotation);
      cancelAnimation(globeScale);
    };
  }, []);

  const animatedStyles = [0, 90, 180, 270].map((offset) =>
    useAnimatedStyle(() => {
      const angle = (rotation.value + offset) * (Math.PI / 180);
      return {
        transform: [
          { translateX: RADIUS * Math.cos(angle) },
          { translateY: RADIUS * Math.sin(angle) },
        ],
      };
    })
  );

  const globeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: globeScale.value }],
    };
  });

  if (!visible) return null;

  return (
    <View style={styles.container} onLayout={startAnimation}>
      {/* Central Globe/Logo */}
      <Animated.View style={[styles.globeContainer, globeStyle]}>
         <Image source={logo} style={{ width: 72, height: 72, resizeMode: "contain" }} />
      </Animated.View>

      {/* Orbiting Dots */}
      {colors.map((color, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: color },
            animatedStyles[index],
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // Or white/black depending on usage
  },
  globeContainer: {
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 90, // Increased from 60
    height: 90, // Increased from 60
    borderRadius: 45,
    backgroundColor: "white", // Background for globe to hide overlapping lines if any
  },
  dot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    zIndex: 2,
  },
});
