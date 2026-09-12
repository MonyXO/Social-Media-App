import { AuthContext } from "@/utils/authContext";
import { useState, useContext } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";


export default function LoginScreen() {

    const authContext = useContext(AuthContext);
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const success = await authContext.logIn(email, password);
        if (!success) {
            Alert.alert("Invalid email or password");
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Login Screen</Text>
            <TextInput 
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{
                    borderWidth: 1,
                    marginBottom: 10,
                    padding: 10
                }}
            />
            <TextInput 
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                    borderWidth: 1,
                    marginBottom: 10,
                    padding: 10,
                }}
            />
            <Button title="Log In!" onPress={handleLogin}/>
            <View>
                <Text style={{ fontSize: 18, textAlign: "center" }}>Want to Sign up?</Text>
                <Button title="Create Account" onPress={() => router.push("/signup")}/>
            </View>
        </View>
    );
}