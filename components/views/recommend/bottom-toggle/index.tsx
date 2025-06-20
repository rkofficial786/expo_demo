import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Keyboard, 
  Platform, 
  Animated 
} from "react-native";
import { BlurView } from "expo-blur";
import { styles } from "./styles";

type ViewMode = "grid" | "list";

interface BottomToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isSearchActive?: boolean; // Optional prop to know if search is active
}

const BottomToggle: React.FC<BottomToggleProps> = ({
  viewMode,
  onViewModeChange,
  isSearchActive = false,
}) => {
  // Add a delay to prevent initial render issues with BlurView
  const [isReady, setIsReady] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  // Animated value for smooth transitions
  const bottomPosition = useState(new Animated.Value(40))[0];

  useEffect(() => {
    // Small delay to let the screen render completely before showing BlurView
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
        
        // Animate to position above keyboard
        Animated.timing(bottomPosition, {
          toValue: e.endCoordinates.height + 50, // 20px padding above keyboard
          duration: Platform.OS === 'ios' ? 250 : 200,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
        
        // Animate back to original position
        Animated.timing(bottomPosition, {
          toValue: 40, // Original bottom position
          duration: Platform.OS === 'ios' ? 250 : 200,
          useNativeDriver: false,
        }).start(() => {
          setKeyboardHeight(0);
        });
      }
    );

    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, [bottomPosition]);

  return (
    <Animated.View 
      style={[
        styles.bottomToggle,
        {
          bottom: bottomPosition,
        }
      ]}
    >
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
    </Animated.View>
  );
};

export default BottomToggle;