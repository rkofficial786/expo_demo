import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Dimensions,
  SafeAreaView,
  TextInput,
  Keyboard,
  StyleSheet,
} from "react-native";
import { profilesData, Profile } from "@/data/profiles-data";
import sizer from "@/utils/sizer";
import { SearchHeader } from "@/components/views/recommend/search-header";
import { NormalHeader } from "@/components/views/recommend/normal-header";
import { ProfileCard } from "@/components/views/recommend/profile-card";
import BottomToggle from "@/components/views/recommend/bottom-toggle";
import { Typography } from "@/constants/typography";
import { Colors } from "@/constants/Colors";


const { width } = Dimensions.get("window");
const cardWidth = (width - sizer.horizontalScale(48)) / 3; // 3 cards per row with responsive margins

type ViewMode = "grid" | "list";

function RecommendScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState(profilesData);
  const searchInputRef = useRef<TextInput>(null);

  // Filter profiles based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProfiles(profilesData);
    } else {
      const filtered = profilesData.filter((profile) =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProfiles(filtered);
    }
  }, [searchQuery]);

  const handleSearchPress = () => {
    setIsSearchActive(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleCancelSearch = () => {
    setIsSearchActive(false);
    setSearchQuery("");
    Keyboard.dismiss();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  const handleProfilePress = (profile: Profile) => {
    // Handle profile press - navigate to profile details
    console.log("Profile pressed:", profile.name);
  };

  const handleBackPress = () => {
    // Handle back navigation
    console.log("Back pressed");
  };

  const handleOptionsPress = () => {
    // Handle options menu
    console.log("Options pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header - switches between normal and search */}
      {isSearchActive ? (
        <SearchHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCancel={handleCancelSearch}
          onClear={handleClearSearch}
          searchInputRef={searchInputRef}
        />
      ) : (
        <NormalHeader
          onSearchPress={handleSearchPress}
          onBackPress={handleBackPress}
          onOptionsPress={handleOptionsPress}
        />
      )}

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.profileGrid}>
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              cardWidth={cardWidth}
              onPress={handleProfilePress}
            />
          ))}
        </View>

        {/* Show no results message */}
        {filteredProfiles.length === 0 && searchQuery.length > 0 && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              No profiles found for "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Toggle - hide when searching */}
      {!isSearchActive && (
        <BottomToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBlack,
    paddingTop: sizer.horizontalScale(40),
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: sizer.horizontalScale(16),
    paddingBottom: sizer.moderateScale(100),
  },
  profileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: sizer.moderateScale(40),
  },
  noResultsText: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.secondWhite,
    textAlign: "center",
  },
});

export default RecommendScreen;
