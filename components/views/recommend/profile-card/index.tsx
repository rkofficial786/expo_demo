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
  action: () => void;
}

interface ProfileCardProps {
  profile: Profile;
  cardWidth: number;
  onPress?: (profile: Profile) => void;
  onOverlayVisible?: (visible: boolean, cardId: string, cardRef?: any) => void;
  cardPosition: { x: number; y: number };
  isActiveCard?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  cardWidth, 
  onPress,
  onOverlayVisible,
  cardPosition,
  isActiveCard = false
}) => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(null);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0)).current;
  const cardHighlight = useRef(new Animated.Value(0)).current;
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<View>(null);
  
  // Define floating action buttons
  const floatingButtons: FloatingButton[] = [
    {
      id: "message",
      icon: "chatbubble",
      color: Colors.whiteHint,
      action: () => console.log("Message", profile.name)
    },
    {
      id: "follow",
      icon: "person-add",
      color: Colors.whiteHint,
      action: () => console.log("Follow", profile.name)
    },
    {
      id: "share",
      icon: "share",
      color: Colors.whiteHint,
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

  // Detect which button is under the finger
  const getButtonUnderFinger = (gestureX: number, gestureY: number) => {
    const buttonRadius = sizer.moderateScale(30);
    
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
    onMoveShouldSetPanResponder: () => isLongPressing,
    
    onPanResponderGrant: (evt) => {
      longPressTimer.current = setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        setIsLongPressing(true);
        // Pass card reference for positioning the overlay version
        onOverlayVisible?.(true, profile.id, { 
          cardPosition, 
          cardWidth, 
          profile,
          floatingButtons,
          getButtonPosition,
          shouldShowOnLeft
        });
        
        // Animate card highlight
        Animated.timing(cardHighlight, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }, 400);
    },
    
    onPanResponderMove: (evt, gestureState) => {
      if (isLongPressing) {
        const fingerX = gestureState.dx;
        const fingerY = gestureState.dy;
        const buttonIndex = getButtonUnderFinger(fingerX, fingerY);
        
        if (buttonIndex !== activeButtonIndex) {
          if (buttonIndex !== null) {
            Haptics.selectionAsync();
          }
          setActiveButtonIndex(buttonIndex);
        }
      }
    },
    
    onPanResponderRelease: () => {
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
        
        // Hide overlay and reset card highlight
        Animated.timing(cardHighlight, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }).start(() => {
          setIsLongPressing(false);
          setActiveButtonIndex(null);
          onOverlayVisible?.(false, profile.id);
        });
      } else {
        // Regular tap
        onPress?.(profile);
      }
    },
  });

  return (
    <Animated.View
      ref={cardRef}
      style={[
        styles.profileCard, 
        { 
          width: cardWidth,
          // Add highlight effect
          shadowColor: cardHighlight.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', Colors.accentBlue],
          }),
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: cardHighlight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.8],
          }),
          shadowRadius: cardHighlight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 20],
          }),
          elevation: cardHighlight.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 15],
          }),
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
                size={sizer.moderateScale(14)}
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