import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ButtonProps {
  iconName: any;
  label: string;
}
const FunctionButton: React.FC<ButtonProps> = ({ iconName, label }) => {
  const { width, height } = useWindowDimensions();
  return (
    <View style={[styles.buttonClick, { height: height * 0.09, width: height * 0.09 }]}>
      <Ionicons name={iconName} size={height * 0.04} color="#666" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default FunctionButton;

const styles = StyleSheet.create({
  buttonClick: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
});
