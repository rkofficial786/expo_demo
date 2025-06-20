import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { styles } from "./styles";

type ViewMode = "grid" | "list";

interface BottomToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const BottomToggle: React.FC<BottomToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  // Add a delay to prevent initial render issues with BlurView
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to let the screen render completely before showing BlurView
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.bottomToggle}>
      <View style={styles.toggleContainer}>
        {/* Only render BlurView after initial delay */}
        {isReady && (
          <BlurView 
            intensity={15} 
            style={styles.blurBackground}
            experimentalBlurMethod="dimezisBlurView"
          />
        )}

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

export default BottomToggle;