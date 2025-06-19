import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/typography";
import { profilesData, Profile } from "@/data/profiles-data";
import sizer from "@/utils/sizer";

const { width } = Dimensions.get("window");
const cardWidth = (width - sizer.horizontalScale(48)) / 3; // 3 cards per row with responsive margins

export default function RecommendScreen() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const ProfileCard = ({ profile }: { profile: Profile }) => (
    <TouchableOpacity style={styles.profileCard} activeOpacity={0.8}>
      <Image source={{ uri: profile.imageUrl }} style={styles.profileImage} />
      <View style={styles.profileOverlay}>
        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.profileName} numberOfLines={1}>
              {profile.name}
            </Text>
            {profile.verified && (
              <Ionicons
                name="checkmark-circle"
                size={sizer.moderateScale(14)}
                color={Colors.accentBlue}
              />
            )}
          </View>
          <Text style={styles.profileDistance}>{profile.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.mainBlack} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons
            name="chevron-back"
            size={sizer.moderateScale(24)}
            color={Colors.mainWhite}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>We recommend</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons
              name="options"
              size={sizer.moderateScale(24)}
              color={Colors.mainWhite}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons
              name="search"
              size={sizer.moderateScale(24)}
              color={Colors.mainWhite}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileGrid}>
          {profilesData.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Toggle */}
      <View style={styles.bottomToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "grid" && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode("grid")}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === "grid" && styles.toggleTextActive,
            ]}
          >
            Grid
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "list" && styles.toggleButtonActive,
          ]}
          onPress={() => setViewMode("list")}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === "list" && styles.toggleTextActive,
            ]}
          >
            List
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBlack,

    paddingTop: sizer.horizontalScale(40),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: sizer.horizontalScale(8),
    paddingVertical: sizer.moderateScale(12),
    paddingTop: sizer.moderateScale(8),
  },
  headerButton: {
    width: sizer.moderateScale(40),
    height: sizer.moderateScale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.mainWhite,
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    flexDirection: "row",
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
  profileCard: {
    width: cardWidth,
    height: sizer.moderateScale(160),
    marginBottom: sizer.moderateScale(16),
    borderRadius: sizer.moderateScale(16),
    overflow: "hidden",
    backgroundColor: Colors.cards,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  profileOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    // background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    padding: sizer.moderateScale(8),
  },
  profileInfo: {
    
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: sizer.moderateScale(-6),
  },
  profileName: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.md,
    color: Colors.mainWhite,
    // flex: 1,
    marginRight: sizer.moderateScale(4),
  },
  profileDistance: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.secondWhite,
  },
  bottomToggle: {
    position: "absolute",
    bottom: sizer.moderateScale(40),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: sizer.horizontalScale(16),
  },
  toggleButton: {
    backgroundColor: Colors.cards,
    paddingHorizontal: sizer.horizontalScale(24),
    paddingVertical: sizer.moderateScale(12),
    borderRadius: sizer.moderateScale(20),
    marginHorizontal: sizer.horizontalScale(8),
    minWidth: sizer.horizontalScale(80),
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: Colors.mainWhite,
  },
  toggleText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.mainWhite,
  },
  toggleTextActive: {
    color: Colors.mainBlack,
  },
});
