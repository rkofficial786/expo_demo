import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import sizer from "@/utils/sizer";
import { styles } from "./styles";

interface NormalHeaderProps {
  onSearchPress: () => void;
  onBackPress?: () => void;
  onOptionsPress?: () => void;
}

export const NormalHeader: React.FC<NormalHeaderProps> = ({
  onSearchPress,
  onBackPress,
  onOptionsPress,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerButton} onPress={onBackPress}>
        <Ionicons
          name="chevron-back"
          size={sizer.moderateScale(24)}
          color={Colors.mainWhite}
        />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>We recommend</Text>

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerButton} onPress={onOptionsPress}>
          <Ionicons
            name="options"
            size={sizer.moderateScale(24)}
            color={Colors.mainWhite}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={onSearchPress}>
          <Ionicons
            name="search"
            size={sizer.moderateScale(24)}
            color={Colors.mainWhite}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};