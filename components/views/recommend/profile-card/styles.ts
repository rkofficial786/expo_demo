import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/typography";
import sizer from "@/utils/sizer";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Your original card styles - preserved exactly
  profileCard: {
    height: sizer.moderateScale(160),
    marginBottom: sizer.moderateScale(8),
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
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    padding: sizer.moderateScale(8),
  },
  profileInfo: {},
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
    marginRight: sizer.moderateScale(-2),
    maxWidth:"80%"
  },
  profileDistance: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.secondWhite,
  },
  
  // Card highlight border for long press
  cardBorderHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // borderWidth: 3,
    // borderColor: Colors.accentBlue,
    borderRadius: sizer.moderateScale(16),
    pointerEvents: "none",
  },
});