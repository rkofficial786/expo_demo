import { Colors } from "@/constants/Colors";
import { Profile } from "@/data/profiles-data";
import sizer from "@/utils/sizer";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import { Animated, Dimensions, Image, Text, View } from "react-native";
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
  onActiveButtonChange?: (
    activeIndex: number | null,
    label: string | null
  ) => void;
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
  isActiveCard = false,
}) => {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(
    null
  );
  const cardHighlight = useRef(new Animated.Value(0)).current;

  const touchState = useRef({
    isActive: false,
    startX: 0,
    startY: 0,
    startTime: 0,
    hasActivatedLongPress: false,
    hasMoved: false,
  });

  const longPressTimer: any = useRef<NodeJS.Timeout | null>(null);

  const floatingButtons: FloatingButton[] = [
    {
      id: "message",
      icon: "chatbubble",
      color: Colors.whiteHint,
      label: "Message",
      action: () => console.log("Message", profile.name),
    },
    {
      id: "follow",
      icon: "person-add",
      color: Colors.whiteHint,
      label: "Follow",
      action: () => console.log("Follow", profile.name),
    },
    {
      id: "share",
      icon: "share",
      color: Colors.whiteHint,
      label: "Share",
      action: () => console.log("Share", profile.name),
    },
  ];

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

  const getButtonPosition = (index: number, total: number) => {
    const radius = sizer.moderateScale(90);
    const spacing = sizer.moderateScale(65);
    const startY = (-(total - 1) * spacing) / 2;
    const isLeft = shouldShowOnLeft();

    let xOffset = isLeft ? -radius : radius;
    if (index === 1) {
      xOffset = isLeft
        ? -radius - sizer.moderateScale(30)
        : radius + sizer.moderateScale(20);
    }

    return {
      x: xOffset,
      y: startY + index * spacing,
    };
  };

  // Better gesture detection
  const getButtonUnderFinger = (gestureX: number, gestureY: number) => {
    const buttonRadius = sizer.moderateScale(50);

    for (let i = 0; i < floatingButtons.length; i++) {
      const buttonPos = getButtonPosition(i, floatingButtons.length);
      const distance = Math.sqrt(
        Math.pow(gestureX - buttonPos.x, 2) +
          Math.pow(gestureY - buttonPos.y, 2)
      );

      if (distance <= buttonRadius) {
        return i;
      }
    }
    return null;
  };

  const getRelativeFingerPosition = (pageX: number, pageY: number) => {
    const centerX = cardPosition.x + cardWidth / 2;
    const centerY = cardPosition.y + sizer.moderateScale(80);

    return {
      x: pageX - centerX,
      y: pageY - centerY,
    };
  };

  // Activate long press
  const activateLongPress = () => {
    if (touchState.current.hasActivatedLongPress) return;

    console.log("ACTIVATING LONG PRESS");
    touchState.current.hasActivatedLongPress = true;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setIsLongPressing(true);
    onOverlayVisible?.(true, profile.id, {
      cardPosition,
      cardWidth,
      profile,
      floatingButtons,
      getButtonPosition,
      shouldShowOnLeft,
      onActiveButtonChange,
    });

    Animated.timing(cardHighlight, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Deactivate long press
  const deactivateLongPress = () => {
    console.log(" DEACTIVATING LONG PRESS");

    setActiveButtonIndex(null);
    onActiveButtonChange?.(null, null);

    Animated.timing(cardHighlight, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setIsLongPressing(false);
      onOverlayVisible?.(false, profile.id);
    });

    touchState.current = {
      isActive: false,
      startX: 0,
      startY: 0,
      startTime: 0,
      hasActivatedLongPress: false,
      hasMoved: false,
    };
  };

  // Clear timer
  const clearTimer = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <Animated.View
      style={[
        styles.profileCard,
        {
          width: cardWidth,
        },
      ]}
      onTouchStart={(evt) => {
        console.log("👆 TOUCH START");

        touchState.current = {
          isActive: true,
          startX: evt.nativeEvent.pageX,
          startY: evt.nativeEvent.pageY,
          startTime: Date.now(),
          hasActivatedLongPress: false,
          hasMoved: false,
        };

        clearTimer();

        longPressTimer.current = setTimeout(() => {
          console.log("TIMER EXPIRED - Checking conditions");
          console.log("Has moved:", touchState.current.hasMoved);
          console.log(
            "Has activated:",
            touchState.current.hasActivatedLongPress
          );

          if (
            !touchState.current.hasMoved &&
            !touchState.current.hasActivatedLongPress
          ) {
            activateLongPress();
          }
        }, 700);
      }}
      onTouchMove={(evt) => {
        if (!touchState.current.isActive) return;

        const currentX = evt.nativeEvent.pageX;
        const currentY = evt.nativeEvent.pageY;

        if (touchState.current.hasActivatedLongPress && isLongPressing) {
          console.log("🎯 LONG PRESS ACTIVE - Button selection mode");

          const relativePos = getRelativeFingerPosition(currentX, currentY);
          const buttonIndex = getButtonUnderFinger(
            relativePos.x,
            relativePos.y
          );

          if (buttonIndex !== activeButtonIndex) {
            if (buttonIndex !== null) {
              Haptics.selectionAsync();
            }
            setActiveButtonIndex(buttonIndex);

            const label =
              buttonIndex !== null ? floatingButtons[buttonIndex].label : null;
            onActiveButtonChange?.(buttonIndex, label);
          }

          return;
        }

        const distance = Math.sqrt(
          Math.pow(currentX - touchState.current.startX, 2) +
            Math.pow(currentY - touchState.current.startY, 2)
        );

        if (distance > 10) {
          console.log("📱 SCROLLING DETECTED - Canceling long press");
          touchState.current.hasMoved = true;
          clearTimer();
        }
      }}
      onTouchEnd={(evt) => {
        console.log("🖐️ TOUCH END");

        clearTimer();

        if (touchState.current.hasActivatedLongPress && isLongPressing) {
          console.log("💫 EXECUTING BUTTON ACTION");

          if (activeButtonIndex !== null) {
            floatingButtons[activeButtonIndex].action();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }

          deactivateLongPress();
          return;
        }

        const touchDuration = Date.now() - touchState.current.startTime;

        if (!touchState.current.hasMoved && touchDuration < 500) {
          console.log("👆 REGULAR TAP");
          onPress?.(profile);
        }

        touchState.current.isActive = false;
      }}
      onTouchCancel={() => {
        console.log("❌ TOUCH CANCELLED");
        clearTimer();

        if (touchState.current.hasActivatedLongPress) {
          deactivateLongPress();
        } else {
          touchState.current.isActive = false;
        }
      }}
    >
      <Image source={{ uri: profile.imageUrl }} style={styles.profileImage} />

      <Animated.View
        style={[
          styles.cardBorderHighlight,
          {
            opacity: cardHighlight,
          },
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
