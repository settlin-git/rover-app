import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs, useRouter } from 'expo-router';
import { type ColorValue, Platform } from 'react-native';

import { useThemeColors } from '@/theme';

// Trips is the landing tab, even though Feed is drawn first in the bar.
export const unstable_settings = { initialRouteName: 'index' };

type IconProps = { color: ColorValue; size: number; focused: boolean };

export default function TabsLayout() {
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.content,
        tabBarInactiveTintColor: colors['content-tertiary'],
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: Platform.select({ ios: 88, default: 68 }),
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}>
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }: IconProps) => (
            <Ionicons name="reorder-three-outline" color={color} size={size + 4} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, size, focused }: IconProps) => (
            <Ionicons name={focused ? 'location' : 'location-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="route"
        options={{
          title: 'Route',
          tabBarIcon: ({ color, size }: IconProps) => (
            <Feather name="plus-square" color={color} size={size} />
          ),
        }}
        listeners={{
          // Building a route is a task, not a place in the app. It opens over
          // whatever you were doing and returns you there, so this tab never
          // actually navigates — it launches the modal instead.
          tabPress: (event) => {
            event.preventDefault();
            router.push('/route');
          },
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          title: 'People',
          tabBarIcon: ({ color, size, focused }: IconProps) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size, focused }: IconProps) => (
            <Ionicons name={focused ? 'chatbox' : 'chatbox-outline'} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
