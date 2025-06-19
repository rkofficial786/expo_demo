import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/typography";
import sizer from "@/utils/sizer";

export const styles = StyleSheet.create({
  bottomToggle: {
    position: "absolute",
    bottom: sizer.moderateScale(40),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: sizer.horizontalScale(16),
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(23, 25, 29, 0.1)", // Semi-transparent background
    borderRadius: sizer.moderateScale(25),
    padding: sizer.moderateScale(4), // Small padding around the buttons
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden", // Important for BlurView
  },
  blurBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  toggleButton: {
    backgroundColor: "transparent", // Transparent by default
    paddingHorizontal: sizer.horizontalScale(28),
    paddingVertical: sizer.moderateScale(8),
    borderRadius: sizer.moderateScale(21),
    marginHorizontal: sizer.horizontalScale(2),
    minWidth: sizer.horizontalScale(90),
    alignItems: "center",
    zIndex: 1, // Ensure buttons are above blur
  },
  toggleButtonActive: {
    backgroundColor: Colors.mainWhite, 
  },
  toggleText: {
    fontFamily: Typography.fonts.semiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.mainWhite,
  },
  toggleTextActive: {
    color: Colors.mainBlack,
  },
});