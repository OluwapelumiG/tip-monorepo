import { expoClient } from "@better-auth/expo/client";
import { env } from "@illtip/env/native";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_SERVER_URL,
  plugins: [
    expoClient({
      scheme: "illtip-monorepo", // Hardcoded to ensure reliability
      storagePrefix: "illtip-monorepo",
      storage: SecureStore,
    }),
  ],
});
