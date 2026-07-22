import { AuthContext } from '@/utils/authContext';
import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

const isLoggedIn = true;

export default function ProtectedLayout() {
  const authState = useContext(AuthContext);

  console.log("isReady", authState.isReady)
  console.log("isLoggedIn", authState.isLoggedIn)

  if (!authState.isReady) {
    return null;
  }

  if (!authState.isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="modal" 
        options={{ presentation: 'modal', title: 'Modal' }} 
      />
    </Stack>
  );
}
