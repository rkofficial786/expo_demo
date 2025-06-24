import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/typography";
import sizer from "@/utils/sizer";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: sizer.horizontalScale(8),
    paddingVertical: sizer.moderateScale(12),
    paddingTop: sizer.moderateScale(12),
    height: sizer.horizontalScale(70),
  },
  headerButton: {
    width: sizer.moderateScale(40),
    height: sizer.moderateScale(40),
    alignItems: "center",
    justifyContent: "center",
  },

  headerLeft: {
    width: sizer.horizontalScale(80),
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
    width: sizer.horizontalScale(80),
  },
});
