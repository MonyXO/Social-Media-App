//import { AuthContext } from "@/utils/authContext";
//import { useContext } from "react";
import { useState, useContext } from "react";
import { useRouter } from "expo-router";
import { Alert, Pressable, Text, View, TextInput } from "react-native";
import api from "@/api/api";

export default function SignUpScreen() {
    // const authContext = useContext(AuthContext);
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignUp = async () => {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            Alert.alert("Missing Information", "Please fill out all fields.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Passwords Don't Match", "Please make sure your passwords match.");
            return;
        }

        if (password.length < 8) {
            Alert.alert(
                "Password Too Short",
                "Your password must be at least 8 characters."
            );
            return;
        }

        try {
            const response = await api.post("/signup", {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
            });

            console.log("Sign response:", response.data);

            if (response.data.success) {
                Alert.alert(
                    "Account Created",
                    "Your account has been created successfully.",
                    [
                        {
                            text: "OK",
                            onPress: () => router.replace("/login"),
                        },
                    ]
                );
            }
        } catch (error: any) {
            console.error("Signup error:", error);

            if(error.response) {
                console.log("Server response:", error.response.data);

                if (error.response.status === 409) {
                    Alert.alert(
                        "Email Already Registered",
                        "An account with this email already exists."
                    );
                } else {
                    Alert.alert(
                        "Signup Failed",
                        error.response.data?.message ||
                        "Unable to create your account."
                    );
                }
            } else {
                Alert.alert(
                    "Connection Error",
                    "Could not connect to the server."
                );
            }
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Pressable
                onPress={() => router.back()}
                style={{
                    position: "absolute",
                    top: 60,
                    left: 20,
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    backgroundColor: '#eee',
                    justifyContent: 'center',
                    alignItems: "center",
                }}
            >   
                <Text style={{ fontSize: 28 }}>←</Text>
                <Text style={{ fontSize: 16, marginLeft: 6 }}>Back</Text>
            </Pressable>
            {/* Rest of Sign Up Screen */}
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign Up</Text>
            <TextInput 
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    marginBottom: 12,
                    padding: 12
                }}
            />
            <TextInput 
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    marginBottom: 12,
                    padding: 12
                }}
            />
            <TextInput 
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    marginBottom: 12,
                    padding: 12
                }}
            />
            <TextInput 
                placeholder="Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    marginBottom: 12,
                    padding: 12,
                }}
            />
            <TextInput 
                placeholder="Confirm Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                    borderWidth: 1,
                    borderRadius: 8,
                    marginBottom: 12,
                    padding: 12,
                }}
            />
            <Pressable
                onPress={handleSignUp}
                style={{
                    backgroundColor: '#000',
                    padding: 14,
                    borderRadius: 8,
                    alignItems: "center",
                }}
            >   
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Create Account</Text>
            </Pressable>
        </View>
    );
}