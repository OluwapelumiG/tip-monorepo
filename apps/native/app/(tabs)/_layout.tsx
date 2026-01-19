import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useThemeColor } from "heroui-native";

export default function TabLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: themeColorBackground,
        },
        headerTintColor: themeColorForeground,
        headerTitleStyle: {
          color: themeColorForeground,
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: themeColorBackground, // automatically changes based on theme
          borderTopWidth: 1,
          borderTopColor: themeColorBackground === "#000000" ? "#1F2937" : "#E5E7EB", // dark: gray-800, light: gray-200
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
          paddingHorizontal: 16,
        },
        tabBarActiveTintColor: "#2563EB", // blue-600 (consistent)
        tabBarInactiveTintColor: themeColorForeground === "#FFFFFF" ? "#9CA3AF" : "#6B7280", // dark: gray-400, light: gray-500
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={28} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={28} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
             <Ionicons name="create-outline" size={28} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
           tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
