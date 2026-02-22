import "../global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import { queryClient } from "@/utils/orpc";

export const unstable_settings = {
  // initialRouteName: "onboarding", // Removed to let index.tsx handle entry logic
};

function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="welcome" />
      
      {/* Auth Routes */}
      <Stack.Screen name="(auth)/role-selection" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />
      
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(drawer)" />
      <Stack.Screen name="user/[id]" />
      <Stack.Screen name="post/[id]" />
      <Stack.Screen name="settings/customization" />
      <Stack.Screen name="settings/language" />
      <Stack.Screen name="settings/finance" />
      <Stack.Screen name="settings/subscription" />
      <Stack.Screen name="settings/help" />
      <Stack.Screen name="settings/about" />
      <Stack.Screen name="modal" options={{ title: "Modal", presentation: "modal", headerShown: true }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <AppThemeProvider>
            <HeroUINativeProvider>
              <StackLayout />
            </HeroUINativeProvider>
          </AppThemeProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
