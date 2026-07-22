import { AuthContext } from "@/utils/authContext";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Button, View, Text } from "react-native";

export default function TabTwoScreen() {
  const router = useRouter();
  const authState = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24 }}>Login Screen</Text>
      <Button title="Log Out!" onPress={authState.logOut}/>
    </View>
  )
}