import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Profile } from "@/data/profiles-data";
import sizer from "@/utils/sizer";
import { styles } from "./styles";

interface ProfileCardProps {
  profile: Profile;
  cardWidth: number;
  onPress?: (profile: Profile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  cardWidth, 
  onPress 
}) => {
  const handlePress = () => {
    onPress?.(profile);
  };

  return (
    <TouchableOpacity 
      style={[styles.profileCard, { width: cardWidth }]} 
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <Image source={{ uri: profile.imageUrl }} style={styles.profileImage} />
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
    </TouchableOpacity>
  );
};