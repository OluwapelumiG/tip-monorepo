import React, { useRef, useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Pressable, ActivityIndicator, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withDelay } from 'react-native-reanimated';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

interface MediaCarouselProps {
  media: MediaItem[];
  height?: number;
  width?: number;
  onLike?: () => void;
}

const VideoPlayer = ({ url, isActive, onLike }: { url: string; isActive: boolean; onLike?: () => void }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const player = useVideoPlayer(url, (p) => {
    p.loop = true;
    p.muted = isMuted;
    if (isActive) {
      p.play();
    }
  });

  const lastTap = useRef<number>(0);
  const heartScale = useSharedValue(0);

  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  // Monitor status
  useEffect(() => {
    const subscription = player.addListener('statusChange', (statusPayload) => {
      console.log(`Video status for ${url}:`, statusPayload.status);
      if (statusPayload.status === 'readyToPlay') {
        setIsLoading(false);
        setHasError(false);
      } else if (statusPayload.status === 'error') {
        console.error(`Video error for ${url}:`, statusPayload.error);
        setIsLoading(false);
        setHasError(true);
      }
    });
    return () => subscription.remove();
  }, [player, url]);

  // Sync player state with isActive and isPaused
  useEffect(() => {
    if (isActive && !isPaused) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, isPaused, player]);

  const handleInteraction = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap - Like
      onLike?.();
      heartScale.value = withSequence(
        withSpring(1.5),
        withDelay(500, withSpring(0))
      );
      lastTap.current = 0;
    } else {
      // Single tap - Toggle pause
      if (player.playing) {
        player.pause();
        setIsPaused(true);
      } else {
        player.play();
        setIsPaused(false);
      }
      lastTap.current = now;
    }
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    player.muted = newMuteState;
  };

  return (
    <View className="flex-1 bg-black overflow-hidden">
      <Pressable onPress={handleInteraction} className="flex-1">
        <VideoView
          player={player}
          className="flex-1"
          style={{ flex: 1 }}
          contentFit="cover"
          nativeControls={false}
        />
        
        {/* Loading Indicator */}
        {isLoading && !hasError && (
          <View style={StyleSheet.absoluteFill} className="items-center justify-center bg-black/40">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}

        {/* Error State */}
        {hasError && (
          <View style={StyleSheet.absoluteFill} className="items-center justify-center bg-black/60">
            <Ionicons name="alert-circle" size={48} color="white" style={{ opacity: 0.8 }} />
            <ActivityIndicator size="small" color="#ffffff" style={{ marginTop: 8 }} />
          </View>
        )}

        {/* Interaction Overlays */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            {/* Play Icon - Only when not playing and not loading and no error */}
            {!player.playing && !isLoading && !hasError && (
                <View className="flex-1 items-center justify-center">
                    <View className="w-20 h-20 rounded-full bg-black/40 items-center justify-center">
                        <Ionicons name="play" size={48} color="white" style={{ marginLeft: 4 }} />
                    </View>
                </View>
            )}

            {/* Mute Button - Needs to be high in z-index and NOT swallowed */}
            <TouchableOpacity 
                onPress={toggleMute}
                className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-black/40 items-center justify-center"
                style={{ zIndex: 100 }}
            >
                <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={22} color="white" />
            </TouchableOpacity>

            {/* Double Tap Heart Feedback */}
            <View style={StyleSheet.absoluteFill} className="items-center justify-center" pointerEvents="none">
                <Animated.View style={animatedHeartStyle}>
                    <Ionicons name="heart" size={100} color="white" />
                </Animated.View>
            </View>
        </View>
      </Pressable>
    </View>
  );
};

export const MediaCarousel = ({ media, height = 300, width: propWidth, onLike }: MediaCarouselProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const width = propWidth ?? windowWidth;
  const [activeIndex, setActiveIndex] = useState(0);
  const heartScale = useSharedValue(0);
  const lastTap = useRef<number>(0);

  const animatedHeartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handleImageTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      onLike?.();
      heartScale.value = withSequence(
        withSpring(1.5),
        withDelay(500, withSpring(0))
      );
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  if (!media || media.length === 0) return null;

  return (
    <View style={{ height, width }} className="bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <FlatList
        data={media}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        snapToInterval={width}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ width, height }}>
            {item.type === 'video' ? (
              <VideoPlayer url={item.url} isActive={index === activeIndex} onLike={onLike} />
            ) : (
              <Pressable onPress={handleImageTap} className="flex-1">
                <Image
                  source={{ uri: item.url }}
                  className="w-full h-full"
                  style={{ width, height }}
                  contentFit="cover"
                />
                {/* Double Tap Heart Feedback */}
                <View style={StyleSheet.absoluteFill} className="items-center justify-center" pointerEvents="none">
                    <Animated.View style={animatedHeartStyle}>
                        <Ionicons name="heart" size={100} color="white" />
                    </Animated.View>
                </View>
              </Pressable>
            )}
          </View>
        )}
      />
      
      {media.length > 1 && (
        <View className="flex-row absolute bottom-4 self-center bg-black/20 px-2 py-1 rounded-full">
          {media.map((_, index) => (
            <View
              key={index}
              className={`w-1.5 h-1.5 rounded-full mx-1 ${index === activeIndex ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </View>
      )}
    </View>
  );
};
