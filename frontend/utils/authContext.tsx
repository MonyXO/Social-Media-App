import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "@/api/api"

SplashScreen.preventAutoHideAsync();

type AuthState = {
    isLoggedIn: boolean;
    isReady: boolean;
    logIn: (email: string, password: string) => Promise<boolean>;
    logOut: () => void;
};

const authStorageKey = "auth-key";

export const AuthContext = createContext<AuthState>({
    isLoggedIn: false,
    isReady: false,

    logIn: async() => false,
    logOut: () => {},
})

export function AuthProvider({ children }: PropsWithChildren) {
    const [isReady, setIsReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const router = useRouter();

    // Adjust login below, keep it commented out until time to test
    const logIn = async (email: string, password: string): Promise<boolean> => {  

        try {

            const response = await api.post("/login", {
                email,
                password,
            });

            // Remove console log in dev environment
            //console.log("Response:", response.data)

            // Check to see if valid token is returned
            if (!response.data.success) {
                return false;
            }

            // This is the token we get back from the server --
            const token = response.data.token;

            await AsyncStorage.setItem("token", token);

            // Set...
            setIsLoggedIn(true);
            router.replace("/");

            return true

        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logOut = async () => {

        // Retrieve from Async Storage
        const token = await AsyncStorage.getItem("token");

        try {
            if (token) {
                // API CALL - LOGOUT WILL HAPPEN SERVER SIDE
                await api.post("/logout");
            }
        } catch (error) {
            console.error("Logout request failed:", error);
        } finally {
            // Then remove it from Async Storage
            await AsyncStorage.removeItem("token");

            // Set whether user is logged in to FALSE.
            setIsLoggedIn(false)

            // Go to the login screen.
            router.replace("/login")
        }
    };

    useEffect(() => {
        const getAuthFromStorage = async () => {
            // simulate a delay - NO NEED
            // await new Promise((res) => setTimeout(() => res(null), 1000));
            try {

                // Grabbing the key from Async Storage - on the phone
                const token = await AsyncStorage.getItem("token");
                // If there is a value - if there is something in Async Storage
                if (!token) {
                    setIsLoggedIn(false);
                    return
                }
                    
                // Send the value to the Flask API to verify - will get a response from the server
                const response = await api.get("/session")

                // Just logging the response - NO NEED
                // console.log("Response:", response.data)

                // Set if the user is logged in
                if (response.data.success) {
                    // await AsyncStorage.setItem(
                    //    "token",
                    //    response.data.token
                    //);
                    // Code above is not necessary. The token is correct if success
                    // is true. No need to put it back in Async Storage. It's already
                    // there.
                    setIsLoggedIn(true);
                    router.replace("/")
                } else {
                    await AsyncStorage.removeItem("token");
                    setIsLoggedIn(false)
                }

            } catch (error: any) {
                // Error expo will show
                if (error.response?.status === 401) {
                    console.log("Token expired or invalid")

                    await AsyncStorage.removeItem("token")
                    setIsLoggedIn(false)
                } else {
                    console.log("Session verification failed:", error)
                    setIsLoggedIn(false)
                }
            } finally {
                setIsReady(true);
            }
        }
        getAuthFromStorage();
    }, []);

    useEffect(() => {
        if (isReady) {
            SplashScreen.hideAsync();
        }
    }, [isReady]);

    return (
        <AuthContext.Provider value={{ isReady, isLoggedIn, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}