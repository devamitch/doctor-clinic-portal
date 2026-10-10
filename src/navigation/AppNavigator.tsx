"use client";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Calendar, User, Heart, Pill } from "lucide-react-native";
import { memo, useState, useCallback } from "react";

import { GlassDrawer } from "@/components/ui/navigation/GlassDrawer";
import { ThemedNavigationContainer } from "@/components/ui/navigation/ThemedNavigationContainer";
import { AppointmentBookingScreen } from "@/screens/AppointmentBookingScreen";
import { AppointmentsScreen } from "@/screens/AppointmentsScreen";
import { LoginScreen } from "@/screens/auth/LoginScreen";
import { RegisterScreen } from "@/screens/auth/RegisterScreen";
import { ChatScreen } from "@/screens/ChatScreen";
import { DoctorListScreen } from "@/screens/DoctorListScreen";
import { DoctorProfileScreen } from "@/screens/DoctorProfileScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { MedicalRecordsScreen } from "@/screens/MedicalRecordsScreen";
import { NotificationsScreen } from "@/screens/NotificationsScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";
import { PaymentScreen } from "@/screens/PaymentScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { QRScannerScreen } from "@/screens/QRScannerScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";

import { PillTabBar } from "./PillTabBar";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = memo(() => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="DoctorList" component={DoctorListScreen} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <Stack.Screen
        name="AppointmentBooking"
        component={AppointmentBookingScreen}
      />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
});

const AppointmentsStack = memo(() => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AppointmentsMain" component={AppointmentsScreen} />
      <Stack.Screen
        name="AppointmentBooking"
        component={AppointmentBookingScreen}
      />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
});

const ProfileStack = memo(() => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="MedicalRecords" component={MedicalRecordsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
});

const MainTabs = memo(() => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabPress = useCallback((index: number) => {
    setActiveTabIndex(index);
  }, []);

  const tabItems = [
    { key: "home", label: "Home", component: HomeStack },
    { key: "history", label: "History", component: AppointmentsStack },
    { key: "profile", label: "Profile", component: ProfileStack },
  ];

  return (
    <>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={() => (
          <PillTabBar
            tabs={tabItems.map((tab, index) => ({
              key: tab.key,
              label: tab.label,
              onPress: () => handleTabPress(index),
            }))}
            activeTabIndex={activeTabIndex}
            onTabPress={(index) => handleTabPress(index)}
          />
        )}
      >
        {tabItems.map((tab) => (
          <Tab.Screen key={tab.key} name={tab.key} component={tab.component} />
        ))}
      </Tab.Navigator>
    </>
  );
});

const AuthStack = memo(() => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
});

export const AppNavigator = memo(() => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const drawerItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      onPress: () => console.log("Profile"),
    },
    {
      id: "appointments",
      label: "My Appointments",
      icon: Calendar,
      onPress: () => console.log("Appointments"),
      badge: 2,
    },
    {
      id: "health",
      label: "Health Metrics",
      icon: Heart,
      onPress: () => console.log("Health"),
    },
    {
      id: "medications",
      label: "Medications",
      icon: Pill,
      onPress: () => console.log("Medications"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: User,
      onPress: () => console.log("Settings"),
      divider: true,
    },
    {
      id: "logout",
      label: "Logout",
      icon: User,
      onPress: () => setIsAuthenticated(false),
    },
  ];

  return (
    <ThemedNavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
      <GlassDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        items={drawerItems}
        userInfo={{
          name: "John Doe",
          email: "john.doe@example.com",
        }}
      />
    </ThemedNavigationContainer>
  );
});

AppNavigator.displayName = "AppNavigator";
HomeStack.displayName = "HomeStack";
AppointmentsStack.displayName = "AppointmentsStack";
ProfileStack.displayName = "ProfileStack";
MainTabs.displayName = "MainTabs";
AuthStack.displayName = "AuthStack";
