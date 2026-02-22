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

export const PostSkeleton = () => {
  return (
    <View className="mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
      {/* User Header Skeleton */}
      <View className="flex-row items-center px-4 mb-3">
        <SkeletonItem style={styles.avatar} />
        <View>
          <SkeletonItem style={styles.titleLine} />
          <SkeletonItem style={styles.subLine} />
        </View>
      </View>

      {/* Tag Skeleton */}
      <View className="px-4 mb-3">
        <SkeletonItem style={styles.tag} />
      </View>

      {/* Media Skeleton */}
      <SkeletonItem style={styles.media} />

      {/* Stats Skeleton */}
      <View className="flex-row px-4 mb-3 space-x-4">
        <SkeletonItem style={styles.statIcon} />
        <SkeletonItem style={styles.statIcon} />
        <SkeletonItem style={styles.statIcon} />
      </View>

      {/* Content Skeleton */}
      <View className="px-4">
        <SkeletonItem style={styles.contentTitle} />
        <SkeletonItem style={styles.contentLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB', // gray-200
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  titleLine: {
    width: 120,
    height: 16,
    borderRadius: 4,
    marginBottom: 6,
  },
  subLine: {
    width: 80,
    height: 12,
    borderRadius: 4,
  },
  tag: {
    width: 60,
    height: 20,
    borderRadius: 4,
  },
  media: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    marginBottom: 12,
  },
  statIcon: {
    width: 40,
    height: 20,
    borderRadius: 4,
  },
  contentTitle: {
    width: '70%',
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  contentLine: {
    width: '90%',
    height: 14,
    borderRadius: 4,
  },
});
