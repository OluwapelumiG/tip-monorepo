import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SkeletonItem = ({ style }: { style?: any }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.skeleton, style, animatedStyle]} />;
};

export const JobSkeleton = () => {
  return (
    <View className="bg-transparent mb-6 px-6">
      {/* Card Image Skeleton */}
      <SkeletonItem style={styles.cardImage} />

      {/* Title Skeleton */}
      <SkeletonItem style={styles.titleLine} />

      {/* Footer Info Skeleton */}
      <View className="flex-row items-center gap-4">
        <SkeletonItem style={styles.priceLine} />
        <SkeletonItem style={styles.employerLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB', // gray-200
  },
  cardImage: {
    width: '100%',
    height: 176, // 44 * 4
    borderRadius: 24,
    marginBottom: 16,
  },
  titleLine: {
    width: '80%',
    height: 24,
    borderRadius: 4,
    marginBottom: 8,
  },
  priceLine: {
    width: 100,
    height: 20,
    borderRadius: 4,
  },
  employerLine: {
    width: 120,
    height: 20,
    borderRadius: 4,
  },
});
