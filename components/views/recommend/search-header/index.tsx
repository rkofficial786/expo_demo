import { Colors } from "@/constants/Colors";
import sizer from "@/utils/sizer";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCancel: () => void;
  onClear: () => void;
  searchInputRef: any;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onCancel,
  onClear,
  searchInputRef,
}) => {
  return (
    <View style={styles.searchHeader}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={sizer.moderateScale(20)}
          color={Colors.secondWhite}
          style={styles.searchIcon}
        />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Username or name"
          placeholderTextColor={Colors.secondWhite}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Ionicons
              name="close"
              size={sizer.moderateScale(20)}
              color={Colors.secondWhite}
            />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};
