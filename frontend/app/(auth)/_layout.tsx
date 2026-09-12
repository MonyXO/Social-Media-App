import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "none",
            }}
        >
            <Stack.Screen
                name="signup"
                options={{
                    headerShown: false,
                    title: "Sign Up",
                }}
            />
        </Stack>
    );
}