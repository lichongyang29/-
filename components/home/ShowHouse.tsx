import React from 'react';
import { Text, Image, StyleSheet, useWindowDimensions, Dimensions } from 'react-native';

import Swiper from 'react-native-swiper';

import { View } from 'react-native';

const ShowHouse = () => {
  const { width, height } = useWindowDimensions();
  // 定义一个接口来描述数组中的每个元素

  return (
    <View>
      <View style={{ height: height * 0.3, width, marginTop: height * 0.06 }}>
        <Swiper style={[styles.wrapper]} showsButtons={true} autoplay={true}>
          <Image
            style={{
              ...styles.sliderImage,
              width: width,
              height: height * 0.28,
              borderRadius: 30,
            }}
            source={require('@/assets/home/houseOne.png')}
            resizeMode="contain"
          />
          <Image
            style={{ ...styles.sliderImage, width: width, height: height * 0.28, borderRadius: 30 }}
            source={require('@/assets/home/houseTwo.png')}
            resizeMode="contain"
          />
          <Image
            style={{ ...styles.sliderImage, width: width, height: height * 0.28, borderRadius: 30 }}
            source={require('@/assets/home/houseThree.png')}
            resizeMode="contain"
          />
        </Swiper>
      </View>

      <View>
        <Text
          style={{
            marginTop: -(height * 0.01),

            marginLeft: width * 0.1,
            fontSize: 18,
          }}>
          合租-朝阳区都市海岸中心-主卧独卫朝南
        </Text>
        <Text style={{ marginTop: height * 0.02, marginLeft: width * 0.1, fontSize: 14 }}>
          陕西省西安市未央区建章路
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              marginTop: height * 0.02,
              marginLeft: width * 0.1,
              fontSize: 18,
              color: 'red',
            }}>
            ￥1400/月
          </Text>
          <Text
            style={{
              marginTop: height * 0.023,
              fontSize: 14,
              color: 'gray',
              marginLeft: width * 0.26,
            }}>
            可入住日期2024/05/20
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ShowHouse;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  wrapper: {
    // height: 200,
  },
  sliderImage: {
    height: 200,
    width: Dimensions.get('window').width,
  },
});
