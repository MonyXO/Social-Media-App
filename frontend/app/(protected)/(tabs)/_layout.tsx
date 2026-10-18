import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

function AppTabBar({ state, navigation, insets }: BottomTabBarProps) {
  const colorScheme = useColorScheme() as 'light' | 'dark';
  const isDark = colorScheme === 'dark';
  const activeTintColor = '#4F7CAC';
  const inactiveTintColor = isDark ? '#9BA1A6' : '#687076';

  const openPostComposer = () => {
    navigation.navigate('index', { openComposer: Date.now().toString() });
  };

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: isDark ? '#151718' : '#FFFFFF',
          borderTopColor: isDark ? '#303438' : '#E7EBEF',
          paddingBottom: insets.bottom + 4,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const isHome = route.name === 'index';
        const label = isHome ? 'Home' : 'Explore';
        const color = isFocused ? activeTintColor : inactiveTintColor;
        const iconName = isHome ? 'house.fill' : 'paperplane.fill';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <React.Fragment key={route.key}>
            {index === 1 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Create a post"
                onPress={openPostComposer}
                style={styles.createPostTabButton}
              >
                <Text style={styles.createPostTabButtonText}>+ Post</Text>
              </Pressable>
            )}
            <Pressable
              accessibilityRole="tab"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={label}
              onPress={onPress}
              style={styles.tabItem}
            >
              <IconSymbol size={26} name={iconName} color={color} />
              <Text style={[styles.tabLabel, { color }]}>{label}</Text>
            </Pressable>
          </React.Fragment>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  createPostTabButton: {
    minWidth: 82,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#4F7CAC',
  },
  createPostTabButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});