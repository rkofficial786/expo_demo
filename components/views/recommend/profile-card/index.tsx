import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  PanResponder,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/Colors";
import { Profile } from "@/data/profiles-data";
import sizer from "@/utils/sizer";
import { styles } from "./styles";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface FloatingButton {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  action: () => void;
}

interface ProfileCardProps {
  profile: Profile;
  cardWidth: number;
  onPress?: (profile: Profile) => void;
  onOverlayVisible?: (visible: boolean, cardId: string, cardData?: any) => void;
  onActiveButtonChange?: (activeIndex: number | null, label: string | null) => void;
  cardPosition: { x: number; y: number };
  isActiveCard?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  cardWidth, 
  onPress,
  onOverlayVisible,
  onActiveButtonChange,
  cardPosition,
  isActiveCard = false
}) => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(null);
  const cardHighlight = useRef(new Animated.Value(0)).current;
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Track initial touch position and movement
  const initialTouch = useRef({ x: 0, y: 0 });
  const hasMovedSignificantly = useRef(false);
  
  // Define floating action buttons with labels
  const floatingButtons: FloatingButton[] = [
    {
      id: "message",
      icon: "chatbubble",
      color: Colors.whiteHint,
      label: "Message",
      action: () => console.log("Message", profile.name)
    },
    {
      id: "follow",
      icon: "person-add",
      color: Colors.whiteHint,
      label: "Follow",
      action: () => console.log("Follow", profile.name)
    },
    {
      id: "share",
      icon: "share",
      color: Colors.whiteHint,
      label: "Share",
      action: () => console.log("Share", profile.name)
    }
  ];

  // Smart positioning: calculate if buttons should appear on left or right
  const shouldShowOnLeft = () => {
    const spaceOnLeft = cardPosition.x;
    const spaceOnRight = screenWidth - (cardPosition.x + cardWidth);
    const requiredSpace = sizer.moderateScale(120);
    
    if (spaceOnLeft >= requiredSpace) {
      return true;
    } else if (spaceOnRight >= requiredSpace) {
      return false;
    } else {
      return spaceOnLeft > spaceOnRight;
    }
  };

  // Calculate button positions based on available space
  const getButtonPosition = (index: number, total: number) => {
    const radius = sizer.moderateScale(90);
    const spacing = sizer.moderateScale(65);
    const startY = -(total - 1) * spacing / 2;
    const isLeft = shouldShowOnLeft();
    
    // Special positioning for middle button (index 1)
    let xOffset = isLeft ? -radius : radius;
    if (index === 1) {
      // Give middle button extra left distance
      xOffset = isLeft ? -radius - sizer.moderateScale(30) : radius + sizer.moderateScale(20);
    }
    
    return {
      x: xOffset,
      y: startY + (index * spacing),
    };
  };

  // ONLY FIX: Better gesture detection - larger radius for easier detection
  const getButtonUnderFinger = (gestureX: number, gestureY: number) => {
    const buttonRadius = sizer.moderateScale(50); // Increased from 30 to 50 for better detection
    
    for (let i = 0; i < floatingButtons.length; i++) {
      const buttonPos = getButtonPosition(i, floatingButtons.length);
      const distance = Math.sqrt(
        Math.pow(gestureX - buttonPos.x, 2) + Math.pow(gestureY - buttonPos.y, 2)
      );
      
      if (distance <= buttonRadius) {
        return i;
      }
    }
    return null;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    
    // KEY FIX: Only set pan responder if not moving significantly and not already long pressing
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If user is moving more than 10 pixels and not long pressing, don't capture
      if (distance > 10 && !isLongPressing) {
        return false;
      }
      
      // If already long pressing, we want to capture movement
      return isLongPressing;
    },
    
    onPanResponderGrant: (evt) => {
      // Store initial touch position
      initialTouch.current = {
        x: evt.nativeEvent.pageX,
        y: evt.nativeEvent.pageY
      };
      hasMovedSignificantly.current = false;
      
      // Start long press timer
      longPressTimer.current = setTimeout(() => {
        // Only trigger if user hasn't moved significantly
        if (!hasMovedSignificantly.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          
          setIsLongPressing(true);
          // Pass card data with button info and active button callback
          onOverlayVisible?.(true, profile.id, { 
            cardPosition, 
            cardWidth, 
            profile,
            floatingButtons,
            getButtonPosition,
            shouldShowOnLeft,
            onActiveButtonChange
          });
          
          // Animate card highlight
          Animated.timing(cardHighlight, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      }, 500); // Increased timeout to 500ms for better scroll detection
    },
    
    onPanResponderMove: (evt, gestureState) => {
      const { dx, dy } = gestureState;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // ONLY cancel long press if we're NOT already long pressing
      if (!isLongPressing) {
        // Check if user has moved significantly since initial touch
        if (distance > 15) {
          hasMovedSignificantly.current = true;
          
          // Cancel long press timer if user is scrolling
          if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
          }
          return;
        }
      } else {
        // We ARE long pressing - handle floating button detection
        const fingerX = gestureState.dx;
        const fingerY = gestureState.dy;
        const buttonIndex = getButtonUnderFinger(fingerX, fingerY);
        
        // Update active button immediately when finger moves
        if (buttonIndex !== activeButtonIndex) {
          if (buttonIndex !== null) {
            Haptics.selectionAsync();
          }
          setActiveButtonIndex(buttonIndex);
          
          // Update parent component with active button info
          const label = buttonIndex !== null ? floatingButtons[buttonIndex].label : null;
          onActiveButtonChange?.(buttonIndex, label);
        }
      }
    },
    
    onPanResponderRelease: () => {
      // Always clear the timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      
      if (isLongPressing) {
        // Execute action if a button was selected
        if (activeButtonIndex !== null) {
          floatingButtons[activeButtonIndex].action();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Reset active button
        setActiveButtonIndex(null);
        onActiveButtonChange?.(null, null);
        
        // Hide overlay and reset card highlight
        Animated.timing(cardHighlight, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start(() => {
          setIsLongPressing(false);
          onOverlayVisible?.(false, profile.id);
        });
      } else if (!hasMovedSignificantly.current) {
        // Regular tap (only if user didn't move significantly)
        onPress?.(profile);
      }
      
      // Reset tracking variables
      hasMovedSignificantly.current = false;
    },
    
    // KEY FIX: Handle termination properly (when scroll view takes over)
    onPanResponderTerminate: () => {
      // Clear timer and reset state when gesture is terminated by parent (scroll)
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      
      // ONLY reset if we're not already long pressing
      // If we are long pressing, let the user continue their gesture
      if (!isLongPressing) {
        hasMovedSignificantly.current = false;
      }
    },
  });

  return (
    <Animated.View
      style={[
        styles.profileCard, 
        { 
          width: cardWidth,
        }
      ]}
      {...panResponder.panHandlers}
    >
      <Image source={{ uri: profile.imageUrl }} style={styles.profileImage} />
      
      {/* Add blue border highlight */}
      <Animated.View
        style={[
          styles.cardBorderHighlight,
          {
            opacity: cardHighlight,
          }
        ]}
      />
      
      <View style={styles.profileOverlay}>
        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.profileName} numberOfLines={1}>
              {profile.name}
            </Text>
            {profile.verified && (
              <Ionicons
                name="checkmark-circle"
                size={sizer.moderateScale(10)}
                color={Colors.accentBlue}
              />
            )}
          </View>
          <Text style={styles.profileDistance}>{profile.distance}</Text>
        </View>
      </View>
    </Animated.View>
  );
};