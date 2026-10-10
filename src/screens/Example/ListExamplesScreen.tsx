"use client";

import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  User,
  Settings,
  AlertCircle,
  Package,
  FileText,
} from "lucide-react-native";
import { useState, useCallback, memo } from "react";

import { useToastContext } from "@/components/providers/ToastProvider";
import { Box } from "@/components/ui/core";
import {
  GlassScrollView,
  GlassFlatList,
  GlassSectionList,
  ListItem,
  ListSection,
  EmptyState,
  ListDivider,
} from "@/components/ui/lists";
import { SearchBar } from "@/components/ui/molecules/SearchBar";
import { GlassHeader } from "@/components/ui/navigation/GlassHeader";
import { GlassTabBar } from "@/components/ui/navigation/GlassTabBar";
import { useThemeStore } from "@/stores/themeStore";

// Mock data for examples
const mockItems = Array.from({ length: 20 }, (_, i) => ({
  id: `item-${i}`,
  title: `Item ${i + 1}`,
  subtitle: `This is item number ${i + 1}`,
  description:
    i % 3 === 0 ? `Additional description for item ${i + 1}` : undefined,
}));

const mockSections = [
  {
    title: "Today",
    data: mockItems.slice(0, 3),
  },
  {
    title: "Yesterday",
    data: mockItems.slice(3, 8),
  },
  {
    title: "Last Week",
    data: mockItems.slice(8, 15),
  },
];

const tabItems = [
  { id: "scroll", label: "ScrollView", icon: FileText },
  { id: "flat", label: "FlatList", icon: Package },
  { id: "section", label: "SectionList", icon: Calendar },
];

export const ListExamplesScreen = memo(() => {
  const { theme } = useThemeStore();
  const { showInfo } = useToastContext();

  const [activeTab, setActiveTab] = useState("scroll");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleTabPress = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleItemPress = useCallback(
    (item: any) => {
      showInfo("Item Selected", `You selected ${item.title}`);
    },
    [showInfo]
  );

  const renderScrollViewExample = () => (
    <GlassScrollView
      spacing="m"
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >
      <ListSection title="Basic List Items" variant="minimal">
        <ListItem
          title="Default List Item"
          subtitle="With subtitle"
          onPress={() => showInfo("Pressed", "Default item pressed")}
          showChevron
        />
        <ListItem
          title="With Left Icon"
          subtitle="Icon on the left side"
          leftIcon={<User size={20} color={theme.colors.primary} />}
          onPress={() => showInfo("Pressed", "Left icon item pressed")}
          showChevron
        />
        <ListItem
          title="With Badge"
          subtitle="Shows count or status"
          badge={5}
          onPress={() => showInfo("Pressed", "Badge item pressed")}
          showChevron
        />
      </ListSection>

      <ListDivider />

      <ListSection title="Glass Variants" variant="glass">
        <Box p="m">
          <ListItem
            title="Glass List Item"
            subtitle="With glassmorphic effect"
            variant="glass"
            onPress={() => showInfo("Pressed", "Glass item pressed")}
            showChevron
          />
          <ListItem
            title="Glass with Icon"
            subtitle="Combines glass and icon"
            variant="glass"
            leftIcon={<Settings size={20} color={theme.colors.primary} />}
            onPress={() => showInfo("Pressed", "Glass icon item pressed")}
            showChevron
          />
        </Box>
      </ListSection>

      <ListSection title="Card Variants" variant="card">
        <Box p="m">
          <ListItem
            title="Card List Item"
            subtitle="With card styling"
            variant="card"
            onPress={() => showInfo("Pressed", "Card item pressed")}
            showChevron
          />
          <ListItem
            title="Card with Description"
            subtitle="Subtitle goes here"
            description="This is a longer description that can span multiple lines and provide more detailed information about this particular item."
            variant="card"
            onPress={() => showInfo("Pressed", "Card description item pressed")}
            showChevron
          />
        </Box>
      </ListSection>

      <ListDivider variant="spacer" spacing="m" />

      <EmptyState
        variant="glass"
        title="Empty State Example"
        message="This is how empty states look when there's no data to display"
        icon={<AlertCircle color={theme.colors.textSecondary} />}
        actionLabel="Take Action"
        onAction={() => showInfo("Action", "Empty state action triggered")}
      />

      <Box height={100} />
    </GlassScrollView>
  );

  const renderFlatListExample = () => (
    <GlassFlatList
      data={mockItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )}
      spacing="m"
      itemSpacing="xs"
      refreshing={refreshing}
      onRefresh={handleRefresh}
      showSeparators
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <ListSection
          title="FlatList Example"
          subtitle="Showing all items"
          variant="minimal"
        />
      }
      ListEmptyComponent={
        <EmptyState
          variant="minimal"
          title="No Results"
          message="No items match your search criteria"
          icon={<Search color={theme.colors.textSecondary} />}
        />
      }
      renderItem={({ item }) => (
        <ListItem
          title={item.title}
          subtitle={item.subtitle}
          description={item.description}
          variant="card"
          onPress={() => handleItemPress(item)}
          showChevron
        />
      )}
    />
  );

  const renderSectionListExample = () => (
    <GlassSectionList
      sections={mockSections.map((section) => ({
        ...section,
        data: section.data.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))}
      spacing="m"
      itemSpacing="xs"
      sectionSpacing="m"
      refreshing={refreshing}
      onRefresh={handleRefresh}
      stickySectionHeadersEnabled
      sectionStyle="glass"
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <EmptyState
          variant="minimal"
          title="No Results"
          message="No items match your search criteria"
          icon={<Search color={theme.colors.textSecondary} />}
        />
      }
      renderItem={({ item }) => (
        <ListItem
          title={item.title}
          subtitle={item.subtitle}
          description={item.description}
          variant="default"
          onPress={() => handleItemPress(item)}
          showChevron
        />
      )}
    />
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "flat":
        return renderFlatListExample();
      case "section":
        return renderSectionListExample();
      default:
        return renderScrollViewExample();
    }
  };

  return (
    <Box flex1 backgroundColor="backgroundPrimary">
      {/* Header */}
      <GlassHeader
        title="List Components"
        leftIcon={<ArrowLeft size={24} color={theme.colors.textPrimary} />}
        rightIcon={<Filter size={24} color={theme.colors.textPrimary} />}
        onLeftPress={() => showInfo("Navigation", "Going back")}
        onRightPress={() => showInfo("Filter", "Opening filter options")}
      />

      {/* Search Bar */}
      <Box px="m" py="s">
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          onClear={() => setSearchQuery("")}
          placeholder="Search items..."
        />
      </Box>

      {/* Content */}
      <Box flex1>{renderActiveTab()}</Box>

      {/* Tab Bar */}
      <GlassTabBar
        tabs={tabItems}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </Box>
  );
});

ListExamplesScreen.displayName = "ListExamplesScreen";
