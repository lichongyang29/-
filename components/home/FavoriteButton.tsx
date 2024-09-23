import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // 使用 Ionicons 作为示例

const FavoriteButton = () => {
  const [isHeart, setIsHeart] = useState(false); // 初始状态为五角星

  const toggleFavorite = () => {
    setIsHeart(!isHeart);
  };

  return (
    <TouchableOpacity onPress={toggleFavorite} style={styles.button}>
      <View style={styles.iconContainer}>
        {isHeart ? (
          <Ionicons name="star" size={30} color="#FFA500" /> // 黄色的五角星
        ) : (
          <Ionicons name="star" size={30} color="#827d7d" /> // 黄色的五角星
        )}
        <Text style={styles.text}>{isHeart ? '已收藏' : '收藏'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
  },
  iconContainer: {
    alignItems: 'center', // 水平居中
    justifyContent: 'center', // 垂直居中
  },
  text: {
    fontSize: 16,
    color: '#827d7d',
    marginTop: 5, // 调整文本与图标之间的间距
  },
});

export default FavoriteButton;
