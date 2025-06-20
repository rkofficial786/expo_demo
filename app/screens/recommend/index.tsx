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
  Animated,
  Image,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { profilesData, Profile } from "@/data/profiles-data";
import sizer from "@/utils/sizer";
import { SearchHeader } from "@/components/views/recommend/search-header";
import { NormalHeader } from "@/components/views/recommend/normal-header";
import { ProfileCard } from "@/components/views/recommend/profile-card";
import BottomToggle from "@/components/views/recommend/bottom-toggle";
import { Typography } from "@/constants/typography";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const cardWidth = (width - sizer.horizontalScale(48)) / 3;

type ViewMode = "grid" | "list";

function RecommendScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState(profilesData);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [activeCardData, setActiveCardData] = useState<any>(null);
  const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(
    null
  );
  const [activeButtonLabel, setActiveButtonLabel] = useState<string | null>(
    null
  );
  const [scrollOffset, setScrollOffset] = useState(0);

  const searchInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const buttonScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

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
    console.log("Profile pressed:", profile.name);
  };

  const handleBackPress = () => {
    console.log("Back pressed");
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleOptionsPress = () => {
    console.log("Options pressed");
  };

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    setScrollOffset(currentOffset);
  };

  const handleOverlayVisible = (
    visible: boolean,
    cardId: string,
    cardData?: any
  ) => {
    setIsOverlayVisible(visible);
    setActiveCardId(visible ? cardId : null);
    setActiveCardData(visible ? cardData : null);

    if (visible && cardData) {
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(buttonScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setActiveButtonIndex(null);
      setActiveButtonLabel(null);
    }
  };

  const handleActiveButtonChange = (
    buttonIndex: number | null,
    label: string | null
  ) => {
    setActiveButtonIndex(buttonIndex);
    setActiveButtonLabel(label);
  };

  // Calculate card position accounting for scroll offset and result count
  const getCardPosition = (index: number) => {
    const cardsPerRow = 3;
    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;

    const horizontalPadding = sizer.horizontalScale(16);

    let x;

    // Check if this row has exactly 2 cards (for search results)
    const cardsInCurrentRow = Math.min(
      cardsPerRow,
      filteredProfiles.length - row * cardsPerRow
    );

    if (cardsInCurrentRow === 2) {
      // For exactly 2 cards, use flex-start style positioning with consistent gap
      const gap = sizer.horizontalScale(16);
      x = horizontalPadding + col * (cardWidth + gap);
    } else {
      // For 1, 3+ cards, use space-between style positioning
      const cardSpacing =
        cardsInCurrentRow === 1
          ? 0
          : (width - horizontalPadding * 2 - cardWidth * cardsInCurrentRow) /
            (cardsInCurrentRow - 1);
      x = horizontalPadding + col * (cardWidth + cardSpacing);
    }

    const headerHeight = sizer.moderateScale(110);
    const cardHeight = sizer.moderateScale(160);
    const cardMarginBottom = sizer.moderateScale(8);

    const y =
      headerHeight + row * (cardHeight + cardMarginBottom) - scrollOffset;

    return { x, y };
  };

  const globalPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: () => isOverlayVisible,

    onPanResponderMove: (evt, gestureState) => {
      if (isOverlayVisible && activeCardData) {
        const buttonsCenterX =
          activeCardData.cardPosition.x + activeCardData.cardWidth / 2 - 30;
        const buttonsCenterY =
          activeCardData.cardPosition.y + sizer.moderateScale(80);

        const fingerX = evt.nativeEvent.pageX - buttonsCenterX;
        const fingerY = evt.nativeEvent.pageY - buttonsCenterY;

        const buttonRadius = sizer.moderateScale(50);
        let buttonIndex = null;

        for (let i = 0; i < activeCardData.floatingButtons.length; i++) {
          const buttonPos = activeCardData.getButtonPosition(
            i,
            activeCardData.floatingButtons.length
          );
          const distance = Math.sqrt(
            Math.pow(fingerX - buttonPos.x, 2) +
              Math.pow(fingerY - buttonPos.y, 2)
          );

          if (distance <= buttonRadius) {
            buttonIndex = i;
            break;
          }
        }

        if (buttonIndex !== activeButtonIndex) {
          const label =
            buttonIndex !== null
              ? activeCardData.floatingButtons[buttonIndex].label
              : null;
          handleActiveButtonChange(buttonIndex, label);
        }
      }
    },

    onPanResponderRelease: () => {
      if (isOverlayVisible) {
        if (activeButtonIndex !== null && activeCardData) {
          activeCardData.floatingButtons[activeButtonIndex].action();
        }
        handleOverlayVisible(false, "");
      }
    },

    onPanResponderTerminate: () => {
      if (isOverlayVisible) {
        handleOverlayVisible(false, "");
      }
    },
  });

  // Helper function to get grid style based on result count
  const getGridStyle = () => {
    const totalResults = filteredProfiles.length;

    // If total results is exactly 2, use flex-start
    if (totalResults === 2 || totalResults === 5) {
      return [
        styles.profileGrid,
        styles.profileGridFlexStart,
        { gap: totalResults == 5 ?sizer.horizontalScale(4)  :sizer.horizontalScale(12) },
      ];
    }

    // For all other cases (1, 3, 4, 5+), use space-between
    return styles.profileGrid;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header */}
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

      <View style={{ flex: 1 }} {...globalPanResponder.panHandlers}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!isOverlayVisible}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={getGridStyle()}>
            {filteredProfiles.map((profile, index) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                cardWidth={cardWidth}
                onPress={handleProfilePress}
                onOverlayVisible={handleOverlayVisible}
                onActiveButtonChange={handleActiveButtonChange}
                cardPosition={getCardPosition(index)}
                isActiveCard={activeCardId === profile.id}
              />
            ))}
          </View>

          {filteredProfiles.length === 0 && searchQuery.length > 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No profiles found for "{searchQuery}"
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Global overlay */}
      {isOverlayVisible && (
        <View style={styles.globalOverlay} pointerEvents="none" />
      )}

      {/* Active card highlight */}
      {isOverlayVisible && activeCardData && (
        <View
          style={[
            styles.activeCardContainer,
            {
              top: activeCardData.cardPosition.y,
              left: activeCardData.cardPosition.x,
              width: activeCardData.cardWidth,
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.activeCard}>
            <Image
              source={{ uri: activeCardData.profile.imageUrl }}
              style={styles.activeCardImage}
            />
            <View style={styles.activeCardOverlay}>
              <View style={styles.activeCardInfo}>
                <View style={styles.activeCardNameContainer}>
                  <Text style={styles.activeCardName} numberOfLines={1}>
                    {activeCardData.profile.name}
                  </Text>
                  {activeCardData.profile.verified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={sizer.moderateScale(10)}
                      color={Colors.accentBlue}
                    />
                  )}
                </View>
                <Text style={styles.activeCardDistance}>
                  {activeCardData.profile.distance}
                </Text>
              </View>
            </View>
            <View style={styles.activeCardBorder} />
          </View>
        </View>
      )}

      {/* Dynamic text label */}
      {isOverlayVisible && activeCardData && (
        <View
          style={[
            styles.floatingButtonsContainer,
            {
              top: activeCardData.cardPosition.y + sizer.moderateScale(2),
              left:
                activeCardData.cardPosition.x + activeCardData.cardWidth / 2,
            },
          ]}
          pointerEvents="none"
        >
          {[1].map((button: any, index: number) => {
            const buttonPos = activeCardData.getButtonPosition(
              index,
              activeCardData.floatingButtons.length
            );
            const isActive = activeButtonIndex === index;

            return (
              <Animated.View
                key={button.id}
                style={[
                  styles.dynamicTextContainer,
                  {
                    transform: [
                      { translateX: buttonPos.x },
                      { translateY: buttonPos.y },
                      // { scale: isActive ? 1.3 : 1 },
                    ],
                    backgroundColor: "transparent",
                    opacity: 1,
                  },
                ]}
              >
                <Text style={styles.dynamicText}>
                  {activeButtonLabel || ""}
                </Text>
              </Animated.View>
            );
          })}
        </View>
      )}

      {/* Center dot */}
      {isOverlayVisible && activeCardData && (
        <View
          style={[
            styles.centerDotContainer,
            {
              top: activeCardData.cardPosition.y + sizer.moderateScale(160) / 2,
              left:
                activeCardData.cardPosition.x + activeCardData.cardWidth / 2,
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.centerDot} />
        </View>
      )}

      {/* Floating action buttons */}
      {isOverlayVisible && activeCardData && (
        <View
          style={[
            styles.floatingButtonsContainer,
            {
              top: activeCardData.cardPosition.y + sizer.moderateScale(80),
              left:
                activeCardData.cardPosition.x +
                activeCardData.cardWidth / 2 +
                (activeCardData.shouldShowOnLeft() ? -30 : 30),
            },
          ]}
          pointerEvents="none"
        >
          {activeCardData.floatingButtons.map((button: any, index: number) => {
            const buttonPos = activeCardData.getButtonPosition(
              index,
              activeCardData.floatingButtons.length
            );
            const isActive = activeButtonIndex === index;

            return (
              <Animated.View
                key={button.id}
                style={[
                  styles.floatingButton,
                  {
                    transform: [
                      { scale: buttonScale },
                      { translateX: buttonPos.x },
                      { translateY: buttonPos.y },
                      { scale: isActive ? 1.1 : 1 },
                    ],
                    backgroundColor: isActive
                      ? Colors.accentBlue
                      : button.color,
                    opacity: isActive ? 1 : 0.9,
                  },
                ]}
              >
                <Ionicons
                  name={button.icon}
                  size={sizer.moderateScale(26)}
                  color={Colors.mainWhite}
                />
              </Animated.View>
            );
          })}
        </View>
      )}

      {/* Bottom toggle */}
      <BottomToggle
        viewMode={viewMode}
        onViewModeChange={(view) => setViewMode(view)}
        isSearchActive={isSearchActive} // Pass the search state
      />
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
    justifyContent: "space-between", // Default for 1, 3+ cards
  },
  profileGridFlexStart: {
    justifyContent: "flex-start", // Only for exactly 2 cards
    // gap: sizer.horizontalScale(4),
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
  globalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    zIndex: 900,
  },
  activeCardContainer: {
    position: "absolute",
    zIndex: 1000,
  },
  activeCard: {
    height: sizer.moderateScale(160),
    borderRadius: sizer.moderateScale(16),
    overflow: "hidden",
  },
  activeCardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  activeCardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    padding: sizer.moderateScale(8),
  },
  activeCardInfo: {},
  activeCardNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: sizer.moderateScale(-6),
  },
  activeCardName: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.md,
    color: Colors.mainWhite,
    // marginRight: sizer.moderateScale(4),
    maxWidth: "80%",
  },
  activeCardDistance: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.secondWhite,
  },
  activeCardBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: sizer.moderateScale(16),
  },
  dynamicTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1150,
    marginLeft: -sizer.moderateScale(50),
  },
  dynamicText: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: sizer.fontScale(26),
    color: Colors.mainWhite,
    paddingHorizontal: sizer.moderateScale(16),
    paddingVertical: sizer.moderateScale(8),
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: sizer.moderateScale(20),
    overflow: "hidden",
    textAlign: "center",
    minWidth: sizer.moderateScale(100),
  },
  floatingButtonsContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1100,
  },
  floatingButton: {
    position: "absolute",
    width: sizer.moderateScale(56),
    height: sizer.moderateScale(56),
    borderRadius: sizer.moderateScale(28),
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    shadowColor: Colors.mainBlack,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  centerDotContainer: {
    position: "absolute",
    zIndex: 1050,
    width: sizer.moderateScale(8),
    height: sizer.moderateScale(8),
    marginLeft: -sizer.moderateScale(4),
    marginTop: -sizer.moderateScale(4),
    justifyContent: "center",
    alignItems: "center",
  },
  centerDot: {
    width: sizer.moderateScale(50),
    height: sizer.moderateScale(50),
    borderRadius: sizer.moderateScale(100),
    // backgroundColor: "green",
    borderWidth: 2,
    borderColor: Colors.secondWhite,
    opacity: 1,
  },
});

export default RecommendScreen;
