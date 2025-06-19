import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { styles } from "./styles";

type ViewMode = "grid" | "list";

interface BottomToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const BottomToggle: React.FC<BottomToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <View style={styles.bottomToggle}>
      <View style={styles.toggleContainer}>
        {/* Blur Background for the entire toggle */}
        <BlurView
          intensity={20}
          style={styles.blurBackground}
          experimentalBlurMethod="dimezisBlurView"
        />

        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "grid" && styles.toggleButtonActive,
          ]}
          onPress={() => onViewModeChange("grid")}
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
          onPress={() => onViewModeChange("list")}
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
    </View>
  );
};
