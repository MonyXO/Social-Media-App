import { AuthContext } from "@/utils/authContext";
import { useState, useContext } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";


export default function LoginScreen() {

    const authContext = useContext(AuthContext);
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
                    marginBottom: 20,
                    padding: 10,
                }}
            />
            <Button title="Log In!" onPress={handleLogin}/>
        </View>
    );
}