import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/typography";
import sizer from "@/utils/sizer";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: sizer.horizontalScale(12),
    paddingVertical: sizer.moderateScale(12),
    gap: sizer.horizontalScale(12),
    height:sizer.horizontalScale(70)
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.cards,
    borderRadius: sizer.moderateScale(25),
    paddingHorizontal: sizer.horizontalScale(12),
    paddingVertical: sizer.horizontalScale(8),
  },
  searchIcon: {
    marginRight: sizer.horizontalScale(8),
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.mainWhite,
    padding: 0,
  },
  clearButton: {
    padding: sizer.moderateScale(4),
    marginLeft: sizer.horizontalScale(8),
  },
  cancelButton: {
    paddingVertical: sizer.moderateScale(12),
    paddingHorizontal: sizer.horizontalScale(8),
  },
  cancelText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.mainWhite,
  },
});