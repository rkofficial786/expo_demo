

import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/typography";
import sizer from "@/utils/sizer";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bottomToggle: {
    position: "absolute",
    bottom: sizer.moderateScale(80),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: sizer.horizontalScale(16),
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(23, 25, 29, 0.2)", // Slightly more opaque to reduce blur effect
    borderRadius: sizer.moderateScale(25),
    padding: sizer.moderateScale(4),
    overflow: "hidden",
  },
  blurBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  toggleButton: {
    backgroundColor: "transparent",
    paddingHorizontal: sizer.horizontalScale(28),
    paddingVertical: sizer.moderateScale(8),
    borderRadius: sizer.moderateScale(21),
    marginHorizontal: sizer.horizontalScale(2),
    minWidth: sizer.horizontalScale(90),
    alignItems: "center",
    zIndex: 1,
  },
  toggleButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly off-white to reduce contrast
    shadowColor: Colors.mainBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // For Android shadow
  },
  toggleText: {
    fontFamily: Typography.fonts.regular, // Changed to regular to reduce glow
    fontSize: Typography.sizes.lg,
    color: Colors.mainWhite,
  },
  toggleTextActive: {
    color: Colors.mainBlack,
    textShadowColor: "rgba(0, 0, 0, 0.1)", // Subtle shadow to define text
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
