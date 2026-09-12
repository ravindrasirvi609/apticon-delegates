import { Tabs } from 'expo-router';
import { CalendarDays, Home, MapPin, Mic, Users } from 'lucide-react-native';
import { colors, fontFamily } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[700],
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle: { fontFamily: fontFamily.sansMedium, fontSize: 11 },
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.surface[200] },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="schedule"
        options={{ title: 'Schedule', tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="committee"
        options={{ title: 'Committee', tabBarIcon: ({ color, size }) => <Users color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="speakers"
        options={{ title: 'Speakers', tabBarIcon: ({ color, size }) => <Mic color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="venue"
        options={{ title: 'Venue', tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} /> }}
      />
    </Tabs>
  );
}
