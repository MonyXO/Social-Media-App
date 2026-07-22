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

            // This is the token we get back from the server --
            const token = response.data.token;
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

    const logOut = () => {
        setIsLoggedIn(false)
        storeAuthState({ isLoggedIn: false });
        router.replace("/login");
    }

    useEffect(() => {
        const getAuthFromStorage = async () => {
            // simulate a delay
            await new Promise((res) => setTimeout(() => res(null), 1000));
            try {
                const value = await AsyncStorage.getItem("token");
                if (value) {
                    setIsLoggedIn(true);
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