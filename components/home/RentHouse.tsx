import React from 'react';
import { Text, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@ant-design/react-native';
import { View, Pressable } from 'react-native';
import dayjs from 'dayjs'; // 导入day.js
const RentHouse = (props: any) => {
  let { item } = props;
  console.log(item);

  // let { name, address, gender, phone, userImage } = item.tenantUser;
  // 定义一个函数来格式化日期
  const formatDateTime = (date: Date) => {
    const daysAgo = dayjs().diff(dayjs(date), 'day'); // 计算天数差异
    return `${daysAgo} 天前发布`;
  };
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView>
          <Pressable onPress={() => router.navigate('/(pages)/home/RendDetail')}>
            <View
              style={{
                width: width * 0.9,
                height: height * 0.2,
                marginLeft: width * 0.055,
                marginTop: height * 0.06,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.35,
                shadowRadius: 3.84,
                elevation: 6,
              }}>
              <Card
                style={{
                  height: height * 0.2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: height * 0.04 }}>
                  <Image
                    source={require('@/assets/login/default.png')}
                    style={{
                      backgroundColor: '#ffffff',
                      width: width * 0.1,
                      height: height * 0.05,
                      borderRadius: 200,
                      marginLeft: width * 0.03,
                      marginTop: height * 0.01,
                    }}
                    resizeMode="contain"></Image>
                  <Text style={{ fontSize: width * 0.03 }}>{item.tenantUser?.name}</Text>
                  <Text style={{ fontSize: width * 0.03, marginLeft: width * 0.02 }}>
                    {item.tenantUser?.gender}
                  </Text>
                  <Text style={{ fontSize: width * 0.03, marginLeft: width * 0.02 }}>
                    {item.tenantUser?.phone}
                  </Text>
                  <Text style={{ fontSize: width * 0.03, marginLeft: width * 0.23 }}>
                    {formatDateTime(item.tenantTime)}
                  </Text>
                </View>

                <Text
                  style={{
                    marginLeft: width * 0.05,
                    marginTop: height * 0.02,
                    fontSize: width * 0.03,
                  }}>
                  {item.tenantDemand}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      marginLeft: width * 0.05,
                      marginTop: height * 0.02,
                      fontSize: width * 0.03,
                      width: width * 0.1,
                      backgroundColor: '#ebf3f8',
                      color: '#44b3f8',
                      paddingHorizontal: width * 0.02,
                      textAlign: 'center',
                      height: height * 0.021,
                    }}>
                    {item.tenantType}
                  </Text>
                  <Text
                    style={{
                      marginLeft: width * 0.05,
                      marginTop: height * 0.02,
                      fontSize: width * 0.03,
                      width: width * 0.4,
                      backgroundColor: '#ebf3f8',
                      color: '#44b3f8',
                      paddingHorizontal: width * 0.02,
                      textAlign: 'center',
                    }}>
                    预算{item.tenantPrice}元/月
                  </Text>
                </View>
                <Text
                  style={{
                    marginLeft: width * 0.05,
                    marginTop: height * 0.02,
                    fontSize: width * 0.03,
                  }}>
                  {item.tenantUser?.address}
                </Text>
              </Card>
            </View>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default RentHouse;

const styles = StyleSheet.create({
  wrapper: {},
  sliderImage: {
    height: 200,
  },
});
