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
  const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(null);
  const searchInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const buttonScale = useRef(new Animated.Value(0)).current;

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
  };

  const handleOptionsPress = () => {
    console.log("Options pressed");
  };

  const handleOverlayVisible = (visible: boolean, cardId: string, cardData?: any) => {
    setIsOverlayVisible(visible);
    setActiveCardId(visible ? cardId : null);
    setActiveCardData(visible ? cardData : null);
    
    if (visible && cardData) {
      // Animate floating buttons
      Animated.spring(buttonScale, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      // Hide floating buttons
      Animated.timing(buttonScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  // Calculate card position in screen coordinates
  const getCardPosition = (index: number) => {
    const cardsPerRow = 3;
    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    
    const horizontalPadding = sizer.horizontalScale(16);
    const cardSpacing = (width - horizontalPadding * 2 - cardWidth * cardsPerRow) / (cardsPerRow - 1);
    
    const x = horizontalPadding + col * (cardWidth + cardSpacing);
    const y = row * (sizer.moderateScale(160) + sizer.moderateScale(16)) + sizer.moderateScale(100);
    
    return { x, y };
  };

  // Handle gesture movement for floating buttons
  const handleGestureMove = (gestureX: number, gestureY: number) => {
    if (!activeCardData) return;
    
    const buttonRadius = sizer.moderateScale(30);
    let newActiveIndex = null;
    
    for (let i = 0; i < activeCardData.floatingButtons.length; i++) {
      const buttonPos = activeCardData.getButtonPosition(i, activeCardData.floatingButtons.length);
      const distance = Math.sqrt(
        Math.pow(gestureX - buttonPos.x, 2) + Math.pow(gestureY - buttonPos.y, 2)
      );
      
      if (distance <= buttonRadius) {
        newActiveIndex = i;
        break;
      }
    }
    
    setActiveButtonIndex(newActiveIndex);
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

      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!isOverlayVisible}
      >
        <View style={styles.profileGrid}>
          {filteredProfiles.map((profile, index) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              cardWidth={cardWidth}
              onPress={handleProfilePress}
              onOverlayVisible={handleOverlayVisible}
              cardPosition={getCardPosition(index)}
              isActiveCard={activeCardId === profile.id}
            />
          ))}
        </View>

        {/* No results message */}
        {filteredProfiles.length === 0 && searchQuery.length > 0 && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              No profiles found for "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Global overlay - covers everything */}
      {isOverlayVisible && (
        <View style={styles.globalOverlay} pointerEvents="none" />
      )}

      {/* Active card rendered above overlay */}
      {isOverlayVisible && activeCardData && (
        <View
          style={[
            styles.activeCardContainer,
            {
              top: activeCardData.cardPosition.y,
              left: activeCardData.cardPosition.x,
              width: activeCardData.cardWidth,
            }
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
                      size={sizer.moderateScale(14)}
                      color={Colors.accentBlue}
                    />
                  )}
                </View>
                <Text style={styles.activeCardDistance}>
                  {activeCardData.profile.distance}
                </Text>
              </View>
            </View>
            {/* Blue border highlight */}
            <View style={styles.activeCardBorder} />
          </View>
        </View>
      )}

      {/* Floating buttons above everything */}
      {isOverlayVisible && activeCardData && (
        <View
          style={[
            styles.floatingButtonsContainer,
            {
              top: activeCardData.cardPosition.y + sizer.moderateScale(80),
              left: activeCardData.cardPosition.x + activeCardData.cardWidth / 2 -30,
            }
          ]}
          pointerEvents="none"
        >
          {activeCardData.floatingButtons.map((button: any, index: number) => {
            const buttonPos = activeCardData.getButtonPosition(index, activeCardData.floatingButtons.length);
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
                      { scale: isActive ? 1.3 : 1 },
                    ],
                    backgroundColor: button.color,
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
          
          {/* Center dot */}
          <View style={styles.centerIndicator}>
            <View style={styles.centerDot} />
          </View>
        </View>
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
  
  // Global overlay - covers all original content
  globalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 900,
  },
  
  // Active card rendered above overlay
  activeCardContainer: {
    position: "absolute",
    zIndex: 1000,
  },
  activeCard: {
    height: sizer.moderateScale(160),
    borderRadius: sizer.moderateScale(16),
    overflow: "hidden",
    // backgroundColor: Colors.cards,
    // shadowColor: Colors.accentBlue,
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.8,
    // shadowRadius: 20,
    // elevation: 15,
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
    marginRight: sizer.moderateScale(4),
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
    // borderWidth: 3,
    // borderColor: Colors.accentBlue,
    borderRadius: sizer.moderateScale(16),
  },
  
  // Floating buttons above everything
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
  centerIndicator: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  centerDot: {
    width: sizer.moderateScale(0),
    height: sizer.moderateScale(0),
    borderRadius: sizer.moderateScale(3),
    backgroundColor: Colors.mainWhite,
    opacity: 0.6,
  },
});

export default RecommendScreen;