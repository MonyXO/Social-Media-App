import { AuthContext } from "@/utils/authContext";
import { useContext } from "react";
import { Button, Text, View } from "react-native";


export default function SignUpScreen() {
    const authContext = useContext(AuthContext);
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 24 }}>SignUpScreen Screen</Text>
        </View>
    );
}