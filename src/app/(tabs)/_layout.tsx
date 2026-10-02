import { Tabs } from 'expo-router';
import { CalendarDays, Home, MapPin, Mic, Users } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { colors, fontFamily, radius } from '@/theme';

function TabIcon({ Icon, color, focused }: { Icon: typeof Home; color: string; focused: boolean }) {
  return (
    <View style={[styles.iconPill, focused && styles.iconPillActive]}>
      <Icon color={color} size={22} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary[700],
        tabBarInactiveTintColor: colors.text.faint,
        tabBarLabelStyle: { fontFamily: fontFamily.sansMedium, fontSize: 11 },
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={Home} color={String(color)} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={CalendarDays} color={String(color)} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="committee"
        options={{
          title: 'Committee',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={Users} color={String(color)} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="speakers"
        options={{
          title: 'Speakers',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={Mic} color={String(color)} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="venue"
        options={{
          title: 'Venue',
          tabBarIcon: ({ color, focused }) => <TabIcon Icon={MapPin} color={String(color)} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.surface[200],
    height: 60,
    paddingTop: 6,
  },
  tabItem: { paddingTop: 2 },
  iconPill: {
    width: 40,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPillActive: { backgroundColor: colors.primary[100] },
});
