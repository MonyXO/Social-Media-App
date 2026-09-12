import { Stack } from "expo-router";
import { AuthProvider } from "@/utils/authContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
    return (
        <AuthProvider>
            <StatusBar style="auto" />

            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: "none",
                }}
            />
        </AuthProvider>
    );
}