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

    // Adjust login below, keep it commented out until time to test
    logIn: async() => false,
    logOut: () => {},
})

export function AuthProvider({ children }: PropsWithChildren) {
    const [isReady, setIsReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const storeAuthState = async (newState: {isLoggedIn: boolean}) => {
        //TODO
        try {
            const jsonValue = JSON.stringify(newState);
            await AsyncStorage.setItem(authStorageKey, jsonValue);
        } catch (error) {
            console.log("Error saving", error);
        }
    };

    // Adjust login below, keep it commented out until time to test
    const logIn = async (email: string, password: string): Promise<boolean> => {  

        try {

            const response = await api.post("/login", {
                email,
                password,
            });

            console.log("Response:", response.data)

            // This is the token we get back from the server --
            const token = response.data.token;
            console.log("Token:", token)

            await AsyncStorage.setItem("token", token);

            // Set...
            setIsLoggedIn(true);
            router.replace("/");

            return true

        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logOut = async () => {

        const token = await AsyncStorage.getItem("token");

        await api.post("/logout",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        await AsyncStorage.removeItem("token");
        setIsLoggedIn(false)
        router.replace("/login")
    }

    useEffect(() => {
        const getAuthFromStorage = async () => {
            // simulate a delay
            await new Promise((res) => setTimeout(() => res(null), 1000));
            try {

                // Grabbing the key from Async Storage - on the phone
                const value = await AsyncStorage.getItem("token");
                // If there is a value - if there is something in Async Storage
                if (value) {
                    // Send the value to the Flask API to verify - will get a response from the server
                    const response = await api.get("/session", {
                        headers: {
                            Authorization: `Bearer ${value}`,
                        },
                    })

                    // Just logging the response
                    console.log("Response:", response.data)
                    
                    // Retrieving true or false
                    const isVerified = response.data.success

                    // Set if the user is logged in
                    if (isVerified) {
                        await AsyncStorage.setItem(
                            "token",
                            response.data.token
                        );
                        setIsLoggedIn(true);
                        router.replace("/")
                    } else {
                        setIsLoggedIn(false)
                    }

                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.log("Error fetching from storage", error);
                setIsLoggedIn(false);
            }
            setIsReady(true);
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