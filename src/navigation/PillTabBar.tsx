"use client";

import type React from "react";

import { BlurView } from "@react-native-community/blur";
import { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeStore } from "@/stores/themeStore";

type TabItem = {
  key: string;
  label: string;
  onPress: () => void;
};

type PillTabBarProps = {
  tabs: TabItem[];
  activeTabIndex: number;
  onTabPress: (index: number) => void;
};

export const PillTabBar: React.FC<PillTabBarProps> = ({
  tabs,
  activeTabIndex,
  onTabPress,
}) => {
  const { theme, isDark } = useThemeStore();
  const insets = useSafeAreaInsets();
  const animatedValue = useRef(new Animated.Value(activeTabIndex)).current;
  const tabWidth = (Dimensions.get("window").width - 40) / tabs.length;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: activeTabIndex,
      useNativeDriver: true,
      friction: 8,
      tension: 70,
    }).start();
  }, [activeTabIndex, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, tabWidth, tabWidth * 2],
  });

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      <View
        style={[
          styles.tabBarContainer,
          { backgroundColor: theme.colors.glassBackgroundStrong },
        ]}
      >
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={isDark ? "dark" : "light"}
          blurAmount={15}
          reducedTransparencyFallbackColor={theme.colors.glassBackgroundStrong}
        />

        {/* Animated highlight */}
        <Animated.View
          style={[
            styles.activeTabBackground,
            {
              width: tabWidth,
              backgroundColor: theme.colors.primary,
              transform: [{ translateX }],
            },
          ]}
        />

        {/* Tab buttons */}
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTabIndex === index
                      ? "white"
                      : theme.colors.textSecondary,
                  fontWeight: activeTabIndex === index ? "600" : "400",
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  tabBarContainer: {
    flexDirection: "row",
    borderRadius: 30,
    height: 56,
    width: "90%",
    marginHorizontal: 20,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    zIndex: 1,
  },
  tabText: {
    fontSize: 16,
    textAlign: "center",
  },
  activeTabBackground: {
    position: "absolute",
    height: "80%",
    borderRadius: 25,
    zIndex: 0,
  },
});
