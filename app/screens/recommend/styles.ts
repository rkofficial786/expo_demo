import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/typography";
import sizer from "@/utils/sizer";

export const styles = StyleSheet.create({
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