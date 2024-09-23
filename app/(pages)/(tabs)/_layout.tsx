import { Tabs } from 'expo-router';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useWindowDimensions } from 'react-native';
import { TabBar } from '@/components/TabBar';

import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/ctx';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { width, height } = useWindowDimensions();
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/(pages)/login/Login" />;
  } else {
    return (
      <Tabs
        screenOptions={{
          tabBarStyle: {
            height: height * 0.1, // 设置高度
            maxHeight: 105,
            // width: '100%', // 设置宽度为100%，可以根据需要调整
            paddingBottom: height * 0.02, // 调整底部内边距
            paddingTop: height * 0.02, // 调整顶部内边距
            backgroundColor: Colors[colorScheme ?? 'light'].background, // 背景颜色
            borderTopWidth: 0, // 去掉顶部边框
          },
          tabBarLabelStyle: {
            fontSize: height * 0.016, // 设置字体大小
            marginLeft: 0,
          },
          tabBarItemStyle: {
            flexDirection: 'column',
          },
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}
        tabBar={(props) => <TabBar {...props} />}>
        <Tabs.Screen
          name="index"
          options={{
            title: '首页',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                size={height * 0.03}
                name={focused ? 'home' : 'home-outline'}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: '地图',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name="compass" size={height * 0.035} color={color} />
              // <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="message"
          options={{
            title: '消息',
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: height * 0.028,
            },
            headerShadowVisible: false,
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name="message-processing"
                size={height * 0.03}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="personal"
          options={{
            title: '我的',
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome name="user-circle" size={height * 0.03} color={color} />
            ),
          }}
        />
      </Tabs>
    );
  }

  // This layout can be deferred because it's not the root layout.
  // return <Stack />;
}
